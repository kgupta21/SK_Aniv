import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Note } from '../types/notes';

export function useNotes() {
  const { username } = useUser();
  const [notes, setNotes] = useState<Note[]>(() => {
    if (!username) return [];
    const stored = localStorage.getItem(`notes_${username}`);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (username) {
      localStorage.setItem(`notes_${username}`, JSON.stringify(notes));
    }
  }, [notes, username]);

  const addNote = (note: Note) => {
    setNotes(prev => [note, ...prev]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, ...updates } : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote
  };
}