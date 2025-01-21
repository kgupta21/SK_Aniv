import { useCallback } from 'react';
import { useUser } from '../../../context/UserContext';
import { WordleStats } from '../types';

const DEFAULT_STATS: WordleStats = {
  guesses: Array(6).fill(0),
  wins: 0,
  gamesPlayed: 0,
  currentStreak: 0,
  maxStreak: 0,
  averageGuesses: 0
};

export function useWordleStats() {
  const { username, scores, addScore } = useUser();

  const updateStats = useCallback((won: boolean, attempts: number) => {
    if (!username) return;

    const today = new Date().toISOString().split('T')[0];
    const currentStats = (scores.wordle?.stats || DEFAULT_STATS) as WordleStats;
    
    // Calculate new stats
    const newStats = { ...currentStats };
    newStats.gamesPlayed++;

    if (won) {
      // Update guess distribution
      newStats.guesses = [...currentStats.guesses];
      newStats.guesses[attempts - 1]++;
      newStats.wins++;

      // Update streak
      if (today === currentStats.lastPlayedDate) {
        newStats.currentStreak++;
      } else {
        newStats.currentStreak = 1;
      }
      newStats.maxStreak = Math.max(newStats.currentStreak, currentStats.maxStreak || 0);

      // Update average guesses
      const totalGuesses = newStats.guesses.reduce((sum, count, index) => 
        sum + (count * (index + 1)), 0);
      newStats.averageGuesses = totalGuesses / newStats.wins;
    } else {
      newStats.currentStreak = 0;
    }

    newStats.lastPlayedDate = today;
    addScore('wordle', { stats: newStats });
  }, [username, scores, addScore]);

  return { updateStats };
}