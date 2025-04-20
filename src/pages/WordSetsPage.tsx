import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { WordSetsTable } from "@/components/vocabulary/WordSetsTable";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import { Input } from "@/components/ui/input";
import { WordSet, Tag } from "@/types/vocabulary";
import { Loader2 } from "lucide-react";

// Temporary mock data until we connect to backend
const mockWordSets: WordSet[] = [
  {
    id: "1",
    title: "TOPIK 초급 필수 단어",
    description: "Basic Korean vocabulary for TOPIK level 1",
    words: [],
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
    words: [],
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
    const wordsByDifficulty: Record<string, any[]> = {
      beginner: [],
      intermediate: [],
      advanced: []
    };
    
    if (data.words && Array.isArray(data.words)) {
      data.words.forEach((word: any) => {
        const difficulty = word.difficulty || 'intermediate';
        if (wordsByDifficulty[difficulty]) {
          // 단어의 태그 객체 형태로 변환
          const wordTags = (word.tags || []).map((tagId: string) => tags[tagId]).filter(Boolean);
          wordsByDifficulty[difficulty].push({
            ...word,
            tags: wordTags
          });
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
            (word.tags || []).some((t: Tag) => t.id === tag.id)
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
            (word.tags || []).some((t: Tag) => t.id === tag.id)
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
            (word.tags || []).some((t: Tag) => t.id === tag.id)
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
      totalWords: data.words.length,
      tags: Object.values(tags).slice(0, 5)
    });
    
    return wordSets;
  } catch (error) {
    console.error('샘플 데이터 로딩 오류:', error);
    return [];
  }
};

const WordSetsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [wordSets, setWordSets] = useState<WordSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // 샘플 데이터와 기존 데이터 합치기
        const sampleWordSets = await loadSampleVocabularyData();
        setWordSets([...sampleWordSets, ...mockWordSets]);
        
        setError(null);
      } catch (err) {
        console.error('데이터 로딩 오류:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setWordSets(mockWordSets); // 에러 시 기본 데이터라도 표시
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const filteredWordSets = wordSets.filter(set => 
    set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    set.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={(term) => setSearchTerm(term)} />
      <ScrollToTopButton />
      
      <main className="container py-6 px-4 md:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">단어장 모음</h1>
          <p className="text-lg text-muted-foreground">
            Browse and study word collections created by the community
          </p>
        </div>

        <div className="space-y-6">
          <Input
            placeholder="단어장 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2">단어장을 불러오는 중...</span>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">
              <p>{error}</p>
              <p className="mt-2">기본 단어장 데이터를 표시합니다.</p>
            </div>
          ) : (
            <WordSetsTable wordSets={filteredWordSets} />
          )}
        </div>
      </main>
    </div>
  );
};

export default WordSetsPage;
