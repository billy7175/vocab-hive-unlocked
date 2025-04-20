
import { useState } from "react";
import Header from "@/components/layout/Header";
import { WordSetsTable } from "@/components/vocabulary/WordSetsTable";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import { Input } from "@/components/ui/input";
import { WordSet } from "@/types/vocabulary";

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

const WordSetsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [wordSets, setWordSets] = useState<WordSet[]>(mockWordSets);

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
          
          <WordSetsTable wordSets={filteredWordSets} />
        </div>
      </main>
    </div>
  );
};

export default WordSetsPage;
