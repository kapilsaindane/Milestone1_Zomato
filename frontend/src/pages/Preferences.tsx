import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  Chip,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { Save, Restaurant } from 'lucide-react';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { apiService, PreferenceProfile } from '../services/api';

const Preferences: React.FC = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    location: '',
    budget: 'medium' as 'low' | 'medium' | 'high',
    cuisine: 'any',
    minimum_rating: 4.0,
    additional_preferences: [] as string[],
    max_budget_amount: null as number | null
  });

  const { data: currentPreferences, isLoading } = useQuery(
    'currentPreferences',
    apiService.getCurrentPreferences,
    {
      onSuccess: (data) => {
        setPreferences({
          location: data.location,
          budget: data.budget,
          cuisine: data.cuisine,
          minimum_rating: data.minimum_rating,
          additional_preferences: data.additional_preferences,
          max_budget_amount: data.budget_range[1]
        });
      }
    }
  );

  const saveMutation = useMutation(apiService.createPreferences, {
    onSuccess: () => {
      navigate('/recommendations');
    }
  });

  const handleSave = () => {
    saveMutation.mutate(preferences);
  };

  const handleAddPreference = (pref: string) => {
    if (pref && !preferences.additional_preferences.includes(pref)) {
      setPreferences(prev => ({
        ...prev,
        additional_preferences: [...prev.additional_preferences, pref]
      }));
    }
  };

  const handleRemovePreference = (pref: string) => {
    setPreferences(prev => ({
      ...prev,
      additional_preferences: prev.additional_preferences.filter(p => p !== pref)
    }));
  };

  const commonPreferences = [
    'family-friendly', 'quick-service', 'fine-dining', 'casual',
    'romantic', 'business-lunch', 'late-night', 'outdoor-seating',
    'valet-parking', 'live-music', 'buffet', 'bar'
  ];

  const cuisineOptions = [
    'any', 'North Indian', 'South Indian', 'Chinese', 'Italian',
    'Mexican', 'Thai', 'Japanese', 'Continental', 'American',
    'Mughlai', 'Biryani', 'Pizza', 'Burger', 'Desserts'
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Set Your Dining Preferences
      </Typography>

      {saveMutation.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error saving preferences. Please try again.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Preferences
              </Typography>
              
              <TextField
                fullWidth
                label="Location"
                value={preferences.location}
                onChange={(e) => setPreferences(prev => ({ ...prev, location: e.target.value }))}
                margin="normal"
                placeholder="e.g., Bellandur, Koramangala, Indiranagar"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Budget Level</InputLabel>
                <Select
                  value={preferences.budget}
                  onChange={(e) => setPreferences(prev => ({ 
                    ...prev, 
                    budget: e.target.value as 'low' | 'medium' | 'high' 
                  }))}
                >
                  <MenuItem value="low">Low (Under ₹500)</MenuItem>
                  <MenuItem value="medium">Medium (₹500-1500)</MenuItem>
                  <MenuItem value="high">High (Above ₹1500)</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Cuisine Preference</InputLabel>
                <Select
                  value={preferences.cuisine}
                  onChange={(e) => setPreferences(prev => ({ ...prev, cuisine: e.target.value }))}
                >
                  {cuisineOptions.map(cuisine => (
                    <MenuItem key={cuisine} value={cuisine}>
                      {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box margin="normal">
                <Typography gutterBottom>
                  Minimum Rating: {preferences.minimum_rating.toFixed(1)}
                </Typography>
                <Slider
                  value={preferences.minimum_rating}
                  onChange={(_, value) => setPreferences(prev => ({ 
                    ...prev, 
                    minimum_rating: value as number 
                  }))}
                  min={1.0}
                  max={5.0}
                  step={0.1}
                  marks={[
                    { value: 1, label: '1★' },
                    { value: 2, label: '2★' },
                    { value: 3, label: '3★' },
                    { value: 4, label: '4★' },
                    { value: 5, label: '5★' }
                  ]}
                />
              </Box>

              <TextField
                fullWidth
                label="Maximum Budget (Optional)"
                type="number"
                value={preferences.max_budget_amount || ''}
                onChange={(e) => setPreferences(prev => ({ 
                  ...prev, 
                  max_budget_amount: e.target.value ? parseInt(e.target.value) : null 
                }))}
                margin="normal"
                placeholder="e.g., 2000"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Additional Preferences
              </Typography>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Click to add preferences:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {commonPreferences.map(pref => (
                    <Chip
                      key={pref}
                      label={pref.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      onClick={() => handleAddPreference(pref)}
                      clickable
                      color={preferences.additional_preferences.includes(pref) ? "primary" : "default"}
                      variant={preferences.additional_preferences.includes(pref) ? "filled" : "outlined"}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Selected preferences:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1} minHeight={50}>
                  {preferences.additional_preferences.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No additional preferences selected
                    </Typography>
                  ) : (
                    preferences.additional_preferences.map(pref => (
                      <Chip
                        key={pref}
                        label={pref.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        onDelete={() => handleRemovePreference(pref)}
                        color="primary"
                        variant="filled"
                      />
                    ))
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Profile Summary
              </Typography>
              <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                <Typography variant="body2">
                  <strong>Location:</strong> {preferences.location || 'Not set'}
                </Typography>
                <Typography variant="body2">
                  <strong>Budget:</strong> {preferences.budget.charAt(0).toUpperCase() + preferences.budget.slice(1)}
                </Typography>
                <Typography variant="body2">
                  <strong>Cuisine:</strong> {preferences.cuisine.charAt(0).toUpperCase() + preferences.cuisine.slice(1)}
                </Typography>
                <Typography variant="body2">
                  <strong>Min Rating:</strong> {preferences.minimum_rating}★
                </Typography>
                {preferences.max_budget_amount && (
                  <Typography variant="body2">
                    <strong>Max Budget:</strong> ₹{preferences.max_budget_amount}
                  </Typography>
                )}
                {preferences.additional_preferences.length > 0 && (
                  <Typography variant="body2">
                    <strong>Additional:</strong> {preferences.additional_preferences.join(', ')}
                  </Typography>
                )}
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={saveMutation.isLoading || !preferences.location}
          startIcon={<Save />}
        >
          {saveMutation.isLoading ? 'Saving...' : 'Save Preferences'}
        </Button>
        
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/recommendations')}
        >
          Skip to Recommendations
        </Button>
      </Box>
    </Box>
  );
};

export default Preferences;
