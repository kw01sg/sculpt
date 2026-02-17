import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Button, TextField, List, ListItem, ListItemText, Paper, AppBar, Toolbar } from '@mui/material';
import { createNutrition, getNutrition } from '../services/api';
import { Nutrition as NutritionType } from '../types';
import { useAuth } from '../context/AuthContext';

const NutritionLogPage: React.FC = () => {
  const { logout } = useAuth();
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [calories, setCalories] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [pastNutrition, setPastNutrition] = useState<NutritionType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNutrition();
  }, []);

  const fetchNutrition = async () => {
    try {
      const data = await getNutrition();
      setPastNutrition(data);
    } catch (err) {
      console.error('Failed to fetch nutrition entries:', err);
      setError('Failed to load past nutrition entries.');
    }
  };

  const handleLogNutrition = async () => {
    setError(null);
    if (!date || calories <= 0 || protein <= 0) {
      setError('Please fill in all nutrition fields correctly.');
      return;
    }
    try {
      const newNutrition: NutritionType = { date, calories, protein };
      await createNutrition(newNutrition);
      setDate(new Date().toISOString().split('T')[0]);
      setCalories(0);
      setProtein(0);
      fetchNutrition(); // Refresh the list
    } catch (err) {
      console.error('Failed to log nutrition:', err);
      setError('Failed to log nutrition. Please try again.');
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
              Sculpt
            </Link>
          </Typography>
          <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
          <Button color="inherit" component={Link} to="/workouts">Workouts</Button>
          <Button color="inherit" onClick={logout} component={Link} to="/">Logout</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Log Your Nutrition
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Paper elevation={3} sx={{ p: 3, mt: 3, width: '100%' }}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="Calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(parseInt(e.target.value))}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Protein (grams)"
              type="number"
              value={protein}
              onChange={(e) => setProtein(parseInt(e.target.value))}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogNutrition}
              sx={{ mt: 3 }}
              fullWidth
            >
              Log Nutrition
            </Button>
          </Paper>

          <Typography variant="h5" component="h2" sx={{ mt: 5, mb: 2 }}>
            Past Nutrition Entries
          </Typography>
          <List sx={{ width: '100%' }}>
            {pastNutrition.length === 0 ? (
              <Typography>No nutrition entries logged yet.</Typography>
            ) : (
              pastNutrition.map((entry) => (
                <Paper key={entry.id} elevation={2} sx={{ p: 2, mb: 2 }}>
                  <ListItemText 
                    primary={`Date: ${entry.date}`} 
                    secondary={`Calories: ${entry.calories}, Protein: ${entry.protein}g`} 
                  />
                </Paper>
              ))
            )}
          </List>
        </Box>
      </Container>
    </Box>
  );
};

export default NutritionLogPage;
