import { words } from '../words';
import { words2 } from '../words2';

// Combine both word lists and ensure all words are lowercase and unique
export const allWords = Array.from(new Set([
  ...words,
  ...words2
].map(word => word.toLowerCase())));