import { PriorityLevel } from '@/types/task';

const config: Record<PriorityLevel, { label: string; className: string }> = {
  High: {
    label: 'High',
    className: 'bg-rose-500/10 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 dark:border-rose-500/20',
  },
  Medium: {
    label: 'Medium',
    className: 'bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 dark:border-amber-500/20',
  },
  Low: {
    label: 'Low',
    className: 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 dark:border-emerald-500/20',
  },
};

export default function PriorityBadge({ priority }: { priority: PriorityLevel }) {
  const { label, className } = config[priority] ?? config.Low;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
