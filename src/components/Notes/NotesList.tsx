import React from 'react';
import { Note } from '../../types/notes';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { Trash2 } from 'lucide-react';
import clsx from 'clsx';

interface NotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

export function NotesList({ notes, selectedNote, onSelectNote, onDeleteNote }: NotesListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {notes.map(note => (
        <div
          key={note.id}
          className={clsx(
            'group p-6 border-b border-white/10 cursor-pointer transition-colors',
            selectedNote?.id === note.id ? 'bg-white/10' : 'hover:bg-white/5'
          )}
          onClick={() => onSelectNote(note)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-white truncate">{note.title}</h3>
              <p className="text-white/50 text-sm truncate mt-1">{note.content}</p>
              <p className="text-white/30 text-sm mt-2">
                {formatDistanceToNow(new Date(note.updatedAt))}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNote(note.id);
              }}
              className="p-2 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}