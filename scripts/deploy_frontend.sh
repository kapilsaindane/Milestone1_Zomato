#!/bin/bash

# Frontend Deployment Script for Vercel
# This script prepares the frontend for deployment to Vercel

echo "🚀 Preparing Frontend for Vercel Deployment"
echo "=========================================="

# Check if we're in the right directory
if [ ! -d "nextjs-frontend" ]; then
    echo "❌ Error: nextjs-frontend directory not found."
    exit 1
fi

cd nextjs-frontend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found."
    exit 1
fi

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found."
    exit 1
fi

echo "✅ Frontend structure verified"

# Check for required environment variables
if [ -z "$NEXT_PUBLIC_API_URL" ]; then
    echo "⚠️  Warning: NEXT_PUBLIC_API_URL not set"
    echo "   Using default: https://restaurant-recommender-api.onrender.com"
    export NEXT_PUBLIC_API_URL="https://restaurant-recommender-api.onrender.com"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

# Build the application
echo "🔨 Building Next.js application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Frontend build successful"

# Test the build locally
echo "🧪 Testing build locally..."
npm start &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 10

# Test if frontend is running
curl -f http://localhost:3000 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Frontend test passed"
else
    echo "❌ Frontend test failed"
    kill $FRONTEND_PID
    exit 1
fi

# Stop frontend
kill $FRONTEND_PID

cd ..

echo ""
echo "✅ Frontend preparation complete"
echo ""
echo "📋 Next Steps for Vercel Deployment:"
echo "1. Make sure backend is deployed first"
echo "2. Go to https://vercel.com/dashboard"
echo "3. Click 'New Project'"
echo "4. Import your GitHub repository"
echo "5. Select 'nextjs-frontend' directory"
echo "6. Set environment variable:"
echo "   NEXT_PUBLIC_API_URL=https://restaurant-recommender-api.onrender.com"
echo "7. Click 'Deploy'"
echo ""
echo "🎯 Your frontend will be available at:"
echo "   https://your-project-name.vercel.app"
echo ""
echo "🔗 Don't forget to update the backend CORS configuration"
echo "   to allow your Vercel domain!"
