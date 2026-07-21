'use client';

import { useEffect, useState } from 'react';
import { Task, TaskFormData, PriorityLevel, TaskStatus } from '@/types/task';
import { X, Loader2 } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  task?: Task | null;
  onClose: () => void;
  onSave: (data: TaskFormData) => Promise<void>;
}

const PRIORITIES: PriorityLevel[] = ['Low', 'Medium', 'High'];
const STATUSES: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];

const today = new Date().toISOString().split('T')[0];

const emptyForm: TaskFormData = {
  title: '',
  description: '',
  priority: '',
  status: '',
  due_date: '',
};

export default function TaskModal({ isOpen, mode, task, onClose, onSave }: TaskModalProps) {
  const [form, setForm] = useState<TaskFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<TaskFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && task) {
      setForm({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        due_date: task.due_date.split('T')[0],
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [mode, task, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Partial<TaskFormData> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.priority) newErrors.priority = 'Priority is required';
    if (!form.status) newErrors.status = 'Status is required';
    if (!form.due_date) {
      newErrors.due_date = 'Due date is required';
    } else if (form.due_date < today && form.status !== 'Completed') {
      newErrors.due_date = 'Due date cannot be earlier than today';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await onSave(form);
    setIsSubmitting(false);
  };

  const field = (key: keyof TaskFormData) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">
            {mode === 'create' ? '+ New Task' : 'Edit Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter task title..."
              {...field('title')}
              className={`w-full px-4 py-2.5 bg-slate-950/60 border ${
                errors.title ? 'border-rose-500/80' : 'border-slate-800 focus:border-sky-500'
              } rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all`}
            />
            {errors.title && <p className="mt-1.5 text-xs text-rose-400">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Description <span className="text-slate-600">(optional)</span>
            </label>
            <textarea
              placeholder="Add a description..."
              rows={3}
              {...field('description')}
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all resize-none"
            />
          </div>

          {/* Priority & Status - side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Priority <span className="text-rose-400">*</span>
              </label>
              <select
                {...field('priority')}
                className={`w-full px-4 py-2.5 bg-slate-950/60 border ${
                  errors.priority ? 'border-rose-500/80' : 'border-slate-800 focus:border-sky-500'
                } rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all appearance-none`}
              >
                <option value="">Select...</option>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              {errors.priority && <p className="mt-1.5 text-xs text-rose-400">{errors.priority}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Status <span className="text-rose-400">*</span>
              </label>
              <select
                {...field('status')}
                className={`w-full px-4 py-2.5 bg-slate-950/60 border ${
                  errors.status ? 'border-rose-500/80' : 'border-slate-800 focus:border-sky-500'
                } rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all appearance-none`}
              >
                <option value="">Select...</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.status && <p className="mt-1.5 text-xs text-rose-400">{errors.status}</p>}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Due Date <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              min={form.status === 'Completed' ? undefined : today}
              {...field('due_date')}
              className={`w-full px-4 py-2.5 bg-slate-950/60 border ${
                errors.due_date ? 'border-rose-500/80' : 'border-slate-800 focus:border-sky-500'
              } rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all [color-scheme:dark]`}
            />
            {errors.due_date && <p className="mt-1.5 text-xs text-rose-400">{errors.due_date}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                mode === 'create' ? 'Create Task' : 'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
