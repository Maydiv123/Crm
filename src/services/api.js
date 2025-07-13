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
  getById: (id) => api.get(`/leads/${id}`),
  create: (leadData) => api.post('/leads', leadData),
  update: (id, leadData) => api.put(`/leads/${id}`, leadData),
  delete: (id) => api.delete(`/leads/${id}`),
  addNote: (id, noteData) => api.post(`/leads/${id}/notes`, noteData),
  getStats: () => api.get('/leads/stats/overview'),
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
  getAll: () => api.get('/tasks'),
  create: (taskData) => api.post('/tasks', taskData),
};

export default api; 