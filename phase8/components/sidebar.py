import streamlit as st
import time
from services.session_manager import get_user_session

def render_sidebar():
    """Render the sidebar navigation and controls"""
    
    # App header
    st.sidebar.title("🍽️ AI Restaurant Recommender")
    
    # User session info
    session = get_user_session()
    user_name = session.get('user_name', 'Guest')
    st.sidebar.write(f"**Welcome, {user_name}!**")
    
    # Session info
    with st.sidebar.expander("Session Info"):
        st.write(f"Session ID: {session.get('session_id', 'N/A')[:8]}...")
        st.write(f"Started: {session.get('start_time', 'N/A')}")
        st.write(f"Page Views: {session.get('page_views', 0)}")
    
    # Navigation
    st.sidebar.subheader("🧭 Navigation")
    
    page_options = [
        "Home",
        "Preferences", 
        "Search",
        "Analytics",
        "Settings"
    ]
    
    # Get current page from session state or default to Home
    current_page = st.session_state.get('current_page', 'Home')
    
    # Page selector
    selected_page = st.sidebar.selectbox(
        "Choose a page",
        page_options,
        index=page_options.index(current_page) if current_page in page_options else 0,
        key="page_selector"
    )
    
    # Update session state
    st.session_state.current_page = selected_page
    
    # Quick actions
    st.sidebar.subheader("⚡ Quick Actions")
    
    # Refresh button
    if st.sidebar.button("🔄 Refresh Recommendations", use_container_width=True):
        st.session_state.recommendations = []
        st.session_state.search_results = []
        st.sidebar.success("Recommendations refreshed!")
        time.sleep(0.5)
        st.rerun()
    
    # Clear preferences
    if st.sidebar.button("🗑️ Clear Preferences", use_container_width=True):
        st.session_state.user_preferences = {}
        st.session_state.recommendations = []
        st.sidebar.success("Preferences cleared!")
        time.sleep(0.5)
        st.rerun()
    
    # Export data
    if st.sidebar.button("📊 Export Data", use_container_width=True):
        export_user_data()
    
    # Statistics
    st.sidebar.subheader("📊 Your Stats")
    
    # Calculate stats
    total_recommendations = len(st.session_state.get('recommendations', []))
    preferences_set = len(st.session_state.get('user_preferences', {}))
    search_count = len(st.session_state.get('search_history', []))
    
    col1, col2 = st.sidebar.columns(2)
    with col1:
        st.metric("Recs", total_recommendations)
        st.metric("Prefs", preferences_set)
    with col2:
        st.metric("Searches", search_count)
        st.metric("Saved", 0)
    
    # Recent activity
    if 'activity_log' in st.session_state and st.session_state.activity_log:
        st.sidebar.subheader("🕒 Recent Activity")
        
        recent_activities = st.session_state.activity_log[-3:]  # Last 3 activities
        
        for activity in recent_activities:
            st.sidebar.write(f"• {activity}")
    
    # Footer
    st.sidebar.markdown("---")
    st.sidebar.markdown("**Version 1.0.0**")
    st.sidebar.markdown("Built with ❤️ using Streamlit")
    
    return selected_page

def export_user_data():
    """Export user data as JSON"""
    import json
    
    user_data = {
        'preferences': st.session_state.get('user_preferences', {}),
        'recommendations': st.session_state.get('recommendations', []),
        'search_history': st.session_state.get('search_history', []),
        'session_info': {
            'session_id': st.session_state.get('session_id'),
            'export_time': time.strftime('%Y-%m-%d %H:%M:%S')
        }
    }
    
    # Convert to JSON
    json_data = json.dumps(user_data, indent=2, default=str)
    
    # Provide download button
    st.sidebar.download_button(
        label="📥 Download JSON",
        data=json_data,
        file_name=f"restaurant_recommender_data_{int(time.time())}.json",
        mime="application/json"
    )
    
    st.sidebar.success("Data ready for download!")

def log_activity(action):
    """Log user activity"""
    if 'activity_log' not in st.session_state:
        st.session_state.activity_log = []
    
    timestamp = time.strftime('%H:%M:%S')
    st.session_state.activity_log.append(f"{timestamp} - {action}")
    
    # Keep only last 10 activities
    if len(st.session_state.activity_log) > 10:
        st.session_state.activity_log = st.session_state.activity_log[-10:]
