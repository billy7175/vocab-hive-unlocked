/**
 * 단어 데이터 캐싱을 위한 서비스
 * - 메모리 캐시 및 IndexedDB를 사용한 영구 캐시 지원
 */

import { WordEntry } from '@/types/vocabulary';

// 메모리 캐시
const memoryCache: {
  [key: string]: {
    data: any;
    timestamp: number;
  }
} = {};

// 캐시 만료 시간 (1시간)
const CACHE_EXPIRY = 60 * 60 * 1000;

/**
 * 메타데이터 캐시 저장
 */
export async function setMetadata(key: string, data: any): Promise<void> {
  memoryCache[`meta-${key}`] = {
    data,
    timestamp: Date.now()
  };
  
  try {
    const db = await openDatabase();
    const tx = db.transaction('metadata', 'readwrite');
    const store = tx.objectStore('metadata');
    await store.put({
      key,
      data,
      timestamp: Date.now()
    });
    await tx.complete;
  } catch (error) {
    console.error('메타데이터 캐시 저장 오류:', error);
  }
}

/**
 * 메타데이터 캐시 조회
 */
export async function getMetadata(key: string): Promise<any | null> {
  // 먼저 메모리 캐시 확인
  const memCached = memoryCache[`meta-${key}`];
  if (memCached && (Date.now() - memCached.timestamp) < CACHE_EXPIRY) {
    return memCached.data;
  }
  
  try {
    const db = await openDatabase();
    const tx = db.transaction('metadata', 'readonly');
    const store = tx.objectStore('metadata');
    const result = await store.get(key);
    
    if (result && (Date.now() - result.timestamp) < CACHE_EXPIRY) {
      // 메모리 캐시에 저장
      memoryCache[`meta-${key}`] = {
        data: result.data,
        timestamp: result.timestamp
      };
      return result.data;
    }
  } catch (error) {
    console.error('메타데이터 캐시 조회 오류:', error);
  }
  
  return null;
}

/**
 * 단어 청크 캐시 저장
 */
export async function setChunk(key: string, data: WordEntry[]): Promise<void> {
  memoryCache[`chunk-${key}`] = {
    data,
    timestamp: Date.now()
  };
  
  try {
    const db = await openDatabase();
    const tx = db.transaction('chunks', 'readwrite');
    const store = tx.objectStore('chunks');
    await store.put({
      key,
      data,
      timestamp: Date.now()
    });
    await tx.complete;
  } catch (error) {
    console.error('청크 캐시 저장 오류:', error);
  }
}

/**
 * 단어 청크 캐시 조회
 */
export async function getChunk(key: string): Promise<WordEntry[] | null> {
  // 먼저 메모리 캐시 확인
  const memCached = memoryCache[`chunk-${key}`];
  if (memCached && (Date.now() - memCached.timestamp) < CACHE_EXPIRY) {
    return memCached.data;
  }
  
  try {
    const db = await openDatabase();
    const tx = db.transaction('chunks', 'readonly');
    const store = tx.objectStore('chunks');
    const result = await store.get(key);
    
    if (result && (Date.now() - result.timestamp) < CACHE_EXPIRY) {
      // 메모리 캐시에 저장
      memoryCache[`chunk-${key}`] = {
        data: result.data,
        timestamp: result.timestamp
      };
      return result.data;
    }
  } catch (error) {
    console.error('청크 캐시 조회 오류:', error);
  }
  
  return null;
}

/**
 * 캐시 삭제
 */
export async function clearCache(key?: string): Promise<void> {
  if (key) {
    delete memoryCache[`meta-${key}`];
    delete memoryCache[`chunk-${key}`];
    
    try {
      const db = await openDatabase();
      const metaTx = db.transaction('metadata', 'readwrite');
      const metaStore = metaTx.objectStore('metadata');
      await metaStore.delete(key);
      await metaTx.complete;
      
      const chunkTx = db.transaction('chunks', 'readwrite');
      const chunkStore = chunkTx.objectStore('chunks');
      await chunkStore.delete(key);
      await chunkTx.complete;
    } catch (error) {
      console.error('캐시 삭제 오류:', error);
    }
  } else {
    // 모든 캐시 삭제
    Object.keys(memoryCache).forEach(k => {
      delete memoryCache[k];
    });
    
    try {
      const db = await openDatabase();
      const metaTx = db.transaction('metadata', 'readwrite');
      const metaStore = metaTx.objectStore('metadata');
      await metaStore.clear();
      await metaTx.complete;
      
      const chunkTx = db.transaction('chunks', 'readwrite');
      const chunkStore = chunkTx.objectStore('chunks');
      await chunkStore.clear();
      await chunkTx.complete;
    } catch (error) {
      console.error('전체 캐시 삭제 오류:', error);
    }
  }
}

/**
 * IndexedDB 연결
 */
async function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('vocabHiveCache', 1);
    
    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // 메타데이터 저장소
      if (!db.objectStoreNames.contains('metadata')) {
        const metaStore = db.createObjectStore('metadata', { keyPath: 'key' });
        metaStore.createIndex('timestamp', 'timestamp');
      }
      
      // 청크 저장소
      if (!db.objectStoreNames.contains('chunks')) {
        const chunkStore = db.createObjectStore('chunks', { keyPath: 'key' });
        chunkStore.createIndex('timestamp', 'timestamp');
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
