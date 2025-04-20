
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WordEntry, Tag } from "@/types/vocabulary";

interface TrendingSectionProps {
  trendingWords: WordEntry[];
  popularTags: Tag[];
  onTagClick: (tag: Tag) => void;
  onWordClick: (word: WordEntry) => void;
}

const TrendingSection = ({ trendingWords, popularTags, onTagClick, onWordClick }: TrendingSectionProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {/* Trending words card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Trending Words</CardTitle>
          <CardDescription>
            Popular words in the community this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {trendingWords.slice(0, expanded ? trendingWords.length : 5).map((word) => (
              <li 
                key={word.id}
                className="p-2 rounded-md hover:bg-accent transition-colors cursor-pointer"
                onClick={() => onWordClick(word)}
              >
                <div className="font-medium">{word.word}</div>
                <div className="text-sm text-muted-foreground line-clamp-1">
                  {word.meaning}
                </div>
              </li>
            ))}
          </ul>
          
          {trendingWords.length > 5 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setExpanded(!expanded)}
              className="w-full mt-2 text-xs"
            >
              {expanded ? "Show Less" : "Show More"}
            </Button>
          )}
        </CardContent>
      </Card>
      
      {/* Popular tags card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Popular Tags</CardTitle>
          <CardDescription>
            Explore words by popular categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge
                key={tag.id}
                className="cursor-pointer text-sm py-1 px-3"
                onClick={() => onTagClick(tag)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendingSection;
