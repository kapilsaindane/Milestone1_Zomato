# Phase 8: Streamlit Deployment and Production Interface

## Overview

Phase 8 focuses on deploying the complete AI Restaurant Recommender system using Streamlit, creating a production-ready web application with real-time capabilities and an intuitive user interface.

## Architecture

### Streamlit Application Structure
```
phase8/
├── app.py                 # Main Streamlit application
├── config/
│   ├── __init__.py
│   └── settings.py        # Streamlit configuration
├── components/
│   ├── __init__.py
│   ├── sidebar.py         # Navigation and controls
│   ├── preferences.py      # User preference forms
│   ├── recommendations.py  # Recommendation display
│   └── analytics.py        # Analytics dashboard
├── services/
│   ├── __init__.py
│   ├── api_client.py       # Backend API integration
│   ├── session_manager.py  # User session handling
│   └── cache_manager.py    # Performance optimization
└── utils/
    ├── __init__.py
    ├── helpers.py          # Utility functions
    └── validators.py       # Input validation
```

## Key Features

### 1. Interactive User Interface
- **Real-time preference input** with live validation
- **Dynamic filtering** and search capabilities
- **Responsive design** for all device sizes
- **Progressive loading** for better performance

### 2. Backend Integration
- **API client** for all phase services
- **Error handling** and retry mechanisms
- **Caching layer** for improved response times
- **Session persistence** for user data

### 3. Multi-User Support
- **Concurrent processing** for multiple users
- **Session isolation** and data privacy
- **Load balancing** capabilities
- **Resource management** optimization

### 4. Analytics and Monitoring
- **Real-time metrics** dashboard
- **User behavior tracking**
- **System performance monitoring**
- **Recommendation quality analytics**

## Installation and Setup

### Prerequisites
```bash
# Python 3.8+
pip install streamlit>=1.28.0
pip install pandas>=1.5.0
pip install plotly>=5.15.0
pip install requests>=2.28.0
pip install streamlit-authenticator>=0.2.0
```

### Environment Setup
```bash
# Create virtual environment
python -m venv phase8_env
source phase8_env/bin/activate  # On Windows: phase8_env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export STREAMLIT_SERVER_PORT=8501
export STREAMLIT_SERVER_ADDRESS=localhost
export BACKEND_API_URL=http://localhost:8000
```

## Configuration

### Streamlit Config (.streamlit/config.toml)
```toml
[server]
port = 8501
address = "localhost"
headless = false
enableCORS = false
enableXsrfProtection = false

[browser]
gatherUsageStats = false

[theme]
primaryColor = "#FF6B6B"
backgroundColor = "#FFFFFF"
secondaryBackgroundColor = "#F0F2F6"
textColor = "#262730"
```

### Environment Variables (.env)
```env
STREAMLIT_SERVER_PORT=8501
STREAMLIT_SERVER_ADDRESS=localhost
BACKEND_API_URL=http://localhost:8000
GROQ_API_KEY=your_groq_api_key
CACHE_TTL=3600
MAX_CONCURRENT_USERS=100
```

## Usage

### Running the Application
```bash
# Development mode
streamlit run phase8/app.py

# Production mode
streamlit run phase8/app.py --server.port=8501 --server.address=0.0.0.0

# With custom configuration
streamlit run phase8/app.py --configFile .streamlit/config.toml
```

### Accessing the Application
- **Local**: http://localhost:8501
- **Network**: http://your-ip:8501
- **Cloud**: Deploy to Streamlit Cloud or other platforms

## Components

### 1. Main Application (app.py)
```python
import streamlit as st
from components.sidebar import render_sidebar
from components.preferences import render_preferences
from components.recommendations import render_recommendations
from components.analytics import render_analytics

def main():
    st.set_page_config(
        page_title="AI Restaurant Recommender",
        page_icon="🍽️",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    # Session state initialization
    if 'user_preferences' not in st.session_state:
        st.session_state.user_preferences = {}
    if 'recommendations' not in st.session_state:
        st.session_state.recommendations = []
    
    # Render components
    render_sidebar()
    
    # Main content area
    tab1, tab2, tab3 = st.tabs(["Preferences", "Recommendations", "Analytics"])
    
    with tab1:
        render_preferences()
    
    with tab2:
        render_recommendations()
    
    with tab3:
        render_analytics()

if __name__ == "__main__":
    main()
```

