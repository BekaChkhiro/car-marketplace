// Simple encryption key (in production, this should be more secure and environment-specific)
const ENCRYPTION_KEY = 'big-way-secret-key';
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Encrypt data
const encrypt = (text: string): string => {
  try {
    const textToChars = (text: string) =>
      text.split('').map(c => c.charCodeAt(0));
    const byteHex = (n: number) =>
      ('0' + Number(n).toString(16)).substr(-2);
    const encryptChar = (charCode: number, keyChar: number) =>
      byteHex(charCode ^ keyChar);
    const textChars = textToChars(text);
    const keyChars = textToChars(ENCRYPTION_KEY);
    
    return textChars
      .map((char, index) => encryptChar(char, keyChars[index % keyChars.length]))
      .join('');
  } catch (error) {
    console.error('Encryption error:', error);
    return text;
  }
};

// Decrypt data
const decrypt = (encoded: string): string => {
  try {
    const textToChars = (text: string) => text.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = (code: number, keyChar: number) => code ^ keyChar;
    
    const keyChars = textToChars(ENCRYPTION_KEY);
    const encodedChars = encoded.match(/.{1,2}/g)?.map(hex => parseInt(hex, 16)) || [];
    
    return encodedChars
      .map((encodedChar, index) => 
        String.fromCharCode(applySaltToChar(encodedChar, keyChars[index % keyChars.length]))
      )
      .join('');
  } catch (error) {
    console.error('Decryption error:', error);
    return encoded;
  }
};

// Store tokens with expiry check
export const setStoredToken = (accessToken: string, refreshToken?: string): void => {
  try {
    if (!accessToken || isTokenInvalid(accessToken)) {
      throw new Error('Invalid access token');
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, encrypt(accessToken));
    
    if (refreshToken) {
      if (isTokenInvalid(refreshToken)) {
        throw new Error('Invalid refresh token');
      }
      localStorage.setItem(REFRESH_TOKEN_KEY, encrypt(refreshToken));
    }
  } catch (error) {
    console.error('Error storing tokens:', error);
    removeStoredToken();
  }
};

// Get access token with validation
export const getAccessToken = (): string | null => {
  try {
    const encryptedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!encryptedToken) return null;

    const token = decrypt(encryptedToken);
    if (isTokenInvalid(token)) {
      removeStoredToken();
      return null;
    }

    return token;
  } catch (error) {
    console.error('Error retrieving access token:', error);
    return null;
  }
};

// Get refresh token with validation
export const getRefreshToken = (): string | null => {
  try {
    const encryptedToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!encryptedToken) return null;

    const token = decrypt(encryptedToken);
    if (isTokenInvalid(token)) {
      removeStoredToken();
      return null;
    }

    return token;
  } catch (error) {
    console.error('Error retrieving refresh token:', error);
    return null;
  }
};

// Check if token exists and is valid
export const hasStoredToken = (): boolean => {
  const token = getAccessToken();
  const refreshToken = getRefreshToken();
  
  // Valid if either:
  // 1. Access token exists and is not expired
  // 2. No access token but valid refresh token exists
  return (!!token && !isTokenExpired(token)) || (!!refreshToken && !isTokenExpired(refreshToken));
};

// Remove stored tokens
export const removeStoredToken = (): void => {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error removing tokens:', error);
  }
};

// Basic token validation
const isTokenInvalid = (token: string): boolean => {
  try {
    // Check basic JWT format (3 parts separated by dots)
    if (!token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/)) {
      return true;
    }

    const payload = parseJwt(token);
    return !payload || !payload.exp;
  } catch {
    return true;
  }
};

// Parse JWT token
const parseJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

// Get token expiration
export const getTokenExpiration = (token: string): number | null => {
  try {
    const payload = parseJwt(token);
    return payload.exp ? payload.exp * 1000 : null; // Convert to milliseconds
  } catch (error) {
    console.error('Error parsing token expiration:', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  // If token is invalid, consider it expired
  if (isTokenInvalid(token)) {
    return true;
  }

  const expiration = getTokenExpiration(token);
  if (!expiration) return true;
  
  // Add a 60-second buffer to handle slight time differences
  const buffer = 60 * 1000; // 60 seconds in milliseconds
  return Date.now() >= (expiration - buffer);
};