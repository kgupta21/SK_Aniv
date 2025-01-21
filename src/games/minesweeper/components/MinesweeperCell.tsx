import React from 'react';
import clsx from 'clsx';
import { Bomb } from 'lucide-react';
import { Cell } from '../types';

interface MinesweeperCellProps {
  cell: Cell;
  onReveal: () => void;
  onFlag: (e: React.MouseEvent) => void;
}

export function MinesweeperCell({ cell, onReveal, onFlag }: MinesweeperCellProps) {
  return (
    <button
      onClick={onReveal}
      onContextMenu={onFlag}
      className={clsx(
        'w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold border transition-colors',
        cell.isRevealed
          ? cell.isMine
            ? 'bg-red-500 border-red-600'
            : 'bg-gray-200 border-gray-300'
          : 'bg-purple-500 border-purple-600 hover:bg-purple-400'
      )}
    >
      {cell.isRevealed
        ? cell.isMine
          ? <Bomb className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          : cell.neighborMines > 0
            ? cell.neighborMines
            : ''
        : cell.isFlagged
          ? '🚩'
          : ''}
    </button>
  );
}