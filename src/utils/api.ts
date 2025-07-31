const API_BASE_URL = process.env.REACT_APP_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';

export const buildApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

export { API_BASE_URL };