import { API_BASE_URL } from "../services/api";

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('blob:')) return path;
  
  // Handle absolute paths that might still be in the DB or state
  if (path.includes(':') && path.includes('uploads')) {
    const parts = path.split('uploads');
    path = 'uploads' + parts[parts.length - 1].replace(/\\/g, '/');
  }
  
  // Remove /api from the end of API_BASE_URL if present
  const baseUrl = API_BASE_URL.replace(/\/api$/, '');
  
  // Ensure path starts with / if it doesn't
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${normalizedPath}`;
};
