import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { CalendarEvent, ViewType } from '../types/calendar';
import { startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from '../utils/dateUtils';

export function useCalendar() {
  const { username } = useUser();
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    if (!username) return [];
    const stored = localStorage.getItem(`calendar_${username}`);
    return stored ? JSON.parse(stored) : [];
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('month');

  useEffect(() => {
    if (username) {
      localStorage.setItem(`calendar_${username}`, JSON.stringify(events));
    }
  }, [events, username]);

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID()
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(event =>
      event.id === id ? { ...event, ...updates } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const getMonthDays = (date: Date) => {
    const start = startOfWeek(startOfMonth(date));
    const end = endOfWeek(endOfMonth(date));
    return eachDayOfInterval({ start, end });
  };

  return {
    events,
    selectedDate,
    view,
    setSelectedDate,
    setView,
    addEvent,
    updateEvent,
    deleteEvent,
    getMonthDays
  };
}