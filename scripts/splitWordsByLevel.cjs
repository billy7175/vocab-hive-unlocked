#!/usr/bin/env node

// scripts/splitWordsByLevel.cjs

const fs = require('fs');
const path = require('path');

// 입력 파일 경로
const INPUT_FILE = path.join(__dirname, '../public/sample-vocabulary-data.json');

// 출력 디렉토리
const OUTPUT_DIR = path.join(__dirname, '../public/word-chunks');

// 난이도 매핑
const LEVEL_MAPPING = {
  'beginner': 'elementary',
  'intermediate': 'middle',
  'advanced': 'high'
};

// 페이지당 단어 수
const WORDS_PER_PAGE = 50;

// 디렉토리 생성
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 각 난이도별 디렉토리 생성
Object.values(LEVEL_MAPPING).forEach(level => {
  const levelDir = path.join(OUTPUT_DIR, level);
  if (!fs.existsSync(levelDir)) {
    fs.mkdirSync(levelDir);
  }
});

// JSON 파일 읽기
function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    process.exit(1);
  }
}

// 단어를 청크로 분할
function splitIntoChunks(words, chunkSize) {
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize));
  }
  return chunks;
}

// 난이도별로 단어 분류 및 청크 생성
function splitWordsByLevel() {
  const data = readJsonFile(INPUT_FILE);
  const { words, tags } = data;
  
  // 태그 ID를 태그 객체로 변환하는 맵 생성
  const tagMap = tags.reduce((acc, tag) => {
    acc[tag.id] = tag;
    return acc;
  }, {});
  
  // 단어의 태그 ID를 태그 객체로 변환
  const wordsWithTags = words.map(word => ({
    ...word,
    tags: word.tags.map(tagId => tagMap[tagId])
  }));
  
  // 난이도별로 단어 분류
  const wordsByLevel = {
    elementary: [],
    middle: [],
    high: []
  };
  
  wordsWithTags.forEach(word => {
    const levelKey = LEVEL_MAPPING[word.difficulty];
    if (levelKey) {
      wordsByLevel[levelKey].push(word);
    } else {
      // 난이도가 없는 경우 중등으로 분류
      wordsByLevel.middle.push(word);
    }
  });
  
  // 각 난이도별로 청크 생성
  Object.entries(wordsByLevel).forEach(([level, words]) => {
    console.log(`\n${level} 레벨: ${words.length}개 단어`);
    
    if (words.length === 0) {
      console.log(`${level} 레벨에 단어가 없습니다.`);
      // 빈 데이터라도 기본 메타데이터는 생성
      const levelMetadata = {
        level,
        totalWords: 0,
        totalChunks: 0,
        wordsPerChunk: WORDS_PER_PAGE,
        createdAt: new Date().toISOString()
      };
      
      fs.writeFileSync(
        path.join(OUTPUT_DIR, level, 'metadata.json'),
        JSON.stringify(levelMetadata, null, 2)
      );
      return;
    }
    
    const chunks = splitIntoChunks(words, WORDS_PER_PAGE);
    console.log(`${chunks.length}개의 청크로 분할`);
    
    // 레벨별 메타데이터 생성
    const levelMetadata = {
      level,
      totalWords: words.length,
      totalChunks: chunks.length,
      wordsPerChunk: WORDS_PER_PAGE,
      createdAt: new Date().toISOString()
    };
    
    // 메타데이터 저장
    fs.writeFileSync(
      path.join(OUTPUT_DIR, level, 'metadata.json'),
      JSON.stringify(levelMetadata, null, 2)
    );
    
    // 각 청크 저장
    chunks.forEach((chunk, index) => {
      const chunkData = {
        meta: {
          level,
          chunkId: index + 1,
          totalChunks: chunks.length,
          wordCount: chunk.length,
          startIndex: index * WORDS_PER_PAGE,
          endIndex: Math.min((index + 1) * WORDS_PER_PAGE - 1, words.length - 1)
        },
        words: chunk
      };
      
      fs.writeFileSync(
        path.join(OUTPUT_DIR, level, `chunk-${index + 1}.json`),
        JSON.stringify(chunkData, null, 2)
      );
      
      console.log(`  - 청크 ${index + 1} 저장됨 (${chunk.length}개 단어)`);
    });
  });
  
  // 전체 메타데이터 생성
  const globalMetadata = {
    version: "1.0",
    source: "Vocab Hive",
    totalWords: words.length,
    levels: Object.entries(wordsByLevel).map(([level, words]) => ({
      level,
      wordCount: words.length,
      chunkCount: Math.ceil(words.length / WORDS_PER_PAGE)
    })),
    tags,
    wordsPerChunk: WORDS_PER_PAGE,
    createdAt: new Date().toISOString()
  };
  
  // 전체 메타데이터 저장
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'metadata.json'),
    JSON.stringify(globalMetadata, null, 2)
  );
  
  console.log('\n데이터 분할 완료!');
  console.log(`전체 메타데이터: ${path.join(OUTPUT_DIR, 'metadata.json')}`);
}

// 실행
splitWordsByLevel();