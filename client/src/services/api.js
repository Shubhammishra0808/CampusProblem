import axios from 'axios';
import { handleMockRequest } from './mockBackend';

// Check if running on GitHub Pages or static hosting without a custom API URL
const isStaticHost = typeof window !== 'undefined' && 
  (window.location.hostname.includes('github.io') || 
   (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && !import.meta.env.VITE_API_URL));

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('campusfix_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Fallback logic: Execute mock if on static host or if real network request fails
const executeWithFallback = async (method, url, data = null, config = {}) => {
  // 1. If on GitHub Pages or static host with no backend server, directly use the mock backend engine
  if (isStaticHost) {
    try {
      return await handleMockRequest(method.toUpperCase(), url, data, config.headers);
    } catch (mockErr) {
      return Promise.reject(mockErr);
    }
  }

  // 2. On Localhost / server environment, attempt the real Express backend first
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      ...config
    });
    return response;
  } catch (error) {
    // If local backend is down or unreachable, fall back to mock backend
    console.warn(`API [${method} ${url}] offline or failed. Falling back to local demo engine.`, error.message);
    try {
      const mockRes = await handleMockRequest(method.toUpperCase(), url, data, config.headers);
      return mockRes;
    } catch (mockErr) {
      // If mock also rejected (e.g. bad credentials), return the mock error
      return Promise.reject(mockErr);
    }
  }
};

const api = {
  get: (url, config) => executeWithFallback('GET', url, null, config),
  post: (url, data, config) => executeWithFallback('POST', url, data, config),
  put: (url, data, config) => executeWithFallback('PUT', url, data, config),
  patch: (url, data, config) => executeWithFallback('PATCH', url, data, config),
  delete: (url, config) => executeWithFallback('DELETE', url, null, config),
  interceptors: axiosInstance.interceptors
};

export default api;
