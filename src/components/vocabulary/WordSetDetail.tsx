
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WordSet, WordEntry } from "@/types/vocabulary";

interface WordSetDetailProps {
  wordSet: WordSet;
  searchTerm: string;
}

export function WordSetDetail({ wordSet, searchTerm }: WordSetDetailProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<string>("alphabetical");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedWord, setExpandedWord] = useState<string | null>(null);
  const itemsPerPage = 20;

  // Filter words based on search term (from header or local)
  const effectiveSearchTerm = searchTerm || localSearchTerm;
  const filteredWords = wordSet.words.filter(word => 
    word.word.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
    word.meaning.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
    word.translation?.toLowerCase().includes(effectiveSearchTerm.toLowerCase())
  );

  // Sort the filtered words
  const sortedWords = [...filteredWords].sort((a, b) => {
    switch (sortOption) {
      case "alphabetical":
        return a.word.localeCompare(b.word);
      case "alphabetical-reverse":
        return b.word.localeCompare(a.word);
      case "newest":
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      case "oldest":
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      default:
        return 0;
    }
  });

  // Paginate the sorted words
  const totalPages = Math.ceil(sortedWords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWords = sortedWords.slice(startIndex, startIndex + itemsPerPage);

  const handleToggleExpand = (wordId: string) => {
    if (expandedWord === wordId) {
      setExpandedWord(null);
    } else {
      setExpandedWord(wordId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Input
          placeholder="단어 검색..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        
        <Select
          value={sortOption}
          onValueChange={(value) => setSortOption(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 방식" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alphabetical">가나다순</SelectItem>
            <SelectItem value="alphabetical-reverse">가나다순 (역순)</SelectItem>
            <SelectItem value="newest">최신순</SelectItem>
            <SelectItem value="oldest">오래된순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">단어</TableHead>
              <TableHead className="hidden md:table-cell">의미</TableHead>
              <TableHead className="hidden sm:table-cell">번역</TableHead>
              <TableHead className="hidden lg:table-cell w-[120px]">난이도</TableHead>
              <TableHead className="w-[100px] text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedWords.map((word) => (
              <>
                <TableRow key={word.id} className={expandedWord === word.id ? "border-b-0" : ""}>
                  <TableCell className="font-medium">{word.word}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {word.meaning.length > 60 
                      ? `${word.meaning.substring(0, 60)}...` 
                      : word.meaning}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {word.translation}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant={
                      word.difficulty === 'beginner' ? 'outline' : 
                      word.difficulty === 'intermediate' ? 'secondary' : 'default'
                    }>
                      {word.difficulty === 'beginner' ? '초급' : 
                       word.difficulty === 'intermediate' ? '중급' : '고급'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleExpand(word.id)}
                    >
                      {expandedWord === word.id ? '접기' : '더 보기'}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedWord === word.id && (
                  <TableRow key={`${word.id}-expanded`}>
                    <TableCell colSpan={5} className="bg-muted/50 p-4">
                      <div className="space-y-2">
                        {word.example && (
                          <div>
                            <div className="font-semibold mb-1">예문:</div>
                            <p className="text-sm italic">{word.example}</p>
                          </div>
                        )}
                        
                        {word.tags.length > 0 && (
                          <div>
                            <div className="font-semibold mb-1">태그:</div>
                            <div className="flex flex-wrap gap-1">
                              {word.tags.map(tag => (
                                <Badge key={tag.id} variant="outline">
                                  {tag.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {word.notes && (
                          <div>
                            <div className="font-semibold mb-1">메모:</div>
                            <p className="text-sm">{word.notes}</p>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
          {paginatedWords.length === 0 && (
            <TableCaption>단어를 찾을 수 없습니다.</TableCaption>
          )}
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              이전
            </Button>
            
            <div className="flex items-center px-4">
              {currentPage} / {totalPages}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              다음
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
