// src/services/levelChunkLoader.ts

import { WordEntry, Tag } from '@/types/vocabulary';
import * as VocabDB from '@/lib/vocabDatabase';

export type Level = 'elementary' | 'middle' | 'high';

interface LevelChunkData {
  meta: {
    level: Level;
    chunkId: number;
    totalChunks: number;
    wordCount: number;
    startIndex: number;
    endIndex: number;
  };
  words: WordEntry[];
}

interface LevelMetadata {
  level: Level;
  totalWords: number;
  totalChunks: number;
  wordsPerChunk: number;
  createdAt: string;
}

interface GlobalMetadata {
  version: string;
  source: string;
  totalWords: number;
  levels: Array<{
    level: Level;
    wordCount: number;
    chunkCount: number;
  }>;
  tags: Tag[];
  wordsPerChunk: number;
  createdAt: string;
}

export class LevelChunkLoader {
  private loadedChunks: Map<Level, Set<number>> = new Map();
  private metadata: GlobalMetadata | null = null;
  private levelMetadata: Map<Level, LevelMetadata> = new Map();

  constructor() {
    // 각 레벨별 로딩 상태 초기화
    this.loadedChunks.set('elementary', new Set());
    this.loadedChunks.set('middle', new Set());
    this.loadedChunks.set('high', new Set());
  }

  // 전역 메타데이터 로드
  async loadGlobalMetadata(): Promise<GlobalMetadata> {
    if (this.metadata) {
      return this.metadata;
    }

    try {
      const response = await fetch('/word-chunks/metadata.json');
      if (!response.ok) {
        throw new Error('전역 메타데이터를 불러올 수 없습니다.');
      }
      this.metadata = await response.json();
      return this.metadata;
    } catch (error) {
      console.error('전역 메타데이터 로드 실패:', error);
      throw error;
    }
  }

  // 특정 레벨의 메타데이터 로드
  async loadLevelMetadata(level: Level): Promise<LevelMetadata> {
    if (this.levelMetadata.has(level)) {
      return this.levelMetadata.get(level)!;
    }

    try {
      const response = await fetch(`/word-chunks/${level}/metadata.json`);
      if (!response.ok) {
        throw new Error(`${level} 레벨 메타데이터를 불러올 수 없습니다.`);
      }
      const metadata = await response.json();
      this.levelMetadata.set(level, metadata);
      return metadata;
    } catch (error) {
      console.error(`${level} 레벨 메타데이터 로드 실패:`, error);
      throw error;
    }
  }

  // 특정 레벨의 특정 청크 로드
  async loadChunk(level: Level, chunkId: number): Promise<boolean> {
    const levelChunks = this.loadedChunks.get(level)!;
    if (levelChunks.has(chunkId)) {
      return true;
    }

    try {
      const response = await fetch(`/word-chunks/${level}/chunk-${chunkId}.json`);
      if (!response.ok) {
        throw new Error(`${level} 레벨 청크 ${chunkId}를 불러올 수 없습니다.`);
      }

      const chunkData: LevelChunkData = await response.json();
      
      // IndexedDB에 단어 저장
      await VocabDB.bulkAddWords(chunkData.words);
      
      levelChunks.add(chunkId);
      return true;
    } catch (error) {
      console.error(`${level} 레벨 청크 ${chunkId} 로드 실패:`, error);
      return false;
    }
  }

  // 페이지 번호에 따라 필요한 청크 계산
  calculateRequiredChunk(level: Level, page: number, pageSize: number): number {
    if (!this.metadata) {
      return 1;
    }

    const levelInfo = this.metadata.levels.find(l => l.level === level);
    if (!levelInfo) {
      return 1;
    }

    const wordsPerChunk = this.metadata.wordsPerChunk;
    const startIndex = (page - 1) * pageSize;
    const chunkNumber = Math.floor(startIndex / wordsPerChunk) + 1;

    return Math.min(chunkNumber, levelInfo.chunkCount);
  }

  // 필요한 청크 로드
  async loadRequiredChunk(level: Level, page: number, pageSize: number): Promise<void> {
    if (!this.metadata) {
      await this.loadGlobalMetadata();
    }

    const requiredChunk = this.calculateRequiredChunk(level, page, pageSize);
    await this.loadChunk(level, requiredChunk);
  }

  // 특정 레벨의 모든 청크 로드 (백그라운드)
  async loadAllChunksForLevel(level: Level): Promise<void> {
    if (!this.metadata) {
      await this.loadGlobalMetadata();
    }

    const levelInfo = this.metadata!.levels.find(l => l.level === level);
    if (!levelInfo) {
      console.error(`${level} 레벨 정보를 찾을 수 없습니다.`);
      return;
    }

    const totalChunks = levelInfo.chunkCount;
    const levelChunks = this.loadedChunks.get(level)!;

    for (let i = 1; i <= totalChunks; i++) {
      if (levelChunks.has(i)) {
        continue;
      }

      // 순차적으로 로드 (너무 많은 동시 요청 방지)
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.loadChunk(level, i);
    }
  }

  // 로드된 청크 정보
  getLoadedChunks(level: Level): number[] {
    return Array.from(this.loadedChunks.get(level) || []);
  }

  // 레벨별 로드 진행률
  getLoadProgress(level: Level): number {
    if (!this.metadata) {
      return 0;
    }

    const levelInfo = this.metadata.levels.find(l => l.level === level);
    if (!levelInfo) {
      return 0;
    }

    const loadedCount = this.loadedChunks.get(level)?.size || 0;
    return (loadedCount / levelInfo.chunkCount) * 100;
  }

  // 전체 로드 진행률
  getTotalLoadProgress(): number {
    if (!this.metadata) {
      return 0;
    }

    let totalChunks = 0;
    let loadedChunks = 0;

    this.metadata.levels.forEach(({ level, chunkCount }) => {
      totalChunks += chunkCount;
      loadedChunks += this.loadedChunks.get(level as Level)?.size || 0;
    });

    return totalChunks > 0 ? (loadedChunks / totalChunks) * 100 : 0;
  }

  // 레벨별 단어 수 정보
  getLevelWordCount(level: Level): number {
    if (!this.metadata) {
      return 0;
    }

    const levelInfo = this.metadata.levels.find(l => l.level === level);
    return levelInfo?.wordCount || 0;
  }
}

// 싱글톤 인스턴스 생성
export const levelChunkLoader = new LevelChunkLoader();