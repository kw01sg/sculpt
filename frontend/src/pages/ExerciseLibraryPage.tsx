import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getExerciseDefinitions, createExerciseDefinition } from '../services/api';
import { ExerciseDefinition } from '../types';
import { useAuth } from '../context/AuthContext';

const ExerciseLibraryPage: React.FC = () => {
  const { logout } = useAuth();
  const [exercises, setExercises] = useState<ExerciseDefinition[]>([]);
  const [newName, setNewName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const data = await getExerciseDefinitions();
      setExercises(data);
    } catch (err) {
      console.error('Failed to fetch exercises:', err);
      setError('Failed to load exercises.');
    }
  };

  const handleAdd = async () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      setError('Exercise name cannot be empty.');
      return;
    }
    setError(null);
    try {
      const created = await createExerciseDefinition(trimmed);
      setExercises((prev) =>
        prev.some((e) => e.id === created.id)
          ? prev
          : [...prev, created].sort((a, b) => a.name.localeCompare(b.name))
      );
      setNewName('');
    } catch (err) {
      console.error('Failed to add exercise:', err);
      setError('Failed to add exercise. Please try again.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
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
          <Button color="inherit" component={Link} to="/nutrition">Nutrition</Button>
          <Button color="inherit" onClick={logout} component={Link} to="/">Logout</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Exercise Library
          </Typography>
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

          <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Add a new exercise
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Exercise Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleKeyDown}
                size="small"
              />
              <IconButton color="primary" onClick={handleAdd} aria-label="Add exercise">
                <AddIcon />
              </IconButton>
            </Box>
          </Paper>

          <Typography variant="h6" sx={{ mt: 4, mb: 1, alignSelf: 'flex-start' }}>
            Your Exercises ({exercises.length})
          </Typography>
          {exercises.length === 0 ? (
            <Typography color="text.secondary">
              No exercises yet. Add your first one above.
            </Typography>
          ) : (
            <List sx={{ width: '100%' }}>
              {exercises.map((ex) => (
                <Paper key={ex.id} elevation={1} sx={{ mb: 1 }}>
                  <ListItem>
                    <ListItemText primary={ex.name} />
                  </ListItem>
                </Paper>
              ))}
            </List>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ExerciseLibraryPage;
