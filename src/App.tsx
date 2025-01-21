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
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
          <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Link to="/" className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src="https://i.postimg.cc/YCxyfPrY/image.png" 
                      alt="Husky Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xl font-bold text-white">SK's Games</span>
                </Link>

                <div className="hidden md:flex space-x-4">
                  <NavLink to="/wordle">Wordle</NavLink>
                  <NavLink to="/minesweeper">Minesweeper</NavLink>
                  <NavLink to="/reversi">Reversi</NavLink>
                  <NavLink to="/todos">Todo List</NavLink>
                  <NavLink to="/calendar">Calendar</NavLink>
                  <NavLink to="/notes">Notes</NavLink>
                  <NavLink to="/h3">H3 Podcast</NavLink>
                  <NavLink to="/racing">Racing</NavLink>
                </div>

                <button
                  onClick={() => setIsNavOpen(true)}
                  className="md:hidden p-2 text-white hover:text-purple-200 transition-colors"
                >
                  <Menu size={24} />
                </button>
              </div>
            </div>
          </nav>

          <MobileNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/wordle" element={<Wordle />} />
              <Route path="/minesweeper" element={<Minesweeper />} />
              <Route path="/reversi" element={<Reversi />} />
              <Route path="/todos" element={<TodoList />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/h3" element={<H3H3Tribute />} />
              <Route path="/racing" element={<RacingGames />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}