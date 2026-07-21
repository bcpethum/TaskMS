export type PriorityLevel = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type SortOption = 'newest' | 'oldest' | 'due_date';

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: PriorityLevel;
  status: TaskStatus;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: PriorityLevel | '';
  status: TaskStatus | '';
  due_date: string;
}

export interface TaskFilters {
  search: string;
  status: TaskStatus | '';
  priority: PriorityLevel | '';
  sortBy: SortOption;
}
