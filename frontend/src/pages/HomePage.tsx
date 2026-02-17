import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const HomePage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Sculpt
        </Typography>
        <Typography variant="h5" component="p" gutterBottom>
          Track your fitness journey, workouts, and nutrition.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" component={Link} to="/register" sx={{ mr: 2 }}>
            Get Started
          </Button>
          <Button variant="outlined" color="primary" component={Link} to="/login">
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
