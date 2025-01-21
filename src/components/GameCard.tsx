import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: string;
}

export function GameCard({ title, description, icon: Icon, path, color }: GameCardProps) {
  return (
    <Link
      to={path}
      className="block group"
    >
      <div className={`p-4 sm:p-6 rounded-lg bg-gradient-to-br ${color} transform transition-all duration-200 hover:scale-105 hover:shadow-xl`}>
        <Icon className="w-8 h-8 sm:w-12 sm:h-12 text-white mb-2 sm:mb-4" />
        <h2 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">{title}</h2>
        <p className="text-sm sm:text-base text-white/80">{description}</p>
      </div>
    </Link>
  );
}