### 2. Sidebar Navigation (components/sidebar.py)
```python
import streamlit as st
from services.session_manager import get_user_session

def render_sidebar():
    st.sidebar.title("🍽️ AI Restaurant Recommender")
    
    # User session info
    session = get_user_session()
    st.sidebar.write(f"Welcome, {session.get('user_name', 'Guest')}")
    
    # Navigation options
    page = st.sidebar.selectbox(
        "Choose a page",
        ["Home", "Preferences", "Search", "Analytics", "Settings"]
    )
    
    # Quick actions
    st.sidebar.subheader("Quick Actions")
    if st.sidebar.button("🔄 Refresh Recommendations"):
        st.session_state.recommendations = []
        st.rerun()
    
    if st.sidebar.button("🗑️ Clear Preferences"):
        st.session_state.user_preferences = {}
        st.rerun()
    
    return page
```

### 3. Preferences Form (components/preferences.py)
```python
import streamlit as st
from services.api_client import submit_preferences
from utils.validators import validate_preferences

def render_preferences():
    st.header("🎯 Set Your Preferences")
    
    # Location
    location = st.text_input(
        "Location",
        value=st.session_state.user_preferences.get('location', ''),
        help="Enter your city or neighborhood"
    )
    
    # Budget level
    budget = st.select_slider(
        "Budget Level",
        options=['$', '$$', '$$$', '$$$$'],
        value=st.session_state.user_preferences.get('budget', '$$')
    )
    
    # Cuisine preferences
    cuisines = ['Italian', 'Chinese', 'Japanese', 'Indian', 'Mexican', 'Thai']
    selected_cuisines = st.multiselect(
        "Preferred Cuisines",
        options=cuisines,
        default=st.session_state.user_preferences.get('cuisines', [])
    )
    
    # Rating filter
    min_rating = st.slider(
        "Minimum Rating",
        min_value=1.0,
        max_value=5.0,
        step=0.5,
        value=st.session_state.user_preferences.get('min_rating', 3.0)
    )
    
    # Submit button
    if st.button("🚀 Get Recommendations"):
        preferences = {
            'location': location,
            'budget': budget,
            'cuisines': selected_cuisines,
            'min_rating': min_rating
        }
        
        if validate_preferences(preferences):
            with st.spinner("Generating recommendations..."):
                result = submit_preferences(preferences)
                if result['success']:
                    st.session_state.user_preferences = preferences
                    st.session_state.recommendations = result['recommendations']
                    st.success("Recommendations generated successfully!")
                else:
                    st.error("Failed to generate recommendations. Please try again.")
        else:
            st.error("Please fill in all required fields.")
```

### 4. Recommendations Display (components/recommendations.py)
```python
import streamlit as st
import pandas as pd
from services.api_client import get_recommendations

def render_recommendations():
    st.header("🍽️ Your Restaurant Recommendations")
    
    if not st.session_state.recommendations:
        st.info("No recommendations yet. Please set your preferences first.")
        return
    
    # Display recommendations
    for i, rec in enumerate(st.session_state.recommendations, 1):
        with st.expander(f"{i}. {rec['name']} ⭐ {rec['rating']}"):
            col1, col2 = st.columns([2, 1])
            
            with col1:
                st.write(f"**Cuisine:** {rec['cuisine']}")
                st.write(f"**Location:** {rec['location']}")
                st.write(f"**Price:** {rec['price_range']}")
                st.write(f"**Rating:** {'⭐' * int(rec['rating'])}")
                st.write(f"**Description:** {rec['description']}")
                st.write(f"**Why we recommend this:** {rec['explanation']}")
            
            with col2:
                if st.button(f"📍 View Details", key=f"details_{i}"):
                    st.write(f"Distance: {rec.get('distance', 'N/A')}")
                    st.write(f"Delivery Time: {rec.get('delivery_time', 'N/A')}")
                    st.write(f"Phone: {rec.get('phone', 'N/A')}")
                    st.write(f"Address: {rec.get('address', 'N/A')}")
    
    # Export options
    st.subheader("Export Options")
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("📊 Download as CSV"):
            df = pd.DataFrame(st.session_state.recommendations)
            csv = df.to_csv(index=False)
            st.download_button(
                label="Download CSV",
                data=csv,
                file_name="recommendations.csv",
                mime="text/csv"
            )
    
    with col2:
        if st.button("📋 Copy to Clipboard"):
            recommendations_text = "\n".join([
                f"{i}. {rec['name']} - {rec['cuisine']} - ⭐{rec['rating']}"
                for i, rec in enumerate(st.session_state.recommendations, 1)
            ])
            st.code(recommendations_text)
```

## Deployment Options

### 1. Streamlit Cloud (Recommended)
```bash
# Deploy to Streamlit Cloud
# 1. Push code to GitHub
# 2. Connect Streamlit Cloud to your repository
# 3. Configure environment variables
# 4. Deploy
```

### 2. Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8501

CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
```

### 3. Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: restaurant-recommender
spec:
  replicas: 3
  selector:
    matchLabels:
      app: restaurant-recommender
  template:
    metadata:
      labels:
        app: restaurant-recommender
    spec:
      containers:
      - name: app
        image: your-registry/restaurant-recommender:latest
        ports:
        - containerPort: 8501
        env:
        - name: BACKEND_API_URL
          value: "http://backend-service:8000"
```

## Performance Optimization

### 1. Caching Strategy
```python
@st.cache_data(ttl=3600)
def get_cached_recommendations(preferences_hash):
    """Cache recommendations for 1 hour"""
    return get_recommendations(preferences_hash)

@st.cache_resource
def load_model():
    """Load ML model once"""
    return load_recommendation_model()
```

### 2. Lazy Loading
```python
def load_recommendations_lazily():
    """Load recommendations only when needed"""
    if 'recommendations_loaded' not in st.session_state:
        with st.spinner("Loading recommendations..."):
            st.session_state.recommendations = get_recommendations()
            st.session_state.recommendations_loaded = True
```

### 3. Background Processing
```python
import threading

def background_recommendation_generation(preferences):
    """Generate recommendations in background"""
    def generate():
        recommendations = get_recommendations(preferences)
        st.session_state.recommendations = recommendations
    
    thread = threading.Thread(target=generate)
    thread.start()
```

## Security Considerations

### 1. Authentication
```python
import streamlit_authenticator as stauth

# Configure authentication
authenticator = stauth.Authenticate(
    config['credentials'],
    config['cookie']['name'],
    config['cookie']['key'],
    config['cookie']['expiry_days'],
    config['preauthorized']
)

name, authentication_status, username = authenticator.login('Login', 'main')
```

### 2. Input Validation
```python
def validate_input(input_data):
    """Validate user input"""
    if not input_data or len(input_data.strip()) == 0:
        return False
    # Add more validation logic
    return True
```

### 3. Rate Limiting
```python
import time
from collections import defaultdict

class RateLimiter:
    def __init__(self, max_requests=100, time_window=3600):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = defaultdict(list)
    
    def is_allowed(self, user_id):
        now = time.time()
        user_requests = self.requests[user_id]
        
        # Remove old requests
        user_requests[:] = [req_time for req_time in user_requests 
                          if now - req_time < self.time_window]
        
        return len(user_requests) < self.max_requests
```

## Monitoring and Analytics

### 1. Performance Metrics
```python
import time
import streamlit as st

def track_performance(func):
    """Decorator to track function performance"""
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        
        # Log performance metrics
        st.session_state.performance_metrics = {
            'function': func.__name__,
            'execution_time': end_time - start_time,
            'timestamp': time.time()
        }
        
        return result
    return wrapper
```

### 2. User Analytics
```python
def track_user_interaction(action, details=None):
    """Track user interactions"""
    if 'user_analytics' not in st.session_state:
        st.session_state.user_analytics = []
    
    st.session_state.user_analytics.append({
        'action': action,
        'details': details,
        'timestamp': time.time(),
        'session_id': st.session_state.get('session_id')
    })
```

## Testing

### 1. Unit Tests
```python
import pytest
import streamlit.testing as stt

def test_preference_submission():
    """Test preference submission functionality"""
    with stt.AppTest.from_file("app.py") as at:
        # Simulate user input
        at.text_input("Location").set_value("New York")
        at.select_slider("Budget Level").set_value("$$")
        at.button("🚀 Get Recommendations").click()
        
        # Assert results
        assert at.session_state.recommendations is not None
        assert len(at.session_state.recommendations) > 0
```

### 2. Integration Tests
```python
def test_api_integration():
    """Test backend API integration"""
    response = submit_preferences(test_preferences)
    assert response['success'] is True
    assert 'recommendations' in response
```

## Troubleshooting

### Common Issues
1. **Port conflicts**: Change port using `--server.port`
2. **CORS errors**: Enable CORS in backend
3. **Memory issues**: Implement caching and lazy loading
4. **Slow performance**: Optimize database queries and API calls

### Debug Mode
```bash
# Run with debug mode
streamlit run app.py --logger.level=debug

# Enable developer tools
streamlit run app.py --server.enableCORS=false --server.enableXsrfProtection=false
```

## Next Steps

1. **Deploy to production** using Streamlit Cloud or other platforms
2. **Implement user authentication** for multi-tenant support
3. **Add real-time features** like live recommendations
4. **Integrate payment processing** for premium features
5. **Scale horizontally** for high traffic scenarios

---

This Phase 8 implementation provides a complete, production-ready Streamlit application that brings together all previous phases into an intuitive, interactive web interface for the AI Restaurant Recommender system.
