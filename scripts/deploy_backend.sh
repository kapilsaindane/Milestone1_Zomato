#!/bin/bash

# Backend Deployment Script for Render
# This script prepares the backend for deployment to Render

echo "🚀 Preparing Backend for Render Deployment"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "render.yaml" ]; then
    echo "❌ Error: render.yaml not found. Please run from project root."
    exit 1
fi

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found."
    exit 1
fi

# Check if requirements.txt exists
if [ ! -f "backend/requirements.txt" ]; then
    echo "❌ Error: backend/requirements.txt not found."
    exit 1
fi

# Verify backend main.py exists
if [ ! -f "backend/main.py" ]; then
    echo "❌ Error: backend/main.py not found."
    exit 1
fi

echo "✅ Backend structure verified"

# Check for required environment variables
if [ -z "$GROQ_API_KEY" ]; then
    echo "⚠️  Warning: GROQ_API_KEY not set in environment"
    echo "   Please set it before deployment to Render"
fi

# Test backend locally (optional)
echo "🧪 Testing backend locally..."
cd backend

# Check if Python dependencies are installed
python -c "import fastapi, uvicorn" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📦 Installing Python dependencies..."
    pip install -r requirements.txt
fi

# Start backend in background for testing
echo "🔄 Starting backend server for local testing..."
python -m uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Test health endpoint
echo "🏥 Testing health endpoint..."
curl -f http://localhost:8000/health
if [ $? -eq 0 ]; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    kill $BACKEND_PID
    exit 1
fi

# Stop backend
kill $BACKEND_PID
cd ..

echo "✅ Backend tests passed"
echo ""
echo "📋 Next Steps for Render Deployment:"
echo "1. Push code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for Render deployment'"
echo "   git push origin main"
echo ""
echo "2. Go to https://dashboard.render.com"
echo "3. Click 'New +' → 'Web Service'"
echo "4. Connect your GitHub repository"
echo "5. Use render.yaml configuration"
echo "6. Set GROQ_API_KEY environment variable"
echo "7. Click 'Deploy'"
echo ""
echo "🎯 Your backend will be available at:"
echo "   https://restaurant-recommender-api.onrender.com"
