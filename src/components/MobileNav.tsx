import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { games } from '../constants/games';
import clsx from 'clsx';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={clsx(
          'fixed inset-0 bg-black/50 transition-opacity z-40',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={clsx(
          'fixed inset-y-0 right-0 w-64 bg-gray-900 transform transition-transform z-50',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 text-white hover:text-purple-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4">
          {games.map((game) => (
            <Link
              key={game.title}
              to={game.path}
              className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={onClose}
            >
              <game.icon size={20} />
              <span>{game.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}