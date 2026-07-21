import { TaskStatus } from '@/types/task';

const config: Record<TaskStatus, { label: string; className: string }> = {
  Pending: {
    label: 'Pending',
    className: 'bg-slate-700/50 text-slate-300 border border-slate-600/50',
  },
  'In Progress': {
    label: 'In Progress',
    className: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  },
  Completed: {
    label: 'Completed',
    className: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  },
};

export default function StatusBadge({ status }: { status: TaskStatus }) {
  const { label, className } = config[status] ?? config.Pending;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
