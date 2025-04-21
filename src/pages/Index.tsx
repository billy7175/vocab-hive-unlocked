import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/common/PageLayout";
import WordGrid from "@/components/vocabulary/WordGrid";
import FilterSidebar from "@/components/vocabulary/FilterSidebar";
import TrendingSection from "@/components/vocabulary/TrendingSection";
// 청크 파일에서 데이터를 가져오도록 변경
import { WordEntry, Tag, FilterOptions, SortOption } from "@/types/vocabulary";

const Index = () => {
  const navigate = useNavigate();
  const [allWords, setAllWords] = useState<WordEntry[]>([]);
  const [filteredWords, setFilteredWords] = useState<WordEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    tags: [],
    bookmarkedOnly: false,
    difficulty: null
  });
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [trendingWords, setTrendingWords] = useState<WordEntry[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);

  useEffect(() => {
    // 청크 파일에서 데이터 가져오기
    const loadVocabularyData = async () => {
      try {
        // 전층 메타데이터 가져오기
        const metadataResponse = await fetch('/word-chunks/metadata.json');
        const metadata = await metadataResponse.json();
        
        // 태그 정보 가져오기
        const tags = metadata.tags || [];
        setPopularTags(tags.slice(0, 12));
        
        // 초급, 중급, 고급 청크 파일에서 단어 가져오기
        const elementaryResponse = await fetch('/word-chunks/elementary/chunk-1.json');
        const middleResponse = await fetch('/word-chunks/middle/chunk-1.json');
        const highResponse = await fetch('/word-chunks/high/chunk-1.json');
        
        const elementaryData = await elementaryResponse.json();
        const middleData = await middleResponse.json();
        const highData = await highResponse.json();
        
        // 모든 단어 합치기
        const allWords = [
          ...elementaryData.words, 
          ...middleData.words, 
          ...highData.words
        ];
        
        setAllWords(allWords);
        // 최근에 추가된 단어 8개를 트렌딩으로 사용
        setTrendingWords(allWords.slice(0, 8));
      } catch (error) {
        console.error('단어 데이터 로드 오류:', error);
      }
    };
    
    loadVocabularyData();
  }, []);

  useEffect(() => {
    // Apply filtering and search to the words
    let result = [...allWords];
    
    // Apply search term
    if (searchTerm) {
      result = result.filter(word => 
        word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.meaning.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredWords(result);
  }, [allWords, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

const handleTagClick = (tag: Tag) => {
    // 태그 클릭 시 난이도별 단어장 페이지로 이동할 수 있도록 로직 수정 가능
    console.log('Tag clicked:', tag);
    navigate('/level-based');
  };

  const handleBookmark = (wordId: string) => {
    // In a real app, this would update a bookmark in the database
    // For this demo, we'll just update the local state
    setAllWords(allWords.map(word => 
      word.id === wordId 
        ? { ...word, isBookmarked: !word.isBookmarked } 
        : word
    ));
  };

  const handleWordClick = (word: WordEntry) => {
    // This would typically navigate to a word detail page
    // For this demo, we'll just scroll to the word in the list
    const wordElement = document.getElementById(`word-${word.id}`);
    if (wordElement) {
      wordElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PageLayout
      onSearch={handleSearch}
      containerClassName="px-0 md:px-4"
    >
      <div className="mb-10 px-4">
        <h1 className="text-4xl font-bold text-center mb-4">VocabHive</h1>
        <p className="text-xl text-center text-muted-foreground mb-6 max-w-3xl mx-auto">
          Discover, learn, and contribute to our community-driven English vocabulary collection
        </p>
          
          {/* Trending section */}
          <div className="mb-10">
            <TrendingSection 
              trendingWords={trendingWords}
              popularTags={popularTags}
              onTagClick={handleTagClick}
              onWordClick={handleWordClick}
            />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter sidebar */}
          <aside className="md:w-64 lg:w-72 shrink-0">
            <FilterSidebar 
            allTags={popularTags}
            filterOptions={filterOptions}
            sortOption={sortOption}
            onFilterChange={setFilterOptions}
            onSortChange={setSortOption}
            />
          </aside>
          
          {/* Main content */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6">
              {searchTerm ? `Search Results for "${searchTerm}"` : "All Vocabulary"}
            </h2>
            
            <WordGrid 
              words={filteredWords}
              onTagClick={handleTagClick}
              onBookmark={handleBookmark}
              filterOptions={filterOptions}
              sortOption={sortOption}
            />
          </div>
        </div>
    </PageLayout>
  );
};

export default Index;
