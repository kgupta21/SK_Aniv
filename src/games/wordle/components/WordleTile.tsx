import React from 'react';
import clsx from 'clsx';
import { LetterStatus } from '../types';

interface WordleTileProps {
  letter: string;
  status: LetterStatus;
}

export function WordleTile({ letter, status }: WordleTileProps) {
  return (
    <div
      className={clsx(
        'aspect-square w-full border-2 flex items-center justify-center text-2xl font-bold uppercase transition-colors',
        {
          'bg-green-500 border-green-600 text-white': status === 'correct',
          'bg-yellow-500 border-yellow-600 text-white': status === 'present',
          'bg-gray-700 border-gray-600 text-white': status === 'absent',
          'border-gray-400 text-white': !status
        }
      )}
    >
      {letter}
    </div>
  );
}