import React, { useState } from 'react';
import { GameLayout } from '../GameLayout';
import { CalendarHeader } from './CalendarHeader';
import { MonthView } from './MonthView';
import { EventModal } from './EventModal';
import { useCalendar } from '../../hooks/useCalendar';
import { CalendarEvent } from '../../types/calendar';
import { useUser } from '../../context/UserContext';

export default function Calendar() {
  const { username } = useUser();
  const {
    events,
    selectedDate,
    view,
    setSelectedDate,
    setView,
    addEvent,
    updateEvent,
    deleteEvent,
    getMonthDays
  } = useCalendar();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent>();

  if (!username) {
    return (
      <GameLayout title="Calendar">
        <div className="text-center text-white">
          <p>Please set a username to use the Calendar feature.</p>
        </div>
      </GameLayout>
    );
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleNewEvent = () => {
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  return (
    <GameLayout title="Calendar">
      <div className="w-full max-w-[1400px] mx-auto space-y-4 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CalendarHeader
            selectedDate={selectedDate}
            view={view}
            onDateChange={setSelectedDate}
            onViewChange={setView}
          />
          
          <button
            onClick={handleNewEvent}
            className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            New Event
          </button>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <MonthView
            days={getMonthDays(selectedDate)}
            events={events}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onEventClick={handleEventClick}
          />
        </div>

        <EventModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(undefined);
          }}
          onSave={(eventData) => {
            if (selectedEvent) {
              updateEvent(selectedEvent.id, eventData);
            } else {
              addEvent(eventData);
            }
          }}
          onDelete={selectedEvent ? deleteEvent : undefined}
        />
      </div>
    </GameLayout>
  );
}