import { words } from '../words';
import { words2 } from '../words2';

// Create a seeded random number generator for deterministic randomization
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Fisher-Yates shuffle with seed for deterministic randomization
function seededShuffle(array: string[], seed: number): string[] {
  const shuffled = [...array];
  let currentIndex = shuffled.length;

  while (currentIndex > 0) {
    const randomIndex = Math.floor(seededRandom(seed + currentIndex) * currentIndex);
    currentIndex--;
    
    [shuffled[currentIndex], shuffled[randomIndex]] = 
    [shuffled[randomIndex], shuffled[currentIndex]];
  }

  return shuffled;
}

// Get the word list based on expansion setting
export function getWordList(useExpansion: boolean): string[] {
  // Use the current year as the base seed for consistent shuffling across sessions
  const seed = new Date().getFullYear();
  
  const uniqueWords = Array.from(new Set(
    useExpansion 
      ? [...words, ...words2].map(word => word.toLowerCase())
      : words.map(word => word.toLowerCase())
  ));

  return seededShuffle(uniqueWords, seed);
}

export function isValidWord(word: string, useExpansion: boolean): boolean {
  const allValidWords = useExpansion
    ? new Set([...words, ...words2].map(w => w.toLowerCase()))
    : new Set(words.map(w => w.toLowerCase()));
  
  return allValidWords.has(word.toLowerCase());
}