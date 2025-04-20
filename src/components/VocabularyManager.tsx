import React, { useState, useRef } from 'react';
import { useVocabDatabase } from '@/hooks/useVocabDatabase';
import { importFromCSV, importFromJSON, fetchWordsFromAPI } from '@/lib/dataImporter';
import { FilterOptions, SortOption, WordEntry, Tag } from '@/types/vocabulary';

const VocabularyManager: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    tags: [],
    difficulty: null,
    bookmarkedOnly: false
  });
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  
  const { 
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
    importWords
  } = useVocabDatabase({ pageSize: 50 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchWords(searchQuery);
  };

  const handleSort = (option: SortOption) => {
    setSortOption(option);
    sortWords(option);
  };

  const handleFilter = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filterOptions, ...newFilters };
    setFilterOptions(updatedFilters);
    filterWords(updatedFilters);
  };

  const handlePageChange = (newPage: number) => {
    changePage(newPage);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      let importResult: { words: WordEntry[], tags: Tag[] } = { words: [], tags: [] };
      
      if (file.name.endsWith('.csv')) {
        importResult = importFromCSV(content);
      } else if (file.name.endsWith('.json')) {
        importResult = importFromJSON(content);
      } else {
        alert('지원되지 않는 파일 형식입니다. CSV 또는 JSON 파일을 업로드해주세요.');
        return;
      }
      
      if (importResult.words.length > 0) {
        await importWords(importResult.words, importResult.tags);
        alert(`${importResult.words.length}개의 단어가 추가되었습니다.`);
        // 파일 입력 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        alert('가져올 단어가 없습니다.');
      }
    };
    
    reader.onerror = () => {
      alert('파일을 읽는 중 오류가 발생했습니다.');
    };
    
    if (file.name.endsWith('.csv') || file.name.endsWith('.json')) {
      reader.readAsText(file);
    } else {
      alert('지원되지 않는 파일 형식입니다. CSV 또는 JSON 파일을 업로드해주세요.');
    }
  };

  // 샘플 데이터 가져오기
  const handleLoadSampleData = async () => {
    try {
      const response = await fetch('/sample-vocabulary-data.json');
      
      if (!response.ok) {
        throw new Error('샘플 데이터를 불러오는데 실패했습니다.');
      }
      
      const jsonData = await response.text();
      const importResult = importFromJSON(jsonData);
      
      if (importResult.words.length > 0) {
        await importWords(importResult.words, importResult.tags);
        alert(`${importResult.words.length}개의 샘플 단어가 추가되었습니다.`);
      } else {
        alert('가져올 샘플 단어가 없습니다.');
      }
    } catch (error) {
      console.error('샘플 데이터 로딩 오류:', error);
      alert('샘플 데이터를 불러오는데 실패했습니다.');
    }
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(totalWords / pageSize);
  const paginationItems = [];
  const maxVisiblePages = 5;
  
  // 페이지네이션 범위 계산
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  // 범위 조정
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
      <h1 className="text-2xl font-bold mb-4">단어장 관리</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <div className="flex flex-wrap gap-4 mb-6">
        {/* 검색 */}
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="단어 검색..."
            className="px-4 py-2 border rounded-l"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
            disabled={isLoading}
          >
            검색
          </button>
        </form>
        
        {/* 정렬 */}
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
        
        {/* 파일 가져오기 */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            onChange={handleFileImport}
            className="hidden"
            id="file-import"
          />
          <label
            htmlFor="file-import"
            className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            파일에서 가져오기
          </label>
        </div>
        
        {/* 샘플 데이터 가져오기 */}
        <button
          onClick={handleLoadSampleData}
          className="bg-purple-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          샘플 데이터 가져오기
        </button>
      </div>
      
      {/* 필터링 */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">필터</h2>
        <div className="flex flex-wrap gap-4">
          {/* 난이도 필터 */}
          <select
            value={filterOptions.difficulty || ''}
            onChange={(e) => {
              const val = e.target.value === '' ? null : e.target.value;
              handleFilter({ 
                difficulty: val as 'beginner' | 'intermediate' | 'advanced' | null 
              });
            }}
            className="px-3 py-1 border rounded"
          >
            <option value="">모든 난이도</option>
            <option value="beginner">초급</option>
            <option value="intermediate">중급</option>
            <option value="advanced">고급</option>
          </select>
          
          {/* 북마크 필터 */}
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filterOptions.bookmarkedOnly}
              onChange={(e) => handleFilter({ bookmarkedOnly: e.target.checked })}
              className="mr-2"
            />
            북마크만
          </label>
          
          {/* 태그 필터링 UI */}
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 10).map((tag) => (
              <button
                key={tag.id}
                onClick={() => {
                  const isSelected = filterOptions.tags.some(t => t.id === tag.id);
                  const newTags = isSelected
                    ? filterOptions.tags.filter(t => t.id !== tag.id)
                    : [...filterOptions.tags, tag];
                  handleFilter({ tags: newTags });
                }}
                className={`px-2 py-1 text-sm rounded ${
                  filterOptions.tags.some(t => t.id === tag.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
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
                <td colSpan={5} className="text-center py-4">단어가 없습니다.</td>
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
      
      <div className="mt-4 text-center text-gray-600">
        총 {totalWords}개의 단어 중 {Math.min((currentPage - 1) * pageSize + 1, totalWords)} - {Math.min(currentPage * pageSize, totalWords)}
      </div>
    </div>
  );
};

export default VocabularyManager; 