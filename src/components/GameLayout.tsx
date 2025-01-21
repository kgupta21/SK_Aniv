import React from 'react';

interface GameLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function GameLayout({ title, children }: GameLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white text-center mb-8">{title}</h1>
      <div className="flex justify-center">
        {children}
      </div>
    </div>
  );
}