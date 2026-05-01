#!/usr/bin/env python3
"""
Phase 8 Launcher Script
Run the Streamlit application for Phase 8: Streamlit Deployment and Production Interface
"""

import os
import sys
import subprocess
from pathlib import Path

def main():
    """Main launcher function"""
    
    print("🚀 Starting Phase 8: Streamlit Deployment and Production Interface")
    print("=" * 60)
    
    # Get the current directory
    phase8_root = Path(__file__).resolve().parent
    
    # Check if we're in the right directory
    if not (phase8_root / "app.py").exists():
        print("❌ Error: app.py not found. Please run this script from the phase8 directory.")
        sys.exit(1)
    
    # Check if requirements are installed
    print("📦 Checking dependencies...")
    try:
        import streamlit
        import pandas
        import plotly
        import requests
        print("✅ All dependencies are installed")
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("📦 Installing dependencies...")
        
        # Install requirements
        requirements_file = phase8_root / "requirements.txt"
        if requirements_file.exists():
            subprocess.run([
                sys.executable, "-m", "pip", "install", "-r", str(requirements_file)
            ], check=True)
            print("✅ Dependencies installed successfully")
        else:
            print("❌ requirements.txt not found")
            sys.exit(1)
    
    # Check backend health
    print("🔍 Checking backend service...")
    try:
        import requests
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend service is running")
        else:
            print("⚠️ Backend service is not responding correctly")
    except requests.exceptions.ConnectionError:
        print("⚠️ Backend service is not running. Some features may be limited.")
    except Exception as e:
        print(f"⚠️ Backend check failed: {e}")
    
    # Set environment variables
    print("⚙️ Setting up environment...")
    os.environ.setdefault('STREAMLIT_SERVER_PORT', '8501')
    os.environ.setdefault('STREAMLIT_SERVER_ADDRESS', 'localhost')
    os.environ.setdefault('BACKEND_API_URL', 'http://localhost:8000')
    
    # Create .streamlit directory if it doesn't exist
    streamlit_config_dir = phase8_root / ".streamlit"
    if not streamlit_config_dir.exists():
        streamlit_config_dir.mkdir(exist_ok=True)
        print("📁 Created .streamlit directory")
    
    # Launch Streamlit
    print("🚀 Launching Streamlit application...")
    print("=" * 60)
    print("📱 Application will be available at: http://localhost:8501")
    print("🛑 Press Ctrl+C to stop the application")
    print("=" * 60)
    
    try:
        # Run streamlit
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", 
            str(phase8_root / "app.py"),
            "--server.port", "8501",
            "--server.address", "localhost",
            "--browser.gatherUsageStats", "false"
        ], check=True)
        
    except KeyboardInterrupt:
        print("\n👋 Application stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running Streamlit: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
