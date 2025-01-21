import React from 'react';
import { ReversiCell } from './ReversiCell';
import { Board, Player } from '../types';

interface ReversiBoardProps {
  board: Board;
  currentPlayer: Player;
  onMove: (row: number, col: number) => void;
}

export function ReversiBoard({ board, currentPlayer, onMove }: ReversiBoardProps) {
  return (
    <div className="w-full max-w-[min(90vw,640px)] aspect-square mx-auto grid grid-cols-8 gap-0.5 sm:gap-1 bg-green-800 p-2 sm:p-4 rounded-lg">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <ReversiCell
            key={`${rowIndex}-${colIndex}`}
            value={cell}
            onClick={() => onMove(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}