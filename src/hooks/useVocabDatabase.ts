import { useState, useEffect, useCallback } from 'react';
import { WordEntry, Tag, FilterOptions, SortOption } from '@/types/vocabulary';
import { MOCK_WORDS, MOCK_TAGS } from '@/data/mockVocabularyData';
import * as VocabDB from '@/lib/vocabDatabase';

export interface UseVocabDatabaseProps {
  pageSize?: number;
}

export const useVocabDatabase = ({ pageSize = 50 }: UseVocabDatabaseProps = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [words, setWords] = useState<WordEntry[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // 데이터베이스 초기화
  const initializeDatabase = useCallback(async () => {
    try {
      setIsLoading(true);
      await VocabDB.initializeWithSampleData(MOCK_WORDS, MOCK_TAGS);
      
      // 초기 데이터 로드
      const { words: initialWords, total } = await VocabDB.getWords(1, pageSize);
      setWords(initialWords);
      setTotalWords(total);
      setTags(MOCK_TAGS);
      setError(null);
    } catch (err) {
      console.error('Database initialization error:', err);
      setError('데이터베이스 초기화 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  // 처음 마운트될 때 데이터베이스 초기화
  useEffect(() => {
    initializeDatabase();
  }, [initializeDatabase]);

  // 페이지 변경
  const changePage = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const { words: pageWords, total } = await VocabDB.getWords(page, pageSize);
      setWords(pageWords);
      setTotalWords(total);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching page:', err);
      setError('페이지를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

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
        default:
          sortBy = 'dateAdded';
          sortDirection = 'prev';
      }
      
      const { words: sortedWords, total } = await VocabDB.getWords(
        currentPage, 
        pageSize, 
        sortBy, 
        sortDirection
      );
      
      setWords(sortedWords);
      setTotalWords(total);
    } catch (err) {
      console.error('Error sorting words:', err);
      setError('단어 정렬 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  // 검색
  const searchWords = useCallback(async (query: string) => {
    if (!query.trim()) {
      changePage(1);
      return;
    }
    
    try {
      setIsLoading(true);
      const searchResults = await VocabDB.searchWords(query);
      setWords(searchResults);
      setTotalWords(searchResults.length);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error searching words:', err);
      setError('단어 검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [changePage]);

  // 필터링
  const filterWords = useCallback(async (filterOptions: FilterOptions) => {
    try {
      setIsLoading(true);
      
      const filters = {
        tagIds: filterOptions.tags ? filterOptions.tags.map(tag => tag.id) : undefined,
        difficulty: filterOptions.difficulty || undefined,
        bookmarkedOnly: filterOptions.bookmarkedOnly
      };
      
      const filteredWords = await VocabDB.getFilteredWords(filters);
      setWords(filteredWords);
      setTotalWords(filteredWords.length);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error filtering words:', err);
      setError('단어 필터링 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 대용량 데이터 추가 (외부 API에서 데이터를 가져와서 추가하는 케이스)
  const importWords = useCallback(async (newWords: WordEntry[], newTags: Tag[] = []) => {
    try {
      setIsLoading(true);
      
      // 새 태그 추가
      if (newTags.length > 0) {
        await VocabDB.bulkAddTags(newTags);
        setTags(prevTags => [...prevTags, ...newTags]);
      }
      
      // 새 단어 추가
      await VocabDB.bulkAddWords(newWords);
      
      // 첫 페이지로 돌아가고 데이터 갱신
      const { words: updatedWords, total } = await VocabDB.getWords(1, pageSize);
      setWords(updatedWords);
      setTotalWords(total);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error importing words:', err);
      setError('단어 가져오기 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  return {
    words,
    tags,
    totalWords,
    currentPage,
    pageSize,
    isLoading,
    error,
    changePage,
    sortWords,
    searchWords,
    filterWords,
    importWords,
    reloadData: initializeDatabase
  };
}; 