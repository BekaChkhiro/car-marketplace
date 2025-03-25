import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, removeStoredToken, isTokenExpired, getRefreshToken, setStoredToken } from '../utils/tokenStorage';
import { getCsrfToken, refreshCsrfToken } from '../utils/csrfProtection';
import { AuthResponse, Tokens } from '../types/auth.types';
import authService from '../services/authService';

// Define error response types
interface ApiErrorResponse {
  message?: string;
  error?: string;
  details?: any;
}

// Define public endpoints that don't require authentication
const publicEndpoints = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/google',
  '/auth/facebook',
  '/auth/refresh-token'
];

// Define endpoints that are public only for GET requests
const publicGetEndpoints = [
  '/transports',
  '/transports/',
  '/cars/brands',
  '/cars/categories'
];

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  withCredentials: true,
  maxContentLength: 100 * 1024 * 1024, // 100MB max
  maxBodyLength: 100 * 1024 * 1024, // 100MB max
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
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
      const refreshToken = getRefreshToken();

      if (accessToken) {
        // Check if token is expired and we have a refresh token
        if (isTokenExpired(accessToken) && refreshToken && !config.url?.includes('/auth/refresh-token')) {
          try {
            const response = await axios.post(
              `${config.baseURL}/auth/refresh-token`,
              { refreshToken },
              { withCredentials: true }
            );
            const newTokens = response.data.tokens;
            setStoredToken(newTokens.accessToken, newTokens.refreshToken);
            config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          } catch (error) {
            console.error('Token refresh failed during request:', error);
            removeStoredToken();
            throw error;
          }
        } else {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
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
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean; _retryCount?: number };
    
    // Enhanced error logging
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: originalRequest.url,
        method: originalRequest.method,
        headers: {
          ...originalRequest.headers,
          Authorization: originalRequest.headers?.Authorization ? '[REDACTED]' : undefined
        }
      });
    }

    if (!originalRequest._retryCount) {
      originalRequest._retryCount = 0;
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
            const refreshToken = getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await axios.post(
              `${originalRequest.baseURL}/auth/refresh-token`,
              { refreshToken },
              { withCredentials: true }
            );

            const newTokens = response.data.tokens;
            setStoredToken(newTokens.accessToken, newTokens.refreshToken);
            
            isRefreshing = false;
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            
            processQueue(null, newTokens.accessToken);
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
          
          // Implement exponential backoff for 500 errors
          const maxRetries = 3;
          if (originalRequest._retryCount < maxRetries) {
            originalRequest._retryCount++;
            const backoffDelay = Math.pow(2, originalRequest._retryCount) * 1000;
            
            console.log(`Retrying request (${originalRequest._retryCount}/${maxRetries}) after ${backoffDelay}ms`);
            
            return new Promise(resolve => setTimeout(resolve, backoffDelay))
              .then(() => api(originalRequest));
          }
          
          return Promise.reject(new Error(
            error.response.data?.message || 
            error.response.data?.error || 
            'Internal server error occurred. Please try again.'
          ));

        case 502:
        case 503:
        case 504:
          // Retry gateway/timeout errors with exponential backoff
          if (originalRequest._retryCount < 3) {
            originalRequest._retryCount++;
            const backoffDelay = Math.pow(2, originalRequest._retryCount) * 1000;
            return new Promise(resolve => setTimeout(resolve, backoffDelay))
              .then(() => api(originalRequest));
          }
          break;
      }

      const errorMessage = error.response.data?.message || 
                         error.response.data?.error || 
                         'An unexpected error occurred';
      return Promise.reject(new Error(errorMessage));
    }

    // Handle network errors with retry
    if (error.message === 'Network Error' && originalRequest._retryCount < 2) {
      originalRequest._retryCount++;
      return new Promise(resolve => setTimeout(resolve, 1000))
        .then(() => api(originalRequest));
    }

    return Promise.reject(error);
  }
);

export default api;