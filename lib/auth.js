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
});

// Add token to requests if available
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

// Auth service functions
export const auth = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error) {
      console.error('Auth error:', error);
      
      // Handle different types of errors
      let errorData = { message: 'Registration failed' };
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        errorData = { message: 'Cannot connect to server. Please make sure the backend is running on localhost:5001' };
      } else if (error.response) {
        errorData = error.response.data;
      } else if (error.message) {
        errorData = { message: error.message };
      }
      
      throw errorData;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error) {
      console.error('Auth error:', error);
      
      // Handle different types of errors
      let errorData = { message: 'Login failed' };
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        errorData = { message: 'Cannot connect to server. Please make sure the backend is running on localhost:5001' };
      } else if (error.response) {
        errorData = error.response.data;
      } else if (error.message) {
        errorData = { message: error.message };
      }
      
      throw errorData;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get user data' };
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/me', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to change password' };
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to process forgot password' };
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reset password' };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },

  // Get stored token
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  // Set token
  setToken: (token) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  // Clear token
  clearToken: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Export the api instance for other services
export default api;
