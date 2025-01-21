import React from 'react';
import { TodoFilter as FilterType } from '../../types/todo';
import clsx from 'clsx';

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  todoCount: Record<FilterType, number>;
}

export function TodoFilter({ currentFilter, onFilterChange, todoCount }: TodoFilterProps) {
  const filters: FilterType[] = ['all', 'active', 'completed'];

  return (
    <div className="flex justify-center gap-2">
      {filters.map(filter => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={clsx(
            'px-4 py-2 rounded-lg transition-colors capitalize',
            currentFilter === filter
              ? 'bg-purple-600 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          )}
        >
          {filter} ({todoCount[filter]})
        </button>
      ))}
    </div>
  );
}