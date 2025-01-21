import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Wordle from './games/wordle/Wordle';
import Minesweeper from './games/minesweeper/Minesweeper';
import Reversi from './games/reversi/Reversi';
import TodoList from './components/TodoList/TodoList';
import Calendar from './components/Calendar/Calendar';
import Notes from './components/Notes/Notes';
import H3H3Tribute from './components/H3H3Tribute';
import RacingGames from './components/RacingGames';
import HomePage from './components/HomePage';
import { UserProvider } from './context/UserContext';
import { MobileNav } from './components/MobileNav';
import clsx from 'clsx';
import { RPGProvider } from './context/RPGContext';
import { TreeStore } from './components/RPG/TreeStore';
import { BackgroundTrees } from './components/RPG/BackgroundTrees';

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={clsx(
        'text-white hover:text-purple-200 px-3 py-2 rounded-md transition-colors',
        'hover:bg-white/10'
      )}
    >
      {children}
    </Link>
  );
}

export default function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <UserProvider>
      <RPGProvider>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative">
          <BackgroundTrees />
          <div className="container mx-auto px-4 py-8">
            <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
              <TodoList />
              <TreeStore />
            </div>
          </div>
        </div>
      </RPGProvider>
    </UserProvider>
  );
}