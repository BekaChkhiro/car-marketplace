import api from '../config/axios';

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
    // Get CSRF token from the server
    const response = await api.get('/csrf-token', {
      headers: {
        // Explicitly exclude CSRF token from this request
        'X-CSRF-Token': null
      }
    });
    
    const csrfToken = response.data.csrfToken || generateToken();
    sessionStorage.setItem(CSRF_TOKEN_KEY, csrfToken);
    
    // Don't set it in default headers - let the interceptor handle it
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
    const response = await api.get('/csrf-token', {
      headers: {
        // Explicitly exclude CSRF token from this request
        'X-CSRF-Token': null
      }
    });
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