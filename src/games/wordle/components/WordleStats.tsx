import React from 'react';
import { Bar } from './Bar';
import { useUser } from '../../../context/UserContext';
import { WordleStats as WordleStatsType } from '../types';

interface WordleStatsProps {
  isVisible: boolean;
  onClose: () => void;
}

export function WordleStats({ isVisible, onClose }: WordleStatsProps) {
  const { username, scores } = useUser();
  const stats = (scores.wordle?.stats || {
    guesses: Array(6).fill(0),
    wins: 0,
    gamesPlayed: 0,
    currentStreak: 0,
    maxStreak: 0,
    averageGuesses: 0
  }) as WordleStatsType;
  
  if (!isVisible) return null;

  const winPercentage = stats.gamesPlayed ? 
    Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;
  const maxGuesses = Math.max(...stats.guesses);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            {username ? `${username}'s Statistics` : 'Statistics'}
          </h2>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.gamesPlayed}</div>
              <div className="text-xs text-gray-400">Played</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{winPercentage}</div>
              <div className="text-xs text-gray-400">Win %</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
              <div className="text-xs text-gray-400">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.maxStreak}</div>
              <div className="text-xs text-gray-400">Max Streak</div>
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-white mb-3">Guess Distribution</h3>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <Bar
                key={num}
                guess={num}
                count={stats.guesses[num - 1]}
                max={maxGuesses}
              />
            ))}
          </div>

          {stats.gamesPlayed > 0 && (
            <div className="mt-4 text-sm text-gray-400">
              Average Guesses: {stats.averageGuesses.toFixed(1)}
            </div>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}