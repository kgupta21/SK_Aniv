import React from 'react';
import clsx from 'clsx';

interface BarProps {
  guess: number;
  count: number;
  max: number;
}

export function Bar({ guess, count, max }: BarProps) {
  const percentage = max > 0 ? (count / max) * 100 : 0;
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 text-white">{guess}</div>
      <div className="flex-1 h-5 bg-gray-800 rounded overflow-hidden">
        <div
          className={clsx(
            'h-full bg-green-500 flex items-center justify-end px-2 text-xs text-white transition-all',
            count === 0 && 'bg-gray-700'
          )}
          style={{ width: `${Math.max(percentage, 5)}%` }}
        >
          {count > 0 && count}
        </div>
      </div>
    </div>
  );
}