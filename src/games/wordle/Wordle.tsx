import React, { useEffect, useState } from 'react';
import { GameLayout } from '../../components/GameLayout';
import { WordleGrid } from './components/WordleGrid';
import { Keyboard } from './components/Keyboard';
import { WordleStats } from './components/WordleStats';
import { useWordle } from './hooks/useWordle';
import { useWordleStats } from './hooks/useWordleStats';
import { BarChart } from 'lucide-react';

export default function Wordle() {
  const {
    targetWord,
    guesses,
    currentGuess,
    gameOver,
    letterStatuses,
    nextWordTime,
    handleKey,
    useExpansion,
    toggleExpansion
  } = useWordle();

  const { updateStats } = useWordleStats();
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'enter' || key === 'backspace' || /^[a-z]$/.test(key)) {
        handleKey(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKey]);

  useEffect(() => {
    if (gameOver) {
      const won = guesses[guesses.length - 1] === targetWord;
      updateStats(won, guesses.length);
    }
  }, [gameOver, guesses, targetWord, updateStats]);

  return (
    <GameLayout title="Wordle">
      <div className="max-w-lg w-full mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <p className="text-white text-sm">Next word in: {nextWordTime}</p>
          <button
            onClick={() => setShowStats(true)}
            className="p-2 text-white hover:text-purple-200 transition-colors"
            title="Show Statistics"
          >
            <BarChart size={24} />
          </button>
        </div>

        <button
          onClick={toggleExpansion}
          className="w-full mb-6 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm"
        >
          {useExpansion ? 'Use Original Words Only' : 'Use Expansion Pack'}
        </button>

        <WordleGrid
          guesses={guesses}
          currentGuess={currentGuess}
          targetWord={targetWord}
        />

        <Keyboard
          onKey={handleKey}
          letterStatuses={letterStatuses}
        />

        {gameOver && (
          <div className="mt-6 text-center">
            <p className="text-xl text-white mb-4">
              {guesses[guesses.length - 1] === targetWord 
                ? 'Congratulations! You won!' 
                : `Game Over! The word was: ${targetWord}`}
            </p>
          </div>
        )}

        <WordleStats 
          isVisible={showStats} 
          onClose={() => setShowStats(false)} 
        />
      </div>
    </GameLayout>
  );
}