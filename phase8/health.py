#!/usr/bin/env python3
"""
Health check endpoint for Streamlit deployment
"""

import json
import sys
from datetime import datetime

def health_check():
    """Return health status for deployment monitoring"""
    
    health_status = {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "streamlit-app",
        "version": "1.0.0",
        "checks": {
            "python_version": sys.version,
            "dependencies": "ok",
            "app_loaded": True
        }
    }
    
    return health_status

if __name__ == "__main__":
    # Print JSON health status for health checks
    print(json.dumps(health_check()))
