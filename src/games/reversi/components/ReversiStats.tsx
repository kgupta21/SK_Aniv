import React from 'react';
import { useUser } from '../../../context/UserContext';
import { ReversiStats as ReversiStatsType, Difficulty } from '../types';
import clsx from 'clsx';

interface ReversiStatsProps {
  isVisible: boolean;
  onClose: () => void;
}

export function ReversiStats({ isVisible, onClose }: ReversiStatsProps) {
  const { username, scores } = useUser();
  const stats = (scores.reversi?.stats || {
    totalGames: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    byDifficulty: {
      easy: { games: 0, wins: 0, losses: 0, ties: 0 },
      medium: { games: 0, wins: 0, losses: 0, ties: 0 },
      hard: { games: 0, wins: 0, losses: 0, ties: 0 }
    }
  }) as ReversiStatsType;

  if (!isVisible) return null;

  const winPercentage = stats.totalGames ? 
    Math.round((stats.wins / stats.totalGames) * 100) : 0;

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 p-6 rounded-lg max-w-2xl w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            {username ? `${username}'s Reversi Statistics` : 'Reversi Statistics'}
          </h2>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.totalGames}</div>
              <div className="text-xs text-gray-400">Games Played</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{winPercentage}%</div>
              <div className="text-xs text-gray-400">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.wins}</div>
              <div className="text-xs text-gray-400">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.ties}</div>
              <div className="text-xs text-gray-400">Ties</div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-4">Performance by Difficulty</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-2 text-left">Difficulty</th>
                  <th className="px-4 py-2 text-center">Games</th>
                  <th className="px-4 py-2 text-center">Wins</th>
                  <th className="px-4 py-2 text-center">Losses</th>
                  <th className="px-4 py-2 text-center">Ties</th>
                  <th className="px-4 py-2 text-center">Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {difficulties.map(diff => {
                  const diffStats = stats.byDifficulty[diff];
                  const diffWinRate = diffStats.games ? 
                    Math.round((diffStats.wins / diffStats.games) * 100) : 0;
                  
                  return (
                    <tr key={diff} className="border-b border-gray-800">
                      <td className="px-4 py-2 capitalize">{diff}</td>
                      <td className="px-4 py-2 text-center">{diffStats.games}</td>
                      <td className="px-4 py-2 text-center text-green-500">{diffStats.wins}</td>
                      <td className="px-4 py-2 text-center text-red-500">{diffStats.losses}</td>
                      <td className="px-4 py-2 text-center text-yellow-500">{diffStats.ties}</td>
                      <td className="px-4 py-2 text-center">{diffWinRate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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