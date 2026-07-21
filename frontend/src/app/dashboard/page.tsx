'use client';

import { useEffect, useState } from 'react';
import { taskService } from '../../services/taskService';
import { DashboardStats } from '../../types/task';
import {
  ClipboardList,
  Clock,
  Loader,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  RefreshCw,
} from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  isLoading: boolean;
}

function StatCard({ label, value, icon: Icon, color, bgColor, borderColor, isLoading }: StatCardProps) {
  return (
    <div className={`relative bg-slate-900 border ${borderColor} rounded-2xl p-6 flex items-start gap-4 overflow-hidden transition-all hover:scale-[1.01] hover:shadow-lg`}>
      {/* Background Glow */}
      <div className={`absolute -top-6 -right-6 w-28 h-28 ${bgColor} rounded-full blur-2xl opacity-30 pointer-events-none`} />

      <div className={`shrink-0 w-12 h-12 rounded-xl ${bgColor} border ${borderColor} flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>

      <div>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
        {isLoading ? (
          <div className="h-8 w-16 bg-slate-800 rounded-lg animate-pulse" />
        ) : (
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        )}
      </div>
    </div>
  );
}

const statCardConfig = [
  {
    key: 'total' as keyof DashboardStats,
    label: 'Total Tasks',
    icon: ClipboardList,
    color: 'text-sky-400',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/20',
  },
  {
    key: 'pending' as keyof DashboardStats,
    label: 'Pending',
    icon: Clock,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
  },
  {
    key: 'inProgress' as keyof DashboardStats,
    label: 'In Progress',
    icon: Loader,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  {
    key: 'completed' as keyof DashboardStats,
    label: 'Completed',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
  },
  {
    key: 'overdue' as keyof DashboardStats,
    label: 'Overdue',
    icon: AlertTriangle,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/20',
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setIsLoading(true);
    setError('');
    const res = await taskService.getStats();
    if (res.success && res.data) {
      setStats(res.data);
    } else {
      setError(res.message || 'Failed to load dashboard stats');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const completionRate =
    stats && stats.total > 0
      ? Math.round((stats.completed / stats.total) * 100)
      : 0;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-sky-400" />
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
          </div>
          <p className="text-slate-400 text-sm">Overview of your task progress</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={isLoading}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-sky-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-2 rounded-xl transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-rose-300 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error} &mdash; Make sure your backend server is running on{' '}
          <code className="text-rose-200 font-mono text-xs">http://localhost:5000</code>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {statCardConfig.map((config) => (
          <StatCard
            key={config.key}
            label={config.label}
            value={stats?.[config.key] ?? 0}
            icon={config.icon}
            color={config.color}
            bgColor={config.bgColor}
            borderColor={config.borderColor}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Completion Progress Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white font-semibold text-sm">Overall Completion Rate</p>
            <p className="text-slate-500 text-xs mt-0.5">
              {stats?.completed ?? 0} of {stats?.total ?? 0} tasks completed
            </p>
          </div>
          <span className="text-2xl font-bold text-emerald-400">{completionRate}%</span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full transition-all duration-700"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        {stats && stats.overdue > 0 && (
          <p className="mt-3 text-xs text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            You have <strong>{stats.overdue}</strong> overdue task{stats.overdue > 1 ? 's' : ''} — check your task list!
          </p>
        )}
      </div>
    </div>
  );
}
