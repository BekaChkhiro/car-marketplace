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

// Store tokens
export const setStoredToken = (accessToken: string, refreshToken?: string): void => {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  } catch (error) {
    console.error('Error storing tokens:', error);
  }
};

// Get access token
export const getAccessToken = (): string | null => {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token && isTokenExpired(token)) {
      removeStoredToken();
      return null;
    }
    return token;
  } catch (error) {
    console.error('Error retrieving access token:', error);
    return null;
  }
};

// Get refresh token
export const getRefreshToken = (): string | null => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving refresh token:', error);
    return null;
  }
};

// Check if token exists
export const hasStoredToken = (): boolean => {
  const token = getAccessToken();
  return !!token && !isTokenExpired(token);
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
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;
  
  // Add a 60-second buffer to handle slight time differences
  const buffer = 60 * 1000; // 60 seconds in milliseconds
  return Date.now() >= (expiration - buffer);
};