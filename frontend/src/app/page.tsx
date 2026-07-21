import React from 'react';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-8 text-center shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-sky-400">Task Management App</h1>
        <p className="text-slate-300 text-sm mb-6">
          Full-Stack Next.js & Node.js Express Task Management System
        </p>
        <div className="inline-block px-4 py-2 bg-slate-700 text-sky-300 rounded-lg text-xs font-mono">
          Initial Setup Ready
        </div>
      </div>
    </main>
  );
}
