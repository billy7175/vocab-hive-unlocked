import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import WordGrid from "@/components/vocabulary/WordGrid";
import FilterSidebar from "@/components/vocabulary/FilterSidebar";
import TrendingSection from "@/components/vocabulary/TrendingSection";
import { 
  getAllWords, 
  MOCK_TAGS, 
  getTrendingWords,
  getPopularTags
} from "@/data/mockVocabularyData";
import { WordEntry, Tag, FilterOptions, SortOption } from "@/types/vocabulary";

const Index = () => {
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
    // In a real app, this would fetch from an API
    const words = getAllWords();
    setAllWords(words);
    setTrendingWords(getTrendingWords(8));
    setPopularTags(getPopularTags(12));
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
    // Add tag to filters if not already included
    if (!filterOptions.tags.some(t => t.id === tag.id)) {
      setFilterOptions({
        ...filterOptions,
        tags: [...filterOptions.tags, tag]
      });
    }
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
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      <ScrollToTopButton />
      
      <main className="container py-6 md:py-10">
        <div className="mb-10">
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
              allTags={MOCK_TAGS}
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
      </main>
    </div>
  );
};

export default Index;
