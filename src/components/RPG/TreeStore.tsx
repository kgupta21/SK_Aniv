import React from 'react';
import { useRPG } from '../../context/RPGContext';
import clsx from 'clsx';

export function TreeStore() {
  const { 
    currency, 
    availableTrees, 
    ownedTrees, 
    purchaseTree, 
    selectedTrees,
    toggleSelectedTree 
  } = useRPG();

  return (
    <div className="p-4 bg-white/5 rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Tree Store</h2>
        <div className="text-yellow-400 font-bold flex items-center gap-2">
          <span className="text-2xl">🪙</span>
          <span className="text-xl">{currency}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableTrees.map(tree => (
          <div
            key={tree.id}
            className="p-4 bg-white/10 rounded-lg space-y-3 hover:bg-white/20 transition-colors border border-white/10"
          >
            <div className="bg-black/30 rounded-lg p-4 flex justify-center">
              <img
                src={tree.imageUrl}
                alt={tree.name}
                className="w-24 h-24 object-contain pixelated"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">{tree.name}</h3>
              <p className="text-white/70 text-sm mt-1">{tree.description}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-yellow-400 font-bold flex items-center gap-1">
                <span className="text-xl">🪙</span>
                <span>{tree.price}</span>
              </div>
              <button
                onClick={() => purchaseTree(tree.id)}
                className={clsx(
                  'px-4 py-2 rounded font-medium transition-colors',
                  currency >= tree.price
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-500 text-white/50 cursor-not-allowed'
                )}
                disabled={currency < tree.price}
              >
                Purchase
              </button>
            </div>
          </div>
        ))}
      </div>

      {ownedTrees.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Your Trees</h3>
            <div className="text-sm text-white/70">
              {selectedTrees.size} tree{selectedTrees.size !== 1 ? 's' : ''} selected
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ownedTrees.map(tree => (
              <div
                key={tree.id}
                className={clsx(
                  'p-4 rounded-lg cursor-pointer transition-colors border',
                  selectedTrees.has(tree.id)
                    ? 'bg-blue-500/30 border-blue-500'
                    : 'bg-white/10 border-white/10 hover:bg-white/20'
                )}
                onClick={() => toggleSelectedTree(tree.id)}
              >
                <div className="bg-black/30 rounded-lg p-2 flex justify-center">
                  <img
                    src={tree.imageUrl}
                    alt={tree.name}
                    className="w-16 h-16 object-contain pixelated"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                <h4 className="text-white text-center mt-2 font-medium">{tree.name}</h4>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 