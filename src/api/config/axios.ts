import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import { getAccessToken, removeStoredToken, isTokenExpired, getRefreshToken, setStoredToken } from '../utils/tokenStorage';
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
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/google',
  '/api/auth/facebook',
  '/api/auth/refresh-token'
];

// Define endpoints that are public only for GET requests
const publicGetEndpoints = [
  '/api/transports',
  '/api/transports/',
  '/api/cars/brands',
  '/api/cars/categories'
];

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
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
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Helper function to check if a URL matches an endpoint
const isEndpointMatch = (url: string | undefined, endpoint: string): boolean => {
  if (!url) return false;
  const urlPath = url.split('?')[0]; // Remove query parameters
  return urlPath === endpoint;
};

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // For multipart form data, let the browser handle the Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    const isPublicEndpoint = publicEndpoints.some(endpoint =>
      isEndpointMatch(config.url, endpoint)
    );
    const isPublicGetEndpoint = config.method === 'get' && publicGetEndpoints.some(endpoint =>
      isEndpointMatch(config.url, endpoint)
    );

    if (!isPublicEndpoint && !isPublicGetEndpoint) {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (accessToken) {
        // Check if token is expired and we have a refresh token
        if (isTokenExpired(accessToken) && refreshToken && !isEndpointMatch(config.url, '/api/auth/refresh-token')) {
          try {
            const response = await axios.post(
              `${config.baseURL}/api/auth/refresh-token`,
              { refreshToken },
              { withCredentials: true }
            );
            setStoredToken(response.data.token, response.data.refreshToken);
            if (!config.headers) {
              // @ts-ignore - ახალი axios-ის ვერსიებში ტიპები შეიცვალა
              config.headers = {};
            }
            // @ts-ignore - ახალი axios-ის ვერსიებში ტიპები შეიცვალა
            config.headers['Authorization'] = `Bearer ${response.data.token}`;
          } catch (error) {
            console.error('Token refresh failed during request:', error);
            removeStoredToken();
            throw error;
          }
        } else {
          if (!config.headers) {
            // @ts-ignore - ახალი axios-ის ვერსიებში ტიპები შეიცვალა
            config.headers = {};
          }
          // @ts-ignore - ახალი axios-ის ვერსიებში ტიპები შეიცვალა
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
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
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('API Request Error (No Response):', error.request);
    } else {
      console.error('API Error:', error.message);
    }

    // Initialize retry count if not present
    if (typeof originalRequest._retryCount === 'undefined') {
      originalRequest._retryCount = 0;
    }

    // Handle 401 errors (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
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

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          `${originalRequest.baseURL}/api/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );
        setStoredToken(response.data.token, response.data.refreshToken);
        
        isRefreshing = false;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
        processQueue(null, response.data.token);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        removeStoredToken();
        return Promise.reject(refreshError);
      }
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