import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import { WordSetDetail } from "@/components/vocabulary/WordSetDetail";
import { Button } from "@/components/ui/button";
import { WordSet, WordEntry, Tag } from "@/types/vocabulary";
import { Loader2 } from "lucide-react";

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

// sample-vocabulary-data.json에서 데이터를 가져와 WordSet 형식으로 변환하는 함수
const loadSampleVocabularyData = async (): Promise<WordSet[]> => {
  try {
    const response = await fetch('/sample-vocabulary-data.json');
    
    if (!response.ok) {
      throw new Error('샘플 데이터를 불러오는데 실패했습니다.');
    }
    
    const data = await response.json();
    
    // 샘플 데이터에서 태그 추출
    const tags: Record<string, Tag> = {};
    if (data.tags && Array.isArray(data.tags)) {
      data.tags.forEach((tag: { id: string; name: string }) => {
        tags[tag.id] = { id: tag.id, name: tag.name };
      });
    }
    
    // 단어들을 난이도별로 그룹화
    const wordsByDifficulty: Record<string, WordEntry[]> = {
      beginner: [],
      intermediate: [],
      advanced: []
    };
    
    if (data.words && Array.isArray(data.words)) {
      data.words.forEach((wordData: any) => {
        const difficulty = wordData.difficulty || 'intermediate';
        if (wordsByDifficulty[difficulty]) {
          // 단어의 태그 객체 형태로 변환
          const wordTags = (wordData.tags || []).map((tagId: string) => tags[tagId]).filter(Boolean);
          
          const word: WordEntry = {
            id: wordData.id,
            word: wordData.word,
            meaning: wordData.meaning,
            tags: wordTags,
            dateAdded: wordData.dateAdded || new Date().toISOString(),
            difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced'
          };
          
          if (wordData.translation) word.translation = wordData.translation;
          if (wordData.example) word.example = wordData.example;
          if (wordData.pronunciation) word.pronunciation = wordData.pronunciation;
          if (wordData.notes) word.notes = wordData.notes;
          if (wordData.audio) word.audio = wordData.audio;
          if (wordData.submittedBy) word.submittedBy = wordData.submittedBy;
          if (wordData.isBookmarked) word.isBookmarked = wordData.isBookmarked;
          
          wordsByDifficulty[difficulty].push(word);
        }
      });
    }
    
    // 난이도별로 단어장 생성
    const wordSets: WordSet[] = [];
    
    if (wordsByDifficulty.beginner.length > 0) {
      wordSets.push({
        id: "sample-beginner",
        title: "초급 영어 단어 모음",
        description: "Essential beginner-level English vocabulary",
        words: wordsByDifficulty.beginner,
        createdBy: "Vocab Hive",
        dateCreated: new Date().toISOString().split('T')[0],
        totalWords: wordsByDifficulty.beginner.length,
        difficulty: "beginner",
        tags: Object.values(tags).filter(tag => 
          wordsByDifficulty.beginner.some(word => 
            word.tags.some(t => t.id === tag.id)
          )
        ).slice(0, 3)
      });
    }
    
    if (wordsByDifficulty.intermediate.length > 0) {
      wordSets.push({
        id: "sample-intermediate",
        title: "중급 영어 단어 모음",
        description: "Essential intermediate-level English vocabulary",
        words: wordsByDifficulty.intermediate,
        createdBy: "Vocab Hive",
        dateCreated: new Date().toISOString().split('T')[0],
        totalWords: wordsByDifficulty.intermediate.length,
        difficulty: "intermediate",
        tags: Object.values(tags).filter(tag => 
          wordsByDifficulty.intermediate.some(word => 
            word.tags.some(t => t.id === tag.id)
          )
        ).slice(0, 3)
      });
    }
    
    if (wordsByDifficulty.advanced.length > 0) {
      wordSets.push({
        id: "sample-advanced",
        title: "고급 영어 단어 모음",
        description: "Advanced English vocabulary for professionals",
        words: wordsByDifficulty.advanced,
        createdBy: "Vocab Hive",
        dateCreated: new Date().toISOString().split('T')[0],
        totalWords: wordsByDifficulty.advanced.length,
        difficulty: "advanced",
        tags: Object.values(tags).filter(tag => 
          wordsByDifficulty.advanced.some(word => 
            word.tags.some(t => t.id === tag.id)
          )
        ).slice(0, 3)
      });
    }
    
    // 모든 단어를 포함하는 종합 모음
    wordSets.push({
      id: "sample-all",
      title: "영어 필수 단어 모음 (전체)",
      description: "Complete collection of essential English vocabulary",
      words: [...wordsByDifficulty.beginner, ...wordsByDifficulty.intermediate, ...wordsByDifficulty.advanced],
      createdBy: "Vocab Hive",
      dateCreated: new Date().toISOString().split('T')[0],
      totalWords: Object.values(wordsByDifficulty).flat().length,
      tags: Object.values(tags).slice(0, 5)
    });
    
    return wordSets;
  } catch (error) {
    console.error('샘플 데이터 로딩 오류:', error);
    return [];
  }
};

const WordSetDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [wordSet, setWordSet] = useState<WordSet | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // 샘플 데이터 가져오기
        const sampleWordSets = await loadSampleVocabularyData();
        const allWordSets = [...sampleWordSets, ...mockWordSets];
        
        // 가져온 데이터에서 id에 해당하는 단어장 찾기
        const foundWordSet = allWordSets.find(set => set.id === id);
        
        if (foundWordSet) {
          setWordSet(foundWordSet);
          setError(null);
        } else {
          console.error(`404 Error: User attempted to access non-existent wordset: ${id}`);
          setError('요청하신 단어장을 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('데이터 로딩 오류:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        
        // 기존 데이터에서 찾아보기
        const foundWordSet = mockWordSets.find(set => set.id === id);
        if (foundWordSet) {
          setWordSet(foundWordSet);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id, navigate]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-medium">단어장을 불러오는 중...</h2>
        </div>
      </div>
    );
  }

  if (error || !wordSet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">단어장을 찾을 수 없습니다</h1>
          <p className="mb-6 text-muted-foreground">
            {error || '요청하신 단어장이 존재하지 않습니다.'}
          </p>
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
            {wordSet.difficulty && (
              <>
                <span>•</span>
                <span>난이도: {
                  wordSet.difficulty === 'beginner' ? '초급' : 
                  wordSet.difficulty === 'intermediate' ? '중급' : '고급'
                }</span>
              </>
            )}
            <span>•</span>
            <span>생성일: {wordSet.dateCreated}</span>
          </div>
          
          {wordSet.tags && wordSet.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {wordSet.tags.map(tag => (
                <span 
                  key={tag.id} 
                  className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <WordSetDetail wordSet={wordSet} searchTerm={searchTerm} />
      </main>
    </div>
  );
};

export default WordSetDetailPage;
