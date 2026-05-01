# AI Restaurant Recommender - Full Stack Architecture

## Overview

This document describes the complete backend and frontend architecture for the AI Restaurant Recommendation System after Phase 5, transforming the phase-based pipeline into a production-ready web application.

## Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Phase System  │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   (Phases 0-4)  │
│                 │    │                 │    │                 │
│ - UI Components │    │ - API Routes    │    │ - Data Processing│
│ - State Mgmt    │    │ - Business Logic│    │ - LLM Integration│
│ - API Client    │    │ - CORS/Security │    │ - File Storage  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Backend Architecture

### Technology Stack
- **Framework**: FastAPI
- **Database**: SQLite (development), PostgreSQL (production)
- **LLM**: Groq (llama-3.3-70b-versatile)
- **Data Processing**: Pandas, NumPy
- **API Documentation**: OpenAPI/Swagger

### Directory Structure
```
backend/
├── main.py                 # FastAPI application entry point
├── core/
│   └── config.py          # Configuration and settings
├── api/
│   └── routes.py          # API route definitions
├── services/
│   └── phase_service.py   # Business logic for phase operations
├── models/
│   └── schemas.py         # Pydantic models for API
└── requirements.txt       # Python dependencies
```

### API Endpoints

#### System Management
- `GET /api/status` - System health and phase status
- `GET /api/health` - Basic health check

#### Preference Management
- `POST /api/preferences` - Create/update preference profile
- `GET /api/preferences` - Get current preferences

#### Recommendation System
- `POST /api/recommendations` - Generate new recommendations
- `GET /api/recommendations/latest` - Get latest recommendations

#### Search & Discovery
- `GET /api/restaurants/search` - Search restaurants with filters

#### Analytics
- `GET /api/analytics/summary` - System analytics and insights

#### Phase Management
- `GET /api/phases/{phase_name}/run` - Run specific phase
- `GET /api/phases/{phase_name}/status` - Get phase status

### Key Features
1. **Async Processing**: Background tasks for long-running operations
2. **Error Handling**: Comprehensive error management
3. **CORS Support**: Cross-origin resource sharing
4. **API Documentation**: Auto-generated OpenAPI docs
5. **Environment Configuration**: Flexible settings management

## Frontend Architecture

### Technology Stack
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: React Query
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Directory Structure
```
frontend/
├── src/
│   ├── App.tsx              # Main application component
│   ├── components/
│   │   └── Navbar.tsx       # Navigation component
│   ├── pages/
│   │   ├── Home.tsx          # Dashboard/home page
│   │   ├── Preferences.tsx   # Preference management
│   │   ├── Recommendations.tsx # AI recommendations display
│   │   ├── Search.tsx        # Restaurant search
│   │   ├── Analytics.tsx      # System analytics
│   │   └── SystemStatus.tsx  # System monitoring
│   ├── services/
│   │   └── api.ts           # API client and types
│   └── package.json         # Dependencies and scripts
```

### Key Features
1. **Responsive Design**: Mobile-first approach
2. **Real-time Updates**: Auto-refreshing data
3. **Interactive Charts**: Analytics visualization
4. **Form Management**: Complex preference forms
5. **Error Boundaries**: Graceful error handling
6. **Loading States**: Progressive loading indicators

## Page Descriptions

### 1. Home Page (`/`)
- **Purpose**: Welcome dashboard and quick actions
- **Features**: Feature highlights, quick navigation, system overview
- **Actions**: Navigate to preferences, recommendations, search

### 2. Preferences Page (`/preferences`)
- **Purpose**: Set and manage dining preferences
- **Features**: Location, budget, cuisine, ratings, additional preferences
- **Actions**: Save preferences, view current profile

### 3. Recommendations Page (`/recommendations`)
- **Purpose**: Display AI-generated restaurant recommendations
- **Features**: Restaurant cards with AI explanations, ratings, filters
- **Actions**: Refresh recommendations, view details

### 4. Search Page (`/search`)
- **Purpose**: Advanced restaurant search and discovery
- **Features**: Multi-criteria search, filtering, results display
- **Actions**: Search by name, location, cuisine, apply filters

