import { WordEntry, Tag } from '@/types/vocabulary';
import { v4 as uuidv4 } from 'uuid';

// 파일에서 대량의 단어 가져오기 (CSV 파일 형식)
export const importFromCSV = (csvContent: string): { words: WordEntry[], tags: Tag[] } => {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  
  const wordIndex = headers.indexOf('word');
  const meaningIndex = headers.indexOf('meaning');
  const translationIndex = headers.indexOf('translation');
  const exampleIndex = headers.indexOf('example');
  const pronunciationIndex = headers.indexOf('pronunciation');
  const difficultyIndex = headers.indexOf('difficulty');
  const tagsIndex = headers.indexOf('tags');
  
  const allTags: Record<string, Tag> = {};
  const words: WordEntry[] = [];
  
  // 첫 번째 줄은 헤더이므로 건너뜁니다
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(',');
    
    // 태그 처리
    const tagNames = tagsIndex >= 0 ? values[tagsIndex].split(';').map(t => t.trim()) : [];
    const wordTags: Tag[] = [];
    
    tagNames.forEach(tagName => {
      if (!tagName) return;
      
      if (!allTags[tagName]) {
        const newTag: Tag = { id: uuidv4(), name: tagName };
        allTags[tagName] = newTag;
      }
      
      wordTags.push(allTags[tagName]);
    });
    
    // 단어 객체 생성
    const word: WordEntry = {
      id: uuidv4(),
      word: values[wordIndex] || '',
      meaning: values[meaningIndex] || '',
      tags: wordTags,
      dateAdded: new Date().toISOString(),
    };
    
    // 선택적 필드 추가
    if (translationIndex >= 0 && values[translationIndex]) {
      word.translation = values[translationIndex];
    }
    
    if (exampleIndex >= 0 && values[exampleIndex]) {
      word.example = values[exampleIndex];
    }
    
    if (pronunciationIndex >= 0 && values[pronunciationIndex]) {
      word.pronunciation = values[pronunciationIndex];
    }
    
    if (difficultyIndex >= 0 && values[difficultyIndex]) {
      const difficulty = values[difficultyIndex].trim().toLowerCase();
      if (['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
        word.difficulty = difficulty as 'beginner' | 'intermediate' | 'advanced';
      }
    }
    
    words.push(word);
  }
  
  return {
    words,
    tags: Object.values(allTags)
  };
};

// 태그 정의 인터페이스 (JSON 파일 내부 객체를 위한 타입)
interface ImportTagData {
  id: string;
  name: string;
}

// 단어 정의 인터페이스 (JSON 파일 내부 객체를 위한 타입)
interface ImportWordData {
  id?: string;
  word: string;
  meaning: string;
  translation?: string;
  example?: string;
  pronunciation?: string;
  notes?: string;
  audio?: string;
  tags?: string[];
  submittedBy?: string;
  dateAdded?: string;
  isBookmarked?: boolean;
  difficulty?: string;
}

// 가져오기 데이터 형식
interface ImportData {
  meta?: {
    version?: string;
    source?: string;
    createDate?: string;
    count?: number;
  };
  tags?: ImportTagData[];
  words?: ImportWordData[];
}

// JSON 파일에서 데이터 가져오기
export const importFromJSON = (jsonContent: string): { words: WordEntry[], tags: Tag[] } => {
  try {
    const data = JSON.parse(jsonContent) as ImportData;
    const tagMap: Record<string, Tag> = {};
    const tags: Tag[] = [];
    
    // 태그 정보가 있는 경우 추출
    if (Array.isArray(data.tags)) {
      data.tags.forEach((tag: ImportTagData) => {
        if (tag.id && tag.name) {
          const newTag: Tag = { id: tag.id, name: tag.name };
          tagMap[tag.name] = newTag;
          tags.push(newTag);
        }
      });
    }
    
    // 단어 데이터 변환
    let words: WordEntry[] = [];
    if (Array.isArray(data.words)) {
      words = data.words.map((item: ImportWordData) => {
        // 태그 링크 처리
        const wordTags: Tag[] = [];
        if (Array.isArray(item.tags)) {
          item.tags.forEach((tagName: string) => {
            if (tagMap[tagName]) {
              wordTags.push(tagMap[tagName]);
            } else {
              const newTag: Tag = { id: uuidv4(), name: tagName };
              tagMap[tagName] = newTag;
              tags.push(newTag);
              wordTags.push(newTag);
            }
          });
        }
        
        const word: WordEntry = {
          id: item.id || uuidv4(),
          word: item.word || '',
          meaning: item.meaning || '',
          tags: wordTags,
          dateAdded: item.dateAdded || new Date().toISOString(),
        };
        
        // 선택적 필드 추가
        if (item.translation) word.translation = item.translation;
        if (item.example) word.example = item.example;
        if (item.pronunciation) word.pronunciation = item.pronunciation;
        if (item.notes) word.notes = item.notes;
        if (item.audio) word.audio = item.audio;
        if (item.submittedBy) word.submittedBy = item.submittedBy;
        if (item.isBookmarked) word.isBookmarked = item.isBookmarked;
        if (['beginner', 'intermediate', 'advanced'].includes(item.difficulty || '')) {
          word.difficulty = item.difficulty as 'beginner' | 'intermediate' | 'advanced';
        }
        
        return word;
      });
    }
    
    return { words, tags };
  } catch (error) {
    console.error('JSON 파싱 오류:', error);
    return { words: [], tags: [] };
  }
};

// Excel 또는 다른 파일 형식 처리를 위한 함수 - 필요에 따라 추가 가능

// API에서 대량의 단어 가져오기 예시
export const fetchWordsFromAPI = async (
  apiUrl: string, 
  params: Record<string, string> = {}
): Promise<{ words: WordEntry[], tags: Tag[] }> => {
  try {
    // URL 파라미터 구성
    const queryParams = new URLSearchParams(params);
    const fullUrl = `${apiUrl}?${queryParams.toString()}`;
    
    const response = await fetch(fullUrl);
    
    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }
    
    const data = await response.json();
    return importFromJSON(JSON.stringify(data));
  } catch (error) {
    console.error('API 데이터 가져오기 오류:', error);
    return { words: [], tags: [] };
  }
}; 