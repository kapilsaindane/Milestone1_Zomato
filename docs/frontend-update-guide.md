# Frontend Update Guide

## Using Google Stitch vs Manual Updates

The Google Stitch project you referenced appears to be a web-based UI generator tool, but the content is heavily obfuscated and doesn't provide a direct code integration method. Instead, here's a comprehensive guide for updating your frontend manually with modern best practices.

## Recommended Approach: Manual Frontend Updates

### 1. Modern UI Framework Migration
Since you have both React (Material-UI) and Next.js (Phase 7) implementations, consider:

**Option A: Enhance Existing React Frontend**
- Keep Material-UI for consistency
- Add modern components gradually
- Use React Query for state management
- Implement responsive design improvements

**Option B: Migrate to Next.js Completely**
- Use your existing Phase 7 Next.js implementation
- Better performance and SEO
- Modern React patterns with App Router

### 2. UI/UX Improvements

#### Modern Component Library
```bash
# For React frontend
npm install @mui/x-date-pickers @mui/x-data-grid @mui/icons-material

# For Next.js frontend  
npm install @headlessui/react @headlessui/tailwindcss
```

#### Enhanced Design System
```typescript
// theme.ts - Create a comprehensive theme
export const lightTheme = {
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#fafafa',
    paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      borderRadius: 8,
    },
  },
}
```

### 3. Performance Optimizations

#### Code Splitting
```typescript
// Lazy load components
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Analytics = React.lazy(() => import('./pages/Analytics'));

// Use Suspense for loading states
<Suspense fallback={<CircularProgress />}>
  <Dashboard />
</Suspense>
```

#### Image Optimization
```typescript
// Next.js Image component
import Image from 'next/image';

<Image
  src="/restaurant-image.jpg"
  alt="Restaurant"
  width={500}
  height={300}
  priority={true}
  loading="lazy"
/>
```

### 4. Advanced Features Implementation

#### Real-time Updates with WebSocket
```typescript
// hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';

export const useWebSocket = (url: string) => {
  const ws = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    ws.current = new WebSocket(url);
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Handle real-time updates
    };
    
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);
  
  return ws.current;
};
```

#### Advanced Search with Debouncing
```typescript
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

### 5. Mobile-First Responsive Design

#### CSS-in-JS Solutions
```typescript
// styles/responsive.ts
export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  laptop: '1366px',
};

export const useResponsive = () => {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return {
    isMobile: width < breakpoints.mobile,
    isTablet: width >= breakpoints.mobile && width < breakpoints.tablet,
    isDesktop: width >= breakpoints.desktop,
  };
};
```

### 6. State Management Enhancements

#### Zustand for Global State
```bash
# Install Zustand
npm install zustand

# Store setup
// store/useRestaurantStore.ts
import { create } from 'zustand';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
}

interface RestaurantStore {
  restaurants: Restaurant[];
  favorites: string[];
  filters: {
    cuisine: string;
    priceRange: string;
    rating: number;
  };
}

export const useRestaurantStore = create<RestaurantStore>((set) => ({
  restaurants: [],
  favorites: [],
  filters: {
    cuisine: 'all',
    priceRange: 'all',
    rating: 0,
  },
  
  addRestaurant: (restaurant: Restaurant) => set((state) => ({
    restaurants: [...state.restaurants, restaurant],
  })),
  
  toggleFavorite: (id: string) => set((state) => ({
    favorites: state.favorites.includes(id) 
      ? state.favorites.filter(fId => fId !== id)
      : [...state.favorites, id],
  })),
}));
```

### 7. Testing Strategy

#### Component Testing
```typescript
// components/__tests__/RestaurantCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { RestaurantCard } from '../RestaurantCard';

describe('RestaurantCard', () => {
  const mockRestaurant = {
    id: '1',
    name: 'Test Restaurant',
    cuisine: 'Italian',
    rating: 4.5,
  };

  test('renders restaurant information', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    
    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
    expect(screen.getByText('Italian')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  test('handles favorite toggle', () => {
    const onFavoriteToggle = jest.fn();
    render(<RestaurantCard restaurant={mockRestaurant} onFavoriteToggle={onFavoriteToggle} />);
    
    fireEvent.click(screen.getByRole('button', { name: /favorite/i }));
    expect(onFavoriteToggle).toHaveBeenCalledWith('1');
  });
});
```

### 8. Deployment Optimizations

#### Build Optimization
```json
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: true,
  },
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compiler: {
    removeConsole: {
      exclude: ['error-.*'],
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
```

### 9. SEO and Meta Tags

#### Dynamic Metadata
```typescript
// pages/_app.tsx (Next.js)
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Restaurant Recommender',
  description: 'Get personalized restaurant recommendations powered by AI',
  keywords: ['restaurants', 'food', 'recommendations', 'AI'],
  openGraph: {
    title: 'AI Restaurant Recommender',
    description: 'Get personalized restaurant recommendations powered by AI',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Restaurant Recommender',
    description: 'Get personalized restaurant recommendations powered by AI',
    images: ['/twitter-image.jpg'],
  },
};
```

### 10. Integration with Modern Tools

#### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"],
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    "**/*.js",
    "**/*.json"
  ],
  "exclude": [
    "node_modules",
    ".next",
    "dist",
    "build"
  ]
}
```

### Implementation Priority

1. **Start with Performance**: Optimize bundle size and loading
2. **Mobile-First**: Ensure responsive design works on all devices
3. **Accessibility**: Add ARIA labels and keyboard navigation
4. **SEO**: Implement proper meta tags and structured data
5. **Testing**: Add comprehensive test coverage
6. **Modern Patterns**: Use hooks, context, and modern React patterns

### Next Steps

1. Choose your preferred approach (React vs Next.js)
2. Implement the performance optimizations
3. Add the advanced features gradually
4. Set up proper testing framework
5. Configure build and deployment pipeline

This approach gives you full control over your frontend development while following modern best practices, rather than depending on external tools that may have limitations.
