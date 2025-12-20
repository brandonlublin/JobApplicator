// API configuration
// In production, use relative URLs since frontend and backend are on the same server
// In development, use the environment variable or default to localhost
const getApiBaseUrl = (): string => {
  if (import.meta.env.PROD) {
    // Production: use relative URL (same origin)
    return '/api';
  }
  // Development: use env var or localhost
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
};

export const API_BASE_URL = getApiBaseUrl();

