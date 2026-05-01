import streamlit as st
import sys
import os
from pathlib import Path

# Add parent directory to path for imports
PHASE8_ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = PHASE8_ROOT.parent
sys.path.insert(0, str(PROJECT_ROOT))

from components.sidebar import render_sidebar
from components.preferences import render_preferences
from components.recommendations import render_recommendations
from components.analytics import render_analytics
from services.session_manager import initialize_session
from services.api_client import check_backend_health

def main():
    # Page configuration
    st.set_page_config(
        page_title="AI Restaurant Recommender",
        page_icon="🍽️",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    # Initialize session state
    initialize_session()
    
    # Check backend health
    if not check_backend_health():
        st.error("⚠️ Backend service is not available. Please start the backend service.")
        st.stop()
    
    # Render sidebar
    current_page = render_sidebar()
    
    # Main content area based on sidebar selection
    if current_page == "Home":
        render_home_page()
    elif current_page == "Preferences":
        render_preferences()
    elif current_page == "Search":
        render_search_page()
    elif current_page == "Analytics":
        render_analytics()
    elif current_page == "Settings":
        render_settings_page()

def render_home_page():
    st.header("🍽️ Welcome to AI Restaurant Recommender")
    
    # Welcome message
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown("""
        ### Discover Your Perfect Dining Experience
        
        Our AI-powered restaurant recommendation system helps you find the perfect restaurant 
        based on your preferences, location, and dining history.
        
        **Features:**
        - 🤖 AI-powered recommendations
        - 📍 Location-based suggestions
        - 💰 Budget-friendly options
        - ⭐ Rating-based filtering
        - 🍽️ Cuisine preferences
        - 📊 Real-time analytics
        """)
        
        # Quick start button
        if st.button("🚀 Get Started", type="primary", use_container_width=True):
            st.session_state.current_page = "Preferences"
            st.rerun()
    
    with col2:
        # Quick stats
        st.subheader("Quick Stats")
        
        stats = {
            "Total Restaurants": "1,234",
            "Active Users": "567",
            "Recommendations Today": "2,890",
            "Average Rating": "4.3 ⭐"
        }
        
        for key, value in stats.items():
            st.metric(key, value)
    
    # Recent recommendations preview
    if st.session_state.recommendations:
        st.subheader("🔥 Your Recent Recommendations")
        
        # Show top 3 recommendations
        top_recommendations = st.session_state.recommendations[:3]
        
        for i, rec in enumerate(top_recommendations, 1):
            with st.expander(f"{i}. {rec['name']} ⭐ {rec['rating']}"):
                col1, col2 = st.columns([3, 1])
                
                with col1:
                    st.write(f"**Cuisine:** {rec['cuisine']}")
                    st.write(f"**Location:** {rec['location']}")
                    st.write(f"**Price:** {rec['price_range']}")
                    st.write(f"**Why we recommend this:** {rec['explanation']}")
                
                with col2:
                    if st.button(f"📍 View", key=f"view_home_{i}"):
                        st.session_state.current_page = "Search"
                        st.rerun()
    else:
        st.info("👋 No recommendations yet. Set your preferences to get started!")

def render_search_page():
    st.header("🔍 Search Restaurants")
    
    # Search interface
    col1, col2 = st.columns([1, 2])
    
    with col1:
        st.subheader("Quick Search")
        
        # Search input
        search_query = st.text_input("Search restaurants...", placeholder="Enter name, cuisine, or location...")
        
        # Quick filters
        st.subheader("Quick Filters")
        
        cuisine_filter = st.multiselect(
            "Cuisine",
            ["Italian", "Chinese", "Japanese", "Indian", "Mexican", "Thai", "American"],
            key="search_cuisine"
        )
        
        price_filter = st.select_slider(
            "Price Range",
            options=["$", "$$", "$$$", "$$$$"],
            value="$$",
            key="search_price"
        )
        
        rating_filter = st.slider(
            "Minimum Rating",
            min_value=1.0,
            max_value=5.0,
            step=0.5,
            value=3.0,
            key="search_rating"
        )
        
        # Search button
        if st.button("🔍 Search", type="primary", use_container_width=True):
            # Perform search (mock implementation)
            st.session_state.search_results = get_mock_search_results(
                search_query, cuisine_filter, price_filter, rating_filter
            )
            st.rerun()
    
    with col2:
        st.subheader("Search Results")
        
        # Display search results
        if 'search_results' in st.session_state and st.session_state.search_results:
            for i, restaurant in enumerate(st.session_state.search_results, 1):
                with st.expander(f"{i}. {restaurant['name']} ⭐ {restaurant['rating']}"):
                    col1, col2 = st.columns([3, 1])
                    
                    with col1:
                        st.write(f"**Cuisine:** {restaurant['cuisine']}")
                        st.write(f"**Location:** {restaurant['location']}")
                        st.write(f"**Price:** {restaurant['price_range']}")
                        st.write(f"**Description:** {restaurant['description']}")
                        st.write(f"**Distance:** {restaurant.get('distance', 'N/A')}")
                        st.write(f"**Delivery Time:** {restaurant.get('delivery_time', 'N/A')}")
                    
                    with col2:
                        if st.button(f"📍 Details", key=f"details_search_{i}"):
                            st.write(f"Phone: {restaurant.get('phone', 'N/A')}")
                            st.write(f"Address: {restaurant.get('address', 'N/A')}")
                        if st.button(f"❤️ Save", key=f"save_search_{i}"):
                            st.success("Restaurant saved to favorites!")
        else:
            st.info("🔍 Enter search criteria and click Search to find restaurants.")

def render_settings_page():
    st.header("⚙️ Settings")
    
    # User settings
    st.subheader("User Preferences")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Notification settings
        st.write("**Notifications**")
        email_notifications = st.checkbox("Email Notifications", value=True)
        push_notifications = st.checkbox("Push Notifications", value=True)
        
        # Display settings
        st.write("**Display**")
        dark_mode = st.checkbox("Dark Mode", value=False)
        compact_view = st.checkbox("Compact View", value=False)
    
    with col2:
        # Privacy settings
        st.write("**Privacy**")
        share_data = st.checkbox("Share anonymous usage data", value=True)
        personalization = st.checkbox("Enable personalization", value=True)
        
        # Account settings
        st.write("**Account**")
        auto_save = st.checkbox("Auto-save preferences", value=True)
    
    # Save settings button
    if st.button("💾 Save Settings", type="primary"):
        st.session_state.user_settings = {
            'email_notifications': email_notifications,
            'push_notifications': push_notifications,
            'dark_mode': dark_mode,
            'compact_view': compact_view,
            'share_data': share_data,
            'personalization': personalization,
            'auto_save': auto_save
        }
        st.success("Settings saved successfully!")
    
    # System information
    st.subheader("System Information")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.metric("Version", "1.0.0")
        st.metric("Backend Status", "✅ Online")
        st.metric("Cache Status", "✅ Active")
    
    with col2:
        st.metric("Session ID", st.session_state.get('session_id', 'N/A')[:8] + "...")
        st.metric("Last Updated", "2 minutes ago")
        st.metric("Response Time", "245ms")

def get_mock_search_results(query, cuisine, price, rating):
    """Mock search results for demonstration"""
    import random
    
    mock_restaurants = [
        {
            'name': 'The Italian Kitchen',
            'cuisine': 'Italian',
            'rating': 4.5,
            'price_range': '$$',
            'location': 'Downtown',
            'description': 'Authentic Italian cuisine with a modern twist',
            'distance': '2.3 km',
            'delivery_time': '35 min',
            'phone': '+1 234-567-8901',
            'address': '123 Main St, Downtown'
        },
        {
            'name': 'Sushi Master',
            'cuisine': 'Japanese',
            'rating': 4.7,
            'price_range': '$$$',
            'location': 'Midtown',
            'description': 'Fresh sushi and Japanese specialties',
            'distance': '3.1 km',
            'delivery_time': '40 min',
            'phone': '+1 234-567-8902',
            'address': '456 Oak Ave, Midtown'
        },
        {
            'name': 'Spice Garden',
            'cuisine': 'Indian',
            'rating': 4.3,
            'price_range': '$$',
            'location': 'Uptown',
            'description': 'Traditional Indian flavors with modern presentation',
            'distance': '4.5 km',
            'delivery_time': '45 min',
            'phone': '+1 234-567-8903',
            'address': '789 Pine Rd, Uptown'
        }
    ]
    
    # Filter based on criteria
    filtered = mock_restaurants
    
    if cuisine:
        filtered = [r for r in filtered if r['cuisine'] in cuisine]
    
    if price:
        filtered = [r for r in filtered if r['price_range'] == price]
    
    if rating:
        filtered = [r for r in filtered if r['rating'] >= rating]
    
    if query:
        filtered = [r for r in filtered if query.lower() in r['name'].lower() or 
                   query.lower() in r['cuisine'].lower() or 
                   query.lower() in r['location'].lower()]
    
    return filtered

if __name__ == "__main__":
    main()
