import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/common/PageLayout';
import LevelCollectionGrid, { VocabCollection } from '@/components/vocabulary/LevelCollectionGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LevelBasedPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('middle');
  const [isLoading, setIsLoading] = useState(true);
  const [elementaryCollections, setElementaryCollections] = useState<VocabCollection[]>([]);
  const [middleCollections, setMiddleCollections] = useState<VocabCollection[]>([]);
  const [highCollections, setHighCollections] = useState<VocabCollection[]>([]);
  
  useEffect(() => {
    const loadCollections = async () => {
      setIsLoading(true);
      
      try {
        // word-chunks/metadata.json에서 전체 메타데이터를 가져옴
        const metadataResponse = await fetch('/word-chunks/metadata.json');
        const metadata = await metadataResponse.json();
        
        // 초등 데이터 가져오기
        const elemMetadataResponse = await fetch('/word-chunks/elementary/metadata.json');
        const elemMetadata = await elemMetadataResponse.json();
        
        // 중등 데이터 가져오기
        const middleMetadataResponse = await fetch('/word-chunks/middle/metadata.json');
        const middleMetadata = await middleMetadataResponse.json();
        
        // 고등 데이터 가져오기
        const highMetadataResponse = await fetch('/word-chunks/high/metadata.json');
        const highMetadata = await highMetadataResponse.json();
        
        // 초등 단어장 구성
        setElementaryCollections([{
          id: 'elementary-collection',
          title: '초등 필수 단어',
          description: '초등학교 수준의 기초 영단어 모음',
          level: '초등',
          wordCount: elemMetadata.totalWords,
          difficulty: 'beginner',
          tags: ['초등', '기초', '필수']
        }
  ]);
      
      // 중등 단어장 구성
      setMiddleCollections([{
        id: 'middle-collection',
        title: '중등 필수 영단어',
        description: '중학교 레벨의 필수 영단어 모음',
        level: '중등',
        wordCount: middleMetadata.totalWords,
        difficulty: 'intermediate',
        tags: ['중등', '필수', '시험']
      }
  ]);
      
      // 고등 단어장 구성
      setHighCollections([{
        id: 'high-collection',
        title: '고등 필수 영단어',
        description: '고등학교 레벨의 필수 영단어 모음',
        level: '고등',
        wordCount: highMetadata.totalWords,
        difficulty: 'advanced',
        tags: ['고등', '필수', '수능']
      }
  ]);
      
      } catch (error) {
        console.error('단어장 메타데이터 로드 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCollections();
  }, []);

  const handleSearch = (term: string) => {
    console.log('Search term:', term);
    // 검색 기능 구현
  };

  return (
    <PageLayout 
      title="난이도별 단어장" 
      description="학년별, 난이도별로 정리된 영어 단어 모음집을 선택하여 학습하세요."
      onSearch={handleSearch}
    >
      <Tabs defaultValue="middle" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="elementary">초등</TabsTrigger>
          <TabsTrigger value="middle">중등</TabsTrigger>
          <TabsTrigger value="high">고등</TabsTrigger>
        </TabsList>
        <TabsContent value="elementary">
          <LevelCollectionGrid collections={elementaryCollections} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="middle">
          <LevelCollectionGrid collections={middleCollections} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="high">
          <LevelCollectionGrid collections={highCollections} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default LevelBasedPage;
