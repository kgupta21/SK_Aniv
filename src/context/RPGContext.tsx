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
  selectedTree: string | null;
  setSelectedTree: (treeId: string | null) => void;
}

const defaultTrees: TreeSprite[] = [
  {
    id: 'tree1-green',
    name: 'Classic Green Tree',
    price: 100,
    imageUrl: '/Pixel Art Tree Pack/Tree 1/TREE 1_GREEN.png',
    description: 'A beautiful classic green tree, perfect for beginners'
  },
  {
    id: 'tree4-teal',
    name: 'Mystical Teal Tree',
    price: 250,
    imageUrl: '/Pixel Art Tree Pack/Tree 4/TREE 4_TEAL.png',
    description: 'A magical teal-colored tree with a mystical aura'
  },
  {
    id: 'tree8-yellow',
    name: 'Golden Autumn Tree',
    price: 500,
    imageUrl: '/Pixel Art Tree Pack/Tree 8/TREE 8_YELLOWISH GREEN.png',
    description: 'A majestic tree with golden autumn leaves'
  },
  {
    id: 'tree11-sandy',
    name: 'Desert Oasis Tree',
    price: 750,
    imageUrl: '/Pixel Art Tree Pack/Tree 11/TREE 11_SANDY GREEN.png',
    description: 'A rare tree that thrives in sandy environments'
  },
  {
    id: 'tree15-green',
    name: 'Ancient Guardian Tree',
    price: 1000,
    imageUrl: '/Pixel Art Tree Pack/Tree 15/TREE 15_GREEN.png',
    description: 'An ancient tree said to protect the forest'
  }
];

const RPGContext = createContext<RPGContextType | null>(null);

export function RPGProvider({ children }: { children: React.ReactNode }) {
  const { username } = useUser();
  const [currency, setCurrency] = useState(0);
  const [ownedTrees, setOwnedTrees] = useState<TreeSprite[]>([]);
  const [selectedTree, setSelectedTree] = useState<string | null>(null);

  // Load saved state from localStorage when username changes
  useEffect(() => {
    if (username) {
      const savedState = localStorage.getItem(`rpg-state-${username}`);
      if (savedState) {
        const { currency, ownedTrees, selectedTree } = JSON.parse(savedState);
        setCurrency(currency);
        setOwnedTrees(ownedTrees);
        setSelectedTree(selectedTree);
      }
    }
  }, [username]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (username) {
      localStorage.setItem(`rpg-state-${username}`, JSON.stringify({
        currency,
        ownedTrees,
        selectedTree
      }));
    }
  }, [username, currency, ownedTrees, selectedTree]);

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
      selectedTree,
      setSelectedTree
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