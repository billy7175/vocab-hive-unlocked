import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/common/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Bookmark, BookmarkCheck, Download, Share2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Pagination from '@/components/vocabulary/Pagination';
import { WordEntry } from '@/types/vocabulary';



const WordCollectionDetailPage: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [words, setWords] = useState<WordEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [bookmarkedWords, setBookmarkedWords] = useState<Set<string>>(new Set());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  useEffect(() => {
    // 실제 청크 파일에서 단어장 정보 가져오기
    const loadWordCollection = async () => {
      setIsLoading(true);
      
      try {
        // 컬렉션 ID에서 레벨 정보 추출
        const levelType = collectionId?.split('-')[0] || 'middle';
        let level = '';
        
        // 레벨 타입 매핑
        if (levelType === 'elementary') {
          level = 'elementary';
          setDifficulty('beginner');
        } else if (levelType === 'middle') {
          level = 'middle';
          setDifficulty('intermediate');
        } else {
          level = 'high';
          setDifficulty('advanced');
        }
        
        // 레벨 메타데이터 가져오기
        const levelMetadataResponse = await fetch(`/word-chunks/${level}/metadata.json`);
        const levelMetadata = await levelMetadataResponse.json();
        
        // 전체 메타데이터 가져오기
        const globalMetadataResponse = await fetch('/word-chunks/metadata.json');
        const globalMetadata = await globalMetadataResponse.json();
        
        // 레벨에 해당하는 태그 필터링
        const levelTags = globalMetadata.tags.filter(tag => 
          // 여기에 적절한 태그 필터링 로직 추가
          tag.name.includes('기본') || 
          tag.name.includes(level === 'elementary' ? '초등' : level === 'middle' ? '중등' : '고등')
        );
        
        // 청크 파일 가져오기 (첫 번째 청크만)
        const chunkResponse = await fetch(`/word-chunks/${level}/chunk-1.json`);
        const chunkData = await chunkResponse.json();
        
        // 단어장 정보 설정
        setTitle(`${level === 'elementary' ? '초등' : level === 'middle' ? '중등' : '고등'} 필수 단어`);
        setDescription(`${level === 'elementary' ? '초등학교' : level === 'middle' ? '중학교' : '고등학교'} 레벨의 ${level === 'elementary' ? '기초' : '필수'} 영단어 모음`);
        setLevel(level === 'elementary' ? '초등' : level === 'middle' ? '중등' : '고등');
        setWordCount(levelMetadata.totalWords);
        setTags([level === 'elementary' ? '초등' : level === 'middle' ? '중등' : '고등', level === 'elementary' ? '기초' : '필수', '시험']);
        
        // 실제 단어 데이터 설정
        setWords(chunkData.words);
      } catch (error) {
        console.error('단어장 로드 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWordCollection();
  }, [collectionId, wordCount]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleBookmark = (wordId: string) => {
    setBookmarkedWords(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(wordId)) {
        newBookmarks.delete(wordId);
      } else {
        newBookmarks.add(wordId);
      }
      return newBookmarks;
    });
  };

  // 현재 페이지에 표시할 단어 필터링
  const paginatedWords = words.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(words.length / pageSize);

  return (
    <PageLayout>
      <div>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/level-based')} 
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> 단어장 목록으로
        </Button>
        
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> 내려받기
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" /> 공유하기
              </Button>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-3">{description}</p>
          
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant={
              difficulty === 'beginner' ? 'outline' : 
              difficulty === 'intermediate' ? 'secondary' : 
              'destructive'
            }>
              {difficulty === 'beginner' ? '초급' : 
               difficulty === 'intermediate' ? '중급' : '고급'}
            </Badge>
            
            <Badge variant="outline">{level}</Badge>
            <Badge variant="outline">{wordCount}개 단어</Badge>
            
            {tags.map((tag, idx) => (
              <Badge key={idx} variant="outline">{tag}</Badge>
            ))}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">단어 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">단어</TableHead>
                        <TableHead>의미</TableHead>
                        <TableHead className="w-[100px] text-center">저장</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedWords.map((word) => (
                        <TableRow key={word.id}>
                          <TableCell className="font-medium">
                            <div>
                              {word.word}
                              {word.pronunciation && (
                                <div className="text-xs text-muted-foreground">
                                  {word.pronunciation}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>{word.meaning}</div>
                            {word.translation && (
                              <div className="text-sm text-muted-foreground">
                                {word.translation}
                              </div>
                            )}
                            {word.example && (
                              <div className="text-sm italic mt-1">
                                {word.example}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleBookmark(word.id)}
                            >
                              {bookmarkedWords.has(word.id) ? (
                                <BookmarkCheck className="h-5 w-5 text-primary" />
                              ) : (
                                <Bookmark className="h-5 w-5" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      showSummary
                      totalItems={words.length}
                      pageSize={pageSize}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default WordCollectionDetailPage;
