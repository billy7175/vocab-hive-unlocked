
import { useState, useEffect } from "react";
import WordCard from "./WordCard";
import { Button } from "@/components/ui/button";
import { WordEntry, Tag, FilterOptions, SortOption } from "@/types/vocabulary";

interface WordGridProps {
  words: WordEntry[];
  onTagClick: (tag: Tag) => void;
  onBookmark: (wordId: string) => void;
  filterOptions: FilterOptions;
  sortOption: SortOption;
}

const WordGrid = ({ words, onTagClick, onBookmark, filterOptions, sortOption }: WordGridProps) => {
  const [visibleWords, setVisibleWords] = useState<WordEntry[]>([]);
  const [page, setPage] = useState(1);
  const wordsPerPage = 12;

  // Apply filtering and sorting
  useEffect(() => {
    let filteredWords = [...words];
    
    // Apply tag filters
    if (filterOptions.tags.length > 0) {
      filteredWords = filteredWords.filter(word => 
        word.tags.some(tag => filterOptions.tags.some(filterTag => filterTag.id === tag.id))
      );
    }
    
    // Apply difficulty filter
    if (filterOptions.difficulty) {
      filteredWords = filteredWords.filter(word => word.difficulty === filterOptions.difficulty);
    }
    
    // Apply bookmarked filter
    if (filterOptions.bookmarkedOnly) {
      filteredWords = filteredWords.filter(word => word.isBookmarked);
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'newest':
        filteredWords.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        break;
      case 'oldest':
        filteredWords.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
        break;
      case 'alphabetical':
        filteredWords.sort((a, b) => a.word.localeCompare(b.word));
        break;
      case 'popular':
        // Sort by a "popularity" metric - could be based on bookmarks/views count in a real app
        filteredWords.sort((a, b) => (b.isBookmarked ? 1 : 0) - (a.isBookmarked ? 1 : 0));
        break;
    }
    
    const startIndex = 0;
    const endIndex = page * wordsPerPage;
    setVisibleWords(filteredWords.slice(startIndex, endIndex));
    
  }, [words, filterOptions, sortOption, page]);

  const loadMoreWords = () => {
    setPage(prevPage => prevPage + 1);
  };

  if (visibleWords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-muted-foreground mb-4">No words found matching your criteria</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reset filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {visibleWords.map(word => (
        <WordCard 
          key={word.id}
          word={word}
          onTagClick={onTagClick}
          onBookmark={onBookmark}
        />
      ))}
      
      {visibleWords.length % wordsPerPage === 0 && visibleWords.length > 0 && (
        <div className="col-span-full my-6 flex justify-center">
          <Button onClick={loadMoreWords} variant="outline">
            Load More Words
          </Button>
        </div>
      )}
    </div>
  );
};

export default WordGrid;
