import React from 'react';
import clsx from 'clsx';
import { Difficulty, DIFFICULTIES } from '../types';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

export function DifficultySelector({ difficulty, onSelect }: DifficultySelectorProps) {
  return (
    <div className="mb-6 flex justify-center space-x-4">
      {Object.keys(DIFFICULTIES).map((diff) => (
        <button
          key={diff}
          onClick={() => onSelect(diff as Difficulty)}
          className={clsx(
            'px-4 py-2 rounded transition-colors',
            difficulty === diff
              ? 'bg-purple-600 text-white'
              : 'bg-purple-200 text-purple-900 hover:bg-purple-300'
          )}
        >
          {diff.charAt(0).toUpperCase() + diff.slice(1)}
        </button>
      ))}
    </div>
  );
}