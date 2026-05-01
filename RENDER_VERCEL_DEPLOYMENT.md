# Render + Vercel Deployment Guide

## Architecture Overview

```
Frontend (Next.js) → Vercel
Backend (FastAPI)  → Render
```

## Backend Deployment on Render

### 1. Prepare Backend

**Create `requirements.txt` (if not exists):**
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
requests==2.31.0
python-dotenv==1.0.0
huggingface_hub==0.19.4
pandas==2.1.4
numpy==1.24.3
groq==0.4.1
```

**Create `render.yaml`:**
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
```

### 2. Deploy to Render

1. **Push to GitHub** (already done)
2. **Go to [Render Dashboard](https://dashboard.render.com)**
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository**
5. **Select the root directory**
6. **Use the `render.yaml` configuration**
7. **Set environment variables:**
   - `GROQ_API_KEY`: Your Groq API key
   - `PYTHON_VERSION`: 3.9
8. **Click "Deploy"**

### 3. Backend URL

After deployment, your backend will be available at:
```
https://restaurant-recommender-api.onrender.com
```

## Frontend Deployment on Vercel

### 1. Prepare Frontend

**Create `vercel.json` in `nextjs-frontend/`:**
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

**Update `nextjs-frontend/package.json`:**
```json
{
  "name": "restaurant-recommender-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18",
    "axios": "^1.6.0",
    "lucide-react": "^0.294.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.0.0"
  }
}
```

### 2. Deploy to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Select the `nextjs-frontend` directory**
5. **Configure environment variables:**
   - `NEXT_PUBLIC_API_URL`: `https://restaurant-recommender-api.onrender.com`
6. **Click "Deploy"**

### 3. Frontend URL

After deployment, your frontend will be available at:
```
https://your-project-name.vercel.app
```

## Environment Variables

### Backend (Render)
- `GROQ_API_KEY`: Your Groq API key
- `HF_DATASET_ID`: `ManikaSaini/zomato-restaurant-recommendation`
- `TOP_N_CANDIDATES`: `30`
- `LOG_LEVEL`: `INFO`
- `ENVIRONMENT`: `production`

### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL`: `https://restaurant-recommender-api.onrender.com`
- `NEXT_PUBLIC_APP_NAME`: `AI Restaurant Recommender`

## Deployment Commands

### Backend (Render)
```bash
# Push changes to trigger deployment
git add .
git commit -m "Update backend"
git push origin main
```

### Frontend (Vercel)
```bash
# Push changes to trigger deployment
cd nextjs-frontend
git add .
git commit -m "Update frontend"
git push origin main
```

## Testing the Deployment

### 1. Test Backend Health
```bash
curl https://restaurant-recommender-api.onrender.com/health
```

### 2. Test Frontend
Visit your Vercel URL and check if the app loads properly.

### 3. Test API Integration
```bash
curl -X POST https://restaurant-recommender-api.onrender.com/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{"location": "New York", "budget": "$$", "cuisines": ["Italian"]}'
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Add CORS middleware to FastAPI backend
   - Ensure frontend URL is allowed

2. **Environment Variables**
   - Check that all required env vars are set
   - Verify API keys are correct

3. **Build Failures**
   - Check logs in Render/Vercel dashboards
   - Ensure all dependencies are in requirements.txt

4. **Connection Issues**
   - Verify backend is running and healthy
   - Check API URL in frontend configuration

### Monitoring

- **Render**: Check dashboard for logs and metrics
- **Vercel**: Check dashboard for build logs and analytics

## Cost Analysis

### Render (Free Tier)
- **Web Service**: Free (750 hours/month)
- **Database**: Free (256MB storage)
- **Bandwidth**: 100GB/month

### Vercel (Free Tier)
- **Hobby Plan**: Free
- **Bandwidth**: 100GB/month
- **Builds**: 100/month

**Total Cost**: $0/month (within free tiers)

## Next Steps

1. Deploy backend to Render
2. Deploy frontend to Vercel
3. Test integration
4. Set up custom domains (optional)
5. Configure monitoring and alerts
