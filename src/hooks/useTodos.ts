import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Todo, TodoFilter } from '../types/todo';

export function useTodos() {
  const { username } = useUser();
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (!username) return [];
    const stored = localStorage.getItem(`todos_${username}`);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (username) {
      localStorage.setItem(`todos_${username}`, JSON.stringify(todos));
    }
  }, [todos, username]);

  const addTodo = (text: string, priority: Todo['priority'], category?: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      priority,
      category
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const editTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  };

  const filterTodos = (filter: TodoFilter) => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    filterTodos
  };
}