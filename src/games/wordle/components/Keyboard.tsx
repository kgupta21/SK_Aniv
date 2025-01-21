import React from 'react';
import clsx from 'clsx';
import { LetterStatus } from '../types';
import { CornerDownLeft } from 'lucide-react';

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace']
];

interface KeyboardProps {
  onKey: (key: string) => void;
  letterStatuses: Record<string, LetterStatus>;
}

export function Keyboard({ onKey, letterStatuses }: KeyboardProps) {
  return (
    <div className="w-full max-w-md mx-auto mt-4 px-1 sm:px-0">
      {KEYBOARD_ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-0.5 sm:gap-1 my-0.5 sm:my-1">
          {row.map((key) => {
            const status = letterStatuses[key] || '';
            return (
              <button
                key={key}
                onClick={() => onKey(key)}
                className={clsx(
                  'h-10 sm:h-12 font-bold rounded transition-colors text-xs sm:text-sm',
                  'min-w-[1.75rem] sm:min-w-[2rem]',
                  'flex items-center justify-center',
                  key === 'enter' && 'w-10 sm:w-16',
                  key === 'backspace' && 'px-0.5 sm:px-2 w-12 sm:w-16',
                  key.length === 1 && 'px-0.5 sm:px-2',
                  {
                    'bg-green-500 text-white': status === 'correct',
                    'bg-yellow-500 text-white': status === 'present',
                    'bg-gray-700 text-white': status === 'absent',
                    'bg-gray-400 text-white hover:bg-gray-500': !status
                  }
                )}
              >
                {key === 'backspace' ? '←' : 
                  key === 'enter' ? <CornerDownLeft className="w-4 h-4 sm:w-5 sm:h-5" /> : 
                  key.toUpperCase()}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}