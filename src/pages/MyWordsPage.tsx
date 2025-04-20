
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WordGrid from "@/components/vocabulary/WordGrid";
import { getAllWords } from "@/data/mockVocabularyData";
import { WordEntry, Tag, FilterOptions, SortOption } from "@/types/vocabulary";

const MyWordsPage = () => {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    tags: [],
    bookmarkedOnly: true,
    difficulty: null
  });
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  useEffect(() => {
    // In a real app, this would fetch the user's bookmarked words from an API
    // For this demo, we'll just filter the mock data for bookmarked words
    const allWords = getAllWords();
    const bookmarkedWords = allWords.filter(word => word.isBookmarked);
    setWords(bookmarkedWords);
  }, []);

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
    setWords(words.map(word => 
      word.id === wordId 
        ? { ...word, isBookmarked: !word.isBookmarked } 
        : word
    ));
  };

  const filteredWords = words
    .filter(word => {
      // Apply search term filter
      if (searchTerm && !word.word.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !word.meaning.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      <ScrollToTopButton />
      
      <main className="container py-6 px-4 md:py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">My Words</h1>
          <p className="text-lg text-muted-foreground">
            Your bookmarked vocabulary words for easy reference
          </p>
        </div>
        
        {filteredWords.length > 0 ? (
          <WordGrid 
            words={filteredWords}
            onTagClick={handleTagClick}
            onBookmark={handleBookmark}
            filterOptions={filterOptions}
            sortOption={sortOption}
          />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-3">No Bookmarked Words Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You haven't bookmarked any vocabulary words yet. Browse and bookmark words to add them to your collection.
            </p>
            <Button 
              onClick={() => window.location.href = "/"}
              className="mx-auto"
            >
              Explore Vocabulary
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyWordsPage;
