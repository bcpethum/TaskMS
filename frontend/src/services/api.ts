import { ApiResponse } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Force redirect to login page if unauthorized
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
      return {
        success: false,
        message: data.message || 'An error occurred during request',
        errors: data.errors,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Network error or backend server unavailable. Please check your backend connection.',
    };
  }
}
