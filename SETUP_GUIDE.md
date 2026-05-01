# Setup Guide - AI Restaurant Recommender

## Quick Start

This guide will help you set up the complete full-stack AI Restaurant Recommender application.

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- Git

## Step 1: Backend Setup

### 1.1 Navigate to Backend Directory
```bash
cd backend
```

### 1.2 Create Virtual Environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 1.3 Install Dependencies
```bash
pip install -r requirements.txt
```

### 1.4 Set Environment Variables
Create a `.env` file in the project root:
```bash
# In the main project directory (not backend/)
echo "GROQ_API_KEY=your_groq_api_key_here" > .env
```

Replace `your_groq_api_key_here` with your actual Groq API key.

### 1.5 Run Initial Phases
Make sure the initial phases have been run:
```bash
# From project root
python phase0/scripts/run_phase0.py
python phase1/scripts/run_phase1.py
```

### 1.6 Start Backend Server
```bash
cd backend
python main.py
```

The backend will start on `http://localhost:8000`

## Step 2: Frontend Setup

### 2.1 Navigate to Frontend Directory
```bash
cd frontend
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Start Frontend Development Server
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Step 3: Verify Setup

### 3.1 Check Backend
- Open `http://localhost:8000/api/docs` in your browser
- You should see the Swagger API documentation
- Check `http://localhost:8000/health` for health status

### 3.2 Check Frontend
- Open `http://localhost:3000` in your browser
- You should see the restaurant recommender interface
- Navigate through different pages to verify functionality

## Step 4: Test the Application

### 4.1 Set Preferences
1. Navigate to Preferences page
2. Enter location (e.g., "Bellandur")
3. Select budget level
4. Set minimum rating
5. Save preferences

### 4.2 Get Recommendations
1. Navigate to Recommendations page
2. Click "Get New Recommendations"
3. Wait for AI processing
4. View the restaurant recommendations with explanations

### 4.3 Search Restaurants
1. Navigate to Search page
2. Enter search criteria
3. Apply filters
4. View search results

### 4.4 View Analytics
1. Navigate to Analytics page
2. View system statistics and charts
3. Explore popular locations and cuisines

### 4.5 Check System Status
1. Navigate to System Status page
2. View phase execution status
3. Run individual phases if needed

## Troubleshooting

### Common Issues

#### Backend Issues
1. **Port Already in Use**
   ```bash
   # Find and kill the process using port 8000
   netstat -ano | findstr :8000  # Windows
   lsof -i :8000                  # Mac/Linux
   ```

2. **Module Not Found**
   ```bash
   # Make sure you're in the backend directory with virtual environment activated
   pip install -r requirements.txt
   ```

3. **GROQ API Key Error**
   - Verify your GROQ API key is correctly set in `.env`
   - Check the API key is valid and has credits

#### Frontend Issues
1. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   npm run build  # Alternative approach
   ```

2. **Module Installation Errors**
   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **CORS Errors**
   - Make sure backend is running on port 8000
   - Check backend CORS configuration

#### Phase Execution Issues
1. **Phase 1 Data Missing**
   ```bash
   python phase0/scripts/run_phase0.py
   python phase1/scripts/run_phase1.py
   ```

2. **Permission Issues**
   - Make sure all scripts have execute permissions
   - Check file permissions in output directories

### Debug Mode

#### Backend Debug Mode
```bash
# Set debug mode in .env
echo "DEBUG=true" >> .env
```

#### Frontend Debug Mode
- Open browser developer tools
- Check console for errors
- Monitor network requests

## Environment Configuration

### Development Environment
```bash
# .env
GROQ_API_KEY=your_groq_api_key
DEBUG=true
DATABASE_URL=sqlite:///./restaurant_recommender.db
```

### Production Environment
```bash
# .env.production
GROQ_API_KEY=your_production_groq_api_key
DEBUG=false
DATABASE_URL=postgresql://user:password@localhost/dbname
```

## API Documentation

Once the backend is running:
- **Swagger UI**: `http://localhost:8000/api/docs`
- **ReDoc**: `http://localhost:8000/api/redoc`

### Key API Endpoints
- `GET /api/status` - System status
- `POST /api/preferences` - Set preferences
- `POST /api/recommendations` - Get recommendations
- `GET /api/restaurants/search` - Search restaurants
- `GET /api/analytics/summary` - System analytics

## Performance Tips

### Backend Performance
1. Use SSD storage for faster data processing
2. Allocate sufficient memory for pandas operations
3. Consider using PostgreSQL for production

### Frontend Performance
1. Use modern browser for better performance
2. Enable hardware acceleration
3. Clear cache if experiencing issues

## Next Steps

After successful setup:
1. Explore the different features
2. Test with various preference combinations
3. Monitor system performance
4. Review the architecture documentation
5. Consider contributing to the project

## Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review the architecture documentation
3. Check the API documentation
4. Verify all prerequisites are met

## Architecture Overview

The application consists of:
- **Backend**: FastAPI server with phase integration
- **Frontend**: React application with Material-UI
- **Phase System**: Data processing pipeline with LLM integration
- **Database**: SQLite (development) / PostgreSQL (production)

For detailed architecture information, see `README_ARCHITECTURE.md`.
