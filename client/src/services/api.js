import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartwealth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Avoid redirect loops if checking /api/auth/me
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        localStorage.removeItem('smartwealth_token');
        localStorage.removeItem('smartwealth_user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Unified API Services
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const expenseApi = {
  getExpenses: (params) => api.get('/expenses', { params }),
  createExpense: (data) => api.post('/expenses', data),
  updateExpense: (id, data) => api.put(`/expenses/${id}`, data),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
};

export const incomeApi = {
  getIncome: (params) => api.get('/income', { params }),
  createIncome: (data) => api.post('/income', data),
  updateIncome: (id, data) => api.put(`/income/${id}`, data),
  deleteIncome: (id) => api.delete(`/income/${id}`),
};

export const budgetApi = {
  getBudgets: (params) => api.get('/budgets', { params }),
  createBudget: (data) => api.post('/budgets', data),
  updateBudget: (id, data) => api.put(`/budgets/${id}`, data),
  deleteBudget: (id) => api.delete(`/budgets/${id}`),
};

export const goalApi = {
  getGoals: () => api.get('/goals'),
  createGoal: (data) => api.post('/goals', data),
  updateGoal: (id, data) => api.put(`/goals/${id}`, data),
  addFunds: (id, amount) => api.post(`/goals/${id}/add-funds`, { amount }),
  deleteGoal: (id) => api.delete(`/goals/${id}`),
};

export const splitApi = {
  getGroups: () => api.get('/splitter'),
  getGroupById: (id) => api.get(`/splitter/${id}`),
  createGroup: (data) => api.post('/splitter', data),
  addExpense: (groupId, data) => api.post(`/splitter/${groupId}/expenses`, data),
  deleteExpense: (groupId, expenseId) => api.delete(`/splitter/${groupId}/expenses/${expenseId}`),
  toggleSettlement: (groupId, data) => api.post(`/splitter/${groupId}/settle`, data),
  deleteGroup: (groupId) => api.delete(`/splitter/${groupId}`),
};

export const dashboardApi = {
  getDashboardData: () => api.get('/dashboard'),
};

export const analyticsApi = {
  getAnalyticsData: (period) => api.get('/analytics', { params: { period } }),
};

export const insightApi = {
  getInsights: () => api.get('/insights'),
};

export const seedApi = {
  seedDemoData: () => api.post('/seed'),
  clearData: () => api.post('/seed/clear'),
};

export default api;
