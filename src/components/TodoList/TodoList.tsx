import React, { useState } from 'react';
import { TodoItem } from './TodoItem';
import { TodoForm } from './TodoForm';
import { TodoFilter } from './TodoFilter';
import { useTodos } from '../../hooks/useTodos';
import { useUser } from '../../context/UserContext';
import { TodoFilter as FilterType } from '../../types/todo';
import { GameLayout } from '../GameLayout';

export default function TodoList() {
  const { username } = useUser();
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, filterTodos } = useTodos();
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  
  if (!username) {
    return (
      <GameLayout title="Todo List">
        <div className="text-center text-white">
          <p>Please set a username to use the Todo List feature.</p>
        </div>
      </GameLayout>
    );
  }

  const filteredTodos = filterTodos(currentFilter);

  return (
    <GameLayout title="Todo List">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        <TodoForm onAdd={addTodo} />
        
        <TodoFilter
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          todoCount={{
            all: todos.length,
            active: todos.filter(t => !t.completed).length,
            completed: todos.filter(t => t.completed).length
          }}
        />

        <div className="space-y-2">
          {filteredTodos.length === 0 ? (
            <p className="text-center text-white/60">No todos found.</p>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))
          )}
        </div>
      </div>
    </GameLayout>
  );
}