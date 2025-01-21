import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { ViewType } from '../../types/calendar';
import { formatDate } from '../../utils/dateUtils';
import clsx from 'clsx';

interface CalendarHeaderProps {
  selectedDate: Date;
  view: ViewType;
  onDateChange: (date: Date) => void;
  onViewChange: (view: ViewType) => void;
}

export function CalendarHeader({ selectedDate, view, onDateChange, onViewChange }: CalendarHeaderProps) {
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    onDateChange(newDate);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <CalendarIcon className="w-6 h-6" />
          {formatDate(selectedDate)}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="flex gap-2">
        {(['month', 'week', 'day'] as ViewType[]).map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={clsx(
              'px-3 py-1 rounded capitalize transition-colors',
              view === v ? 'bg-purple-600 text-white' : 'text-white/70 hover:bg-white/10'
            )}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}