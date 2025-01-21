import React from 'react';
import { useRPG } from '../../context/RPGContext';

export function TreeStore() {
  const { currency, availableTrees, ownedTrees, purchaseTree, selectedTree, setSelectedTree } = useRPG();

  return (
    <div className="p-4 bg-white/5 rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Tree Store</h2>
        <div className="text-yellow-400 font-bold">
          🪙 {currency} coins
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {availableTrees.map(tree => (
          <div
            key={tree.id}
            className="p-4 bg-white/10 rounded-lg space-y-2 hover:bg-white/20 transition-colors"
          >
            <img
              src={tree.imageUrl}
              alt={tree.name}
              className="w-full h-32 object-contain"
            />
            <h3 className="text-white font-semibold">{tree.name}</h3>
            <p className="text-yellow-400">🪙 {tree.price}</p>
            <button
              onClick={() => purchaseTree(tree.id)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currency < tree.price}
            >
              Purchase
            </button>
          </div>
        ))}
      </div>

      {ownedTrees.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-white mb-4">Your Trees</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ownedTrees.map(tree => (
              <div
                key={tree.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedTree === tree.id
                    ? 'bg-blue-500/30 ring-2 ring-blue-500'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                onClick={() => setSelectedTree(tree.id)}
              >
                <img
                  src={tree.imageUrl}
                  alt={tree.name}
                  className="w-full h-24 object-contain"
                />
                <h4 className="text-white text-center mt-2">{tree.name}</h4>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 