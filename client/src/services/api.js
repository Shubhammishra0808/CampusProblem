import axios from 'axios';
import { handleMockRequest } from './mockBackend';

const axiosInstance = axios.create({
  baseURL: '/api',
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

// Fallback logic: Execute mock if network fails or on 404/500/offline
const executeWithFallback = async (method, url, data = null, config = {}) => {
  // If we are on GitHub Pages or static host where /api doesn't exist, we can directly try or fallback
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      ...config
    });
    return response;
  } catch (error) {
    // If request failed due to no backend, network error, or 404 on static hosting, use mock engine
    const isOfflineOrNotFound = 
      !error.response || 
      error.code === 'ERR_NETWORK' || 
      error.response.status === 404 || 
      error.response.status === 502 || 
      error.response.status === 503 ||
      error.response.status === 504;

    if (isOfflineOrNotFound) {
      try {
        const mockRes = await handleMockRequest(method.toUpperCase(), url, data, config.headers);
        return mockRes;
      } catch (mockErr) {
        return Promise.reject(mockErr);
      }
    }

    // Handle token expiration for real API
    if (error.response && error.response.status === 401 && !url.includes('/auth/login')) {
      localStorage.removeItem('campusfix_token');
      localStorage.removeItem('campusfix_user');
    }

    return Promise.reject(error);
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
