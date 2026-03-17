import axios from 'axios';

// Dynamic API URL based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? '/api'  // Vercel serverless routes
    : 'http://localhost:5001/api'); // Local development

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for serverless
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        error.message = 'Request timeout. Please try again.';
      } else {
        error.message = 'Network error. Please check your connection.';
      }
      return Promise.reject(error);
    }

    // Handle server errors
    const { status, data } = error.response;
    
    if (status === 401) {
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      error.message = 'Session expired. Please login again.';
    } else if (status === 429) {
      error.message = 'Too many requests. Please try again later.';
    } else if (status >= 500) {
      error.message = 'Server error. Please try again later.';
    } else if (data?.message) {
      error.message = data.message;
    }

    return Promise.reject(error);
  }
);

// API service functions
export const apiClient = {
  // User endpoints
  auth: {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getCurrentUser: () => api.get('/auth/me'),
    updateProfile: (profileData) => api.put('/auth/me', profileData),
    logout: () => api.post('/auth/logout'),
    changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  },
  
  // User management
  users: {
    getLeaderboard: (params = {}) => {
      const searchParams = new URLSearchParams(params).toString();
      return api.get(`/users/leaderboard?${searchParams}`);
    },
    getProfile: (username) => api.get(`/users/profile/${username}`),
  },
  
  // Admin endpoints
  admin: {
    getStats: () => api.get('/admin/stats'),
    getUsers: (params = {}) => {
      const searchParams = new URLSearchParams(params).toString();
      return api.get(`/admin/users?${searchParams}`);
    },
    getUser: (id) => api.get(`/admin/users/${id}`),
    updateUser: (id, updateData) => api.put(`/admin/users/${id}`, updateData),
    deactivateUser: (id) => api.delete(`/admin/users/${id}`),
  },
  
  // Router endpoints
  router: {
    getStatus: (routerIP) => {
      const params = routerIP ? `?routerIP=${routerIP}` : '';
      return api.get(`/router/status${params}`);
    },
    getDevices: (routerIP) => {
      const params = routerIP ? `?routerIP=${routerIP}` : '';
      return api.get(`/router/devices${params}`);
    },
    reboot: (routerIP) => {
      const params = routerIP ? `?routerIP=${routerIP}` : '';
      return api.post(`/router/reboot${params}`);
    },
  },
  
  // Utility methods
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },
  
  clearToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  },
  
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },
  
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }
};

export default api;
