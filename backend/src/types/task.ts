export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export type PriorityLevel = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface ITask {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  priority: PriorityLevel;
  status: TaskStatus;
  due_date: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: PriorityLevel;
  status: TaskStatus;
  due_date: string;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {}

export interface TaskFilters {
  search?: string;
  status?: TaskStatus;
  priority?: PriorityLevel;
  sortBy?: 'newest' | 'oldest' | 'due_date';
}
