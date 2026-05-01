# Frontend UI Generation Prompt for Google Stitch

## Overview
Generate a modern, professional Next.js frontend for an AI-powered restaurant recommendation system with Material-UI design system.

## Project Context
This is a full-stack restaurant recommendation application that uses AI/LLM to provide personalized dining suggestions. The system analyzes user preferences, filters restaurants, and generates intelligent recommendations with explanations.

## Technical Requirements
- **Framework**: Next.js 14+ with TypeScript
- **UI Library**: Material-UI (MUI) v5+
- **Styling**: Material-UI theme with custom colors
- **Icons**: Lucide React icons
- **State Management**: React Query for API state management
- **Charts**: Recharts for analytics visualizations
- **Routing**: Next.js App Router
- **Responsive**: Mobile-first responsive design

## Design System
- **Primary Color**: #e53935 (Zomato-like red)
- **Secondary Color**: #ffc107 (Gold accent)
- **Typography**: Roboto font family
- **Design Style**: Modern, clean, food delivery app inspired
- **Layout**: Card-based layouts with proper spacing
- **Components**: Use Material-UI components consistently

## Pages to Generate

### 1. Home Page (/)
**Purpose**: Dashboard and landing page
**Components**:
- Hero section with app branding
- Feature highlights cards
- Quick action buttons (Set Preferences, Get Recommendations)
- "How It Works" section with step-by-step process
- Recent activity or popular restaurants section
- Statistics overview cards

### 2. Preferences Page (/preferences)
**Purpose**: User preference capture form
**Components**:
- Multi-step preference form
- Location selector (dropdown/search)
- Budget level selector (Low/Medium/High)
- Cuisine multi-select with chips
- Minimum rating slider
- Additional preferences checkboxes
- Save/Reset buttons
- Form validation and progress indicator

### 3. Recommendations Page (/recommendations)
**Purpose**: Display AI-generated recommendations
**Components**:
- Recommendation cards with restaurant details
- AI explanation sections
- Rating displays with stars
- Confidence score badges
- Interactive feedback buttons (Like/Dislike/Neutral)
- Refresh recommendations button
- Filter/sort options
- Loading states and skeletons

### 4. Search Page (/search)
**Purpose**: Advanced restaurant search
**Components**:
- Search bar with autocomplete
- Filter sidebar (Location, Cuisine, Rating, Price)
- Search results grid/list
- Restaurant cards with key info
- Pagination or infinite scroll
- No results state
- Search history

### 5. Analytics Page (/analytics)
**Purpose**: System analytics dashboard
**Components**:
- Overview metric cards
- Bar charts for popular locations/cuisines
- Pie charts for distribution data
- Line charts for trends
- Performance metrics tables
- Date range selector
- Export functionality

### 6. System Status Page (/status)
**Purpose**: System monitoring dashboard
**Components**:
- Phase progress indicators
- System health status cards
- Performance metrics
- Recent activity log
- Manual phase execution buttons
- Error handling displays

### 7. Feedback Page (/feedback)
**Purpose**: User feedback collection
**Components**:
- Feedback overview cards
- Recommendation feedback forms
- Rating components
- Comment text areas
- Feedback history
- Improvement suggestions display

## Key UI Components to Design

### Navigation
- Top navigation bar with logo
- Mobile hamburger menu
- Active page indicators
- User profile section

### Restaurant Cards
- Restaurant name and cuisine
- Rating stars and vote count
- Price range indicator
- Location/distance
- Online order/table booking badges
- AI explanation section
- Feedback buttons

### Forms
- Material-UI form components
- Validation states
- Progress indicators
- Clear error messages

### Charts & Visualizations
- Consistent color scheme
- Responsive sizing
- Interactive tooltips
- Legend and labels

## Design Principles

### Visual Hierarchy
- Clear typography scale
- Consistent spacing (8px grid)
- Proper contrast ratios
- Focus states and hover effects

### User Experience
- Intuitive navigation flow
- Clear call-to-action buttons
- Loading states for async operations
- Error boundaries and graceful failures
- Mobile-first responsive design

### Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

## Specific Design Details

### Color Usage
- Primary red for main actions and branding
- Gold for accents and highlights
- Grey scale for text and backgrounds
- Success/error states with appropriate colors
- Dark mode support (optional)

### Typography
- H1: 2.5rem for page titles
- H2: 2rem for section headers
- H3: 1.5rem for card titles
- Body: 1rem for regular text
- Caption: 0.875rem for metadata

### Spacing
- Container padding: 24px
- Card padding: 16px
- Button margins: 8px
- Section gaps: 32px

### Interactions
- Button hover states with opacity changes
- Card elevation changes on hover
- Smooth transitions (200ms)
- Loading spinners for async operations
- Skeleton loaders for content

## Data Context

### Restaurant Data Structure
```typescript
interface Restaurant {
  restaurant_name: string;
  cuisine: string;
  rating: number;
  cost_for_two: number;
  location: string;
  votes: number;
  online_order: string;
  table_booking: string;
}
```

### Recommendation Data Structure
```typescript
interface Recommendation {
  restaurant_name: string;
  cuisine: string;
  explanation: string;
  confidence_score: number;
  rating?: number;
  estimated_cost?: number;
}
```

### User Preferences Structure
```typescript
interface UserPreferences {
  location: string;
  budget: string;
  cuisine: string;
  minimum_rating: number;
  additional_preferences?: string[];
}
```

## Image Generation Prompts

### Home Page
"Modern restaurant recommendation app homepage with hero section, feature cards, quick action buttons, and statistics overview. Clean Material-UI design with red and gold color scheme. Professional food delivery app aesthetic."

### Preferences Page
"User preference form page with multi-step form, location selector, budget options, cuisine chips, and rating slider. Clean form design with Material-UI components and validation states."

### Recommendations Page
"Restaurant recommendation cards with AI explanations, ratings, feedback buttons, and confidence scores. Card-based layout with modern design and interactive elements."

### Search Page
"Advanced restaurant search interface with filters sidebar, search results grid, and restaurant cards. Clean search UI with Material-UI components."

### Analytics Dashboard
"Analytics dashboard with charts, metrics cards, and data visualizations. Professional dashboard design with consistent color scheme and responsive charts."

### System Status
"System monitoring dashboard with phase progress indicators, health status cards, and performance metrics. Clean admin-style interface."

### Feedback Page
"User feedback collection interface with rating components, comment areas, and feedback history. Clean form design with Material-UI components."

## Technical Implementation Notes

### Component Structure
- Use functional components with hooks
- Implement proper TypeScript types
- Use React Query for API calls
- Implement error boundaries
- Add proper loading states

### Performance Considerations
- Implement code splitting for pages
- Use Next.js Image optimization
- Implement proper caching strategies
- Optimize bundle size

### SEO Considerations
- Implement proper meta tags
- Use semantic HTML
- Add structured data
- Implement proper page titles

## Brand Guidelines
- Logo: Modern restaurant/delivery icon
- Tone: Professional yet friendly
- Style: Clean, modern, food-tech aesthetic
- Inspiration: Zomato, Uber Eats, DoorDash UI patterns

This prompt provides comprehensive guidance for generating a complete, production-ready Next.js frontend that aligns with the existing backend architecture and provides an excellent user experience for the AI restaurant recommendation system.
