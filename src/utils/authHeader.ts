/**
 * Type definition for authorization headers
 */
type AuthHeaderType = {
  Authorization?: string;
};

/**
 * Utility function to get authorization headers for authenticated API requests
 * @returns Authorization header with JWT token if logged in
 */
export const authHeader = (): AuthHeaderType => {
  // Get the token from local storage
  const token = localStorage.getItem('token');
  
  // If token exists, return it in the authorization header
  if (token) {
    return { 
      Authorization: `Bearer ${token}` 
    };
  }
  
  // Return empty object if no token is found
  return {};
};
