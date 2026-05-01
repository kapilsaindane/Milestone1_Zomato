import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Rating,
  IconButton
} from '@mui/material';
import { RefreshCw, Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const Recommendations: React.FC = () => {
  const navigate = useNavigate();

  const { data: recommendations, isLoading, error, refetch } = useQuery(
    'recommendations',
    apiService.getLatestRecommendations,
    {
      retry: 2,
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );

  const handleGetNewRecommendations = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Generating AI Recommendations...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Our system is analyzing thousands of restaurants to find the perfect match for you
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load recommendations. Please try again.
        </Alert>
        <Button variant="contained" onClick={() => refetch()}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!recommendations || recommendations.recommendations.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" gutterBottom>
          No recommendations available
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Please set your preferences first to get personalized recommendations
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/preferences')}
          sx={{ mt: 2 }}
        >
          Set Preferences
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Your Restaurant Recommendations
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshCw />}
          onClick={handleGetNewRecommendations}
        >
          Refresh
        </Button>
      </Box>

      {/* Summary Card */}
      <Card sx={{ mb: 3, backgroundColor: 'primary.light', color: 'white' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            AI Analysis Summary
          </Typography>
          <Typography variant="body1">
            {recommendations.summary}
          </Typography>
          <Box display="flex" gap={2} mt={2}>
            <Chip 
              label={`Model: ${recommendations.model}`}
              size="small"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip 
              label={`Analyzed: ${recommendations.total_input_candidates} restaurants`}
              size="small"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            {recommendations.processing_time && (
              <Chip 
                label={`Processing: ${recommendations.processing_time.toFixed(2)}s`}
                size="small"
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Recommendations Grid */}
      <Grid container spacing={3}>
        {recommendations.recommendations.map((restaurant, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                    {restaurant.restaurant_name}
                  </Typography>
                  {restaurant.confidence_score && (
                    <Chip 
                      label={`${(restaurant.confidence_score * 100).toFixed(0)}% match`}
                      size="small"
                      color="primary"
                    />
                  )}
                </Box>

                {/* Cuisine */}
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Cuisine
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {restaurant.cuisine}
                  </Typography>
                </Box>

                {/* Rating and Cost */}
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Star size={16} color="#ffc107" />
                      {restaurant.rating ? (
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {restaurant.rating.toFixed(1)}
                          </Typography>
                          <Rating 
                            value={restaurant.rating} 
                            readOnly 
                            size="small"
                            precision={0.1}
                          />
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Not rated
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <DollarSign size={16} />
                      {restaurant.estimated_cost ? (
                        <Typography variant="body2" fontWeight="medium">
                          ₹{restaurant.estimated_cost} for two
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Cost not available
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* AI Explanation */}
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Why this restaurant?
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontStyle: 'italic',
                    lineHeight: 1.4,
                    color: 'text.primary'
                  }}>
                    {restaurant.explanation}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={() => navigate('/search')}
        >
          Explore More Restaurants
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/preferences')}
        >
          Update Preferences
        </Button>
      </Box>
    </Box>
  );
};

export default Recommendations;
