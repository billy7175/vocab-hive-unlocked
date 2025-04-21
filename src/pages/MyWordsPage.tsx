
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import WordGrid from "@/components/vocabulary/WordGrid";
import { WordEntry, Tag, FilterOptions, SortOption } from "@/types/vocabulary";
import PageLayout from "@/components/layout/common/PageLayout";

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
    // 청크 파일에서 저장된 단어를 가져오기
    const loadBookmarkedWords = async () => {
      try {
        // 전체 단어 가져오기
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
        
        // 실제로는 서버에서 저장된 북마크 단어를 가져와야 하지만
        // 이 데모에서는 모든 단어의 일부를 북마크로 사용
        // 물론 실제로는 이부분이 서버에서 제공되어야 함
        const bookmarkedWords = allWords.slice(0, 10); // 처음 10개를 북마크로 설정
        
        setWords(bookmarkedWords);
      } catch (error) {
        console.error('북마크 단어 로드 오류:', error);
      }
    };
    
    loadBookmarkedWords();
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
    <PageLayout
      title="My Words"
      description="Your bookmarked vocabulary words for easy reference"
      onSearch={handleSearch}
    >
        
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
    </PageLayout>
  );
};

export default MyWordsPage;
