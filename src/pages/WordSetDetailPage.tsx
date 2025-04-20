
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import { WordSetDetail } from "@/components/vocabulary/WordSetDetail";
import { Button } from "@/components/ui/button";
import { WordSet, WordEntry } from "@/types/vocabulary";

// Mock word entries for the detail page
const generateMockWords = (count: number, setTitle: string): WordEntry[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `word-${i}`,
    word: `Example Word ${i + 1}`,
    meaning: `The definition of Example Word ${i + 1}`,
    translation: `예시 단어 ${i + 1}`,
    example: `This is an example sentence using Example Word ${i + 1}.`,
    tags: [{ id: `tag-${i % 3}`, name: `Tag ${i % 3}` }],
    dateAdded: new Date().toISOString(),
    difficulty: i % 3 === 0 ? 'beginner' : i % 3 === 1 ? 'intermediate' : 'advanced'
  }));
};

// Temporary mock data - would be fetched from API in real app
const mockWordSets: WordSet[] = [
  {
    id: "1",
    title: "TOPIK 초급 필수 단어",
    description: "Basic Korean vocabulary for TOPIK level 1",
    words: generateMockWords(50, "TOPIK 초급"),
    createdBy: "Korean Teacher Kim",
    dateCreated: "2024-04-20",
    totalWords: 50,
    difficulty: "beginner",
    tags: [{ id: "1", name: "TOPIK" }, { id: "2", name: "초급" }]
  },
  {
    id: "2",
    title: "비즈니스 한국어",
    description: "Essential business Korean vocabulary",
    words: generateMockWords(100, "비즈니스 한국어"),
    createdBy: "Business Korean Pro",
    dateCreated: "2024-04-19",
    totalWords: 100,
    difficulty: "intermediate",
    tags: [{ id: "3", name: "비즈니스" }, { id: "4", name: "중급" }]
  }
];

const WordSetDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [wordSet, setWordSet] = useState<WordSet | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // In a real app, this would be an API call
    const foundWordSet = mockWordSets.find(set => set.id === id);
    
    if (foundWordSet) {
      setWordSet(foundWordSet);
    } else {
      console.error(`404 Error: User attempted to access non-existent wordset: ${id}`);
      // Optionally navigate to 404 page
      // navigate("/404");
    }
  }, [id, navigate]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  if (!wordSet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">단어장을 찾을 수 없습니다</h1>
          <p className="mb-6 text-muted-foreground">요청하신 단어장이 존재하지 않습니다.</p>
          <Button onClick={() => navigate("/wordsets")}>단어장 목록으로 돌아가기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      <ScrollToTopButton />
      
      <main className="container py-6 px-4 md:py-10">
        <div className="mb-8">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => navigate("/wordsets")}
          >
            ← 단어장 목록으로
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">{wordSet.title}</h1>
          {wordSet.description && (
            <p className="text-lg text-muted-foreground mb-2">
              {wordSet.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
            <span>만든이: {wordSet.createdBy}</span>
            <span>•</span>
            <span>단어 수: {wordSet.totalWords}개</span>
            <span>•</span>
            <span>난이도: {
              wordSet.difficulty === 'beginner' ? '초급' : 
              wordSet.difficulty === 'intermediate' ? '중급' : '고급'
            }</span>
          </div>
        </div>

        <WordSetDetail wordSet={wordSet} searchTerm={searchTerm} />
      </main>
    </div>
  );
};

export default WordSetDetailPage;
