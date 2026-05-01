// API client for backend communication
import axios from 'axios';

// Get API URL from environment or fallback to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized
      console.error('Authentication required');
    } else if (error.response?.status === 429) {
      // Rate limited
      console.error('Rate limit exceeded');
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      console.error('Request timeout');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const apiClient = {
  // Health check
  health: () => api.get('/health'),
  
  // Recommendations
  getRecommendations: (preferences: any) => 
    api.post('/api/recommendations', preferences),
  
  // System status
  getSystemStatus: () => 
    api.get('/api/status'),
  
  // User preferences
  createPreferenceProfile: (preferences: any) => 
    api.post('/api/preferences', preferences),
  
  // Feedback
  submitFeedback: (feedback: any) => 
    api.post('/api/feedback', feedback),
  
  // Analytics
  getUserAnalytics: (userId?: string) => 
    api.get('/api/analytics/user', { params: { user_id: userId } }),
  
  getSystemAnalytics: () => 
    api.get('/api/analytics/system'),
};

export default api;
