'use client';

import { useEffect, useState, useCallback } from 'react';
import { Task, TaskFormData, TaskFilters, TaskStatus, PriorityLevel, SortOption } from '@/types/task';
import { taskService } from '@/services/taskService';
import TaskModal from '@/components/tasks/TaskModal';
import DeleteConfirmModal from '@/components/tasks/DeleteConfirmModal';
import PriorityBadge from '@/components/tasks/PriorityBadge';
import StatusBadge from '@/components/tasks/StatusBadge';
import {
  Plus, Search, SlidersHorizontal, Pencil, Trash2,
  ListTodo, CalendarDays, ChevronDown, X, AlertTriangle, RefreshCw,
} from 'lucide-react';

const STATUS_OPTIONS: (TaskStatus | '')[] = ['', 'Pending', 'In Progress', 'Completed'];
const PRIORITY_OPTIONS: (PriorityLevel | '')[] = ['', 'Low', 'Medium', 'High'];
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'due_date_asc', label: 'Due Date (Earliest)' },
  { value: 'due_date_desc', label: 'Due Date (Latest)' },
];

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const isOverdue = (task: Task) =>
  task.status !== 'Completed' && new Date(task.due_date) < new Date(new Date().setHours(0, 0, 0, 0));

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    status: '',
    priority: '',
    sortBy: 'newest',
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const fetchTasks = useCallback(async (currentFilters: TaskFilters) => {
    setIsLoading(true);
    setError('');
    const res = await taskService.getTasks(currentFilters);
    if (res.success && res.data) {
      setTasks(res.data);
    } else {
      setError(res.message || 'Failed to load tasks');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks(filters);
  }, [filters, fetchTasks]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ─── Handlers ───────────────────────────────────────────────
  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedTask(null);
    setShowModal(true);
  };

  const handleOpenEdit = (task: Task) => {
    setModalMode('edit');
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleOpenDelete = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleSaveTask = async (data: TaskFormData) => {
    let res;
    if (modalMode === 'create') {
      res = await taskService.createTask(data);
    } else if (selectedTask) {
      res = await taskService.updateTask(selectedTask.id, data);
    } else return;

    if (res?.success) {
      setShowModal(false);
      fetchTasks(filters);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    const res = await taskService.deleteTask(taskToDelete.id);
    if (res.success) {
      setShowDeleteModal(false);
      setTaskToDelete(null);
      fetchTasks(filters);
    }
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters({ search: '', status: '', priority: '', sortBy: 'newest' });
  };

  const hasActiveFilters = filters.search || filters.status || filters.priority || filters.sortBy !== 'newest';

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <ListTodo className="w-5 h-5 text-sky-400" />
            <h1 className="text-xl font-bold text-white">Tasks</h1>
            {!isLoading && (
              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                {tasks.length}
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm">Manage and track your tasks</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-sky-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Search + Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-5 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tasks by title..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" />

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as TaskStatus | '' }))}
              className="appearance-none pl-3 pr-7 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium rounded-lg focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.filter(Boolean).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              value={filters.priority}
              onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value as PriorityLevel | '' }))}
              className="appearance-none pl-3 pr-7 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium rounded-lg focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="">All Priorities</option>
              {PRIORITY_OPTIONS.filter(Boolean).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as SortOption }))}
              className="appearance-none pl-3 pr-7 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium rounded-lg focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 ml-1 transition-colors"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}

          <button
            onClick={() => fetchTasks(filters)}
            className="ml-auto flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-400 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-rose-300 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Task List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-4 bg-slate-800 rounded w-1/3" />
                <div className="h-4 bg-slate-800 rounded w-16" />
                <div className="h-4 bg-slate-800 rounded w-20 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 mb-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
            <ListTodo className="w-6 h-6 text-slate-600" />
          </div>
          <h3 className="text-white font-semibold mb-1">No tasks found</h3>
          <p className="text-slate-500 text-sm max-w-xs mb-5">
            {hasActiveFilters ? 'Try adjusting your search or filters.' : 'Get started by creating your first task!'}
          </p>
          {hasActiveFilters ? (
            <button onClick={clearFilters} className="text-sky-400 text-sm hover:underline">
              Clear filters
            </button>
          ) : (
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/20 text-sm font-medium rounded-xl transition-all"
            >
              + Create Task
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tasks.map((task) => (
                  <tr key={task.id} className="group hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className={`font-medium text-sm ${isOverdue(task) ? 'text-rose-300' : 'text-white'}`}>
                          {task.title}
                          {isOverdue(task) && (
                            <span className="ml-2 text-xs text-rose-400 font-normal">overdue</span>
                          )}
                        </p>
                        {task.description && (
                          <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{task.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className={`flex items-center gap-1.5 text-xs ${isOverdue(task) ? 'text-rose-400' : 'text-slate-400'}`}>
                        <CalendarDays className="w-3.5 h-3.5" />
                        {formatDate(task.due_date)}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(task)}
                          className="p-2 text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-all"
                          title="Edit task"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(task)}
                          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-slate-900 border ${isOverdue(task) ? 'border-rose-500/30' : 'border-slate-800'} rounded-xl p-4`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className={`font-semibold text-sm leading-snug ${isOverdue(task) ? 'text-rose-300' : 'text-white'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(task)}
                      className="p-1.5 text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(task)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {task.description && (
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                  <span className={`flex items-center gap-1 text-xs ml-auto ${isOverdue(task) ? 'text-rose-400' : 'text-slate-500'}`}>
                    <CalendarDays className="w-3 h-3" />
                    {formatDate(task.due_date)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      <TaskModal
        isOpen={showModal}
        mode={modalMode}
        task={selectedTask}
        onClose={() => setShowModal(false)}
        onSave={handleSaveTask}
      />
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        task={taskToDelete}
        onClose={() => { setShowDeleteModal(false); setTaskToDelete(null); }}
        onConfirm={handleDeleteTask}
      />
    </div>
  );
}
