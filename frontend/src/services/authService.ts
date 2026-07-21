import { fetchApi } from './api';
import { AuthResponse, ApiResponse, User } from '../types/auth';

export const authService = {
  async login(email: string, password?: string): Promise<ApiResponse<AuthResponse>> {
    return fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getMe(): Promise<ApiResponse<{ user: User }>> {
    return fetchApi<{ user: User }>('/auth/me', {
      method: 'GET',
    });
  },
};
