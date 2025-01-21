import React from 'react';
import { useRPG } from '../../context/RPGContext';

export function BackgroundTrees() {
  const { selectedTree, ownedTrees } = useRPG();
  
  if (!selectedTree) return null;
  
  const tree = ownedTrees.find(t => t.id === selectedTree);
  if (!tree) return null;

  // Create an array of random positions for the trees
  const treePositions = Array.from({ length: 5 }, () => ({
    left: `${Math.random() * 80 + 10}%`,
    bottom: `${Math.random() * 30}%`,
    scale: Math.random() * 0.5 + 0.5,
    rotation: Math.random() * 10 - 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {treePositions.map((position, index) => (
        <img
          key={index}
          src={tree.imageUrl}
          alt={tree.name}
          className="absolute w-32 opacity-20"
          style={{
            left: position.left,
            bottom: position.bottom,
            transform: `scale(${position.scale}) rotate(${position.rotation}deg)`,
            transition: 'transform 0.3s ease-in-out',
          }}
        />
      ))}
    </div>
  );
} 