import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { RefreshCw, CheckCircle, Error, Clock, Play } from 'lucide-react';
import { useQuery, useMutation } from 'react-query';
import { apiService } from '../services/api';

const SystemStatus: React.FC = () => {
  const { data: systemStatus, isLoading, refetch } = useQuery(
    'systemStatus',
    apiService.getSystemStatus,
    {
      retry: 2,
      refetchInterval: 10000, // Refresh every 10 seconds
    }
  );

  const runPhaseMutation = useMutation(apiService.runPhase, {
    onSuccess: () => {
      refetch();
    }
  });

  const handleRunPhase = (phaseName: string) => {
    runPhaseMutation.mutate(phaseName);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'running':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="#4caf50" />;
      case 'running':
        return <Clock color="#ff9800" />;
      case 'failed':
        return <Error color="#f44336" />;
      default:
        return <Clock color="#9e9e9e" />;
    }
  };

  const getPhaseDescription = (phaseName: string) => {
    switch (phaseName) {
      case 'phase1':
        return 'Data Foundation - Clean and preprocess restaurant data';
      case 'phase2':
        return 'Preference Capture - Store user preferences';
      case 'phase3':
        return 'Candidate Retrieval - Filter and rank restaurants';
      case 'phase4':
        return 'LLM Reasoning - Generate AI-powered recommendations';
      default:
        return 'Unknown phase';
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!systemStatus) {
    return (
      <Alert severity="error">
        Failed to load system status
      </Alert>
    );
  }

  const completedPhases = systemStatus.phases.filter(p => p.status === 'completed').length;
  const overallProgress = (completedPhases / systemStatus.phases.length) * 100;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          System Status
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshCw />}
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </Box>

      {/* System Overview */}
      <Card sx={{ mb: 3, backgroundColor: 'primary.light', color: 'white' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                System Status
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {systemStatus.system_status.toUpperCase()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Total Restaurants
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {systemStatus.total_restaurants.toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Completed Phases
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {completedPhases}/{systemStatus.phases.length}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Last Updated
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {new Date(systemStatus.last_updated).toLocaleTimeString()}
              </Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              Overall Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={overallProgress}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'white'
                }
              }}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {overallProgress.toFixed(0)}% Complete
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Phase Status */}
      <Typography variant="h5" gutterBottom>
        Phase Status
      </Typography>
      <Grid container spacing={3}>
        {systemStatus.phases.map((phase) => (
          <Grid item xs={12} md={6} key={phase.name}>
            <Card 
              sx={{ 
                height: '100%',
                border: phase.status === 'running' ? '2px solid #ff9800' : '1px solid #e0e0e0'
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {phase.name.toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {getPhaseDescription(phase.name)}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getStatusIcon(phase.status)}
                    <Chip
                      label={phase.status.toUpperCase()}
                      color={getStatusColor(phase.status)}
                      size="small"
                    />
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  {phase.input_count !== undefined && (
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Input Records
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {phase.input_count.toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                  {phase.output_count !== undefined && (
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Output Records
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {phase.output_count.toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                  {phase.processing_time !== undefined && (
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Processing Time
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {phase.processing_time.toFixed(2)}s
                      </Typography>
                    </Grid>
                  )}
                  {phase.last_run && (
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Last Run
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {new Date(phase.last_run).toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                </Grid>

                {phase.error_message && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {phase.error_message}
                  </Alert>
                )}

                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Play />}
                    onClick={() => handleRunPhase(phase.name)}
                    disabled={runPhaseMutation.isLoading || phase.status === 'running'}
                  >
                    {runPhaseMutation.isLoading ? 'Running...' : 'Run Phase'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* System Information */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                API Version
              </Typography>
              <Typography variant="body1">
                v1.0.0
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                LLM Model
              </Typography>
              <Typography variant="body1">
                llama-3.3-70b-versatile (Groq)
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SystemStatus;
