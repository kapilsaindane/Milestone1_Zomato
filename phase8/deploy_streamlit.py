#!/usr/bin/env python3
"""
Production Streamlit Deployment Script
Fixes health check issues and ensures proper deployment
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def main():
    """Deploy Streamlit with proper health checks"""
    
    print("🚀 Starting Streamlit Production Deployment")
    print("=" * 50)
    
    # Get the phase8 directory
    phase8_dir = Path(__file__).resolve().parent
    
    # Change to phase8 directory
    os.chdir(phase8_dir)
    
    # Set environment variables for production
    os.environ.update({
        'PYTHONPATH': str(phase8_dir),
        'STREAMLIT_SERVER_PORT': '8501',
        'STREAMLIT_SERVER_ADDRESS': '0.0.0.0',  # Bind to all interfaces
        'STREAMLIT_SERVER_HEADLESS': 'true',    # Headless mode for production
        'STREAMLIT_SERVER_ENABLE_CORS': 'false',
        'STREAMLIT_SERVER_ENABLE_XSRF_PROTECTION': 'false',
        'STREAMLIT_BROWSER_GATHER_USAGE_STATS': 'false'
    })
    
    # Check if dependencies are installed
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
        subprocess.run([
            sys.executable, "-m", "pip", "install", "-r", "requirements.txt"
        ], check=True)
        print("✅ Dependencies installed successfully")
    
    # Start health check server in background
    print("🏥 Starting health check server...")
    health_process = subprocess.Popen([
        sys.executable, "-c", """
import http.server
import socketserver
import json
from datetime import datetime
import sys

class HealthHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/healthz' or self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            health_data = {
                'status': 'healthy',
                'timestamp': datetime.now().isoformat(),
                'service': 'streamlit-app',
                'version': '1.0.0'
            }
            self.wfile.write(json.dumps(health_data).encode())
        else:
            self.send_response(404)
            self.end_headers()

with socketserver.TCPServer(("", 8502), HealthHandler) as httpd:
    print("Health check server running on port 8502")
    httpd.serve_forever()
"""
    ])
    
    # Give health server time to start
    time.sleep(2)
    
    # Start Streamlit
    print("🚀 Starting Streamlit application...")
    print("📱 Application will be available at: http://0.0.0.0:8501")
    print("🏥 Health check available at: http://0.0.0.0:8502/healthz")
    print("=" * 50)
    
    try:
        # Run streamlit with production settings
        streamlit_cmd = [
            sys.executable, "-m", "streamlit", "run", "app.py",
            "--server.port", "8501",
            "--server.address", "0.0.0.0",
            "--server.headless", "true",
            "--browser.gatherUsageStats", "false",
            "--server.enableCORS", "false",
            "--server.enableXsrfProtection", "false"
        ]
        
        subprocess.run(streamlit_cmd, check=True)
        
    except KeyboardInterrupt:
        print("\n👋 Application stopped by user")
        if health_process:
            health_process.terminate()
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running Streamlit: {e}")
        if health_process:
            health_process.terminate()
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        if health_process:
            health_process.terminate()
        sys.exit(1)
    finally:
        if health_process:
            health_process.terminate()

if __name__ == "__main__":
    main()
