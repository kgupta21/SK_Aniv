import React from 'react';
import { WordleRow } from './WordleRow';
import { WORD_LENGTH, MAX_ATTEMPTS } from '../types';

interface WordleGridProps {
  guesses: string[];
  currentGuess: string;
  targetWord: string;
}

export function WordleGrid({ guesses, currentGuess, targetWord }: WordleGridProps) {
  return (
    <div className="grid gap-1.5 mx-auto max-w-sm">
      {[...Array(MAX_ATTEMPTS)].map((_, i) => (
        <WordleRow
          key={i}
          guess={i < guesses.length ? guesses[i] : (i === guesses.length ? currentGuess : '')}
          targetWord={targetWord}
          isSubmitted={i < guesses.length}
        />
      ))}
    </div>
  );
}