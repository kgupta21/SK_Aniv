import React from 'react';
import { useUser } from '../context/UserContext';

export function ScoreDisplay({ game }: { game: string }) {
  const { username, scores } = useUser();
  const gameScores = scores[game];

  if (!username || !gameScores) return null;

  return (
    <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
      <h3 className="text-lg text-white font-semibold mb-2">Your Scores</h3>
      <div className="grid grid-cols-3 gap-4 text-white">
        <div>
          <p className="text-purple-200">High Score</p>
          <p className="text-xl">{gameScores.highScore}</p>
        </div>
        <div>
          <p className="text-purple-200">Last Score</p>
          <p className="text-xl">{gameScores.lastScore}</p>
        </div>
        <div>
          <p className="text-purple-200">Games Played</p>
          <p className="text-xl">{gameScores.totalGames}</p>
        </div>
      </div>
    </div>
  );
}