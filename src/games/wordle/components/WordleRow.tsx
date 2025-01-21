import React from 'react';
import { WordleTile } from './WordleTile';
import { WORD_LENGTH, LetterStatus } from '../types';

interface WordleRowProps {
  guess: string;
  targetWord: string;
  isSubmitted: boolean;
}

export function WordleRow({ guess, targetWord, isSubmitted }: WordleRowProps) {
  const getLetterStatus = (letter: string, index: number): LetterStatus => {
    if (!isSubmitted) return '';
    if (guess[index] === targetWord[index]) return 'correct';
    if (targetWord.includes(guess[index])) return 'present';
    return 'absent';
  };

  return (
    <div className="grid grid-cols-5 gap-1.5">
      {[...Array(WORD_LENGTH)].map((_, i) => (
        <WordleTile
          key={i}
          letter={guess[i] || ''}
          status={getLetterStatus(guess[i], i)}
        />
      ))}
    </div>
  );
}