// src/hooks/useVocabByLevel.ts

import { useState, useEffect, useCallback } from 'react';
import { WordEntry, Tag, FilterOptions, SortOption } from '@/types/vocabulary';
import { levelChunkLoader, Level } from '@/services/levelChunkLoader';
import * as VocabDB from '@/lib/vocabDatabase';

interface UseVocabByLevelProps {
  level: Level;
  pageSize?: number;
}

export const useVocabByLevel = ({ level, pageSize = 50 }: UseVocabByLevelProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [words, setWords] = useState<WordEntry[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadProgress, setLoadProgress] = useState(0);

  // 초기화
  const initialize = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // 전역 메타데이터 로드
      const globalMetadata = await levelChunkLoader.loadGlobalMetadata();
      setTags(globalMetadata.tags);
      
      // 레벨별 메타데이터 로드
      const levelMetadata = await levelChunkLoader.loadLevelMetadata(level);
      setTotalWords(levelMetadata.totalWords);
      
      // 단어가 없는 경우 즉시 반환
      if (levelMetadata.totalWords === 0) {
        setWords([]);
        setError(null);
        return;
      }
      
      // 첫 번째 청크 로드
      await levelChunkLoader.loadRequiredChunk(level, 1, pageSize);
      
      // 첫 페이지 데이터 조회
      const filteredWords = await VocabDB.getFilteredWords({
        difficulty: level === 'elementary' ? 'beginner' : 
                   level === 'middle' ? 'intermediate' : 'advanced'
      });
      
      // 페이지네이션 적용
      const startIndex = 0;
      const endIndex = Math.min(pageSize, filteredWords.length);
      setWords(filteredWords.slice(startIndex, endIndex));
      
      setError(null);
    } catch (err) {
      console.error('초기화 오류:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [level, pageSize]);

  // 페이지 변경
  const changePage = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      
      // 필요한 청크 로드
      await levelChunkLoader.loadRequiredChunk(level, page, pageSize);
      
      // 데이터 조회
      const filteredWords = await VocabDB.getFilteredWords({
        difficulty: level === 'elementary' ? 'beginner' : 
                   level === 'middle' ? 'intermediate' : 'advanced'
      });
      
      // 페이지네이션 적용
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(page * pageSize, filteredWords.length);
      setWords(filteredWords.slice(startIndex, endIndex));
      
      setCurrentPage(page);
    } catch (err) {
      console.error('페이지 변경 오류:', err);
      setError('페이지를 변경하는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [level, pageSize]);

  // 정렬 변경
  const sortWords = useCallback(async (sortOption: SortOption) => {
    try {
      setIsLoading(true);
      
      let sortBy = 'dateAdded';
      let sortDirection: IDBCursorDirection = 'next';
      
      switch (sortOption) {
        case 'newest':
          sortBy = 'dateAdded';
          sortDirection = 'prev';
          break;
        case 'oldest':
          sortBy = 'dateAdded';
          sortDirection = 'next';
          break;
        case 'alphabetical':
          sortBy = 'word';
          sortDirection = 'next';
          break;
      }
      
      // 정렬된 데이터 조회
      const { words: sortedWords } = await VocabDB.getWords(
        currentPage, 
        pageSize, 
        sortBy, 
        sortDirection
      );
      
      // 난이도 필터링
      const filteredWords = sortedWords.filter(word => {
        const wordDifficulty = word.difficulty;
        if (level === 'elementary') return wordDifficulty === 'beginner';
        if (level === 'middle') return wordDifficulty === 'intermediate';
        if (level === 'high') return wordDifficulty === 'advanced';
        return false;
      });
      
      setWords(filteredWords);
    } catch (err) {
      console.error('정렬 오류:', err);
      setError('단어 정렬 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, level]);

  // 백그라운드에서 레벨의 모든 청크 로드
  const loadAllChunksInBackground = useCallback(async () => {
    try {
      await levelChunkLoader.loadAllChunksForLevel(level);
    } catch (err) {
      console.error('백그라운드 로딩 오류:', err);
    }
  }, [level]);

  // 로드 진행률 업데이트
  const updateLoadProgress = useCallback(() => {
    const progress = levelChunkLoader.getLoadProgress(level);
    setLoadProgress(progress);
  }, [level]);

  // 초기화
  useEffect(() => {
    initialize();
  }, [initialize]);

  // 백그라운드 로딩 시작
  useEffect(() => {
    loadAllChunksInBackground();
  }, [loadAllChunksInBackground]);

  // 로드 진행률 모니터링
  useEffect(() => {
    const interval = setInterval(updateLoadProgress, 1000);
    return () => clearInterval(interval);
  }, [updateLoadProgress]);

  return {
    words,
    tags,
    totalWords,
    currentPage,
    pageSize,
    isLoading,
    error,
    loadProgress,
    changePage,
    sortWords,
    level,
  };
};