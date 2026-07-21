import { fetchApi } from './api';
import { Task, DashboardStats, TaskFormData, TaskFilters } from '../types/task';
import { ApiResponse } from '../types/auth';

export const taskService = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    return fetchApi<DashboardStats>('/tasks/stats');
  },

  async getTasks(filters?: Partial<TaskFilters>): Promise<ApiResponse<Task[]>> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);

    const queryString = params.toString();
    return fetchApi<Task[]>(`/tasks${queryString ? `?${queryString}` : ''}`);
  },

  async getTaskById(id: number): Promise<ApiResponse<Task>> {
    return fetchApi<Task>(`/tasks/${id}`);
  },

  async createTask(data: TaskFormData): Promise<ApiResponse<Task>> {
    return fetchApi<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateTask(id: number, data: TaskFormData): Promise<ApiResponse<Task>> {
    return fetchApi<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteTask(id: number): Promise<ApiResponse<null>> {
    return fetchApi<null>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};
