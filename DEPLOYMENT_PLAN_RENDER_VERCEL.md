# Production Deployment Plan: Render + Vercel

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │
│   (Next.js)     │◄──►│   (FastAPI)      │
│   Vercel        │    │   Render         │
└─────────────────┘    └─────────────────┘
```

## Phase 1: Backend Deployment (Render)

### 1.1 Prerequisites
- ✅ GitHub repository with backend code
- ✅ Render account (Free tier)
- ✅ Groq API key
- ✅ Backend FastAPI application ready

### 1.2 Backend Configuration Files

**render.yaml** (Root directory):
```yaml
services:
  - type: web
    name: restaurant-recommender-api
    env: python
    plan: free
    buildCommand: "pip install -r requirements.txt"
    startCommand: "python -m uvicorn main:app --host 0.0.0.0 --port $PORT"
    healthCheckPath: /health
    envVars:
      - key: PYTHON_VERSION
        value: 3.9
      - key: GROQ_API_KEY
        sync: false
      - key: HF_DATASET_ID
        value: ManikaSaini/zomato-restaurant-recommendation
      - key: TOP_N_CANDIDATES
        value: 30
      - key: LOG_LEVEL
        value: INFO
      - key: ENVIRONMENT
        value: production

databases:
  - name: restaurant-db
    plan: free
```

**Backend CORS Configuration** (backend/main.py):
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "https://*.vercel.app",
        "https://restaurant-recommender-frontend.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 1.3 Backend Deployment Steps

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

2. **Create Render Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Select root directory
   - Use `render.yaml` configuration
   - Set environment variables:
     - `GROQ_API_KEY`: Your Groq API key
   - Click "Deploy"

3. **Verify Backend Deployment**
   ```bash
   curl https://restaurant-recommender-api.onrender.com/health
   ```

### 1.4 Backend Environment Variables

| Variable | Value | Required |
|----------|-------|----------|
| `GROQ_API_KEY` | Your Groq API key | ✅ |
| `HF_DATASET_ID` | ManikaSaini/zomato-restaurant-recommendation | ✅ |
| `TOP_N_CANDIDATES` | 30 | ✅ |
| `LOG_LEVEL` | INFO | ✅ |
| `ENVIRONMENT` | production | ✅ |
| `PYTHON_VERSION` | 3.9 | ✅ |

## Phase 2: Frontend Deployment (Vercel)

### 2.1 Prerequisites
- ✅ Next.js frontend application
- ✅ Vercel account (Free tier)
- ✅ Backend URL from Render

### 2.2 Frontend Configuration Files

**vercel.json** (nextjs-frontend/):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://restaurant-recommender-api.onrender.com",
    "NEXT_PUBLIC_APP_NAME": "AI Restaurant Recommender"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "https://restaurant-recommender-api.onrender.com"
    }
  }
}
```

**API Client** (nextjs-frontend/lib/api.ts):
```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = {
  health: () => axios.get(`${API_URL}/health`),
  getRecommendations: (preferences: any) => 
    axios.post(`${API_URL}/api/recommendations`, preferences),
  // ... other API methods
};
```

### 2.3 Frontend Deployment Steps

1. **Prepare Frontend Package**
   ```bash
   cd nextjs-frontend
   npm install
   npm run build
   ```

2. **Create Vercel Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import GitHub repository
   - Select `nextjs-frontend` directory
   - Configure environment variables:
     - `NEXT_PUBLIC_API_URL`: `https://restaurant-recommender-api.onrender.com`
   - Click "Deploy"

3. **Verify Frontend Deployment**
   - Visit your Vercel URL
   - Check if app loads and connects to backend

### 2.4 Frontend Environment Variables

| Variable | Value | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_API_URL` | https://restaurant-recommender-api.onrender.com | ✅ |
| `NEXT_PUBLIC_APP_NAME` | AI Restaurant Recommender | ✅ |

## Phase 3: Integration Testing

### 3.1 Health Checks

**Backend Health:**
```bash
curl https://restaurant-recommender-api.onrender.com/health
```

**Frontend Health:**
```bash
curl https://your-project.vercel.app
```

### 3.2 API Integration Test

```bash
curl -X POST https://restaurant-recommender-api.onrender.com/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "location": "New York",
    "budget": "$$",
    "cuisines": ["Italian"],
    "min_rating": 4.0
  }'
