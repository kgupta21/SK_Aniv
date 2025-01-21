import React, { useState } from 'react';
import { GameLayout } from '../GameLayout';
import { NotesList } from './NotesList';
import { NoteEditor } from './NoteEditor';
import { useNotes } from '../../hooks/useNotes';
import { useUser } from '../../context/UserContext';
import { Note } from '../../types/notes';
import { Plus } from 'lucide-react';

export default function Notes() {
  const { username } = useUser();
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!username) {
    return (
      <GameLayout title="Notes">
        <div className="text-center text-white">
          <p>Please set a username to use the Notes feature.</p>
        </div>
      </GameLayout>
    );
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    addNote(newNote);
    setSelectedNote(newNote);
  };

  return (
    <GameLayout title="Notes">
      <div className="w-full max-w-[1920px] mx-auto flex h-[calc(100vh-12rem)] bg-white/5 rounded-lg overflow-hidden">
        <div className="w-80 border-r border-white/10 flex flex-col">
          <div className="p-6 border-b border-white/10 space-y-4">
            <button
              onClick={handleNewNote}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-lg"
            >
              <Plus size={24} />
              New Note
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <NotesList
            notes={filteredNotes}
            selectedNote={selectedNote}
            onSelectNote={setSelectedNote}
            onDeleteNote={deleteNote}
          />
        </div>
        <div className="flex-1 bg-white/[0.02]">
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              onUpdate={updateNote}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-white/50 text-lg">
              Select a note or create a new one
            </div>
          )}
        </div>
      </div>
    </GameLayout>
  );
}