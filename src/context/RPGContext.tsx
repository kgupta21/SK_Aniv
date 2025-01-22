import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

interface TreeSprite {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

interface RPGContextType {
  currency: number;
  addCurrency: (amount: number) => void;
  ownedTrees: TreeSprite[];
  availableTrees: TreeSprite[];
  purchaseTree: (treeId: string) => void;
  selectedTrees: Set<string>;
  toggleSelectedTree: (treeId: string) => void;
}

const defaultTrees: TreeSprite[] = [
  {
    id: 'tree1-green',
    name: 'Classic Green Tree',
    price: 500,
    imageUrl: '/Pixel Art Tree Pack/Tree 1/TREE 1_YELLOWISH GREEN.png',
    description: 'A beautiful classic tree with vibrant yellowish-green leaves'
  },
  {
    id: 'tree1-teal',
    name: 'Mystical Teal Tree',
    price: 1000,
    imageUrl: '/Pixel Art Tree Pack/Tree 1/TREE 1_TEAL.png',
    description: 'A magical teal-colored variant of the classic tree'
  },
  {
    id: 'tree8-yellow',
    name: 'Golden Autumn Tree',
    price: 2500,
    imageUrl: '/Pixel Art Tree Pack/Tree 8/TREE 8_YELLOWISH GREEN.png',
    description: 'A majestic tree with golden autumn leaves'
  },
  {
    id: 'tree11-sandy',
    name: 'Desert Oasis Tree',
    price: 3750,
    imageUrl: '/Pixel Art Tree Pack/Tree 11/TREE 11_SANDY GREEN.png',
    description: 'A rare tree that thrives in sandy environments'
  },
  {
    id: 'tree15-teal',
    name: 'Ancient Guardian Tree',
    price: 5000,
    imageUrl: '/Pixel Art Tree Pack/Tree 15/TREE 15_TEAL.png',
    description: 'An ancient tree with mystical teal leaves'
  },
  {
    id: 'tree15-red',
    name: 'Crimson Guardian Tree',
    price: 7500,
    imageUrl: '/Pixel Art Tree Pack/Tree 15/TREE 15_RED.png',
    description: 'A rare crimson variant of the ancient guardian tree'
  }
];

const RPGContext = createContext<RPGContextType | null>(null);

export function RPGProvider({ children }: { children: React.ReactNode }) {
  const { username } = useUser();
  const [currency, setCurrency] = useState(0);
  const [ownedTrees, setOwnedTrees] = useState<TreeSprite[]>([]);
  const [selectedTrees, setSelectedTrees] = useState<Set<string>>(new Set());

  // Load saved state from localStorage when username changes
  useEffect(() => {
    if (username) {
      const savedState = localStorage.getItem(`rpg-state-${username}`);
      if (savedState) {
        const { currency, ownedTrees, selectedTrees } = JSON.parse(savedState);
        setCurrency(currency);
        setOwnedTrees(ownedTrees);
        setSelectedTrees(new Set(selectedTrees));
      }
    }
  }, [username]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (username) {
      localStorage.setItem(`rpg-state-${username}`, JSON.stringify({
        currency,
        ownedTrees,
        selectedTrees: Array.from(selectedTrees)
      }));
    }
  }, [username, currency, ownedTrees, selectedTrees]);

  const addCurrency = (amount: number) => {
    setCurrency((prev: number) => prev + amount);
  };

  const purchaseTree = (treeId: string) => {
    const tree = defaultTrees.find(t => t.id === treeId);
    if (!tree) return;
    if (currency >= tree.price && !ownedTrees.some((t: TreeSprite) => t.id === treeId)) {
      setCurrency((prev: number) => prev - tree.price);
      setOwnedTrees((prev: TreeSprite[]) => [...prev, tree]);
    }
  };

  const toggleSelectedTree = (treeId: string) => {
    setSelectedTrees(prev => {
      const newSet = new Set(prev);
      if (newSet.has(treeId)) {
        newSet.delete(treeId);
      } else {
        newSet.add(treeId);
      }
      return newSet;
    });
  };

  const availableTrees = defaultTrees.filter(
    (tree: TreeSprite) => !ownedTrees.some((owned: TreeSprite) => owned.id === tree.id)
  );

  return (
    <RPGContext.Provider value={{
      currency,
      addCurrency,
      ownedTrees,
      availableTrees,
      purchaseTree,
      selectedTrees,
      toggleSelectedTree
    }}>
      {children}
    </RPGContext.Provider>
  );
}

export function useRPG() {
  const context = useContext(RPGContext);
  if (!context) {
    throw new Error('useRPG must be used within an RPGProvider');
  }
  return context;
} 