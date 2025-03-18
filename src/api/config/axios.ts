import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, removeStoredToken, isTokenExpired, getRefreshToken, setStoredToken } from '../utils/tokenStorage';
import { getCsrfToken, refreshCsrfToken } from '../utils/csrfProtection';
import { AuthResponse, Tokens } from '../types/auth.types';
import authService from '../services/authService';

// Define error response types
interface ApiErrorResponse {
  message?: string;
  error?: string;
}

// Define public endpoints that don't require authentication
const publicEndpoints = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/google',
  '/auth/facebook',
  '/auth/refresh-token'  // Add refresh token endpoint
];

// Define endpoints that are public only for GET requests
const publicGetEndpoints = [
  '/transports',
  '/transports/'
];

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  maxContentLength: 100 * 1024 * 1024, // 100MB max
  maxBodyLength: 100 * 1024 * 1024, // 100MB max
  timeout: 30000 // 30 second timeout
});

// Track if we're currently refreshing the token
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: any) => void; }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // For multipart form data, let the browser handle the Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    // Only add CSRF token for non-GET requests that are not preflight
    if (config.method !== 'get' && config.method !== 'options') {
      const token = getCsrfToken();
      if (token) {
        config.headers['X-CSRF-Token'] = token;
      }
    }

    // Check if the endpoint requires authentication
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url?.includes(endpoint)
    );
    const isPublicGetEndpoint = config.method === 'get' && publicGetEndpoints.some(endpoint =>
      config.url?.includes(endpoint)
    );

    if (!isPublicEndpoint && !isPublicGetEndpoint) {
      const accessToken = getAccessToken();

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    const newCsrfToken = response.headers['x-csrf-token'];
    if (newCsrfToken) {
      refreshCsrfToken();
    }
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Log error details for debugging
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: originalRequest.url
      });
    }

    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 401: {
          if (originalRequest._retry || originalRequest.url?.includes('/auth/refresh-token')) {
            processQueue(error);
            removeStoredToken();
            window.dispatchEvent(new CustomEvent('auth:required', { 
              detail: { message: 'Session expired. Please log in again.' }
            }));
            return Promise.reject(error);
          }

          originalRequest._retry = true;

          if (isRefreshing) {
            try {
              const token = await new Promise<string>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              });
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            } catch (err) {
              return Promise.reject(err);
            }
          }

          isRefreshing = true;

          try {
            const tokens = await authService.refreshToken();
            isRefreshing = false;
            
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
            
            processQueue(null, tokens.accessToken);
            return api(originalRequest);
          } catch (refreshError) {
            isRefreshing = false;
            processQueue(refreshError);
            removeStoredToken();
            
            window.dispatchEvent(new CustomEvent('auth:required', { 
              detail: { message: 'Session expired. Please log in again.' }
            }));
            
            return Promise.reject(refreshError);
          }
        }
        
        case 403:
          if (error.response.data?.message?.includes('CSRF')) {
            const newToken = refreshCsrfToken();
            if (originalRequest.headers && newToken) {
              originalRequest.headers['X-CSRF-Token'] = newToken;
              return api(originalRequest);
            }
          }
          break;

        case 500:
          console.error('Server error:', error.response.data);
          // Add retry logic for 500 errors
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            return new Promise(resolve => setTimeout(resolve, 1000)).then(() => api(originalRequest));
          }
          return Promise.reject(new Error(error.response.data?.message || 'Internal server error occurred. Please try again.'));
      }

      const errorMessage = error.response.data?.message || error.response.data?.error || 'An error occurred';
      return Promise.reject(new Error(errorMessage));
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('Network error occurred:', error);
      return Promise.reject(new Error('Network error. Please check your connection and try again.'));
    }

    return Promise.reject(error);
  }
);

export default api;