### 5. Analytics Page (`/analytics`)
- **Purpose**: System analytics and insights
- **Features**: Charts, statistics, popular locations/cuisines
- **Actions**: View trends, system performance metrics

### 6. System Status Page (`/status`)
- **Purpose**: Monitor system and phase status
- **Features**: Phase progress, system health, manual phase execution
- **Actions**: Run phases, view logs, monitor performance

## Integration with Existing Phases

### Phase 1: Data Foundation
- **Backend**: Loads cleaned data from Phase 1 output
- **Frontend**: Analytics page shows dataset statistics
- **API**: `/analytics/summary` uses Phase 1 data

### Phase 2: Preference Capture
- **Backend**: Direct integration with Phase 2 preference system
- **Frontend**: Preferences page manages Phase 2 profiles
- **API**: `/preferences` endpoints map to Phase 2 functionality

### Phase 3: Candidate Retrieval
- **Backend**: Triggers Phase 3 scripts for candidate generation
- **Frontend**: System status shows Phase 3 progress
- **API**: `/phases/phase3/run` executes Phase 3 pipeline

### Phase 4: LLM Reasoning
- **Backend**: Integrates with Groq API for LLM recommendations
- **Frontend**: Recommendations page displays LLM insights
- **API**: `/recommendations` uses Phase 4 output

## Data Flow

1. **User Sets Preferences** → Phase 2 → Preference Profile
2. **User Requests Recommendations** → Phase 3 + Phase 4 → AI Recommendations
3. **User Searches Restaurants** → Phase 1 Data → Filtered Results
4. **System Analytics** → All Phases → Comprehensive Insights

## Security Considerations

### Backend Security
- **CORS**: Configured for frontend origin
- **Input Validation**: Pydantic models for request validation
- **Error Handling**: No sensitive information in error messages
- **Environment Variables**: Sensitive data in .env file

### Frontend Security
- **API Communication**: HTTPS in production
- **Data Validation**: Client-side validation with server-side verification
- **Error Boundaries**: Prevent error information leakage

## Performance Optimizations

### Backend
- **Async Processing**: Background tasks for long operations
- **Caching**: System status and analytics caching
- **Connection Pooling**: Database connection management
- **Lazy Loading**: Load data on-demand

### Frontend
- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Responsive images
- **Caching**: React Query caching with invalidation
- **Virtual Scrolling**: For large result sets

## Deployment Architecture

### Development Environment
```
Frontend (localhost:3000) ←→ Backend (localhost:8000) ←→ Phase Scripts
```

### Production Environment
```
Users ←→ CDN ←→ Frontend (Static) ←→ Backend (API) ←→ Phase Scripts
                                      ↓
                                   Database
```

## Environment Setup

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables
```bash
# .env file
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=sqlite:///./restaurant_recommender.db
DEBUG=false
```

## Future Enhancements

### Backend
1. **Database Integration**: PostgreSQL with SQLAlchemy ORM
2. **Authentication**: JWT-based user authentication
3. **Rate Limiting**: API rate limiting
4. **Logging**: Structured logging with ELK stack
5. **Monitoring**: Prometheus metrics and Grafana dashboards

### Frontend
1. **User Authentication**: Login/logout functionality
2. **Saved Preferences**: User-specific preference storage
3. **Restaurant Details**: Detailed restaurant pages
4. **Reviews System**: User reviews and ratings
5. **Mobile App**: React Native mobile application

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/api/docs`
- **ReDoc**: `http://localhost:8000/api/redoc`

## Testing

### Backend Tests
```bash
cd backend
pytest -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Monitoring and Logging

### System Monitoring
- Phase execution status
- API response times
- Error rates and types
- Resource utilization

### Logging Strategy
- Structured JSON logging
- Log levels (DEBUG, INFO, WARNING, ERROR)
- Log aggregation and analysis
- Performance metrics

This architecture provides a solid foundation for scaling the restaurant recommendation system from a prototype to a production-ready application with proper separation of concerns, security, and performance optimizations.
