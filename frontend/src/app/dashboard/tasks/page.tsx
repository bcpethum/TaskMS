'use client';

import { ListTodo } from 'lucide-react';

export default function TasksPage() {
  return (
    <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
        <ListTodo className="w-6 h-6 text-sky-400" />
      </div>
      <h1 className="text-xl font-bold text-white mb-2">Task Management</h1>
      <p className="text-slate-400 text-sm max-w-sm">
        Full task CRUD, search, filters and sorting coming in Phase 4!
      </p>
    </div>
  );
}
