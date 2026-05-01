# Environment Variables Guide

## 📋 Overview

This document outlines all the environment variables required for the AI Restaurant Recommender application in different environments.

## 🔧 Environment Files

### Development (.env.development)
For local development and testing:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AI Restaurant Recommender (Dev)
NODE_ENV=development
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_DEBUG_MODE=true
```

### Production (.env.production)
For production deployment on Vercel:
```bash
NEXT_PUBLIC_API_URL=https://restaurant-recommender-api.onrender.com
NEXT_PUBLIC_APP_URL=https://your-project-name.vercel.app
NEXT_PUBLIC_APP_NAME=AI Restaurant Recommender
NODE_ENV=production
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## 🌐 Required Environment Variables

### Frontend Configuration

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | ✅ Yes | `http://localhost:8000` |
| `NEXT_PUBLIC_APP_URL` | Frontend application URL | ✅ Yes | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | Application name | ✅ Yes | `AI Restaurant Recommender` |
| `NODE_ENV` | Environment mode | ✅ Yes | `development` |

### Analytics & Monitoring

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | Google Analytics tracking ID | ❌ No | - |
| `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` | Vercel Analytics ID | ❌ No | - |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics tracking | ❌ No | `false` |

### Feature Flags

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_ENABLE_PWA` | Enable Progressive Web App | ❌ No | `true` |
| `NEXT_PUBLIC_ENABLE_SEO` | Enable SEO optimizations | ❌ No | `true` |
| `NEXT_PUBLIC_ENABLE_BUNDLE_ANALYZER` | Enable bundle analysis | ❌ No | `false` |

### API Configuration

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_TIMEOUT` | API request timeout (ms) | ❌ No | `30000` |
| `NEXT_PUBLIC_API_RETRIES` | API retry attempts | ❌ No | `3` |

### Security

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_ENABLE_CSP` | Enable Content Security Policy | ❌ No | `false` |
| `NEXT_PUBLIC_ENABLE_HSTS` | Enable HSTS security | ❌ No | `false` |

## 🚀 Production Setup

### Step 1: Vercel Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Navigate to **Settings → Environment Variables**
4. Add the following variables:

```bash
NEXT_PUBLIC_API_URL=https://restaurant-recommender-api.onrender.com
NEXT_PUBLIC_APP_NAME=AI Restaurant Recommender
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NODE_ENV=production
```

### Step 2: Backend Environment Variables

For the Render backend, set these in your Render dashboard:

```bash
GROQ_API_KEY=your-groq-api-key
HF_DATASET_ID=ManikaSaini/zomato-restaurant-recommendation
TOP_N_CANDIDATES=30
LOG_LEVEL=INFO
ENVIRONMENT=production
PORT=8000
```

### Step 3: Optional Analytics

Add analytics IDs if you want tracking:

```bash
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=auto
```

## 🔒 Security Notes

### Sensitive Variables
- Never commit `.env` files to version control
- Use Vercel's environment variable management for production
- Rotate API keys regularly

### Public vs Private Variables
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Backend-only variables should not have `NEXT_PUBLIC_` prefix
- Keep API keys and secrets on the backend only

## 🧪 Testing Environment Variables

### Local Development
```bash
# Copy development template
cp .env.development .env.local

# Start development server
npm run dev
```

### Production Build Test
```bash
# Copy production template
cp .env.production .env.local

# Test production build
npm run build
npm start
```

## 📊 Environment-Specific Configurations

### Development Features
- Debug mode enabled
- Analytics disabled
- Relaxed security settings
- Local API endpoints

### Production Features
- Analytics enabled
- Enhanced security
- Production API endpoints
- Optimized performance

## 🔧 Troubleshooting

### Common Issues

1. **API not responding**
   - Check `NEXT_PUBLIC_API_URL` is correct
   - Verify backend is running and accessible

2. **Analytics not working**
   - Ensure `NEXT_PUBLIC_ENABLE_ANALYTICS=true`
   - Verify analytics IDs are correct

3. **Build failures**
   - Check all required variables are set
   - Verify variable formats (no quotes, correct URLs)

### Debug Commands

```bash
# Check current environment variables
npm run env

# Test API connectivity
curl $NEXT_PUBLIC_API_URL/health

# Verify build with production variables
NODE_ENV=production npm run build
```

## 📝 Best Practices

1. **Use environment-specific files**
   - `.env.development` for local development
   - `.env.production` for production deployment

2. **Document your variables**
   - Keep this guide updated
   - Document any custom variables

3. **Regular audits**
   - Review unused variables
   - Update API keys and URLs

4. **Version control**
   - Add `.env*` to `.gitignore`
   - Commit template files only

## 🔄 Variable Updates

When updating environment variables:

1. Update the appropriate `.env` file
2. Update Vercel environment variables
3. Restart the application
4. Test the changes

## 📚 Additional Resources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Render Environment Variables](https://render.com/docs/environment-variables)
