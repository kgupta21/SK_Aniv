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

  const updateStats = useCallback((result: 'win' | 'loss' | 'tie', difficulty: Difficulty) => {
    if (!username) return;

    const currentStats = scores.reversi?.stats || DEFAULT_STATS;
    const newStats = { ...currentStats };

    // Update total stats
    newStats.totalGames++;
    if (result === 'win') newStats.wins++;
    else if (result === 'loss') newStats.losses++;
    else newStats.ties++;

    // Update difficulty specific stats
    const diffStats = newStats.byDifficulty[difficulty];
    diffStats.games++;
    if (result === 'win') diffStats.wins++;
    else if (result === 'loss') diffStats.losses++;
    else diffStats.ties++;

    // Add score to user context
    addScore('reversi', { stats: newStats });
  }, [username, scores, addScore]);

  return {
    stats: scores.reversi?.stats || DEFAULT_STATS,
    updateStats
  };
}