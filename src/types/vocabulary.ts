// Type definitions for vocabulary app

export interface Tag {
  id: string;
  name: string;
}

export interface WordEntry {
  id: string;
  word: string;
  meaning: string;
  translation?: string;
  example?: string;
  pronunciation?: string;
  notes?: string;
  audio?: string;
  tags: Tag[];
  submittedBy?: string;
  dateAdded: string;
  isBookmarked?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface WordSet {
  id: string;
  title: string;
  description?: string;
  words: WordEntry[];
  createdBy: string;
  dateCreated: string;
  totalWords: number;
  tags?: Tag[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'popular';

export type FilterOptions = {
  tags: Tag[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | null;
  bookmarkedOnly: boolean;
}
