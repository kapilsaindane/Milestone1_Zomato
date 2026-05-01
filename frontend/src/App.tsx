import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Preferences from './pages/Preferences';
import Recommendations from './pages/Recommendations';
import Search from './pages/Search';
import Feedback from './pages/Feedback';
import Analytics from './pages/Analytics';
import SystemStatus from './pages/SystemStatus';

const theme = createTheme({
  palette: {
    primary: {
      main: '#e53935', // Zomato-like red
    },
    secondary: {
      main: '#ffc107', // Gold accent
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/preferences" element={<Preferences />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/search" element={<Search />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/status" element={<SystemStatus />} />
            </Routes>
          </Container>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
