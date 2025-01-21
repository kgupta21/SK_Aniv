export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;

export type LetterStatus = 'correct' | 'present' | 'absent' | '';

export interface WordleStats {
  guesses: number[];  // Array of 6 numbers representing distribution
  wins: number;
  gamesPlayed: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate?: string;
  averageGuesses: number;
}

export interface GameState {
  targetWord: string;
  guesses: string[];
  currentGuess: string;
  gameOver: boolean;
}