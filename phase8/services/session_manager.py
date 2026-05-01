import streamlit as st
import time
import uuid
from typing import Dict, Any, Optional
from datetime import datetime

def initialize_session():
    """Initialize session state with default values"""
    
    # Generate unique session ID if not exists
    if 'session_id' not in st.session_state:
        st.session_state.session_id = str(uuid.uuid4())
    
    # Initialize user preferences
    if 'user_preferences' not in st.session_state:
        st.session_state.user_preferences = {}
    
    # Initialize recommendations
    if 'recommendations' not in st.session_state:
        st.session_state.recommendations = []
    
    # Initialize search results
    if 'search_results' not in st.session_state:
        st.session_state.search_results = []
    
    # Initialize favorites
    if 'favorites' not in st.session_state:
        st.session_state.favorites = []
    
    # Initialize activity log
    if 'activity_log' not in st.session_state:
        st.session_state.activity_log = []
    
    # Initialize search history
    if 'search_history' not in st.session_state:
        st.session_state.search_history = []
    
    # Initialize user settings
    if 'user_settings' not in st.session_state:
        st.session_state.user_settings = {
            'email_notifications': True,
            'push_notifications': True,
            'sms_notifications': False,
            'notification_frequency': 'Daily',
            'recommendation_types': ['New Restaurants', 'Similar to Favorites'],
            'auto_save': True,
            'share_data': True,
            'personalization': True
        }
    
    # Initialize current page
    if 'current_page' not in st.session_state:
        st.session_state.current_page = 'Home'
    
    # Initialize session metadata
    if 'session_metadata' not in st.session_state:
        st.session_state.session_metadata = {
            'start_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'page_views': 0,
            'last_activity': datetime.now().isoformat(),
            'browser_info': None,
            'ip_address': None
        }

def get_user_session() -> Dict[str, Any]:
    """Get current user session information"""
    
    session_data = {
        'session_id': st.session_state.get('session_id', 'N/A'),
        'user_name': st.session_state.user_preferences.get('name', 'Guest'),
        'start_time': st.session_state.session_metadata.get('start_time', 'N/A'),
        'page_views': st.session_state.session_metadata.get('page_views', 0),
        'last_activity': st.session_state.session_metadata.get('last_activity', 'N/A'),
        'preferences_count': len(st.session_state.get('user_preferences', {})),
        'recommendations_count': len(st.session_state.get('recommendations', [])),
        'favorites_count': len(st.session_state.get('favorites', []))
    }
    
    return session_data

def update_session_activity(page: str = None):
    """Update session activity tracking"""
    
    # Update last activity
    st.session_state.session_metadata['last_activity'] = datetime.now().isoformat()
    
    # Update page views
    st.session_state.session_metadata['page_views'] += 1
    
    # Update current page if provided
    if page:
        st.session_state.current_page = page
    
    # Log page view
    log_activity(f"Visited {page} page")

def log_activity(action: str, details: Dict[str, Any] = None):
    """Log user activity"""
    
    if 'activity_log' not in st.session_state:
        st.session_state.activity_log = []
    
    timestamp = datetime.now().strftime('%H:%M:%S')
    
    activity_entry = {
        'timestamp': timestamp,
        'action': action,
        'details': details or {},
        'page': st.session_state.get('current_page', 'Unknown')
    }
    
    st.session_state.activity_log.append(activity_entry)
    
    # Keep only last 50 activities
    if len(st.session_state.activity_log) > 50:
        st.session_state.activity_log = st.session_state.activity_log[-50:]

def save_search_query(query: str, filters: Dict[str, Any] = None):
    """Save search query to history"""
    
    if 'search_history' not in st.session_state:
        st.session_state.search_history = []
    
    search_entry = {
        'query': query,
        'filters': filters or {},
        'timestamp': datetime.now().isoformat(),
        'results_count': len(st.session_state.get('search_results', []))
    }
    
    st.session_state.search_history.append(search_entry)
    
    # Keep only last 20 searches
    if len(st.session_state.search_history) > 20:
        st.session_state.search_history = st.session_state.search_history[-20:]

def get_session_summary() -> Dict[str, Any]:
    """Get comprehensive session summary"""
    
    summary = {
        'session_id': st.session_state.get('session_id', 'N/A'),
        'duration': calculate_session_duration(),
        'page_views': st.session_state.session_metadata.get('page_views', 0),
        'current_page': st.session_state.get('current_page', 'Unknown'),
        'preferences': {
            'count': len(st.session_state.get('user_preferences', {})),
            'completion': calculate_preferences_completion(),
            'last_updated': get_last_preferences_update()
        },
        'recommendations': {
            'total_generated': len(st.session_state.get('recommendations', [])),
            'current_count': len(st.session_state.get('recommendations', [])),
            'last_generated': get_last_recommendation_time()
        },
        'interactions': {
            'searches_performed': len(st.session_state.get('search_history', [])),
            'favorites_saved': len(st.session_state.get('favorites', [])),
            'activities_logged': len(st.session_state.get('activity_log', []))
        },
        'engagement': {
            'score': calculate_engagement_score(),
            'most_active_page': get_most_active_page(),
            'peak_activity_time': get_peak_activity_time()
        }
    }
    
    return summary

def calculate_session_duration() -> str:
    """Calculate session duration"""
    
    start_time_str = st.session_state.session_metadata.get('start_time')
    if not start_time_str:
        return 'Unknown'
    
    try:
        start_time = datetime.strptime(start_time_str, '%Y-%m-%d %H:%M:%S')
        duration = datetime.now() - start_time
        
        hours = duration.seconds // 3600
        minutes = (duration.seconds % 3600) // 60
        
        if hours > 0:
            return f"{hours}h {minutes}m"
        else:
            return f"{minutes}m"
    except:
        return 'Unknown'

