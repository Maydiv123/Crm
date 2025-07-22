import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

// Leads API
export const leadsAPI = {
  getAll: (params) => api.get('/leads', { params }),
  getAllLeads: (params) => api.get('/leads/all', { params }), // New endpoint for all leads
  getById: (id) => api.get(`/leads/${id}`),
  create: (leadData) => api.post('/leads', leadData),
  update: (id, leadData) => api.put(`/leads/${id}`, leadData),
  delete: (id) => api.delete(`/leads/${id}`),
  addNote: (id, noteData) => api.post(`/leads/${id}/notes`, noteData),
  getStats: () => api.get('/leads/stats/overview'),
  getWinLossStats: () => api.get('/leads/stats/win-loss'),
  updateStage: (id, stage) => api.patch(`/leads/${id}/stage`, { stage }),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

// Pipeline API
export const pipelineAPI = {
  get: () => api.get('/pipeline'),
  save: (columns) => api.post('/pipeline', { columns }),
  getAll: () => api.get('/pipeline/all'),
  create: (name, stages) => api.post('/pipeline/all', { name, stages }),
  rename: (id, name) => api.put(`/pipeline/${id}`, { name }),
  delete: (id) => api.delete(`/pipeline/${id}`),
};

// Tasks API
export const tasksAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getAllTasks: (params) => api.get('/tasks/all', { params }), // New endpoint for all tasks
  getById: (id) => api.get(`/tasks/${id}`),
  create: (taskData) => api.post('/tasks', taskData),
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// Activity Logs API
export const activityLogsAPI = {
  getAll: (params) => api.get('/activity-logs', { params }),
  getById: (id) => api.get(`/activity-logs/${id}`),
  create: (activityData) => api.post('/activity-logs', activityData),
  delete: (id) => api.delete(`/activity-logs/${id}`),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAdvertisements: () => api.get('/admin/advertisements'),
  createAdvertisement: (data) => api.post('/admin/advertisements', data),
  updateAdvertisement: (id, data) => api.put(`/admin/advertisements/${id}`, data),
  deleteAdvertisement: (id) => api.delete(`/admin/advertisements/${id}`),
  getPackages: () => api.get('/admin/packages'),
  createPackage: (data) => api.post('/admin/packages', data),
  updatePackage: (id, data) => api.put(`/admin/packages/${id}`, data),
  getUsers: () => api.get('/admin/users'),
  getUserDetails: (id) => api.get(`/admin/users/${id}`),
  getPermissions: () => api.get('/admin/permissions'),
  updateUserPermissions: (id, permissions) => api.put(`/admin/users/${id}/permissions`, { permissions }),
  getActivityLogs: () => api.get('/admin/activity-logs'),
  getMonthlyAnalytics: () => api.get('/admin/analytics/monthly'),
};

export default api; 