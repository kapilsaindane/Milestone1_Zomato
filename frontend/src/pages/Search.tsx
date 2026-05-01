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
  Button,
  Chip,
  Paper,
  CircularProgress,
  Rating
} from '@mui/material';
import { Search, Filter, Star, MapPin, DollarSign } from 'lucide-react';
import { useQuery } from 'react-query';
import { apiService } from '../services/api';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    location: '',
    cuisine: '',
    limit: 20
  });

  const { data: searchResults, isLoading, refetch } = useQuery(
    ['searchRestaurants', searchParams],
    () => apiService.searchRestaurants(searchParams),
    {
      enabled: false, // Don't auto-run, wait for user action
    }
  );

  const handleSearch = () => {
    if (searchParams.query || searchParams.location || searchParams.cuisine) {
      refetch();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const cuisineOptions = [
    'North Indian', 'South Indian', 'Chinese', 'Italian', 'Mexican',
    'Thai', 'Japanese', 'Continental', 'American', 'Mughlai',
    'Biryani', 'Pizza', 'Burger', 'Desserts', 'Cafe'
  ];

  const locationOptions = [
    'Bellandur', 'Koramangala', 'Indiranagar', 'MG Road', 'Whitefield',
    'HSR Layout', 'Jayanagar', 'BTM Layout', 'Marathahalli', 'Electronic City'
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Search Restaurants
      </Typography>

      {/* Search Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Search Filters
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search by name or cuisine"
                value={searchParams.query}
                onChange={(e) => setSearchParams(prev => ({ ...prev, query: e.target.value }))}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Italian, Pizza, Domino's"
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={searchParams.location}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
                >
                  <MenuItem value="">All Locations</MenuItem>
                  {locationOptions.map(location => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Cuisine</InputLabel>
                <Select
                  value={searchParams.cuisine}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, cuisine: e.target.value }))}
                >
                  <MenuItem value="">All Cuisines</MenuItem>
                  {cuisineOptions.map(cuisine => (
                    <MenuItem key={cuisine} value={cuisine}>
                      {cuisine}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Results</InputLabel>
                <Select
                  value={searchParams.limit}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, limit: parseInt(e.target.value) }))}
                >
                  <MenuItem value={10}>10 results</MenuItem>
                  <MenuItem value={20}>20 results</MenuItem>
                  <MenuItem value={50}>50 results</MenuItem>
                  <MenuItem value={100}>100 results</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => setSearchParams({ query: '', location: '', cuisine: '', limit: 20 })}
            >
              Clear Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Search Results */}
      {isLoading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      )}

      {searchResults && !isLoading && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Found {searchResults.total_found} restaurants
            </Typography>
            {searchResults.search_time && (
              <Typography variant="body2" color="text.secondary">
                Search time: {searchResults.search_time.toFixed(2)}s
              </Typography>
            )}
          </Box>

          <Grid container spacing={2}>
            {searchResults.restaurants.map((restaurant, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2
                    }
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {restaurant.restaurant_name}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <MapPin size={16} color="#666" />
                      <Typography variant="body2" color="text.secondary">
                        {restaurant.location}
                      </Typography>
                    </Box>

                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        Cuisine
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {restaurant.cuisine}
                      </Typography>
                    </Box>

                    <Grid container spacing={1} mb={2}>
                      <Grid item xs={6}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Star size={16} color="#ffc107" />
                          {restaurant.rating && restaurant.rating > 0 ? (
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
                          {restaurant.cost_for_two ? (
                            <Typography variant="body2" fontWeight="medium">
                              ₹{restaurant.cost_for_two}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Price not available
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </Grid>

                    <Box display="flex" gap={1} mb={1}>
                      {restaurant.online_order === 'yes' && (
                        <Chip label="Online Order" size="small" color="primary" />
                      )}
                      {restaurant.table_booking === 'yes' && (
                        <Chip label="Table Booking" size="small" color="secondary" />
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {restaurant.votes} votes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {searchResults.restaurants.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                No restaurants found matching your criteria
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or search terms
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {!searchResults && !isLoading && (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Start searching for restaurants
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use the filters above to find restaurants that match your preferences
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Search;
