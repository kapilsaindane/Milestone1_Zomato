import requests
import json
import time
import os
from typing import Dict, List, Any, Optional
from functools import lru_cache

class APIClient:
    """Client for interacting with the backend API"""
    
    def __init__(self, base_url: str = None):
        self.base_url = base_url or os.getenv('BACKEND_API_URL', 'http://localhost:8000')
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'Restaurant-Recommender-Streamlit/1.0'
        })
    
    @lru_cache(maxsize=128)
    def check_backend_health(self) -> bool:
        """Check if backend is healthy"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=5)
            return response.status_code == 200
        except Exception:
            return False
    
    def submit_preferences(self, preferences: Dict[str, Any]) -> Dict[str, Any]:
        """Submit user preferences and get recommendations"""
        try:
            response = self.session.post(
                f"{self.base_url}/api/recommendations",
                json=preferences,
                timeout=30
            )
            
            if response.status_code == 200:
                return {
                    'success': True,
                    'recommendations': response.json().get('recommendations', []),
                    'message': 'Recommendations generated successfully'
                }
            else:
                return {
                    'success': False,
                    'error': f"API Error: {response.status_code}",
                    'message': response.json().get('error', 'Unknown error')
                }
                
        except requests.exceptions.Timeout:
            return {
                'success': False,
                'error': 'timeout',
                'message': 'Request timed out. Please try again.'
            }
        except requests.exceptions.ConnectionError:
            return {
                'success': False,
                'error': 'connection_error',
                'message': 'Cannot connect to backend. Please check if the service is running.'
            }
        except Exception as e:
            return {
                'success': False,
                'error': 'unknown',
                'message': f'An unexpected error occurred: {str(e)}'
            }
    
    def get_recommendations(self, preferences: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Get recommendations based on preferences"""
        if not preferences:
            preferences = {}
        
        result = self.submit_preferences(preferences)
        
        if result['success']:
            return result['recommendations']
        else:
            # Return mock recommendations if API fails
            return self.get_mock_recommendations(preferences)
    
    def submit_feedback(self, feedback_data: Dict[str, Any]) -> Dict[str, Any]:
        """Submit user feedback"""
        try:
            response = self.session.post(
                f"{self.base_url}/api/feedback",
                json=feedback_data,
                timeout=10
            )
            
            if response.status_code == 200:
                return {
                    'success': True,
                    'message': 'Feedback submitted successfully'
                }
            else:
                return {
                    'success': False,
                    'error': f"API Error: {response.status_code}"
                }
                
        except Exception as e:
            return {
                'success': False,
                'error': 'unknown',
                'message': f'Failed to submit feedback: {str(e)}'
            }
    
    def get_user_analytics(self, user_id: str = None) -> Dict[str, Any]:
        """Get user analytics data"""
        try:
            params = {'user_id': user_id} if user_id else {}
            response = self.session.get(
                f"{self.base_url}/api/analytics/user",
                params=params,
                timeout=15
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return self.get_mock_analytics()
                
        except Exception:
            return self.get_mock_analytics()
    
    def get_system_analytics(self) -> Dict[str, Any]:
        """Get system-wide analytics"""
        try:
            response = self.session.get(
                f"{self.base_url}/api/analytics/system",
                timeout=15
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return self.get_mock_system_analytics()
                
        except Exception:
            return self.get_mock_system_analytics()
    
    def get_mock_recommendations(self, preferences: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate mock recommendations when API is unavailable"""
        
        mock_restaurants = [
            {
                'id': '1',
                'name': 'The Italian Kitchen',
                'cuisine': 'Italian',
                'rating': 4.5,
                'price_range': '$$',
                'location': preferences.get('location', 'Downtown'),
                'description': 'Authentic Italian cuisine with a modern twist',
                'explanation': 'Based on your preference for Italian food and moderate pricing, this restaurant offers excellent value and quality.',
                'distance': '2.3 km',
                'delivery_time': '35 min',
                'phone': '+1 234-567-8901',
                'address': '123 Main St, Downtown',
                'match_score': 0.92,
                'tags': ['Italian', 'Romantic', 'Wine Bar', 'Pasta']
            },
            {
                'id': '2',
                'name': 'Sushi Master',
                'cuisine': 'Japanese',
                'rating': 4.7,
                'price_range': '$$$',
                'location': preferences.get('location', 'Midtown'),
                'description': 'Fresh sushi and Japanese specialties',
                'explanation': 'Highly rated Japanese restaurant that matches your taste preferences and budget range.',
                'distance': '3.1 km',
                'delivery_time': '40 min',
                'phone': '+1 234-567-8902',
                'address': '456 Oak Ave, Midtown',
                'match_score': 0.88,
                'tags': ['Japanese', 'Sushi', 'Ramen', 'Fresh Fish']
            },
            {
                'id': '3',
                'name': 'Spice Garden',
                'cuisine': 'Indian',
                'rating': 4.3,
                'price_range': '$$',
                'location': preferences.get('location', 'Uptown'),
                'description': 'Traditional Indian flavors with modern presentation',
                'explanation': 'Great option for Indian cuisine with good ratings and reasonable prices.',
                'distance': '4.5 km',
                'delivery_time': '45 min',
                'phone': '+1 234-567-8903',
                'address': '789 Pine Rd, Uptown',
                'match_score': 0.85,
                'tags': ['Indian', 'Curry', 'Vegetarian', 'Spicy']
            },
            {
                'id': '4',
                'name': 'Burger Palace',
                'cuisine': 'American',
                'rating': 4.1,
                'price_range': '$',
                'location': preferences.get('location', 'Westside'),
                'description': 'Gourmet burgers and American comfort food',
                'explanation': 'Casual dining option with excellent burgers at budget-friendly prices.',
                'distance': '1.8 km',
                'delivery_time': '25 min',
                'phone': '+1 234-567-8904',
                'address': '321 Elm St, Westside',
                'match_score': 0.79,
                'tags': ['American', 'Burgers', 'Casual', 'Family Friendly']
            },
            {
                'id': '5',
                'name': 'Pizza Paradise',
                'cuisine': 'Italian',
                'rating': 4.4,
                'price_range': '$$',
                'location': preferences.get('location', 'Eastside'),
                'description': 'Wood-fired pizzas and Italian classics',
                'explanation': 'Popular pizza place with authentic Italian recipes and great atmosphere.',
                'distance': '2.7 km',
                'delivery_time': '30 min',
                'phone': '+1 234-567-8905',
                'address': '654 Maple Dr, Eastside',
                'match_score': 0.82,
                'tags': ['Italian', 'Pizza', 'Wood-fired', 'Casual']
            }
        ]
        
        # Filter based on preferences if provided
        if preferences:
            filtered_restaurants = []
            
            for restaurant in mock_restaurants:
                # Check cuisine preference
                if preferences.get('cuisines'):
                    if not any(cuisine.lower() in restaurant['cuisine'].lower() 
                              for cuisine in preferences['cuisines']):
                        continue
                
                # Check budget preference
                if preferences.get('budget') and restaurant['price_range'] != preferences['budget']:
                    # Allow one level above and below
                    budget_levels = ['$', '$$', '$$$', '$$$$']
                    current_level = budget_levels.index(restaurant['price_range'])
                    preferred_level = budget_levels.index(preferences['budget'])
                    
                    if abs(current_level - preferred_level) > 1:
                        continue
                
                # Check minimum rating
                if preferences.get('min_rating') and restaurant['rating'] < preferences['min_rating']:
                    continue
                
                filtered_restaurants.append(restaurant)
            
            return filtered_restaurants if filtered_restaurants else mock_restaurants[:3]
        
        return mock_restaurants
    
    def get_mock_analytics(self) -> Dict[str, Any]:
        """Generate mock user analytics"""
        import random
        from datetime import datetime, timedelta
        
        return {
            'user_id': 'mock_user_123',
            'total_recommendations': random.randint(50, 200),
            'average_rating': round(random.uniform(3.5, 4.8), 1),
            'favorite_cuisines': ['Italian', 'Chinese', 'Japanese'],
            'preferred_price_range': '$$',
            'session_count': random.randint(5, 25),
            'last_active': datetime.now().isoformat(),
            'feedback_given': random.randint(10, 50),
            'restaurants_saved': random.randint(5, 20)
        }
    
    def get_mock_system_analytics(self) -> Dict[str, Any]:
        """Generate mock system analytics"""
        import random
        
        return {
            'total_users': random.randint(1000, 5000),
            'active_users_today': random.randint(100, 500),
            'total_recommendations': random.randint(5000, 20000),
            'average_response_time': random.randint(200, 400),
            'success_rate': round(random.uniform(0.85, 0.95), 2),
            'popular_cuisines': {
                'Italian': random.randint(200, 400),
                'Chinese': random.randint(150, 350),
                'Japanese': random.randint(100, 300),
                'Indian': random.randint(80, 250),
                'Mexican': random.randint(60, 200)
            },
            'system_health': {
                'cpu_usage': random.randint(20, 80),
                'memory_usage': random.randint(30, 70),
                'disk_usage': random.randint(10, 60)
            }
        }

# Global API client instance
api_client = APIClient()

# Convenience functions
def check_backend_health() -> bool:
    """Check if backend is healthy"""
    return api_client.check_backend_health()

def submit_preferences(preferences: Dict[str, Any]) -> Dict[str, Any]:
    """Submit user preferences and get recommendations"""
    return api_client.submit_preferences(preferences)

def get_recommendations(preferences: Dict[str, Any] = None) -> List[Dict[str, Any]]:
    """Get recommendations based on preferences"""
    return api_client.get_recommendations(preferences)

def submit_feedback(feedback_data: Dict[str, Any]) -> Dict[str, Any]:
    """Submit user feedback"""
    return api_client.submit_feedback(feedback_data)

def get_user_analytics(user_id: str = None) -> Dict[str, Any]:
    """Get user analytics data"""
    return api_client.get_user_analytics(user_id)

def get_system_analytics() -> Dict[str, Any]:
    """Get system-wide analytics"""
    return api_client.get_system_analytics()
