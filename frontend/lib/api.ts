import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { full_name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Expenses API
export const expensesAPI = {
  getAll: (params?: { category?: string; startDate?: string; endDate?: string; limit?: number }) =>
    api.get('/expenses', { params }),
  getById: (id: number) => api.get(`/expenses/${id}`),
  create: (data: { category: string; amount: number; date: string; description?: string }) =>
    api.post('/expenses', data),
  update: (id: number, data: { category: string; amount: number; date: string; description?: string }) =>
    api.put(`/expenses/${id}`, data),
  delete: (id: number) => api.delete(`/expenses/${id}`),
  getStats: (params?: { month?: number; year?: number }) =>
    api.get('/expenses/stats/summary', { params }),
};

// Budget API
export const budgetAPI = {
  get: () => api.get('/budget'),
  set: (monthly_budget: number) => api.post('/budget', { monthly_budget }),
  getIncome: () => api.get('/budget/income'),
  addIncome: (data: { amount: number; source?: string; date: string }) =>
    api.post('/budget/income', data),
};

// AI API
export const aiAPI = {
  analyze: (message: string) => api.post('/ai/analyze', { message }),
};

// Chat API
export const chatAPI = {
  getHistory: (limit?: number) => api.get('/chat/history', { params: { limit } }),
  clearHistory: () => api.delete('/chat/history'),
};

export default api;

