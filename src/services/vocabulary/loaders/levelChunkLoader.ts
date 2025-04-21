/**
 * 난이도별 단어 데이터를 청크 단위로 로드하는 서비스
 */

import { WordEntry, Tag } from '@/types/vocabulary';
import * as cacheService from '../caching/cacheService';

// 난이도 유형
export type Level = 'elementary' | 'middle' | 'high';

// 난이도별 매핑
const LEVEL_TO_DIFFICULTY = {
  'elementary': 'beginner',
  'middle': 'intermediate',
  'high': 'advanced',
} as const;

// 글로벌 메타데이터 인터페이스
export interface GlobalMetadata {
  tags: Tag[];
  lastUpdated: string;
  version: string;
}

// 레벨별 메타데이터 인터페이스
export interface LevelMetadata {
  level: Level;
  totalWords: number;
  totalChunks: number;
  lastUpdated: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// 청크 로딩 진행 상태
const loadingProgress: Record<Level, number> = {
  'elementary': 0,
  'middle': 0,
  'high': 0,
};

// 청크 로딩 상태
const loadedChunks: Record<Level, Set<number>> = {
  'elementary': new Set(),
  'middle': new Set(),
  'high': new Set(),
};

// 레벨별 총 청크 수
const totalChunks: Record<Level, number> = {
  'elementary': 0,
  'middle': 0,
  'high': 0,
};

/**
 * 글로벌 메타데이터 로드
 */
export async function loadGlobalMetadata(): Promise<GlobalMetadata> {
  // 캐시 확인
  const cached = await cacheService.getMetadata('global');
  if (cached) {
    return cached;
  }
  
  try {
    // API에서 메타데이터 가져오기 (실제로는 서버에서)
    // 임시로 목업 데이터 사용
    const metadata: GlobalMetadata = {
      tags: [
        { id: '1', name: '기초' },
        { id: '2', name: '일상' },
        { id: '3', name: '비즈니스' },
        { id: '4', name: '학술' },
        { id: '5', name: 'TOEIC' },
        { id: '6', name: 'TOEFL' },
      ],
      lastUpdated: new Date().toISOString(),
      version: '1.0.0',
    };
    
    // 캐시에 저장
    await cacheService.setMetadata('global', metadata);
    
    return metadata;
  } catch (error) {
    console.error('글로벌 메타데이터 로드 오류:', error);
    throw new Error('글로벌 메타데이터를 로드하는 중 오류가 발생했습니다.');
  }
}

/**
 * 레벨별 메타데이터 로드
 */
export async function loadLevelMetadata(level: Level): Promise<LevelMetadata> {
  // 캐시 확인
  const cached = await cacheService.getMetadata(`level-${level}`);
  if (cached) {
    // 총 청크 수 업데이트
    totalChunks[level] = cached.totalChunks;
    return cached;
  }
  
  try {
    // API에서 메타데이터 가져오기 (실제로는 서버에서)
    // 임시로 목업 데이터 사용
    const metadata: LevelMetadata = {
      level,
      totalWords: level === 'elementary' ? 500 : level === 'middle' ? 1000 : 2000,
      totalChunks: level === 'elementary' ? 5 : level === 'middle' ? 10 : 20,
      lastUpdated: new Date().toISOString(),
      difficulty: LEVEL_TO_DIFFICULTY[level],
    };
    
    // 총 청크 수 업데이트
    totalChunks[level] = metadata.totalChunks;
    
    // 캐시에 저장
    await cacheService.setMetadata(`level-${level}`, metadata);
    
    return metadata;
  } catch (error) {
    console.error(`${level} 메타데이터 로드 오류:`, error);
    throw new Error(`${level} 메타데이터를 로드하는 중 오류가 발생했습니다.`);
  }
}

/**
 * 특정 페이지에 필요한 청크 로드
 */
export async function loadRequiredChunk(level: Level, page: number, pageSize: number): Promise<void> {
  const chunkSize = 100; // 각 청크당 단어 수
  const startIndex = (page - 1) * pageSize;
  const chunkIndex = Math.floor(startIndex / chunkSize);
  
  await loadChunk(level, chunkIndex);
}

/**
 * 특정 청크 로드
 */
export async function loadChunk(level: Level, chunkIndex: number): Promise<WordEntry[]> {
  // 이미 로드된 청크인지 확인
  if (loadedChunks[level].has(chunkIndex)) {
    const cached = await cacheService.getChunk(`level-${level}-chunk-${chunkIndex}`);
    if (cached) {
      return cached;
    }
  }
  
  try {
    // API에서 청크 가져오기 (실제로는 서버에서)
    // 임시로 목업 데이터 생성
    const words = generateMockWords(level, chunkIndex);
    
    // 로드된 청크로 표시
    loadedChunks[level].add(chunkIndex);
    
    // 청크를 캐시에 저장
    await cacheService.setChunk(`level-${level}-chunk-${chunkIndex}`, words);
    
    // 진행률 업데이트
    updateLoadProgress(level);
    
    return words;
  } catch (error) {
    console.error(`${level} 청크 ${chunkIndex} 로드 오류:`, error);
    throw new Error(`단어 데이터를 로드하는 중 오류가 발생했습니다.`);
  }
}

/**
 * 레벨에 대한 모든 청크 로드 (백그라운드)
 */
export async function loadAllChunksForLevel(level: Level): Promise<void> {
  try {
    // 레벨 메타데이터 로드
    const metadata = await loadLevelMetadata(level);
    
    // 병렬로 모든 청크 로드 (단, 3개씩만)
    const chunks = Array.from({ length: metadata.totalChunks }, (_, i) => i);
    
    // 프로미스 풀을 사용하여 병렬 처리 제한
    for (let i = 0; i < chunks.length; i += 3) {
      const currentChunks = chunks.slice(i, i + 3);
      await Promise.all(currentChunks.map(chunkIndex => loadChunk(level, chunkIndex)));
    }
  } catch (error) {
    console.error(`${level} 모든 청크 로드 오류:`, error);
  }
}

/**
 * 로드 진행률 업데이트
 */
function updateLoadProgress(level: Level): void {
  const loaded = loadedChunks[level].size;
  const total = totalChunks[level] || 1;
  loadingProgress[level] = Math.round((loaded / total) * 100);
}

/**
 * 현재 로드 진행률 조회
 */
export function getLoadProgress(level: Level): number {
  return loadingProgress[level];
}

/**
 * 모의 단어 데이터 생성 (실제로는 서버에서 가져옴)
 */
function generateMockWords(level: Level, chunkIndex: number): WordEntry[] {
  const chunkSize = 100;
  const words: WordEntry[] = [];
  const difficulty = LEVEL_TO_DIFFICULTY[level];
  
  const baseIndex = chunkIndex * chunkSize;
  
  for (let i = 0; i < chunkSize; i++) {
    const index = baseIndex + i;
    const word: WordEntry = {
      id: `word-${level}-${index}`,
      word: `Example ${level} Word ${index}`,
      meaning: `The definition of Example ${level} Word ${index}`,
      translation: `${level === 'elementary' ? '초등' : level === 'middle' ? '중등' : '고등'} 예시 단어 ${index}`,
      example: `This is an example sentence using ${level} Word ${index}.`,
      pronunciation: `/ɪɡˈzæmpəl wɜːrd ${index}/`,
      tags: [
        { id: '1', name: '기초' },
        { id: (index % 5 + 2).toString(), name: ['일상', '비즈니스', '학술', 'TOEIC', 'TOEFL'][index % 5] },
      ],
      dateAdded: new Date(Date.now() - index * 86400000).toISOString(),
      difficulty,
    };
    
    words.push(word);
  }
  
  return words;
}

/**
 * 특정 난이도의 단어 조회
 */
export async function getWordsByLevel(level: Level, page: number, pageSize: number): Promise<{
  words: WordEntry[];
  total: number;
}> {
  try {
    // 해당 레벨의 메타데이터 로드
    const metadata = await loadLevelMetadata(level);
    const totalWords = metadata.totalWords;
    
    // 필요한 청크 로드
    await loadRequiredChunk(level, page, pageSize);
    
    // 청크 크기와 인덱스 계산
    const chunkSize = 100;
    const startIndex = (page - 1) * pageSize;
    const startChunkIndex = Math.floor(startIndex / chunkSize);
    const offsetInChunk = startIndex % chunkSize;
    
    let allWords: WordEntry[] = [];
    let remainingWords = pageSize;
    let currentChunkIndex = startChunkIndex;
    
    while (remainingWords > 0) {
      // 청크 로드
      const chunkWords = await loadChunk(level, currentChunkIndex);
      
      // 필요한 단어만 추출
      let chunkOffset = currentChunkIndex === startChunkIndex ? offsetInChunk : 0;
      let wordsToTake = Math.min(chunkWords.length - chunkOffset, remainingWords);
      
      // 더 이상 단어가 없으면 중단
      if (wordsToTake <= 0) break;
      
      allWords = allWords.concat(chunkWords.slice(chunkOffset, chunkOffset + wordsToTake));
      remainingWords -= wordsToTake;
      currentChunkIndex++;
    }
    
    return {
      words: allWords,
      total: totalWords,
    };
  } catch (error) {
    console.error(`레벨별 단어 조회 오류:`, error);
    throw new Error('단어 데이터를 조회하는 중 오류가 발생했습니다.');
  }
}
