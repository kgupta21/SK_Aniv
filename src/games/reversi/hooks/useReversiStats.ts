import { useCallback } from 'react';
import { useUser } from '../../../context/UserContext';
import { ReversiStats, Difficulty } from '../types';

const DEFAULT_DIFFICULTY_STATS = {
  games: 0,
  wins: 0,
  losses: 0,
  ties: 0
};

const DEFAULT_STATS: ReversiStats = {
  totalGames: 0,
  wins: 0,
  losses: 0,
  ties: 0,
  byDifficulty: {
    easy: { ...DEFAULT_DIFFICULTY_STATS },
    medium: { ...DEFAULT_DIFFICULTY_STATS },
    hard: { ...DEFAULT_DIFFICULTY_STATS }
  }
};

export function useReversiStats() {
  const { username, scores, addScore } = useUser();

  const updateStats = useCallback((
    playerScore: number,
    aiScore: number,
    difficulty: Difficulty
  ) => {
    if (!username) return;

    const currentStats = (scores.reversi?.stats || DEFAULT_STATS) as ReversiStats;
    const newStats = { ...currentStats };
    
    // Update total stats
    newStats.totalGames++;
    if (playerScore > aiScore) {
      newStats.wins++;
    } else if (aiScore > playerScore) {
      newStats.losses++;
    } else {
      newStats.ties++;
    }

    // Update difficulty-specific stats
    const diffStats = newStats.byDifficulty[difficulty];
    diffStats.games++;
    if (playerScore > aiScore) {
      diffStats.wins++;
    } else if (aiScore > playerScore) {
      diffStats.losses++;
    } else {
      diffStats.ties++;
    }

    addScore('reversi', { stats: newStats });
  }, [username, scores, addScore]);

  return { updateStats };
}