#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 출력 파일 경로
const OUTPUT_FILE = path.join(__dirname, '../public/sample-vocabulary-data.json');

// 태그 데이터
const tags = [
  { id: "tag1", name: "기본동사" },
  { id: "tag2", name: "명사" },
  { id: "tag3", name: "형용사" },
  { id: "tag4", name: "부사" },
  { id: "tag5", name: "숙어" },
  { id: "tag6", name: "학교생활" },
  { id: "tag7", name: "일상생활" },
  { id: "tag8", name: "가족" },
  { id: "tag9", name: "음식" },
  { id: "tag10", name: "동물" },
  { id: "tag11", name: "날씨" },
  { id: "tag12", name: "과학" },
  { id: "tag13", name: "수학" },
  { id: "tag14", name: "사회" },
  { id: "tag15", name: "감정" },
  { id: "tag16", name: "직업" },
  { id: "tag17", name: "교통" },
  { id: "tag18", name: "건강" },
  { id: "tag19", name: "스포츠" },
  { id: "tag20", name: "문화예술" }
];

// 실제 초등, 중등, 고등 수준의 단어 데이터
const elementaryWords = [
  {
    id: "elem1",
    word: "apple",
    meaning: "사과",
    translation: "りんご (일본어)",
    example: "I eat an apple every day.",
    pronunciation: "/ˈæp.əl/",
    tags: ["tag2", "tag9"],
    submittedBy: "이영희 선생님",
    dateAdded: "2023-01-10T09:00:00Z",
    difficulty: "beginner"
  },
  {
    id: "elem2",
    word: "run",
    meaning: "달리다",
    translation: "走る (일본어)",
    example: "I like to run in the park.",
    pronunciation: "/rʌn/",
    tags: ["tag1", "tag19"],
    submittedBy: "김철수 선생님",
    dateAdded: "2023-01-11T09:00:00Z",
    difficulty: "beginner"
  },
  {
    id: "elem3",
    word: "happy",
    meaning: "행복한",
    translation: "嬉しい (일본어)",
    example: "She looks happy today.",
    pronunciation: "/ˈhæp.i/",
    tags: ["tag3", "tag15"],
    submittedBy: "박민지 선생님",
    dateAdded: "2023-01-12T09:00:00Z",
    difficulty: "beginner"
  },
  {
    id: "elem4",
    word: "school",
    meaning: "학교",
    translation: "学校 (일본어)",
    example: "I go to school every morning.",
    pronunciation: "/skuːl/",
    tags: ["tag2", "tag6"],
    submittedBy: "정수연 선생님",
    dateAdded: "2023-01-13T09:00:00Z",
    difficulty: "beginner"
  },
  {
    id: "elem5",
    word: "family",
    meaning: "가족",
    translation: "家族 (일본어)",
    example: "My family is very important to me.",
    pronunciation: "/ˈfæm.əl.i/",
    tags: ["tag2", "tag8"],
    submittedBy: "최동욱 선생님",
    dateAdded: "2023-01-14T09:00:00Z",
    difficulty: "beginner"
  },
  {
    id: "elem6",
    word: "book",
    meaning: "책",
    translation: "本 (일본어)",
    example: "I am reading a book.",
    pronunciation: "/bʊk/",
    tags: ["tag2", "tag6"],
    submittedBy: "이영희 선생님",
    dateAdded: "2023-01-15T09:00:00Z",
    difficulty: "beginner"
  },
  {
    id: "elem7",
    word: "dog",
    meaning: "개",
    translation: "犬 (일본어)",
    example: "I have a small dog.",
    pronunciation: "/dɒɡ/",
    tags: ["tag2", "tag10"],
    submittedBy: "김철수 선생님",
    dateAdded: "2023-01-16T09:00:00Z",
    difficulty: "beginner"
  },
  {
    id: "elem8",
    word: "water",
    meaning: "물",
    translation: "水 (일본어)",
    example: "Please drink more water.",
    pronunciation: "/ˈwɔː.tər/",
    tags: ["tag2", "tag7"],
    submittedBy: "박민지 선생님",
    dateAdded: "2023-01-17T09:00:00Z",
    difficulty: "beginner"
  },
  {
    id: "elem9",
    word: "sun",
    meaning: "태양",
    translation: "太陽 (일본어)",
    example: "The sun is shining bright today.",
    pronunciation: "/sʌn/",
    tags: ["tag2", "tag11"],
    submittedBy: "정수연 선생님",
    dateAdded: "2023-01-18T09:00:00Z",
    difficulty: "beginner"
  },
  {
    id: "elem10",
    word: "tree",
    meaning: "나무",
    translation: "木 (일본어)",
    example: "There is a big tree in our garden.",
    pronunciation: "/triː/",
    tags: ["tag2", "tag7"],
    submittedBy: "최동욱 선생님",
    dateAdded: "2023-01-19T09:00:00Z",
    difficulty: "beginner"
  },
  {
    id: "elem11",
    word: "cat",
    meaning: "고양이",
    translation: "猫 (일본어)",
    example: "The cat is sleeping on the sofa.",
    pronunciation: "/kæt/",
    tags: ["tag2", "tag10"],
    submittedBy: "이영희 선생님",
    dateAdded: "2023-01-20T09:00:00Z",
    difficulty: "beginner"
  },
  {
    id: "elem12",
    word: "house",
    meaning: "집",
    translation: "家 (일본어)",
    example: "This is my house.",
    pronunciation: "/haʊs/",
    tags: ["tag2", "tag7"],
    submittedBy: "김철수 선생님",
    dateAdded: "2023-01-21T09:00:00Z",
    difficulty: "beginner"
  },
  {
    id: "elem13",
    word: "friend",
    meaning: "친구",
    translation: "友達 (일본어)",
    example: "He is my best friend.",
    pronunciation: "/frend/",
    tags: ["tag2", "tag8"],
    submittedBy: "박민지 선생님",
    dateAdded: "2023-01-22T09:00:00Z",
    difficulty: "beginner"
  },
  {
    id: "elem14",
    word: "color",
    meaning: "색깔",
    translation: "色 (일본어)",
    example: "What is your favorite color?",
    pronunciation: "/ˈkʌl.ər/",
    tags: ["tag2", "tag20"],
    submittedBy: "정수연 선생님",
    dateAdded: "2023-01-23T09:00:00Z",
    difficulty: "beginner"
  },
  {
    id: "elem15",
    word: "play",
    meaning: "놀다, 연주하다",
    translation: "遊ぶ (일본어)",
    example: "Children play in the playground.",
    pronunciation: "/pleɪ/",
    tags: ["tag1", "tag7"],
    submittedBy: "최동욱 선생님",
    dateAdded: "2023-01-24T09:00:00Z",
    difficulty: "beginner"
  }
];

