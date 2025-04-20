import { WordEntry, Tag } from "@/types/vocabulary";

// 데이터베이스 설정
const DB_NAME = 'vocabHiveDB';
const DB_VERSION = 1;
const WORD_STORE = 'words';
const TAG_STORE = 'tags';


// IndexedDB 초기화 함수
export const initDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    // const request = indexedDB.open(DB_NAME, DB_VERSION);
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = (event) => {
      reject('데이터베이스 접근에 실패했습니다.');
    };

    request.onsuccess = (event) => {
      const db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // 단어 저장소 생성
      if (!db.objectStoreNames.contains(WORD_STORE)) {
        const wordStore = db.createObjectStore(WORD_STORE, { keyPath: 'id' });
        wordStore.createIndex('word', 'word', { unique: false });
        wordStore.createIndex('difficulty', 'difficulty', { unique: false });
        wordStore.createIndex('dateAdded', 'dateAdded', { unique: false });
        wordStore.createIndex('isBookmarked', 'isBookmarked', { unique: false });
      }
      
      // 태그 저장소 생성
      if (!db.objectStoreNames.contains(TAG_STORE)) {
        const tagStore = db.createObjectStore(TAG_STORE, { keyPath: 'id' });
        tagStore.createIndex('name', 'name', { unique: true });
      }
    };
  });
};

// 단어 데이터 일괄 추가
export const bulkAddWords = async (words: WordEntry[]): Promise<void> => {
  const db = await initDatabase();
  const transaction = db.transaction(WORD_STORE, 'readwrite');
  const store = transaction.objectStore(WORD_STORE);
  
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    
    words.forEach(word => {
      store.put(word);
    });
  });
};

// 태그 데이터 일괄 추가
export const bulkAddTags = async (tags: Tag[]): Promise<void> => {
  const db = await initDatabase();
  const transaction = db.transaction(TAG_STORE, 'readwrite');
  const store = transaction.objectStore(TAG_STORE);
  
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    
    tags.forEach(tag => {
      store.put(tag);
    });
  });
};

// 단어 페이지네이션 조회
export const getWords = async (
  page: number = 1, 
  limit: number = 50,
  sortBy: string = 'dateAdded',
  sortDirection: IDBCursorDirection = 'next'
): Promise<{ words: WordEntry[], total: number }> => {
  const db = await initDatabase();
  const transaction = db.transaction(WORD_STORE, 'readonly');
  const store = transaction.objectStore(WORD_STORE);
  const index = store.index(sortBy);
  
  // 전체 단어 수 조회
  const countRequest = store.count();
  
  const words: WordEntry[] = [];
  const skip = (page - 1) * limit;
  
  return new Promise((resolve, reject) => {
    transaction.onerror = () => reject(transaction.error);
    
    countRequest.onsuccess = () => {
      const total = countRequest.result;
      
      if (skip >= total) {
        resolve({ words: [], total });
        return;
      }
      
      const cursorRequest = index.openCursor(null, sortDirection);
      let counter = 0;
      
      cursorRequest.onsuccess = (event) => {
        const cursor = cursorRequest.result;
        
        if (!cursor) {
          resolve({ words, total });
          return;
        }
        
        if (counter >= skip) {
          if (words.length < limit) {
            words.push(cursor.value);
          }
          
          if (words.length >= limit) {
            resolve({ words, total });
            return;
          }
        }
        
        counter++;
        cursor.continue();
      };
    };
  });
};

// 검색 기능
export const searchWords = async (query: string): Promise<WordEntry[]> => {
  const db = await initDatabase();
  const transaction = db.transaction(WORD_STORE, 'readonly');
  const store = transaction.objectStore(WORD_STORE);
  const index = store.index('word');
  
  return new Promise((resolve, reject) => {
    transaction.onerror = () => reject(transaction.error);
    
    // 대소문자 구분 없이 검색을 위한 정규식
    const regex = new RegExp(query, 'i');
    const words: WordEntry[] = [];
    
    index.openCursor().onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      
      if (cursor) {
        if (regex.test(cursor.value.word) || 
            regex.test(cursor.value.meaning) || 
            (cursor.value.translation && regex.test(cursor.value.translation))) {
          words.push(cursor.value);
        }
        cursor.continue();
      } else {
        resolve(words);
      }
    };
  });
};

// 필터링된 단어 조회
export const getFilteredWords = async (
  filters: {
    tagIds?: string[],
    difficulty?: string,
    bookmarkedOnly?: boolean
  }
): Promise<WordEntry[]> => {
  const db = await initDatabase();
  const transaction = db.transaction(WORD_STORE, 'readonly');
  const store = transaction.objectStore(WORD_STORE);
  
  return new Promise((resolve, reject) => {
    transaction.onerror = () => reject(transaction.error);
    
    const words: WordEntry[] = [];
    
    store.openCursor().onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      
      if (cursor) {
        const word = cursor.value as WordEntry;
        let include = true;
        
        // 태그 필터링
        if (filters.tagIds && filters.tagIds.length > 0) {
          const hasTag = word.tags.some(tag => filters.tagIds?.includes(tag.id));
          if (!hasTag) include = false;
        }
        
        // 난이도 필터링
        if (filters.difficulty && word.difficulty !== filters.difficulty) {
          include = false;
        }
        
        // 북마크 필터링
        if (filters.bookmarkedOnly && !word.isBookmarked) {
          include = false;
        }
        
        if (include) {
          words.push(word);
        }
        
        cursor.continue();
      } else {
        resolve(words);
      }
    };
  });
};

// 데이터베이스 초기화 및 샘플 데이터 로드
export const initializeWithSampleData = async (words: WordEntry[], tags: Tag[]): Promise<void> => {
  const db = await initDatabase();
  
  // 기존 데이터 삭제
  const clearTransaction = db.transaction([WORD_STORE, TAG_STORE], 'readwrite');
  clearTransaction.objectStore(WORD_STORE).clear();
  clearTransaction.objectStore(TAG_STORE).clear();
  
  await new Promise<void>((resolve, reject) => {
    clearTransaction.oncomplete = () => resolve();
    clearTransaction.onerror = () => reject(clearTransaction.error);
  });
  
  // 새 데이터 추가
  await bulkAddTags(tags);
  await bulkAddWords(words);
}; 