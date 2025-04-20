
import { WordEntry, Tag } from "@/types/vocabulary";
import { v4 as uuidv4 } from "uuid";

export const MOCK_TAGS: Tag[] = [
  { id: "1", name: "business" },
  { id: "2", name: "technology" },
  { id: "3", name: "academic" },
  { id: "4", name: "idiom" },
  { id: "5", name: "slang" },
  { id: "6", name: "phrasal verb" },
  { id: "7", name: "IELTS" },
  { id: "8", name: "TOEFL" },
  { id: "9", name: "formal" },
  { id: "10", name: "casual" },
  { id: "11", name: "medical" },
  { id: "12", name: "legal" },
  { id: "13", name: "science" },
  { id: "14", name: "arts" },
  { id: "15", name: "sports" },
  { id: "16", name: "food" },
  { id: "17", name: "travel" },
  { id: "18", name: "social media" }
];

export const MOCK_WORDS: WordEntry[] = [
  {
    id: "1",
    word: "serendipity",
    meaning: "The occurrence and development of events by chance in a happy or beneficial way.",
    translation: "幸运的偶然 (Chinese)",
    example: "The fact that I met my wife was pure serendipity.",
    pronunciation: "/ˌsɛr.ənˈdɪp.ɪ.ti/",
    tags: [MOCK_TAGS[2], MOCK_TAGS[8]],
    dateAdded: "2023-01-15T12:00:00Z",
    difficulty: "advanced",
    submittedBy: "Emily Chen"
  },
  {
    id: "2",
    word: "ubiquitous",
    meaning: "Present, appearing, or found everywhere.",
    example: "Mobile phones are now ubiquitous in modern society.",
    pronunciation: "/juːˈbɪk.wɪ.təs/",
    tags: [MOCK_TAGS[2], MOCK_TAGS[12]],
    dateAdded: "2023-01-20T14:30:00Z",
    difficulty: "advanced",
    submittedBy: "Prof. Johnson"
  },
  {
    id: "3",
    word: "procrastinate",
    meaning: "Delay or postpone action; put off doing something.",
    translation: "postergar (Spanish)",
    example: "I always procrastinate when I have to write a difficult email.",
    pronunciation: "/prəˈkræs.tɪ.neɪt/",
    tags: [MOCK_TAGS[3], MOCK_TAGS[9]],
    dateAdded: "2023-02-05T09:15:00Z",
    difficulty: "intermediate",
    submittedBy: "Miguel Rodriguez",
    isBookmarked: true
  },
  {
    id: "4",
    word: "meticulous",
    meaning: "Showing great attention to detail; very careful and precise.",
    example: "He is meticulous about keeping records of all transactions.",
    pronunciation: "/məˈtɪk.jə.ləs/",
    tags: [MOCK_TAGS[0], MOCK_TAGS[8]],
    dateAdded: "2023-02-10T16:45:00Z",
    difficulty: "advanced",
    submittedBy: "Sarah Williams"
  },
  {
    id: "5",
    word: "resilience",
    meaning: "The capacity to recover quickly from difficulties; toughness.",
    translation: "レジリエンス (Japanese)",
    example: "She showed great resilience in bouncing back after losing her job.",
    pronunciation: "/rɪˈzɪl.i.əns/",
    tags: [MOCK_TAGS[0], MOCK_TAGS[6]],
    dateAdded: "2023-02-18T11:20:00Z",
    difficulty: "intermediate",
    submittedBy: "Takashi Yamamoto"
  },
  {
    id: "6",
    word: "algorithm",
    meaning: "A process or set of rules to be followed in calculations or other problem-solving operations, especially by a computer.",
    example: "The company developed a new algorithm for recommending products to users.",
    pronunciation: "/ˈæl.ɡə.rɪ.ðəm/",
    tags: [MOCK_TAGS[1], MOCK_TAGS[12]],
    dateAdded: "2023-03-02T13:10:00Z",
    difficulty: "intermediate",
    submittedBy: "Alex Kumar",
    isBookmarked: true
  },
  {
    id: "7",
    word: "juxtapose",
    meaning: "Place or deal with close together for contrasting effect.",
    example: "The photographer juxtaposed images of poverty and wealth to create a powerful statement.",
    pronunciation: "/ˈdʒʌk.stə.poʊz/",
    tags: [MOCK_TAGS[2], MOCK_TAGS[13]],
    dateAdded: "2023-03-15T10:05:00Z",
    difficulty: "advanced",
    submittedBy: "Olivia Martinez"
  },
  {
    id: "8",
    word: "eloquent",
    meaning: "Fluent or persuasive in speaking or writing.",
    translation: "éloquent (French)",
    example: "Her eloquent speech moved the entire audience.",
    pronunciation: "/ˈɛl.ə.kwənt/",
    tags: [MOCK_TAGS[3], MOCK_TAGS[7]],
    dateAdded: "2023-03-28T09:30:00Z",
    difficulty: "intermediate",
    submittedBy: "Pierre Dubois"
  },
  {
    id: "9",
    word: "cryptocurrency",
    meaning: "A digital currency in which transactions are verified and records maintained by a decentralized system.",
    example: "Bitcoin was the first cryptocurrency to gain widespread attention.",
    pronunciation: "/ˌkrɪp.toʊˈkɜr.ən.si/",
    tags: [MOCK_TAGS[1], MOCK_TAGS[0]],
    dateAdded: "2023-04-05T14:50:00Z",
    difficulty: "intermediate",
    submittedBy: "Ryan Thompson",
    isBookmarked: true
  },
  {
    id: "10",
    word: "ephemeral",
    meaning: "Lasting for a very short time.",
    example: "The beauty of cherry blossoms is ephemeral, lasting only a few days.",
    pronunciation: "/ɪˈfɛm.ər.əl/",
    tags: [MOCK_TAGS[2], MOCK_TAGS[13]],
    dateAdded: "2023-04-12T17:20:00Z",
    difficulty: "advanced",
    submittedBy: "Hannah Kim"
  },
  {
    id: "11",
    word: "gaslighting",
    meaning: "Manipulating someone by psychological means into questioning their own sanity.",
    translation: "manipulación psicológica (Spanish)",
    example: "Her ex-boyfriend was gaslighting her by denying things that had actually happened.",
    pronunciation: "/ˈɡæs.laɪ.tɪŋ/",
    tags: [MOCK_TAGS[4], MOCK_TAGS[17]],
    dateAdded: "2023-04-25T12:40:00Z",
    difficulty: "intermediate",
    submittedBy: "Jessica Lopez"
  },
  {
    id: "12",
    word: "sustainable",
    meaning: "Able to be maintained at a certain rate or level; conserving an ecological balance.",
    example: "The company is committed to sustainable farming practices.",
    pronunciation: "/səˈsteɪ.nə.bəl/",
    tags: [MOCK_TAGS[0], MOCK_TAGS[12]],
    dateAdded: "2023-05-08T11:15:00Z",
    difficulty: "intermediate",
    submittedBy: "David Green",
    isBookmarked: true
  },
  {
    id: "13",
    word: "paradigm",
    meaning: "A typical example or pattern of something; a model.",
    example: "The discovery led to a new paradigm in scientific thinking.",
    pronunciation: "/ˈpær.ə.daɪm/",
    tags: [MOCK_TAGS[2], MOCK_TAGS[12]],
    dateAdded: "2023-05-20T15:30:00Z",
    difficulty: "advanced",
    submittedBy: "Nathan Patel"
  },
  {
    id: "14",
    word: "quintessential",
    meaning: "Representing the most perfect or typical example of a quality or class.",
    translation: "典型的 (Chinese)",
    example: "The small café is the quintessential Parisian experience.",
    pronunciation: "/ˌkwɪn.təˈsɛn.ʃəl/",
    tags: [MOCK_TAGS[3], MOCK_TAGS[8]],
    dateAdded: "2023-06-02T13:45:00Z",
    difficulty: "advanced",
    submittedBy: "Wei Zhang"
  },
  {
    id: "15",
    word: "exacerbate",
    meaning: "Make (a problem, bad situation, or negative feeling) worse.",
    example: "The road closure will exacerbate traffic problems in the city center.",
    pronunciation: "/ɪɡˈzæs.ər.beɪt/",
    tags: [MOCK_TAGS[2], MOCK_TAGS[10]],
    dateAdded: "2023-06-15T10:20:00Z",
    difficulty: "advanced",
    submittedBy: "Rachel Adams"
  },
  {
    id: "16",
    word: "FOMO",
    meaning: "Fear of missing out: anxiety that an exciting or interesting event may currently be happening elsewhere.",
    example: "I wasn't going to go to the party, but FOMO got the better of me.",
    pronunciation: "/ˈfoʊ.moʊ/",
    tags: [MOCK_TAGS[4], MOCK_TAGS[17]],
    dateAdded: "2023-06-28T16:50:00Z",
    difficulty: "beginner",
    submittedBy: "Tyler Johnson",
    isBookmarked: true
  },
  {
    id: "17",
    word: "microaggression",
    meaning: "A statement, action, or incident regarded as an instance of indirect, subtle, or unintentional discrimination.",
    example: "Asking 'where are you really from?' can be seen as a microaggression.",
    pronunciation: "/ˌmaɪ.kroʊ.əˈɡrɛʃ.ən/",
    tags: [MOCK_TAGS[9], MOCK_TAGS[17]],
    dateAdded: "2023-07-10T14:15:00Z",
    difficulty: "intermediate",
    submittedBy: "Marcus Washington"
  },
  {
    id: "18",
    word: "zeitgeist",
    meaning: "The defining spirit or mood of a particular period of history as shown by the ideas and beliefs of the time.",
    translation: "Zeitgeist (German)",
    example: "The film perfectly captures the zeitgeist of 1960s America.",
    pronunciation: "/ˈzaɪt.ɡaɪst/",
    tags: [MOCK_TAGS[2], MOCK_TAGS[13]],
    dateAdded: "2023-07-22T11:30:00Z",
    difficulty: "advanced",
    submittedBy: "Eva Schmidt"
  },
  {
    id: "19",
    word: "gig economy",
    meaning: "A labor market characterized by the prevalence of short-term contracts or freelance work as opposed to permanent jobs.",
    example: "Many young professionals are turning to the gig economy for flexibility.",
    pronunciation: "/ɡɪɡ ɪˈkɑ.nə.mi/",
    tags: [MOCK_TAGS[0], MOCK_TAGS[17]],
    dateAdded: "2023-08-05T09:45:00Z",
    difficulty: "intermediate",
    submittedBy: "Jordan Lee"
  },
  {
    id: "20",
    word: "meme",
    meaning: "An image, video, piece of text, etc., that is copied and spread rapidly by internet users, often with slight variations.",
    translation: "мем (Russian)",
    example: "The cat video quickly became a popular meme shared across social media platforms.",
    pronunciation: "/miːm/",
    tags: [MOCK_TAGS[4], MOCK_TAGS[17]],
    dateAdded: "2023-08-18T15:10:00Z",
    difficulty: "beginner",
    submittedBy: "Alexei Petrov",
    isBookmarked: true
  }
];

