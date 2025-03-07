import axios from 'axios';
import api from '../config/axios';

// Base axios instance for CSRF operations (without interceptors)
const csrfApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

// CSRF token storage key
const CSRF_TOKEN_KEY = 'csrf_token';

// Generate a random token
const generateToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const getCsrfToken = (): string => {
  let token = sessionStorage.getItem(CSRF_TOKEN_KEY);
  if (!token) {
    token = generateToken();
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  }
  return token;
};

export const clearCsrfToken = (): void => {
  sessionStorage.removeItem(CSRF_TOKEN_KEY);
};

export const refreshCsrfToken = (): string => {
  const token = generateToken();
  sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  return token;
};

export const setupCSRFProtection = async (): Promise<void> => {
  try {
    // Get CSRF token from the server using the separate instance
    const response = await csrfApi.get('/csrf-token');
    const csrfToken = response.data.csrfToken || generateToken();
    sessionStorage.setItem(CSRF_TOKEN_KEY, csrfToken);
  } catch (error) {
    console.error('Failed to setup CSRF protection:', error);
    // Generate a fallback token if server request fails
    const fallbackToken = generateToken();
    sessionStorage.setItem(CSRF_TOKEN_KEY, fallbackToken);
  }
};

// Call this when making forms or important mutations
export const getCSRFToken = async (): Promise<string | null> => {
  try {
    // Use the separate instance for token fetching
    const response = await csrfApi.get('/csrf-token');
    const token = response.data.csrfToken;
    if (token) {
      sessionStorage.setItem(CSRF_TOKEN_KEY, token);
    }
    return token;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    return getCsrfToken(); // Fall back to stored or generated token
  }
};