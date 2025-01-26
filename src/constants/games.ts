import { Target, Gamepad2, CircleDot, ListTodo, Calendar, StickyNote, Mic, Car, ArrowUpDown } from 'lucide-react';

export const games = [
  {
    title: 'Wordle',
    description: 'Test your vocabulary with Wordle!',
    icon: Target,
    path: '/wordle',
    color: 'from-green-500 to-emerald-700'
  },
  {
    title: 'Minesweeper',
    description: 'Classic Minesweeper game with customizable difficulty.',
    icon: Gamepad2,
    path: '/minesweeper',
    color: 'from-blue-500 to-blue-700'
  },
  {
    title: 'Reversi',
    description: 'Play against AI with multiple difficulty levels.',
    icon: CircleDot,
    path: '/reversi',
    color: 'from-purple-500 to-purple-700'
  },
  {
    title: 'Platformer',
    description: 'Endless runner platformer with procedurally generated levels.',
    icon: ArrowUpDown,
    path: '/platformer',
    color: 'from-yellow-500 to-orange-700'
  },
  {
    title: 'Todo List',
    description: 'Manage your tasks with priorities and categories.',
    icon: ListTodo,
    path: '/todos',
    color: 'from-pink-500 to-rose-700'
  },
  {
    title: 'Calendar',
    description: 'Organize your schedule with a full-featured calendar.',
    icon: Calendar,
    path: '/calendar',
    color: 'from-indigo-500 to-indigo-700'
  },
  {
    title: 'Notes',
    description: 'Create and organize your notes beautifully.',
    icon: StickyNote,
    path: '/notes',
    color: 'from-amber-500 to-orange-700'
  },
  {
    title: 'H3 Podcast',
    description: 'A tribute to the legendary H3H3 podcast.',
    icon: Mic,
    path: '/h3',
    color: 'from-violet-500 to-purple-700'
  },
  {
    title: 'Racing Games',
    description: 'Play exciting racing games from indie developers.',
    icon: Car,
    path: '/racing',
    color: 'from-red-500 to-orange-700'
  }
];