def calculate_preferences_completion() -> float:
    """Calculate preferences completion percentage"""
    
    preferences = st.session_state.get('user_preferences', {})
    
    required_fields = ['location', 'budget', 'min_rating']
    optional_fields = ['cuisines', 'max_distance', 'group_size', 'spice_level', 'ambiance']
    
    completed_required = sum(1 for field in required_fields if field in preferences and preferences[field])
    completed_optional = sum(1 for field in optional_fields if field in preferences and preferences[field])
    
    # Weight: 70% for required, 30% for optional
    required_progress = (completed_required / len(required_fields)) * 70
    optional_progress = (completed_optional / len(optional_fields)) * 30
    
    return required_progress + optional_progress

def get_last_preferences_update() -> str:
    """Get last time preferences were updated"""
    
    # This would be tracked in a real implementation
    return 'Not tracked'

def get_last_recommendation_time() -> str:
    """Get last time recommendations were generated"""
    
    if st.session_state.recommendations:
        return 'Recently'
    else:
        return 'Never'

def calculate_engagement_score() -> float:
    """Calculate user engagement score"""
    
    score = 0.0
    
    # Base score for having recommendations
    if st.session_state.recommendations:
        score += 20
    
    # Score for preferences
    score += calculate_preferences_completion() * 0.3
    
    # Score for favorites
    score += len(st.session_state.get('favorites', [])) * 2
    
    # Score for search activity
    score += len(st.session_state.get('search_history', [])) * 1
    
    # Score for page views
    score += min(st.session_state.session_metadata.get('page_views', 0) * 0.5, 20)
    
    return min(score, 100)

def get_most_active_page() -> str:
    """Get the page where user spent most time"""
    
    # This would require more detailed tracking in a real implementation
    activities = st.session_state.get('activity_log', [])
    
    if not activities:
        return 'Unknown'
    
    page_counts = {}
    for activity in activities:
        page = activity.get('page', 'Unknown')
        page_counts[page] = page_counts.get(page, 0) + 1
    
    return max(page_counts, key=page_counts.get) if page_counts else 'Unknown'

def get_peak_activity_time() -> str:
    """Get the time of peak activity"""
    
    activities = st.session_state.get('activity_log', [])
    
    if not activities:
        return 'Unknown'
    
    # Count activities by hour
    hour_counts = {}
    for activity in activities:
        try:
            timestamp = datetime.strptime(activity['timestamp'], '%H:%M:%S')
            hour = timestamp.hour
            hour_counts[hour] = hour_counts.get(hour, 0) + 1
        except:
            continue
    
    if hour_counts:
        peak_hour = max(hour_counts, key=hour_counts.get)
        return f"{peak_hour}:00 - {peak_hour + 1}:00"
    
    return 'Unknown'

def clear_session_data():
    """Clear all session data (for logout or reset)"""
    
    # Keep only essential session metadata
    session_id = st.session_state.get('session_id')
    
    # Clear all data
    for key in list(st.session_state.keys()):
        if key != 'session_id':
            del st.session_state[key]
    
    # Reinitialize with clean state
    initialize_session()
    
    # Restore session ID
    if session_id:
        st.session_state.session_id = session_id

def export_session_data() -> Dict[str, Any]:
    """Export all session data for backup or analysis"""
    
    export_data = {
        'session_info': get_user_session(),
        'session_summary': get_session_summary(),
        'preferences': st.session_state.get('user_preferences', {}),
        'recommendations': st.session_state.get('recommendations', []),
        'favorites': st.session_state.get('favorites', []),
        'search_history': st.session_state.get('search_history', []),
        'activity_log': st.session_state.get('activity_log', []),
        'user_settings': st.session_state.get('user_settings', {}),
        'session_metadata': st.session_state.get('session_metadata', {}),
        'export_timestamp': datetime.now().isoformat()
    }
    
    return export_data

def import_session_data(data: Dict[str, Any]) -> bool:
    """Import session data from backup"""
    
    try:
        # Validate data structure
        required_keys = ['session_info', 'preferences', 'recommendations']
        if not all(key in data for key in required_keys):
            return False
        
        # Import data
        st.session_state.user_preferences = data.get('preferences', {})
        st.session_state.recommendations = data.get('recommendations', [])
        st.session_state.favorites = data.get('favorites', [])
        st.session_state.search_history = data.get('search_history', [])
        st.session_state.activity_log = data.get('activity_log', [])
        st.session_state.user_settings = data.get('user_settings', {})
        
        # Update session metadata
        if 'session_metadata' in data:
            st.session_state.session_metadata.update(data['session_metadata'])
        
        return True
    
    except Exception:
        return False

def validate_session_integrity() -> bool:
    """Validate session data integrity"""
    
    try:
        # Check required session state keys
        required_keys = ['session_id', 'user_preferences', 'recommendations']
        
        for key in required_keys:
            if key not in st.session_state:
                return False
        
        # Validate data types
        if not isinstance(st.session_state.user_preferences, dict):
            return False
        
        if not isinstance(st.session_state.recommendations, list):
            return False
        
        # Validate session ID format
        session_id = st.session_state.get('session_id', '')
        if not session_id or len(session_id) < 10:
            return False
        
        return True
    
    except Exception:
        return False
