import React from 'react';
import { Board, Player } from '../types';
import { isValidMove } from '../utils/gameLogic';

export interface ReversiBoardProps {
  board: Board;
  currentPlayer: Player;
  onMove: (row: number, col: number) => void;
  isActive?: boolean;
}

export function ReversiBoard({ board, currentPlayer, onMove, isActive = true }: ReversiBoardProps) {
  const handleCellClick = (row: number, col: number) => {
    if (!isActive) return;
    onMove(row, col);
  };

  return (
    <div className="w-full max-w-[min(90vw,640px)] aspect-square mx-auto">
      <div className="w-full h-full grid grid-cols-8 gap-1 bg-green-900 p-2 rounded">
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            const canMove = isActive && isValidMove(rowIndex, colIndex, currentPlayer, board);
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`
                  aspect-square flex items-center justify-center
                  ${canMove ? 'cursor-pointer hover:bg-green-700' : 'cursor-not-allowed'}
                  ${cell === null ? 'bg-green-800' : ''}
                `}
              >
                {cell && (
                  <div
                    className={`
                      w-[90%] h-[90%] rounded-full
                      ${cell === 'black' ? 'bg-black' : 'bg-white'}
                      transition-transform duration-300 ease-in-out
                      ${cell === currentPlayer ? 'scale-90' : 'scale-100'}
                    `}
                  />
                )}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
}