import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export interface VocabCollection {
  id: string;
  title: string;
  description: string;
  level: string;
  wordCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

interface LevelCollectionGridProps {
  collections: VocabCollection[];
  isLoading?: boolean;
  className?: string;
}

const LevelCollectionGrid: React.FC<LevelCollectionGridProps> = ({
  collections,
  isLoading = false,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleCollectionClick = (collectionId: string) => {
    navigate(`/level-based/${collectionId}`);
  };

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="w-full h-[220px] animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 bg-muted rounded-md w-2/3"></div>
              <div className="h-4 bg-muted rounded-md w-full mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded-md w-1/2 mt-2"></div>
            </CardContent>
            <CardFooter>
              <div className="h-9 bg-muted rounded-md w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">단어 모음집이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {collections.map((collection) => (
        <Card 
          key={collection.id} 
          className="w-full hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleCollectionClick(collection.id)}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {collection.title}
              <Badge variant={
                collection.difficulty === 'beginner' ? 'outline' : 
                collection.difficulty === 'intermediate' ? 'secondary' : 
                'destructive'
              }>
                {collection.difficulty === 'beginner' ? '초급' : 
                 collection.difficulty === 'intermediate' ? '중급' : 
                 '고급'}
              </Badge>
            </CardTitle>
            <CardDescription>{collection.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>{collection.wordCount}개 단어</span>
            </div>
            {collection.tags && collection.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {collection.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="secondary" className="w-full">
              학습하기
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default LevelCollectionGrid;
