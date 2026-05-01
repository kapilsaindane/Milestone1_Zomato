# Deployment Guide - AI Restaurant Recommender

## 🚀 Free Deployment Options

### 1. **Vercel (Recommended)**
**Best for Next.js applications with zero cost**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
cd nextjs-frontend
vercel --prod

# Benefits:
- Automatic HTTPS
- Global CDN
- Zero config deployments
- GitHub integration
- Built for Next.js
```

### 2. **Netlify**
**Great for static sites with continuous deployment**

```bash
# Build the application
cd nextjs-frontend
npm run build

# Deploy to Netlify
npx netlify deploy --prod --dir=.next

# Benefits:
- Free tier with 100GB bandwidth
- Automatic HTTPS
- Git-based deployments
- Preview deployments
```

### 3. **GitHub Pages**
**Free hosting for static sites**

```bash
# Configure next.config.js for static export
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig

# Build and deploy
cd nextjs-frontend
npm run build
# Deploy out/ folder to GitHub Pages
```

### 4. **Railway**
**Simple backend deployment**

```bash
# Deploy backend
cd backend
railway up

# Deploy frontend
cd nextjs-frontend
railway up

# Benefits:
- $5 free credit
- Automatic HTTPS
- Built-in databases
- Easy scaling
```

### 5. **Render**
**Full-stack deployment platform**

```bash
# Deploy with Docker
# Create Dockerfile for frontend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]

# Deploy
render.com
```

### 6. **Firebase Hosting**
**Google's hosting solution**

```bash
# Build and deploy
cd nextjs-frontend
npm run build
firebase deploy --only hosting

# Benefits:
- Free tier
- Global CDN
- Easy domain management
```

## 📋 Prerequisites

### Environment Setup
```bash
# Node.js (v18+)
node --version

# npm/yarn
npm --version

# Git
git --version
```

### Environment Variables
Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔧 Configuration Files

### 1. **package.json Scripts**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "export": "next export",
    "deploy": "npm run build && npm run export"
  }
}
```

### 2. **next.config.js**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig;
```

### 3. **Dockerfile**
```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=base /app/.next .
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json

EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
```

## 🌐 Domain Setup

### 1. **Custom Domain**
```bash
# Point DNS to deployment platform
# Example for Vercel
vercel domains add yourdomain.com

# Configure next.config.js
const nextConfig = {
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  assetPrefix: '',
}
```

### 2. **SSL Certificate**
Most platforms provide automatic SSL:
- Vercel: Automatic
- Netlify: Automatic
- GitHub Pages: Automatic
- Railway: Automatic

## 📊 Performance Optimization

### 1. **Build Optimization**
```javascript
// next.config.js
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: true,
  },
}
```

### 2. **Image Optimization**
```javascript
// next.config.js
const nextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
}
```

## 🔍 SEO & Analytics

### 1. **Meta Tags**
```typescript
// app/layout.tsx
export const metadata = {
  title: 'AI Restaurant Recommender',
  description: 'Get personalized restaurant recommendations powered by AI',
  keywords: ['restaurants', 'food', 'recommendations', 'AI'],
  openGraph: {
    title: 'AI Restaurant Recommender',
    description: 'Get personalized restaurant recommendations powered by AI',
    images: ['/og-image.jpg'],
  },
}
```

### 2. **Analytics Integration**
```bash
# Google Analytics
npm install @vercel/analytics

# Vercel Analytics (built-in)
# Automatically available on Vercel deployments
```

## 🔒 Security Considerations

### 1. **Environment Variables**
```bash
# Never commit .env files
echo ".env.local" >> .gitignore

# Use platform-specific secrets
# Vercel: vercel env add
# Netlify: netlify env:set
```

### 2. **API Security**
```javascript
// API route protection
export async function middleware(request) {
  const token = request.headers.get('authorization');
  
  if (!token || token !== process.env.API_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  return NextResponse.next();
}
```

## 📱 Mobile Optimization

### 1. **PWA Configuration**
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA(nextConfig);
```

### 2. **Responsive Design**
```css
/* Tailwind CSS for mobile optimization */
@media (max-width: 640px) {
  .container {
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

## 🚀 Quick Start Commands

### **Development**
```bash
# Clone and setup
git clone <your-repo>
cd Milestone1
npm install

# Start development servers
# Terminal 1: Backend
cd backend && python main.py

# Terminal 2: Frontend
cd nextjs-frontend && npm run dev
```

### **Production Deployment**
```bash
# Vercel (Recommended)
vercel --prod

# Alternative: Netlify
npm run build && npx netlify deploy --prod --dir=.next

# Alternative: GitHub Pages
npm run export && gh-pages -d out/
```

## 📈 Monitoring & Maintenance

### 1. **Performance Monitoring**
```bash
# Vercel Analytics
vercel logs

# Custom monitoring
npm install @sentry/nextjs
```

### 2. **Error Tracking**
```javascript
// Error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service
  }
}
```

## 💰 Cost Analysis

### Free Tier Limitations
- **Vercel**: 100GB bandwidth/month, 100 function invocations/month
- **Netlify**: 100GB bandwidth/month, 300 build minutes/month
- **GitHub Pages**: 1GB storage, 100GB bandwidth/month
- **Railway**: $5 credit/month
- **Render**: 750 hours/month free tier

### Recommended Upgrade Path
1. Start with **Vercel** (free)
2. Monitor usage and scale accordingly
3. Upgrade to paid tier when needed

## 🎯 Deployment Checklist

### Pre-Deployment Checklist
- [ ] Environment variables configured
- [ ] Build runs without errors
- [ ] All API endpoints tested
- [ ] Responsive design verified
- [ ] SEO meta tags added
- [ ] Performance optimization applied
- [ ] Security measures implemented
- [ ] Error handling added
- [ ] Analytics tracking configured

### Post-Deployment Checklist
- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] Mobile responsiveness working
- [ ] API endpoints responding
- [ ] Analytics tracking active
- [ ] Error monitoring working
- [ ] SSL certificate valid
- [ ] Performance scores acceptable

## 🆘 Support & Resources

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Netlify Docs](https://docs.netlify.com/)
- [GitHub Pages Docs](https://docs.github.com/en/pages/)

### Troubleshooting
- **Build fails**: Check Node.js version and dependencies
- **Deployment fails**: Verify environment variables and build configuration
- **API errors**: Check CORS settings and backend service status
- **Performance issues**: Optimize images and enable caching
- **Mobile issues**: Test responsive design and viewport settings

---

## 🎉 Ready to Deploy!

Your AI Restaurant Recommender is now ready for deployment using any of the free platforms above. Start with Vercel for the best Next.js experience, or choose the platform that best fits your needs and budget.

**Next Steps:**
1. Choose your deployment platform
2. Configure environment variables
3. Run the deployment command
4. Monitor your application
5. Scale as needed

Good luck with your deployment! 🚀
