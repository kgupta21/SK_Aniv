import React from 'react';
import { useDrag } from 'react-dnd';
import { SHIPS } from '../types';

interface DraggableShipProps {
  shipIndex: number;
  isPlaced: boolean;
  orientation: 'horizontal' | 'vertical';
  onRotate: () => void;
}

export function DraggableShip({ shipIndex, isPlaced, orientation, onRotate }: DraggableShipProps) {
  const ship = SHIPS[shipIndex];
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ship',
    item: { shipIndex, size: ship.size, orientation },
    canDrag: !isPlaced,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [shipIndex, ship.size, orientation, isPlaced]);

  const cells = Array(ship.size).fill(null);

  return (
    <div
      ref={drag}
      className={`
        inline-flex
        ${orientation === 'vertical' ? 'flex-col' : 'flex-row'}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${isPlaced ? 'cursor-not-allowed opacity-50' : 'cursor-move'}
        select-none
      `}
      onClick={(e) => {
        if (e.ctrlKey || e.metaKey) {
          onRotate();
        }
      }}
    >
      {cells.map((_, i) => (
        <div
          key={i}
          className="w-8 h-8 bg-gray-400 border border-gray-500"
          style={{
            borderRadius: i === 0 
              ? orientation === 'horizontal' 
                ? '4px 0 0 4px' 
                : '4px 4px 0 0'
              : i === cells.length - 1
                ? orientation === 'horizontal'
                  ? '0 4px 4px 0'
                  : '0 0 4px 4px'
                : undefined
          }}
        />
      ))}
    </div>
  );
} 