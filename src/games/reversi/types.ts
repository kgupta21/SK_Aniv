export type Player = 'black' | 'white';
export type Cell = Player | null;
export type Board = Cell[][];
export type Difficulty = 'easy' | 'medium' | 'hard';

export const BOARD_SIZE = 8;

export const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
] as const;

export interface AIConfig {
  easy: number;
  medium: number;
  hard: number;
}

export const AI_DEPTH: AIConfig = {
  easy: 2,
  medium: 4,
  hard: 6
};

export interface DifficultyStats {
  games: number;
  wins: number;
  losses: number;
  ties: number;
}

export interface ReversiStats {
  totalGames: number;
  wins: number;
  losses: number;
  ties: number;
  byDifficulty: Record<Difficulty, DifficultyStats>;
}