// Generate more random words for pagination demonstration
export const generateRandomWords = (count: number): WordEntry[] => {
  const randomWords: WordEntry[] = [];
  
  const wordPrefixes = ["re", "un", "de", "pro", "in", "con", "trans", "super", "inter", "pre"];
  const wordSuffixes = ["tion", "ism", "ity", "ment", "ness", "ance", "ence", "ion", "ology", "ism"];
  const wordRoots = ["form", "spect", "duct", "port", "ject", "mit", "scribe", "struct", "cept", "fect"];
  
  for (let i = 0; i < count; i++) {
    const prefix = wordPrefixes[Math.floor(Math.random() * wordPrefixes.length)];
    const root = wordRoots[Math.floor(Math.random() * wordRoots.length)];
    const suffix = wordSuffixes[Math.floor(Math.random() * wordSuffixes.length)];
    
    const randomWord = prefix + root + suffix;
    const randomTags = [];
    
    // Assign 2-3 random tags
    for (let j = 0; j < Math.floor(Math.random() * 2) + 2; j++) {
      const randomTagIndex = Math.floor(Math.random() * MOCK_TAGS.length);
      if (!randomTags.some(tag => tag.id === MOCK_TAGS[randomTagIndex].id)) {
        randomTags.push(MOCK_TAGS[randomTagIndex]);
      }
    }
    
    // Assign a random difficulty
    const difficulties: Array<'beginner' | 'intermediate' | 'advanced'> = ['beginner', 'intermediate', 'advanced'];
    const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    
    // Generate a date in the last year
    const now = new Date();
    const randomDate = new Date(
      now.getFullYear() - 1 + Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    ).toISOString();
    
    randomWords.push({
      id: uuidv4(),
      word: randomWord,
      meaning: `The act or process of ${randomWord}ing.`,
      example: `She demonstrated excellent ${randomWord} skills during the presentation.`,
      tags: randomTags,
      dateAdded: randomDate,
      difficulty: randomDifficulty,
      submittedBy: "AI Generator",
      isBookmarked: Math.random() > 0.8 // 20% chance to be bookmarked
    });
  }
  
  return randomWords;
};

// Get trending words (could be based on various factors in a real app)
export const getTrendingWords = (count: number = 10): WordEntry[] => {
  // In a real app, this would be based on analytics, user activity, etc.
  // For this example, we'll just return a subset of mock words
  return MOCK_WORDS.slice(0, count);
};

// Get popular tags based on frequency
export const getPopularTags = (count: number = 10): Tag[] => {
  // In a real app, this would be calculated from actual tag usage
  return MOCK_TAGS.slice(0, count);
};

// Get all words, including generated ones for pagination
export const getAllWords = (): WordEntry[] => {
  return [...MOCK_WORDS, ...generateRandomWords(80)];
};
