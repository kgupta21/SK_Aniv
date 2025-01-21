import React from 'react';
import { GameCard } from './GameCard';
import { UserSetup } from './UserSetup';
import { useUser } from '../context/UserContext';
import { games } from '../constants/games';

export default function HomePage() {
  const { username } = useUser();
  
  return (
    <div className="space-y-6 sm:space-y-8">
      <UserSetup />
      
      <div className="text-center">
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">Welcome to SK's Games</h1>
        {username && (
          <p className="text-purple-200 mb-2 sm:mb-4">Playing as: {username}</p>
        )}
        <p className="text-sm sm:text-base text-purple-200">Choose your game and start playing!</p>
      </div>

      {/* Game cards in a vertical layout on desktop */}
      <div className="max-w-md mx-auto grid grid-cols-1 gap-4 sm:gap-6">
        {games.map((game) => (
          <GameCard key={game.title} {...game} />
        ))}
      </div>
    </div>
  );
}