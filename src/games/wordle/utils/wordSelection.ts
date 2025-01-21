import { getWordList } from './wordLists';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const START_DATE = new Date('2024-01-01').getTime();

// Get a deterministic index for both original and expansion lists
function getDailyIndex(): number {
  const today = new Date().setHours(0, 0, 0, 0);
  return Math.floor((today - START_DATE) / DAY_IN_MS);
}

// Get the word for today based on the daily index
export function getDailyWord(useExpansion: boolean): string {
  const wordList = getWordList(useExpansion);
  const index = getDailyIndex() % wordList.length;
  return wordList[index];
}

export function getTimeUntilNextWord(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${hours}h ${minutes}m ${seconds}s`;
}