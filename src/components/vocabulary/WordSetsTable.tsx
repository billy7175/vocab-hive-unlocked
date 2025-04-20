
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WordSet } from "@/types/vocabulary";

interface WordSetsTableProps {
  wordSets: WordSet[];
}

export const WordSetsTable = ({ wordSets }: WordSetsTableProps) => {
  const navigate = useNavigate();

  const handleStudyClick = (setId: string) => {
    navigate(`/wordsets/${setId}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">제목</TableHead>
            <TableHead className="hidden md:table-cell">작성자</TableHead>
            <TableHead className="hidden sm:table-cell">단어 수</TableHead>
            <TableHead className="hidden lg:table-cell">태그</TableHead>
            <TableHead className="text-right">학습하기</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wordSets.map((set) => (
            <TableRow 
              key={set.id} 
              className="cursor-pointer hover:bg-muted/80"
              onClick={() => handleStudyClick(set.id)}
            >
              <TableCell className="font-medium">
                <div>
                  <div className="font-semibold">{set.title}</div>
                  {set.description && (
                    <div className="text-sm text-muted-foreground hidden sm:block">
                      {set.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{set.createdBy}</TableCell>
              <TableCell className="hidden sm:table-cell">{set.totalWords} 단어</TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex flex-wrap gap-1">
                  {set.tags?.map((tag) => (
                    <Badge key={tag.id} variant="outline">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStudyClick(set.id);
                  }}
                  size="sm"
                >
                  공부하기
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {wordSets.length === 0 && (
          <TableCaption>No word sets found.</TableCaption>
        )}
      </Table>
    </div>
  );
};
