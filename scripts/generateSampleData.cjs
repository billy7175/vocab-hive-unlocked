#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 출력 파일 경로
const OUTPUT_FILE = path.join(__dirname, '../public/sample-vocabulary-data.json');

// 태그 데이터
const tags = [
  { id: "tag1", name: "비즈니스" },
  { id: "tag2", name: "테크놀로지" },
  { id: "tag3", name: "학술" },
  { id: "tag4", name: "일상" },
  { id: "tag5", name: "여행" },
  { id: "tag6", name: "의학" },
  { id: "tag7", name: "TOEIC" },
  { id: "tag8", name: "TOEFL" },
  { id: "tag9", name: "관용어" },
  { id: "tag10", name: "IT" }
];

// 난이도별 샘플 단어 생성
function generateWords() {
  const words = [];
  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const submitters = ["김철수", "이영희", "박지성", "최민수", "정수연"];
  
  // 각 난이도별로 50개씩 생성
  difficulties.forEach(difficulty => {
    for (let i = 0; i < 50; i++) {
      const id = `word_${difficulty}_${i + 1}`;
      const submitterIndex = Math.floor(Math.random() * submitters.length);
      const tagCount = Math.floor(Math.random() * 3) + 1; // 1-3개의 태그
      const wordTags = [];
      const usedTagIndices = new Set();
      
      while (wordTags.length < tagCount) {
        const tagIndex = Math.floor(Math.random() * tags.length);
        if (!usedTagIndices.has(tagIndex)) {
          usedTagIndices.add(tagIndex);
          wordTags.push(tags[tagIndex].id);
        }
      }
      
      words.push({
        id: id,
        word: `word_${difficulty}_${i + 1}`,
        meaning: `${difficulty} level word ${i + 1}의 의미`,
        translation: `${difficulty} level word ${i + 1}의 번역`,
        example: `This is an example sentence for ${difficulty} level word ${i + 1}.`,
        pronunciation: `/prəˌnʌn.siˈeɪ.ʃən_${i + 1}/`,
        notes: `${difficulty} 레벨 단어 ${i + 1}에 대한 노트`,
        tags: wordTags,
        submittedBy: submitters[submitterIndex],
        dateAdded: new Date(2023, 4, 15 + (i % 30)).toISOString(),
        difficulty: difficulty,
        isBookmarked: Math.random() > 0.8
      });
    }
  });
  
  // 기존 실제 단어들도 추가
  const existingWords = [
    {
      "id": "word1",
      "word": "implement",
      "meaning": "실행하다, 이행하다",
      "translation": "実行する (일본어)",
      "example": "We need to implement the new policy by next month.",
      "pronunciation": "/ˈɪm.plɪ.ment/",
      "notes": "비즈니스 환경에서 자주 사용됨",
      "tags": ["tag1", "tag2"],
      "submittedBy": "김철수",
      "dateAdded": "2023-05-15T09:30:00Z",
      "difficulty": "intermediate"
    },
    {
      "id": "word2",
      "word": "paradigm",
      "meaning": "패러다임, 전형적인 예",
      "translation": "범례, 전형적 예",
      "example": "The discovery led to a new paradigm in scientific thinking.",
      "pronunciation": "/ˈpær.ə.daɪm/",
      "tags": ["tag3", "tag10"],
      "submittedBy": "이지은",
      "dateAdded": "2023-05-16T14:20:00Z",
      "difficulty": "advanced"
    },
    {
      "id": "word3",
      "word": "apple",
      "meaning": "사과",
      "example": "I ate an apple for lunch.",
      "pronunciation": "/ˈæp.əl/",
      "tags": ["tag4"],
      "submittedBy": "박영희",
      "dateAdded": "2023-06-01T09:00:00Z",
      "difficulty": "beginner"
    },
    {
      "id": "word4",
      "word": "book",
      "meaning": "책",
      "example": "She is reading a book.",
      "pronunciation": "/bʊk/",
      "tags": ["tag4", "tag3"],
      "submittedBy": "김민수",
      "dateAdded": "2023-06-02T10:00:00Z",
      "difficulty": "beginner"
    },
    {
      "id": "word5",
      "word": "computer",
      "meaning": "컴퓨터",
      "example": "I use my computer for work.",
      "pronunciation": "/kəmˈpjuː.tər/",
      "tags": ["tag2", "tag10"],
      "submittedBy": "이준호",
      "dateAdded": "2023-06-03T11:00:00Z",
      "difficulty": "beginner"
    }
  ];
  
  return [...existingWords, ...words];
}

// 데이터 생성 및 저장
function generateSampleData() {
  const data = {
    meta: {
      version: "1.0",
      source: "Vocab Hive",
      createDate: new Date().toISOString(),
      count: 155 // 기존 5개 + 난이도별 50개 * 3
    },
    tags: tags,
    words: generateWords()
  };
  
  // 파일로 저장
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(data, null, 2)
  );
  
  console.log(`샘플 데이터가 생성되었습니다: ${OUTPUT_FILE}`);
  console.log(`총 단어 수: ${data.words.length}`);
  console.log(`난이도별 단어 수:`);
  console.log(`- beginner: ${data.words.filter(w => w.difficulty === 'beginner').length}`);
  console.log(`- intermediate: ${data.words.filter(w => w.difficulty === 'intermediate').length}`);
  console.log(`- advanced: ${data.words.filter(w => w.difficulty === 'advanced').length}`);
}

// 실행
generateSampleData();