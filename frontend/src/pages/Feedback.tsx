import React, { useState } from 'react';
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
  Rating,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Divider
} from '@mui/material';
import { ThumbsUp, ThumbsDown, Star, MessageSquare, TrendingUp, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation } from 'react-query';

interface FeedbackData {
  session_id: string;
  restaurant_name: string;
  recommendation_id: string;
  feedback_type: string;
  interaction_type: string;
  preference_profile: any;
  recommendation_context: any;
  rating?: number;
  explanation_quality?: number;
  comments?: string;
}

const Feedback: React.FC = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 0,
    explanation_quality: 0,
    comments: '',
    feedback_type: ''
  });

  // Mock data for demonstration
  const mockRecommendations = [
    {
      restaurant_name: "Ruh",
      cuisine: "North Indian, Mughlai, Mediterranean, Iranian",
      explanation: "Ruh has the highest number of votes and is located in Bellandur, with a high score, making it a top choice considering the budget fit and cuisine match.",
      recommendation_id: "rec_1"
    },
    {
      restaurant_name: "Tipsy Bull - The Bar Exchange",
      cuisine: "North Indian, Chinese, Continental, Mexican",
      explanation: "Tipsy Bull - The Bar Exchange has a high number of votes, a good score, and offers multiple cuisines, including North Indian, which is a common primary cuisine among the candidates.",
      recommendation_id: "rec_2"
    }
  ];

  const mockPreferences = {
    location: "Bellandur",
    budget: "medium",
    cuisine: "any",
    minimum_rating: 4.0
  };

  // Create feedback session mutation
  const createSessionMutation = useMutation(
    async (preferences: any) => {
      const response = await fetch('/api/feedback/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      return response.json();
    }
  );

  // Record feedback mutation
  const recordFeedbackMutation = useMutation(
    async (feedbackData: FeedbackData) => {
      const response = await fetch('/api/feedback/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });
      return response.json();
    }
  );

  const handleFeedbackClick = (restaurant: any, feedbackType: string) => {
    setSelectedRestaurant(restaurant);
    setFeedbackForm(prev => ({ ...prev, feedback_type: feedbackType }));
    setFeedbackDialog(true);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedRestaurant || !feedbackForm.feedback_type) return;

    // Create session if needed
    let sessionId = 'demo_session';
    try {
      const sessionResult = await createSessionMutation.mutateAsync(mockPreferences);
      sessionId = sessionResult.session_id;
    } catch (error) {
      console.error('Session creation failed:', error);
    }

    // Submit feedback
    const feedbackData: FeedbackData = {
      session_id: sessionId,
      restaurant_name: selectedRestaurant.restaurant_name,
      recommendation_id: selectedRestaurant.recommendation_id,
      feedback_type: feedbackForm.feedback_type,
      interaction_type: 'click',
      preference_profile: mockPreferences,
      recommendation_context: selectedRestaurant,
      rating: feedbackForm.rating || undefined,
      explanation_quality: feedbackForm.explanation_quality || undefined,
      comments: feedbackForm.comments || undefined
    };

    try {
      await recordFeedbackMutation.mutateAsync(feedbackData);
      setFeedbackDialog(false);
      setFeedbackForm({ rating: 0, explanation_quality: 0, comments: '', feedback_type: '' });
    } catch (error) {
      console.error('Feedback submission failed:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Feedback & Improvement Center
      </Typography>

      {/* Feedback Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUp color="#4caf50" />
                <Box>
                  <Typography variant="h6">Total Feedback</Typography>
                  <Typography variant="h4" color="primary.main">
                    0
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Star color="#ffc107" />
                <Box>
                  <Typography variant="h6">Avg Rating</Typography>
                  <Typography variant="h4" color="primary.main">
                    0.0
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AlertTriangle color="#ff9800" />
                <Box>
                  <Typography variant="h6">Improvement Ideas</Typography>
                  <Typography variant="h4" color="primary.main">
                    0
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Recommendations for Feedback */}
      <Typography variant="h5" gutterBottom>
        Provide Feedback on Recommendations
      </Typography>
      
      <Grid container spacing={3}>
        {mockRecommendations.map((restaurant, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {restaurant.restaurant_name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {restaurant.cuisine}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                  {restaurant.explanation}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  How helpful was this recommendation?
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ThumbsUp />}
                    onClick={() => handleFeedbackClick(restaurant, 'like')}
                    color="success"
                  >
                    Helpful
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ThumbsDown />}
                    onClick={() => handleFeedbackClick(restaurant, 'dislike')}
                    color="error"
                  >
                    Not Helpful
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Star />}
                    onClick={() => handleFeedbackClick(restaurant, 'selected')}
                    color="primary"
                  >
                    Would Visit
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<MessageSquare />}
                    onClick={() => handleFeedbackClick(restaurant, 'neutral')}
                  >
                    Neutral
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialog} onClose={() => setFeedbackDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Feedback for {selectedRestaurant?.restaurant_name}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            {/* Restaurant Rating */}
            <Box>
              <Typography variant="body2" gutterBottom>
                How would you rate this restaurant?
              </Typography>
              <Rating
                value={feedbackForm.rating}
                onChange={(_, value) => setFeedbackForm(prev => ({ ...prev, rating: value || 0 }))}
                size="large"
              />
            </Box>

            {/* Explanation Quality */}
            <Box>
              <Typography variant="body2" gutterBottom>
                How helpful was the explanation?
              </Typography>
              <Rating
                value={feedbackForm.explanation_quality}
                onChange={(_, value) => setFeedbackForm(prev => ({ ...prev, explanation_quality: value || 0 }))}
                size="large"
              />
            </Box>

            {/* Comments */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Additional Comments (Optional)"
              value={feedbackForm.comments}
              onChange={(e) => setFeedbackForm(prev => ({ ...prev, comments: e.target.value }))}
              placeholder="Tell us more about your experience..."
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setFeedbackDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitFeedback}
            variant="contained"
            disabled={recordFeedbackMutation.isLoading}
          >
            {recordFeedbackMutation.isLoading ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Recent Feedback Summary */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Recent Feedback Activity
      </Typography>
      
      <Paper sx={{ p: 3, backgroundColor: 'grey.50', textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No feedback data available yet. Start by providing feedback on the recommendations above!
        </Typography>
      </Paper>
    </Box>
  );
};

export default Feedback;