```

### 3.3 Frontend-Backend Connection Test

1. Open frontend URL in browser
2. Navigate to preferences page
3. Submit a recommendation request
4. Verify results display correctly

## Phase 4: Production Optimization

### 4.1 Performance Monitoring

**Render Monitoring:**
- Check Render dashboard for metrics
- Monitor response times
- Set up alerts for errors

**Vercel Analytics:**
- Enable Vercel Analytics
- Monitor Core Web Vitals
- Track user interactions

### 4.2 Security Configuration

**Backend Security:**
- HTTPS enforced by default
- CORS properly configured
- API rate limiting (if needed)
- Environment variables secured

**Frontend Security:**
- HTTPS enforced by default
- Environment variables secured
- Content Security Policy (if needed)

### 4.3 Backup and Recovery

**Data Backup:**
- GitHub repository serves as backup
- Database backups (Render provides)
- Environment variables documentation

**Recovery Plan:**
- Redeploy from GitHub if needed
- Restore database from Render backups
- Update environment variables

## Phase 5: Maintenance and Updates

### 5.1 CI/CD Pipeline

**Automatic Deployment:**
- GitHub → Render (Backend)
- GitHub → Vercel (Frontend)
- Trigger on push to main branch

**Deployment Commands:**
```bash
# Backend update
git push origin main

# Frontend update (in nextjs-frontend directory)
git push origin main
```

### 5.2 Monitoring and Alerts

**Key Metrics:**
- API response times
- Error rates
- User engagement
- System uptime

**Alert Setup:**
- Render provides built-in monitoring
- Vercel Analytics for frontend
- Custom logging for critical errors

### 5.3 Scaling Considerations

**Current Limits (Free Tier):**
- Render: 750 hours/month, 256MB RAM
- Vercel: 100GB bandwidth, 100 builds/month

**Scaling Path:**
- Upgrade to paid tiers when needed
- Consider CDN for static assets
- Database scaling for user growth

## Phase 6: Custom Domain Setup (Optional)

### 6.1 Domain Configuration

**Backend Domain:**
- Purchase domain from registrar
- Configure DNS to point to Render
- Update CORS origins

**Frontend Domain:**
- Add custom domain in Vercel dashboard
- Configure DNS records
- Update API URLs if needed

### 6.2 SSL Certificates

- Automatic SSL from both platforms
- No manual configuration needed
- HTTPS enforced by default

## Timeline and Resources

### Deployment Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Backend Deployment | 30 minutes | GitHub repo, API keys |
| Frontend Deployment | 20 minutes | Backend URL |
| Integration Testing | 15 minutes | Both deployments |
| Production Setup | 45 minutes | Testing complete |

**Total Estimated Time:** ~2 hours

### Required Resources

**Accounts:**
- GitHub (Free)
- Render (Free tier)
- Vercel (Free tier)

**API Keys:**
- Groq API key
- Hugging Face (for dataset)

**Technical Skills:**
- Basic Git knowledge
- Environment variable configuration
- API testing

### Cost Analysis

**Monthly Costs (Free Tier):**
- Render: $0
- Vercel: $0
- GitHub: $0
- Groq API: Usage-based
- **Total:** $0 + API usage

**Paid Tier Considerations:**
- Render Starter: $7/month
- Vercel Pro: $20/month
- Recommended when scaling beyond free limits

## Troubleshooting Guide

### Common Issues

1. **CORS Errors**
   - Verify backend CORS configuration
   - Check frontend API URL
   - Ensure HTTPS is used

2. **Environment Variables**
   - Verify all required variables are set
   - Check for typos in variable names
   - Restart services after changes

3. **Build Failures**
   - Check build logs in dashboards
   - Verify dependencies in requirements.txt/package.json
   - Ensure all files are committed to Git

4. **Connection Issues**
   - Test backend health endpoint
   - Verify frontend API calls
   - Check network connectivity

### Support Resources

- **Render Documentation:** https://render.com/docs
- **Vercel Documentation:** https://vercel.com/docs
- **GitHub Support:** https://support.github.com
- **Community Forums:** Platform-specific forums

## Success Criteria

### Deployment Success Metrics

✅ **Backend:**
- Health endpoint returns 200
- API endpoints respond correctly
- CORS allows frontend access

✅ **Frontend:**
- Application loads without errors
- API calls work correctly
- UI displays properly

✅ **Integration:**
- End-to-end user flow works
- Recommendations generate successfully
- No console errors

### Performance Targets

- **API Response Time:** < 2 seconds
- **Frontend Load Time:** < 3 seconds
- **Uptime:** > 99%
- **Error Rate:** < 1%

## Next Steps

1. **Execute Deployment Plan**
2. **Monitor Performance**
3. **Gather User Feedback**
4. **Iterate and Improve**
5. **Scale as Needed**

This deployment plan provides a comprehensive roadmap for successfully deploying the AI Restaurant Recommender system on Render and Vercel with production-ready configurations.
