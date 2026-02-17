import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Button, AppBar, Toolbar } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
              Sculpt
            </Link>
          </Typography>
          <Button color="inherit" component={Link} to="/workouts">Workouts</Button>
          <Button color="inherit" component={Link} to="/nutrition">Nutrition</Button>
          <Button color="inherit" onClick={logout} component={Link} to="/">Logout</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, {user?.email}!
          </Typography>
          <Typography variant="h6" component="p" gutterBottom>
            Your fitness journey starts here.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" component={Link} to="/workouts" sx={{ mr: 2 }}>
              Log Workout
            </Button>
            <Button variant="contained" color="secondary" component={Link} to="/nutrition">
              Log Nutrition
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardPage;
