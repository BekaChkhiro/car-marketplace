import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, removeStoredToken } from '../utils/tokenStorage';
import { getCsrfToken, refreshCsrfToken } from '../utils/csrfProtection';
import { AuthResponse } from '../types/auth.types';

// Define error response types
interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Only add CSRF token for non-GET requests that are not preflight
    if (config.method !== 'get' && config.method !== 'options') {
      const token = getCsrfToken();
      if (token) {
        config.headers['X-CSRF-Token'] = token;
      }
    }

    const authToken = getAccessToken();
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Check for new CSRF token in response headers
    const newCsrfToken = response.headers['x-csrf-token'];
    if (newCsrfToken) {
      refreshCsrfToken();
    }
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Clear auth on 401 Unauthorized
          removeStoredToken();
          window.dispatchEvent(new CustomEvent('auth:required', { 
            detail: { message: 'Please log in to continue' }
          }));
          break;
        
        case 403:
          // Handle CSRF token validation failure
          if (error.response.data?.message?.includes('CSRF')) {
            const newToken = refreshCsrfToken();
            if (originalRequest.headers) {
              originalRequest.headers['X-CSRF-Token'] = newToken;
              return api(originalRequest);
            }
          }
          break;
      }

      // Convert error response to a more friendly format
      const errorMessage = error.response.data?.message || error.response.data?.error || 'An error occurred';
      return Promise.reject(new Error(errorMessage));
    }

    // Network errors
    if (error.message === 'Network Error') {
      console.error('Network error occurred:', error);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    return Promise.reject(error);
  }
);

export default api;