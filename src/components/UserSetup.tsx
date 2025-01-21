import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

export function UserSetup() {
  const { username, setUsername } = useUser();
  const [inputUsername, setInputUsername] = useState(username);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      setUsername(inputUsername.trim());
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-4 sm:p-6 bg-white/10 rounded-lg backdrop-blur-sm">
      <h2 className="text-lg sm:text-xl text-white font-semibold mb-4">
        {username ? 'Change Username' : 'Set Username to Save Scores'}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={inputUsername}
          onChange={(e) => setInputUsername(e.target.value)}
          placeholder="Enter username"
          maxLength={20}
          className="w-full sm:flex-1 px-4 py-2 rounded bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors whitespace-nowrap"
        >
          {username ? 'Update' : 'Set Username'}
        </button>
      </form>
    </div>
  );
}