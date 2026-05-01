import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  CircularProgress
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from 'react-query';
import { apiService } from '../services/api';

const Analytics: React.FC = () => {
  const { data: analytics, isLoading, error } = useQuery(
    'analytics',
    apiService.getAnalytics,
    {
      retry: 2,
    }
  );

  const COLORS = ['#e53935', '#ffc107', '#4caf50', '#2196f3', '#9c27b0', '#ff5722'];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          Failed to load analytics data
        </Typography>
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Box>
        <Typography variant="h6" color="text.secondary">
          No analytics data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        System Analytics
      </Typography>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary.main">
                Total Restaurants
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {analytics.total_restaurants.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary.main">
                Recommendations Generated
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {analytics.total_recommendations_generated.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary.main">
                Average Rating
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {analytics.average_ratings.overall.toFixed(1)}★
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary.main">
                Avg Response Time
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {analytics.system_performance.avg_response_time?.toFixed(2) || 'N/A'}s
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Popular Locations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top 10 Popular Locations
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.popular_locations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="location" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#e53935" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Popular Cuisines */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top 10 Popular Cuisines
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.popular_cuisines}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ cuisine, count }) => `${cuisine}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.popular_cuisines.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Ratings by Location */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Ratings by Location (Top 10)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={
                  Object.entries(analytics.average_ratings.by_location)
                    .slice(0, 10)
                    .map(([location, rating]) => ({ location, rating }))
                }>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="location" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="rating" fill="#ffc107" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Ratings by Cuisine */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Ratings by Cuisine (Top 10)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={
                  Object.entries(analytics.average_ratings.by_cuisine)
                    .slice(0, 10)
                    .map(([cuisine, rating]) => ({ cuisine, rating }))
                }>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="cuisine" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="rating" fill="#4caf50" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Performance */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Performance Metrics
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(analytics.system_performance).map(([metric, value]) => (
              <Grid item xs={12} sm={6} md={4} key={metric}>
                <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                  <Typography variant="body2" color="text.secondary">
                    {metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {typeof value === 'number' ? value.toFixed(3) : value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Analytics;
