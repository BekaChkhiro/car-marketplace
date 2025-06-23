import axios from 'axios';
import { getStoredToken, removeStoredToken } from '../utils/tokenStorage';
import authService from '../services/authService';

// Use production URL by default (render.com) and fallback to localhost for development
const BASE_URL = process.env.REACT_APP_API_URL || 'https://big-way-server.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const tokens = await authService.refreshToken();
        
        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, log out user
        removeStoredToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;