const intermediateWords = [
  {
    id: "mid1",
    word: "achieve",
    meaning: "달성하다, 성취하다",
    translation: "达成 (중국어)",
    example: "She achieved her goal of becoming a doctor.",
    pronunciation: "/əˈtʃiːv/",
    tags: ["tag1", "tag16"],
    submittedBy: "김지영 선생님",
    dateAdded: "2023-02-01T09:00:00Z",
    difficulty: "intermediate"
  },
  {
    id: "mid2",
    word: "environment",
    meaning: "환경",
    translation: "環境 (일본어)",
    example: "We must protect our environment.",
    pronunciation: "/ɪnˈvaɪ.rən.mənt/",
    tags: ["tag2", "tag12"],
    submittedBy: "이준호 선생님",
    dateAdded: "2023-02-02T09:00:00Z",
    difficulty: "intermediate"
  },
  {
    id: "mid3",
    word: "essential",
    meaning: "필수적인, 본질적인",
    translation: "必要な (일본어)",
    example: "Water is essential for life.",
    pronunciation: "/ɪˈsen.ʃəl/",
    tags: ["tag3", "tag12"],
    submittedBy: "박서준 선생님",
    dateAdded: "2023-02-03T09:00:00Z",
    difficulty: "intermediate"
  },
  {
    id: "mid4",
    word: "evaluate",
    meaning: "평가하다",
    translation: "評価する (일본어)",
    example: "Teachers evaluate students through exams.",
    pronunciation: "/ɪˈvæl.ju.eɪt/",
    tags: ["tag1", "tag6"],
    submittedBy: "정미경 선생님",
    dateAdded: "2023-02-04T09:00:00Z",
    difficulty: "intermediate"
  },
  {
    id: "mid5",
    word: "influence",
    meaning: "영향, 영향을 미치다",
    translation: "影響 (일본어)",
    example: "Social media has a big influence on teenagers.",
    pronunciation: "/ˈɪn.flu.əns/",
    tags: ["tag1", "tag2", "tag14"],
    submittedBy: "최유진 선생님",
    dateAdded: "2023-02-05T09:00:00Z",
    difficulty: "intermediate"
  },
  {
    id: "mid6",
    word: "perspective",
    meaning: "관점, 시각",
    translation: "視点 (일본어)",
    example: "From my perspective, this is the best solution.",
    pronunciation: "/pərˈspek.tɪv/",
    tags: ["tag2", "tag14"],
    submittedBy: "김지영 선생님",
    dateAdded: "2023-02-06T09:00:00Z",
    difficulty: "intermediate"
  },
  {
    id: "mid7",
    word: "responsible",
    meaning: "책임이 있는, 책임감 있는",
    translation: "責任のある (일본어)",
    example: "Parents are responsible for their children's education.",
    pronunciation: "/rɪˈspɒn.sə.bəl/",
    tags: ["tag3", "tag7"],
    submittedBy: "이준호 선생님",
    dateAdded: "2023-02-07T09:00:00Z",
    difficulty: "intermediate"
  },
  {
    id: "mid8",
    word: "technology",
    meaning: "기술",
    translation: "技術 (일본어)",
    example: "Technology is advancing rapidly.",
    pronunciation: "/tekˈnɒl.ə.dʒi/",
    tags: ["tag2", "tag12"],
    submittedBy: "박서준 선생님",
    dateAdded: "2023-02-08T09:00:00Z",
    difficulty: "intermediate"
  },
  {
    id: "mid9",
    word: "tradition",
    meaning: "전통",
    translation: "伝統 (일본어)",
    example: "We should preserve our cultural traditions.",
    pronunciation: "/trəˈdɪʃ.ən/",
    tags: ["tag2", "tag20"],
    submittedBy: "정미경 선생님",
    dateAdded: "2023-02-09T09:00:00Z",
    difficulty: "intermediate"
  },
  {
    id: "mid10",
    word: "volunteer",
    meaning: "자원봉사자, 자원봉사하다",
    translation: "ボランティア (일본어)",
    example: "Many students volunteer at the local hospital.",
    pronunciation: "/ˌvɒl.ənˈtɪər/",
    tags: ["tag1", "tag2", "tag14"],
    submittedBy: "최유진 선생님",
    dateAdded: "2023-02-10T09:00:00Z",
    difficulty: "intermediate"
  },
  {
    id: "mid11",
    word: "benefit",
    meaning: "이익, 혜택",
    translation: "利益 (일본어)",
    example: "Regular exercise has many health benefits.",
    pronunciation: "/ˈben.ɪ.fɪt/",
    tags: ["tag2", "tag18"],
    submittedBy: "김지영 선생님",
    dateAdded: "2023-02-11T09:00:00Z",
    difficulty: "intermediate"
  },
  {
    id: "mid12",
    word: "community",
    meaning: "공동체, 지역사회",
    translation: "コミュニティ (일본어)",
    example: "Our school is part of the local community.",
    pronunciation: "/kəˈmjuː.nə.ti/",
    tags: ["tag2", "tag14"],
    submittedBy: "이준호 선생님",
    dateAdded: "2023-02-12T09:00:00Z",
    difficulty: "intermediate"
  },
  {
    id: "mid13",
    word: "develop",
    meaning: "발전하다, 개발하다",
    translation: "開発する (일본어)",
    example: "Scientists are developing new medicines.",
    pronunciation: "/dɪˈvel.əp/",
    tags: ["tag1", "tag12"],
    submittedBy: "박서준 선생님",
    dateAdded: "2023-02-13T09:00:00Z",
    difficulty: "intermediate"
  },
  {
    id: "mid14",
    word: "experience",
    meaning: "경험, 경험하다",
    translation: "経験 (일본어)",
    example: "Traveling abroad is a great experience.",
    pronunciation: "/ɪkˈspɪə.ri.əns/",
    tags: ["tag1", "tag2", "tag7"],
    submittedBy: "정미경 선생님",
    dateAdded: "2023-02-14T09:00:00Z",
    difficulty: "intermediate"
  },
  {
    id: "mid15",
    word: "knowledge",
    meaning: "지식",
    translation: "知識 (일본어)",
    example: "Reading books increases your knowledge.",
    pronunciation: "/ˈnɒl.ɪdʒ/",
    tags: ["tag2", "tag6"],
    submittedBy: "최유진 선생님",
    dateAdded: "2023-02-15T09:00:00Z",
    difficulty: "intermediate"
  }
];

