import React from 'react';
import { useRPG } from '../../context/RPGContext';
import { useLocation } from 'react-router-dom';

export function BackgroundTrees() {
  const { selectedTrees, ownedTrees } = useRPG();
  const location = useLocation();
  
  // Don't show trees in game pages where they might interfere
  const isGamePage = ['/reversi', '/minesweeper', '/wordle'].includes(location.pathname);
  if (selectedTrees.size === 0 || isGamePage) return null;
  
  // Get all selected trees
  const selectedTreeSprites = ownedTrees.filter(tree => selectedTrees.has(tree.id));
  if (selectedTreeSprites.length === 0) return null;

  // Create positions for each tree type
  const treePositions = Array.from({ length: 8 }, () => ({
    left: `${Math.random() * 80 + 10}%`,
    bottom: `${Math.random() * 30}%`,
    scale: Math.random() * 0.5 + 0.5,
    rotation: Math.random() * 10 - 5,
    treeIndex: Math.floor(Math.random() * selectedTreeSprites.length)
  }));

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      {treePositions.map((position, index) => {
        const tree = selectedTreeSprites[position.treeIndex];
        return (
          <img
            key={`${index}-${tree.id}`}
            src={tree.imageUrl}
            alt={tree.name}
            className="absolute w-32 opacity-20"
            style={{
              left: position.left,
              bottom: position.bottom,
              transform: `scale(${position.scale}) rotate(${position.rotation}deg)`,
              transition: 'transform 0.3s ease-in-out',
              imageRendering: 'pixelated',
              pointerEvents: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
          />
        );
      })}
    </div>
  );
} 