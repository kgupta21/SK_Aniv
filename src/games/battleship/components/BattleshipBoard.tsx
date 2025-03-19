import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import type { DropTargetMonitor } from 'react-dnd';
import { Board, BOARD_SIZE } from '../types';

interface DragItem {
  shipIndex: number;
  size: number;
  orientation: 'horizontal' | 'vertical';
}

interface BattleshipBoardProps {
  board: Board;
  isPlacement?: boolean;
  showShips?: boolean;
  onCellClick?: (row: number, col: number) => void;
  onShipDrop?: (shipIndex: number, row: number, col: number) => void;
  highlightCells?: [number, number][];
  isActive?: boolean;
}

export function BattleshipBoard({
  board,
  isPlacement = false,
  showShips = false,
  onCellClick,
  onShipDrop,
  highlightCells = [],
  isActive = true,
}: BattleshipBoardProps) {
  const [previewShip, setPreviewShip] = useState<{ size: number; row: number; col: number; orientation: 'horizontal' | 'vertical' } | null>(null);

  const isValidPlacement = (row: number, col: number, size: number, orientation: 'horizontal' | 'vertical'): boolean => {
    // Check if ship goes off board
    if (orientation === 'horizontal' && col + size > BOARD_SIZE) return false;
    if (orientation === 'vertical' && row + size > BOARD_SIZE) return false;

    // Check if ship overlaps with other ships or adjacent to them
    const shipCells = new Set<string>();
    
    // Add the cells of the new ship
    for (let i = 0; i < size; i++) {
      const r = orientation === 'horizontal' ? row : row + i;
      const c = orientation === 'horizontal' ? col + i : col;
      shipCells.add(`${r},${c}`);
    }

    // Check each cell and its adjacents
    for (let r = Math.max(0, row - 1); r <= Math.min(BOARD_SIZE - 1, row + (orientation === 'vertical' ? size : 1)); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(BOARD_SIZE - 1, col + (orientation === 'horizontal' ? size : 1)); c++) {
        // If this cell is part of the ship we're placing, skip the check
        if (shipCells.has(`${r},${c}`)) continue;
        
        // If we find a ship in an adjacent cell, placement is invalid
        if (board[r][c] === 'ship') return false;
      }
    }

    return true;
  };

  return (
    <div className="w-full max-w-[min(90vw,640px)] aspect-square mx-auto">
      <div className="w-full h-full grid grid-cols-10 gap-1 bg-blue-900 p-2 rounded">
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            const isHighlighted = highlightCells.some(
              ([r, c]) => r === rowIndex && c === colIndex
            );

            const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>(() => ({
              accept: 'ship',
              canDrop: (item: DragItem) => {
                if (!isPlacement || !isActive) return false;
                return isValidPlacement(rowIndex, colIndex, item.size, item.orientation);
              },
              hover: (item: DragItem, monitor) => {
                if (monitor.canDrop()) {
                  setPreviewShip({
                    size: item.size,
                    row: rowIndex,
                    col: colIndex,
                    orientation: item.orientation
                  });
                }
              },
              drop: (item: DragItem) => {
                setPreviewShip(null);
                onShipDrop?.(item.shipIndex, rowIndex, colIndex);
              },
              collect: (monitor) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
              }),
            }), [isPlacement, isActive, rowIndex, colIndex, board]);

            const isPreview = previewShip && (() => {
              if (rowIndex < previewShip.row || colIndex < previewShip.col) return false;
              if (previewShip.orientation === 'horizontal') {
                return rowIndex === previewShip.row && 
                       colIndex >= previewShip.col && 
                       colIndex < previewShip.col + previewShip.size;
              } else {
                return colIndex === previewShip.col && 
                       rowIndex >= previewShip.row && 
                       rowIndex < previewShip.row + previewShip.size;
              }
            })();

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                ref={drop}
                onClick={() => isActive && onCellClick?.(rowIndex, colIndex)}
                className={`
                  aspect-square flex items-center justify-center
                  ${isActive ? 'cursor-pointer hover:bg-blue-700' : 'cursor-not-allowed'}
                  ${isHighlighted ? 'bg-blue-600' : 'bg-blue-800'}
                  ${isOver && canDrop ? 'bg-green-600' : ''}
                  ${isOver && !canDrop ? 'bg-red-600' : ''}
                  ${isPreview && canDrop ? 'bg-gray-400' : ''}
                  transition-colors duration-200
                `}
              >
                {cell === 'ship' && showShips && (
                  <div className="w-[80%] h-[80%] bg-gray-400 rounded" />
                )}
                {cell === 'hit' && (
                  <div className="w-[80%] h-[80%] bg-red-500 rounded-full" />
                )}
                {cell === 'miss' && (
                  <div className="w-[80%] h-[80%] border-2 border-white rounded-full" />
                )}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
} 