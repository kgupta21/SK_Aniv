import React, { useState, useEffect } from 'react';
import { Note } from '../../types/notes';
import { debounce } from '../../utils/debounce';

interface NoteEditorProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
}

export function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  const debouncedUpdate = debounce((updates: Partial<Note>) => {
    onUpdate(note.id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }, 500);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedUpdate({ title: newTitle });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    debouncedUpdate({ content: newContent });
  };

  return (
    <div className="h-full flex flex-col p-8">
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Note title"
        className="w-full px-4 py-3 bg-transparent text-2xl font-semibold text-white border-none outline-none placeholder-white/30"
      />
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Start typing your note..."
        className="flex-1 w-full px-4 py-4 mt-4 bg-transparent text-lg text-white resize-none border-none outline-none placeholder-white/30"
      />
    </div>
  );
}