const advancedWords = [
  {
    id: "adv1",
    word: "ambiguous",
    meaning: "모호한, 애매한",
    translation: "曖昧な (일본어)",
    example: "The politician's answer was deliberately ambiguous.",
    pronunciation: "/æmˈbɪɡ.ju.əs/",
    tags: ["tag3", "tag14"],
    submittedBy: "김민수 교수님",
    dateAdded: "2023-03-01T09:00:00Z",
    difficulty: "advanced"
  },
  {
    id: "adv2",
    word: "autonomous",
    meaning: "자율적인, 자치의",
    translation: "自律的な (일본어)",
    example: "The company developed an autonomous driving system.",
    pronunciation: "/ɔːˈtɒn.ə.məs/",
    tags: ["tag3", "tag12"],
    submittedBy: "이정호 교수님",
    dateAdded: "2023-03-02T09:00:00Z",
    difficulty: "advanced"
  },
  {
    id: "adv3",
    word: "conundrum",
    meaning: "난해한 문제, 수수께끼",
    translation: "難問 (일본어)",
    example: "Climate change presents us with a serious conundrum.",
    pronunciation: "/kəˈnʌn.drəm/",
    tags: ["tag2", "tag14"],
    submittedBy: "박성희 교수님",
    dateAdded: "2023-03-03T09:00:00Z",
    difficulty: "advanced"
  },
  {
    id: "adv4",
    word: "dichotomy",
    meaning: "이분법, 양분",
    translation: "二分法 (일본어)",
    example: "The dichotomy between work and life is increasingly blurred.",
    pronunciation: "/daɪˈkɒt.ə.mi/",
    tags: ["tag2", "tag14"],
    submittedBy: "정유라 교수님",
    dateAdded: "2023-03-04T09:00:00Z",
    difficulty: "advanced"
  },
  {
    id: "adv5",
    word: "ephemeral",
    meaning: "일시적인, 수명이 짧은",
    translation: "はかない (일본어)",
    example: "The beauty of cherry blossoms is ephemeral.",
    pronunciation: "/ɪˈfem.ər.əl/",
    tags: ["tag3", "tag20"],
    submittedBy: "최진우 교수님",
    dateAdded: "2023-03-05T09:00:00Z",
    difficulty: "advanced"
  },
  {
    id: "adv6",
    word: "idiosyncrasy",
    meaning: "특이성, 개성",
    translation: "特異性 (일본어)",
    example: "Each language has its own idiosyncrasies.",
    pronunciation: "/ˌɪd.i.əˈsɪŋ.krə.si/",
    tags: ["tag2", "tag14"],
    submittedBy: "김민수 교수님",
    dateAdded: "2023-03-06T09:00:00Z",
    difficulty: "advanced"
  },
  {
    id: "adv7",
    word: "juxtaposition",
    meaning: "병치, 나란히 놓음",
    translation: "並置 (일본어)",
    example: "The juxtaposition of modern and traditional architecture creates an interesting effect.",
    pronunciation: "/ˌdʒʌk.stə.pəˈzɪʃ.ən/",
    tags: ["tag2", "tag20"],
    submittedBy: "이정호 교수님",
    dateAdded: "2023-03-07T09:00:00Z",
    difficulty: "advanced"
  },
  {
    id: "adv8",
    word: "metamorphosis",
    meaning: "변태, 변형",
    translation: "変態 (일본어)",
    example: "The caterpillar undergoes metamorphosis to become a butterfly.",
    pronunciation: "/ˌmet.əˈmɔː.fə.sɪs/",
    tags: ["tag2", "tag12"],
    submittedBy: "박성희 교수님",
    dateAdded: "2023-03-08T09:00:00Z",
    difficulty: "advanced"
  },
  {
    id: "adv9",
    word: "paradigm",
    meaning: "패러다임, 전형",
    translation: "パラダイム (일본어)",
    example: "Einstein's theory of relativity introduced a new paradigm in physics.",
    pronunciation: "/ˈpær.ə.daɪm/",
    tags: ["tag2", "tag12"],
    submittedBy: "정유라 교수님",
    dateAdded: "2023-03-09T09:00:00Z",
    difficulty: "advanced"
  },
  {
    id: "adv10",
    word: "quintessential",
    meaning: "전형적인, 본질적인",
    translation: "典型的な (일본어)",
    example: "She is the quintessential example of a successful entrepreneur.",
    pronunciation: "/ˌkwɪn.təˈsen.ʃəl/",
    tags: ["tag3", "tag14"],
    submittedBy: "최진우 교수님",
    dateAdded: "2023-03-10T09:00:00Z",
    difficulty: "advanced"
  },
  {
    id: "adv11",
    word: "serendipity",
    meaning: "우연한 행운, 뜻밖의 발견",
    translation: "セレンディピティ (일본어)",
    example: "The discovery of penicillin was an example of serendipity.",
    pronunciation: "/ˌser.ənˈdɪp.ə.ti/",
    tags: ["tag2", "tag12"],
    submittedBy: "김민수 교수님",
    dateAdded: "2023-03-11T09:00:00Z",
    difficulty: "advanced"
  },
  {
    id: "adv12",
    word: "ubiquitous",
    meaning: "편재하는, 어디에나 있는",
    translation: "偏在する (일본어)",
    example: "Smartphones have become ubiquitous in modern society.",
    pronunciation: "/juːˈbɪk.wɪ.təs/",
    tags: ["tag3", "tag12"],
    submittedBy: "이정호 교수님",
    dateAdded: "2023-03-12T09:00:00Z",
    difficulty: "advanced"
  },
  {
    id: "adv13",
    word: "vicarious",
    meaning: "대리의, 간접 경험의",
    translation: "代理の (일본어)",
    example: "People often live vicariously through social media.",
    pronunciation: "/vɪˈkeə.ri.əs/",
    tags: ["tag3", "tag14"],
    submittedBy: "박성희 교수님",
    dateAdded: "2023-03-13T09:00:00Z",
    difficulty: "advanced"
  },
  {
    id: "adv14",
    word: "zeitgeist",
    meaning: "시대정신",
    translation: "時代精神 (일본어)",
    example: "This art movement perfectly captures the zeitgeist of the 1960s.",
    pronunciation: "/ˈzaɪt.ɡaɪst/",
    tags: ["tag2", "tag20"],
    submittedBy: "정유라 교수님",
    dateAdded: "2023-03-14T09:00:00Z",
    difficulty: "advanced"
  },
  {
    id: "adv15",
    word: "xenophobia",
    meaning: "외국인 혐오증",
    translation: "外国人嫌悪 (일본어)",
    example: "The government is taking measures to combat xenophobia.",
    pronunciation: "/ˌzen.əˈfəʊ.bi.ə/",
    tags: ["tag2", "tag14"],
    submittedBy: "최진우 교수님",
    dateAdded: "2023-03-15T09:00:00Z",
    difficulty: "advanced"
  }
];

function generateRealVocabularyData() {
  const data = {
    meta: {
      version: "1.0",
      source: "Vocab Hive Educational Platform",
      createDate: new Date().toISOString(),
      count: elementaryWords.length + intermediateWords.length + advancedWords.length
    },
    tags: tags,
    words: [...elementaryWords, ...intermediateWords, ...advancedWords]
  };
  
  // 파일로 저장
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(data, null, 2)
  );
  
  console.log(`실제 단어 데이터가 생성되었습니다: ${OUTPUT_FILE}`);
  console.log(`총 단어 수: ${data.words.length}`);
  console.log(`난이도별 단어 수:`);
  console.log(`- 초등 (beginner): ${elementaryWords.length}`);
  console.log(`- 중등 (intermediate): ${intermediateWords.length}`);
  console.log(`- 고등 (advanced): ${advancedWords.length}`);
}

// 실행
generateRealVocabularyData();