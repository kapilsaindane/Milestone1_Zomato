import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Paper,
  Divider
} from '@mui/material';
import { Restaurant, Star, TrendingUp, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Restaurant />,
      title: 'Smart Recommendations',
      description: 'AI-powered restaurant suggestions based on your preferences'
    },
    {
      icon: <Star />,
      title: 'Personalized Experience',
      description: 'Tailored recommendations considering budget, cuisine, and location'
    },
    {
      icon: <TrendingUp />,
      title: 'LLM Analysis',
      description: 'Advanced reasoning using Groq LLM for intelligent insights'
    },
    {
      icon: <Search />,
      title: 'Easy Search',
      description: 'Find restaurants quickly with advanced filtering options'
    }
  ];

  const quickActions = [
    {
      title: 'Set Preferences',
      description: 'Configure your dining preferences',
      action: () => navigate('/preferences')
    },
    {
      title: 'Get Recommendations',
      description: 'View personalized restaurant suggestions',
      action: () => navigate('/recommendations')
    },
    {
      title: 'Search Restaurants',
      description: 'Explore restaurants in your area',
      action: () => navigate('/search')
    },
    {
      title: 'View Analytics',
      description: 'Check system performance and insights',
      action: () => navigate('/analytics')
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          p: 6,
          mb: 4,
          background: 'linear-gradient(135deg, #e53935 0%, #ffc107 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          🍽️ AI Restaurant Recommender
        </Typography>
        <Typography variant="h5" gutterBottom>
          Discover your perfect dining experience with AI-powered recommendations
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/preferences')}
          sx={{
            mt: 2,
            backgroundColor: 'white',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'grey.100',
            }
          }}
        >
          Get Started
        </Button>
      </Paper>

      {/* Features Section */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Key Features
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={action.action}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* How It Works */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          How It Works
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="primary.main" gutterBottom>
                Step 1: Set Preferences
              </Typography>
              <Typography variant="body2">
                Tell us about your dining preferences, budget, and location
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="primary.main" gutterBottom>
                Step 2: AI Processing
              </Typography>
              <Typography variant="body2">
                Our system analyzes thousands of restaurants using advanced AI
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="primary.main" gutterBottom>
                Step 3: Get Recommendations
              </Typography>
              <Typography variant="body2">
                Receive personalized recommendations with detailed explanations
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
