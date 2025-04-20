import React, { useState } from 'react';
import { useVocabByLevel } from '@/hooks/useVocabByLevel';
import { Level } from '@/services/levelChunkLoader';
import { SortOption } from '@/types/vocabulary';

const VocabularyByLevel: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<Level>('elementary');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  
  const { 
    words, 
    totalWords, 
    currentPage, 
    pageSize,
    isLoading, 
    error, 
    loadProgress,
    changePage,
    sortWords,
    level
  } = useVocabByLevel({ level: selectedLevel, pageSize: 20 });

  const handleLevelChange = (newLevel: Level) => {
    setSelectedLevel(newLevel);
  };

  const handleSort = (option: SortOption) => {
    setSortOption(option);
    sortWords(option);
  };

  const handlePageChange = (newPage: number) => {
    changePage(newPage);
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(totalWords / pageSize);
  const paginationItems = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationItems.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">난이도별 단어장</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      {/* 난이도 선택 */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleLevelChange('elementary')}
          className={`px-4 py-2 rounded ${
            selectedLevel === 'elementary' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          초등
        </button>
        <button
          onClick={() => handleLevelChange('middle')}
          className={`px-4 py-2 rounded ${
            selectedLevel === 'middle' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          중등
        </button>
        <button
          onClick={() => handleLevelChange('high')}
          className={`px-4 py-2 rounded ${
            selectedLevel === 'high' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          고등
        </button>
      </div>
      
      {/* 정렬 옵션 */}
      <div className="mb-6">
        <select
          value={sortOption}
          onChange={(e) => handleSort(e.target.value as SortOption)}
          className="px-4 py-2 border rounded"
          disabled={isLoading}
        >
          <option value="newest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="alphabetical">알파벳순</option>
        </select>
      </div>
      
      {/* 로딩 진행률 */}
      {loadProgress < 100 && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${loadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            데이터 로딩 중: {Math.round(loadProgress)}%
          </p>
        </div>
      )}
      
      {/* 단어 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 border-b">단어</th>
              <th className="py-2 px-4 border-b">의미</th>
              <th className="py-2 px-4 border-b">난이도</th>
              <th className="py-2 px-4 border-b">태그</th>
              <th className="py-2 px-4 border-b">등록일</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">로딩 중...</td>
              </tr>
            ) : words.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  {loadProgress < 100 ? '데이터 로딩 중...' : `${selectedLevel === 'elementary' ? '초등' : selectedLevel === 'middle' ? '중등' : '고등'} 레벨에 단어가 없습니다.`}
                </td>
              </tr>
            ) : (
              words.map((word) => (
                <tr key={word.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    <div className="font-medium">{word.word}</div>
                    {word.pronunciation && (
                      <div className="text-sm text-gray-500">{word.pronunciation}</div>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div>{word.meaning}</div>
                    {word.translation && (
                      <div className="text-sm text-gray-500">{word.translation}</div>
                    )}
                    {word.example && (
                      <div className="text-sm italic mt-1">{word.example}</div>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        word.difficulty === 'beginner'
                          ? 'bg-green-100 text-green-800'
                          : word.difficulty === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {word.difficulty || 'N/A'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex flex-wrap gap-1">
                      {word.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 text-xs bg-gray-200 rounded"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(word.dateAdded).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* 페이지네이션 */}
      {words.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || isLoading}
            className="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
          >
            처음
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
          >
            이전
          </button>
          
          {paginationItems}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
          >
            다음
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || isLoading}
            className="px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
          >
            마지막
          </button>
        </div>
      )}
      
      {words.length > 0 && (
        <div className="mt-4 text-center text-gray-600">
          총 {totalWords}개의 단어 중 {Math.min((currentPage - 1) * pageSize + 1, totalWords)} - {Math.min(currentPage * pageSize, totalWords)}
        </div>
      )}
    </div>
  );
};

export default VocabularyByLevel;