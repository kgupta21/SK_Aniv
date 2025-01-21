import React from 'react';
import clsx from 'clsx';
import { Cell } from '../types';

interface ReversiCellProps {
  value: Cell;
  onClick: () => void;
}

export function ReversiCell({ value, onClick }: ReversiCellProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'aspect-square w-full transition-all transform hover:scale-95',
        'flex items-center justify-center rounded-full',
        {
          'bg-green-700': value === null,
          'bg-black': value === 'black',
          'bg-white': value === 'white'
        }
      )}
    />
  );
}