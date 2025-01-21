import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Todo, PriorityLevel } from '../../types/todo';
import { useRPG } from '../../context/RPGContext';
import clsx from 'clsx';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Todo>) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState<PriorityLevel>(todo.priority);
  const [showReward, setShowReward] = useState(false);
  const { addCurrency } = useRPG();

  // Calculate reward based on priority
  const getReward = (priority: PriorityLevel): number => {
    switch (priority) {
      case 'high': return 100;
      case 'medium': return 50;
      case 'low': return 25;
      default: return 25;
    }
  };

  const handleToggle = () => {
    if (!todo.completed) {
      const reward = getReward(todo.priority);
      addCurrency(reward);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 2000);
    }
    onToggle(todo.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editText.trim()) {
      onEdit(todo.id, { text: editText.trim(), priority: editPriority });
      setIsEditing(false);
    }
  };

  const priorityColors = {
    low: 'bg-blue-500/20 text-blue-300',
    medium: 'bg-yellow-500/20 text-yellow-300',
    high: 'bg-red-500/20 text-red-300'
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white/10 p-3 rounded-lg">
        <input
          type="text"
          value={editText}
          onChange={e => setEditText(e.target.value)}
          className="flex-1 bg-transparent border border-white/20 rounded px-2 py-1 text-white"
          autoFocus
        />
        <select
          value={editPriority}
          onChange={e => setEditPriority(e.target.value as PriorityLevel)}
          className="bg-transparent border border-white/20 rounded px-2 py-1 text-white"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit" className="p-1 text-green-400 hover:text-green-300">
          <Check size={20} />
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="p-1 text-red-400 hover:text-red-300"
        >
          <X size={20} />
        </button>
      </form>
    );
  }

  return (
    <div className="relative">
      <div className={clsx(
        'flex items-center gap-3 p-3 rounded-lg transition-colors',
        'bg-white/10 hover:bg-white/20'
      )}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="w-5 h-5 rounded border-white/20"
        />
        <span className={clsx(
          'flex-1 text-white transition-opacity',
          todo.completed && 'line-through opacity-50'
        )}>
          {todo.text}
        </span>
        <span className={clsx(
          'px-2 py-1 rounded text-xs font-medium',
          priorityColors[todo.priority]
        )}>
          {todo.priority}
        </span>
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 text-white/60 hover:text-white"
        >
          <Pencil size={20} />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1 text-white/60 hover:text-red-400"
        >
          <Trash2 size={20} />
        </button>
      </div>
      
      {showReward && (
        <div className="absolute top-0 right-0 transform -translate-y-full p-2 bg-yellow-400 text-black rounded-lg animate-bounce">
          +{getReward(todo.priority)} 🪙
        </div>
      )}
    </div>
  );
}