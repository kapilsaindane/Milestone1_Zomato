#!/usr/bin/env python3
"""
Streamlit Launcher with Proper Python Path Setup
"""

import sys
import os
from pathlib import Path

def main():
    """Setup path and launch Streamlit"""
    
    # Get the phase8 directory
    phase8_dir = Path(__file__).resolve().parent
    
    # Add phase8 directory to Python path
    if str(phase8_dir) not in sys.path:
        sys.path.insert(0, str(phase8_dir))
    
    # Change to phase8 directory
    os.chdir(phase8_dir)
    
    # Set environment variables
    os.environ['PYTHONPATH'] = str(phase8_dir)
    
    # Import and run the app
    try:
        import streamlit
        
        # Run streamlit with the app
        sys.argv = [
            'streamlit', 'run', 'app.py',
            '--server.port', '8501',
            '--server.address', 'localhost',
            '--browser.gatherUsageStats', 'false'
        ]
        
        streamlit.cli.main()
        
    except ImportError:
        print("❌ Streamlit not installed. Please install with:")
        print("pip install streamlit")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error starting Streamlit: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
