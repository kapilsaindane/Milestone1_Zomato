import streamlit as st
import sys
import requests
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Import the FastAPI app
from main import app

# Streamlit configuration
st.set_page_config(
    page_title="AI Restaurant Recommender",
    page_icon="🍽️",
    layout="wide"
)

def main():
    st.title("🍽️ AI Restaurant Recommender Backend")
    st.markdown("---")
    
    # API Information
    st.header("API Information")
    st.write("FastAPI application is running!")
    
    # Show available endpoints
    st.header("Available Endpoints")
    
    endpoints = [
        {"Method": "GET", "Endpoint": "/health", "Description": "Health check"},
        {"Method": "GET", "Endpoint": "/api/status", "Description": "Get system status"},
        {"Method": "POST", "Endpoint": "/api/preferences", "Description": "Create preference profile"},
        {"Method": "GET", "Endpoint": "/api/preferences", "Description": "Get current preferences"},
        {"Method": "POST", "Endpoint": "/api/recommendations", "Description": "Get recommendations"},
        {"Method": "GET", "Endpoint": "/api/recommendations/latest", "Description": "Get latest recommendations"},
        {"Method": "GET", "Endpoint": "/api/restaurants/search", "Description": "Search restaurants"},
        {"Method": "GET", "Endpoint": "/api/analytics/summary", "Description": "Get analytics summary"},
    ]
    
    st.table(endpoints)
    
    # Health check
    st.header("System Health")
    try:
        # Try to import and test the services
        from services.phase_service import PhaseService
        phase_service = PhaseService()
        
        # Test basic functionality
        with st.spinner("Testing system health..."):
            status = phase_service.get_system_status()
            st.success("✅ System is healthy!")
            st.json(status.dict())
    except Exception as e:
        st.error(f"❌ System health check failed: {str(e)}")
        st.write("This might be due to missing dependencies or configuration issues.")
    
    # Configuration info
    st.header("Configuration")
    st.write(f"Backend directory: {backend_dir}")
    st.write(f"Python path entries: {sys.path[:3]}")
    
    # API Documentation links
    st.header("API Documentation")
    st.write("When running as a FastAPI server, you can access:")
    st.write("- Swagger UI: `/api/docs`")
    st.write("- ReDoc: `/api/redoc`")
    
    # Instructions for running as FastAPI
    st.header("Running as FastAPI Server")
    st.code("""
# To run this as a FastAPI server instead of Streamlit:
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000

# Or for development with reload:
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    """)

if __name__ == "__main__":
    main()
