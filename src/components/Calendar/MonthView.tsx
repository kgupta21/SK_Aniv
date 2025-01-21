import React from 'react';
import { CalendarEvent } from '../../types/calendar';
import { isSameDay } from '../../utils/dateUtils';
import clsx from 'clsx';

interface MonthViewProps {
  days: Date[];
  events: CalendarEvent[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function MonthView({ days, events, selectedDate, onSelectDate, onEventClick }: MonthViewProps) {
  const getDayEvents = (date: Date): CalendarEvent[] => {
    return events.filter(event => isSameDay(new Date(event.start), date));
  };

  const getEventClassName = (color: string) => {
    const baseClasses = "text-xs p-1 rounded truncate cursor-pointer transition-colors mb-1";
    const colorClasses = {
      blue: "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30",
      green: "bg-green-500/20 text-green-300 hover:bg-green-500/30",
      red: "bg-red-500/20 text-red-300 hover:bg-red-500/30",
      purple: "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30",
      yellow: "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30"
    };
    return clsx(baseClasses, colorClasses[color as keyof typeof colorClasses]);
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="p-2 text-center text-white/70 font-medium">
          {day}
        </div>
      ))}
      
      {days.map((date, i) => {
        const dayEvents = getDayEvents(date);
        const isToday = isSameDay(date, new Date());
        const isSelected = isSameDay(date, selectedDate);
        const isCurrentMonth = date.getMonth() === selectedDate.getMonth();

        return (
          <div
            key={i}
            onClick={() => onSelectDate(date)}
            className={clsx(
              'min-h-[80px] sm:min-h-[120px] p-1 border border-white/10 transition-colors cursor-pointer',
              'hover:bg-white/10',
              isCurrentMonth ? 'bg-white/5' : 'bg-white/2 opacity-50',
              isSelected && 'ring-2 ring-purple-500'
            )}
          >
            <div className={clsx(
              'text-sm w-6 h-6 flex items-center justify-center rounded-full mb-1',
              isToday ? 'bg-purple-600 text-white' : 'text-white/70'
            )}>
              {date.getDate()}
            </div>
            <div className="space-y-1 overflow-hidden">
              {dayEvents.slice(0, 3).map(event => (
                <div
                  key={event.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                  className={getEventClassName(event.color)}
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-xs text-white/50 pl-1">
                  +{dayEvents.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}