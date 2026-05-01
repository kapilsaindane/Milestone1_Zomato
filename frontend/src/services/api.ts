import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface PreferenceProfile {
  location: string;
  budget: 'low' | 'medium' | 'high';
  cuisine: string;
  minimum_rating: number;
  additional_preferences: string[];
  budget_range: number[];
  normalized_tags: string[];
}

export interface Restaurant {
  restaurant_name: string;
  cuisine: string;
  rating?: number;
  estimated_cost?: number;
  explanation: string;
  confidence_score?: number;
}

export interface RecommendationResponse {
  model: string;
  total_input_candidates: number;
  recommendations: Restaurant[];
  summary: string;
  processing_time?: number;
  created_at?: string;
}

export interface SystemStatus {
  system_status: string;
  phases: Array<{
    name: string;
    status: string;
    input_count?: number;
    output_count?: number;
    error_message?: string;
    last_run?: string;
    processing_time?: number;
  }>;
  total_restaurants: number;
  last_updated: string;
}

export interface SearchResult {
  restaurants: Array<{
    restaurant_name: string;
    location: string;
    cuisine: string;
    primary_cuisine: string;
    rating?: number;
    cost_for_two?: number;
    votes: number;
    online_order: string;
    table_booking: string;
  }>;
  total_found: number;
  search_time: number;
}

export interface Analytics {
  total_restaurants: number;
  total_recommendations_generated: number;
  popular_locations: Array<{ location: string; count: number }>;
  popular_cuisines: Array<{ cuisine: string; count: number }>;
  average_ratings: {
    overall: number;
    by_location: Record<string, number>;
    by_cuisine: Record<string, number>;
  };
  system_performance: Record<string, number>;
}

// API Functions
export const apiService = {
  // System Status
  async getSystemStatus(): Promise<SystemStatus> {
    const response = await api.get('/status');
    return response.data;
  },

  // Preferences
  async createPreferences(preferences: Omit<PreferenceProfile, 'budget_range' | 'normalized_tags'>): Promise<PreferenceProfile> {
    const response = await api.post('/preferences', preferences);
    return response.data;
  },

  async getCurrentPreferences(): Promise<PreferenceProfile> {
    const response = await api.get('/preferences');
    return response.data;
  },

  // Recommendations
  async getRecommendations(preferences?: Omit<PreferenceProfile, 'budget_range' | 'normalized_tags'>): Promise<RecommendationResponse> {
    const response = await api.post('/recommendations', preferences);
    return response.data;
  },

  async getLatestRecommendations(): Promise<RecommendationResponse> {
    const response = await api.get('/recommendations/latest');
    return response.data;
  },

  // Search
  async searchRestaurants(params: {
    query?: string;
    location?: string;
    cuisine?: string;
    limit?: number;
  }): Promise<SearchResult> {
    const response = await api.get('/restaurants/search', { params });
    return response.data;
  },

  // Analytics
  async getAnalytics(): Promise<Analytics> {
    const response = await api.get('/analytics/summary');
    return response.data;
  },

  // Phase Management
  async runPhase(phaseName: string): Promise<{ message: string; status: string }> {
    const response = await api.get(`/phases/${phaseName}/run`);
    return response.data;
  },

  async getPhaseStatus(phaseName: string): Promise<any> {
    const response = await api.get(`/phases/${phaseName}/status`);
    return response.data;
  },
};

export default apiService;
