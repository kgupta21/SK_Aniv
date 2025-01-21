import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  username: string;
  setUsername: (username: string) => void;
  scores: Record<string, GameScores>;
  addScore: (game: string, score: number) => void;
}

interface GameScores {
  highScore: number;
  lastScore: number;
  totalGames: number;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || '';
  });

  const [scores, setScores] = useState<Record<string, GameScores>>(() => {
    const stored = localStorage.getItem(`scores_${username}`);
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
      const stored = localStorage.getItem(`scores_${username}`);
      if (stored) {
        setScores(JSON.parse(stored));
      }
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      localStorage.setItem(`scores_${username}`, JSON.stringify(scores));
    }
  }, [scores, username]);

  const addScore = (game: string, score: number) => {
    if (!username) return;

    setScores(prev => {
      const gameScores = prev[game] || { highScore: 0, lastScore: 0, totalGames: 0 };
      return {
        ...prev,
        [game]: {
          highScore: Math.max(gameScores.highScore, score),
          lastScore: score,
          totalGames: gameScores.totalGames + 1
        }
      };
    });
  };

  return (
    <UserContext.Provider value={{ username, setUsername, scores, addScore }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}