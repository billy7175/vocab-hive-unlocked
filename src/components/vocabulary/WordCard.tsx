
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, BookmarkCheck, Volume2 } from "lucide-react";
import { Tag, WordEntry } from "@/types/vocabulary";

interface WordCardProps {
  word: WordEntry;
  onTagClick: (tag: Tag) => void;
  onBookmark: (wordId: string) => void;
}

const WordCard = ({ word, onTagClick, onBookmark }: WordCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(word.isBookmarked || false);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark(word.id);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleTagClick = (tag: Tag) => {
    onTagClick(tag);
  };

  return (
    <Card className={`word-card overflow-hidden ${expanded ? "scale-in" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-pretty text-xl font-bold">{word.word}</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleBookmark}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this word"}
          >
            {isBookmarked ? (
              <BookmarkCheck className="text-primary h-5 w-5" />
            ) : (
              <Bookmark className="text-muted-foreground h-5 w-5" />
            )}
          </Button>
        </div>
        <CardDescription className="text-pretty">
          {word.translation && (
            <span className="text-muted-foreground italic">
              {word.translation}
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="text-sm mb-2">
          <p className="font-medium">Meaning:</p>
          <p className="text-pretty">{word.meaning}</p>
        </div>

        {expanded && (
          <div className="mt-3 text-sm fade-in">
            {word.example && (
              <div className="mb-2">
                <p className="font-medium">Example:</p>
                <p className="text-pretty italic">"{word.example}"</p>
              </div>
            )}
            
            {word.notes && (
              <div className="mb-2">
                <p className="font-medium">Notes:</p>
                <p className="text-pretty">{word.notes}</p>
              </div>
            )}

            {word.pronunciation && (
              <div className="flex items-center mt-2 mb-1">
                <span className="text-sm font-medium mr-2">Pronunciation:</span>
                <span className="text-sm">{word.pronunciation}</span>
                {word.audio && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 ml-1"
                    onClick={() => {
                      const audio = new Audio(word.audio);
                      audio.play();
                    }}
                    aria-label="Play pronunciation"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
            
            {word.submittedBy && (
              <div className="text-xs text-muted-foreground mt-2">
                Contributed by {word.submittedBy}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-stretch pt-0">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {word.tags.map((tag) => (
            <Badge 
              key={tag.id} 
              variant="outline" 
              className="tag-pill cursor-pointer"
              onClick={() => handleTagClick(tag)}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-xs" 
          onClick={toggleExpand}
        >
          {expanded ? "Show Less" : "Show More"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WordCard;
