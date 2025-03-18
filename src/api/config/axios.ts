import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, removeStoredToken, isTokenExpired } from '../utils/tokenStorage';
import { getCsrfToken, refreshCsrfToken } from '../utils/csrfProtection';
import { AuthResponse } from '../types/auth.types';

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
  '/auth/facebook'
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
  maxBodyLength: 100 * 1024 * 1024 // 100MB max
});

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
      // Check for auth token only for protected endpoints
      const authToken = getAccessToken();
      if (!authToken) {
        return Promise.reject(new Error('No authentication token found'));
      }

      // Check if token is expired
      if (isTokenExpired(authToken)) {
        removeStoredToken();
        window.dispatchEvent(new CustomEvent('auth:required', { 
          detail: { message: 'Session expired. Please log in again.' }
        }));
        return Promise.reject(new Error('Authentication token expired'));
      }

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
      // Log the error response for debugging
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: originalRequest.url
      });

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
            if (originalRequest.headers && newToken) {
              originalRequest.headers['X-CSRF-Token'] = newToken;
              return api(originalRequest);
            }
          }
          break;

        case 500:
          console.error('Server error:', error.response.data);
          return Promise.reject(new Error(error.response.data?.message || 'Internal server error occurred'));
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