import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Button, TextField, List, ListItem, ListItemText, Paper, AppBar, Toolbar, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { createWorkout, getWorkouts, getExerciseDefinitions } from '../services/api';
import { Workout, Exercise as ExerciseType, ExerciseDefinition } from '../types';
import { useAuth } from '../context/AuthContext';

const WorkoutLogPage: React.FC = () => {
  const { logout } = useAuth();
  const [workoutName, setWorkoutName] = useState<string>(new Date().toISOString().slice(0, 10));
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const [newExerciseName, setNewExerciseName] = useState<string>('');
  const [newSets, setNewSets] = useState<number>(0);
  const [newReps, setNewReps] = useState<number>(0);
  const [newWeight, setNewWeight] = useState<number>(0);
  const [pastWorkouts, setPastWorkouts] = useState<Workout[]>([]);
  const [exerciseOptions, setExerciseOptions] = useState<ExerciseDefinition[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkouts();
    fetchExerciseDefinitions();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const data = await getWorkouts();
      setPastWorkouts(data);
    } catch (err) {
      console.error('Failed to fetch workouts:', err);
      setError('Failed to load past workouts.');
    }
  };

  const fetchExerciseDefinitions = async () => {
    try {
      const data = await getExerciseDefinitions();
      setExerciseOptions(data);
    } catch (err) {
      console.error('Failed to fetch exercise definitions:', err);
    }
  };

  const handleAddExercise = () => {
    if (newExerciseName && newSets > 0 && newReps > 0 && newWeight > 0) {
      setExercises([...exercises, {
        name: newExerciseName,
        sets: newSets,
        reps: newReps,
        weight: newWeight,
      }]);
      setNewExerciseName('');
      setNewSets(0);
      setNewReps(0);
      setNewWeight(0);
    } else {
      setError('Please select an exercise and fill in all fields correctly.');
    }
  };

  const handleLogWorkout = async () => {
    setError(null);
    if (!workoutName || exercises.length === 0) {
      setError('Workout name and at least one exercise are required.');
      return;
    }
    try {
      const newWorkout: Workout = { name: workoutName, exercises };
      await createWorkout(newWorkout);
      setWorkoutName(new Date().toISOString().slice(0, 10));
      setExercises([]);
      fetchWorkouts();
    } catch (err) {
      console.error('Failed to log workout:', err);
      setError('Failed to log workout. Please try again.');
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
          <Button color="inherit" component={Link} to="/exercises">Exercises</Button>
          <Button color="inherit" component={Link} to="/nutrition">Nutrition</Button>
          <Button color="inherit" onClick={logout} component={Link} to="/">Logout</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Log Your Workout
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Paper elevation={3} sx={{ p: 3, mt: 3, width: '100%' }}>
            <TextField
              fullWidth
              label="Workout Name"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              margin="normal"
            />
            <Typography variant="h6" sx={{ mt: 2 }}>Exercises</Typography>
            <List>
              {exercises.map((ex, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${ex.name}: ${ex.sets} sets, ${ex.reps} reps, ${ex.weight}`} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
              <FormControl size="small" sx={{ flexGrow: 1 }}>
                <InputLabel>Exercise</InputLabel>
                <Select
                  value={newExerciseName}
                  label="Exercise"
                  onChange={(e) => setNewExerciseName(e.target.value)}
                  displayEmpty
                >
                  {exerciseOptions.length === 0 ? (
                    <MenuItem disabled value="">
                      No exercises in library — add some first
                    </MenuItem>
                  ) : (
                    exerciseOptions.map((opt) => (
                      <MenuItem key={opt.id} value={opt.name}>{opt.name}</MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              <TextField
                label="Sets"
                type="number"
                value={newSets}
                onChange={(e) => setNewSets(parseInt(e.target.value))}
                size="small"
                sx={{ width: 80 }}
              />
              <TextField
                label="Reps"
                type="number"
                value={newReps}
                onChange={(e) => setNewReps(parseInt(e.target.value))}
                size="small"
                sx={{ width: 80 }}
              />
              <TextField
                label="Weight"
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(parseInt(e.target.value))}
                size="small"
                sx={{ width: 100 }}
              />
              <IconButton color="primary" onClick={handleAddExercise}>
                <AddIcon />
              </IconButton>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogWorkout}
              sx={{ mt: 3 }}
              fullWidth
            >
              Log Workout
            </Button>
          </Paper>

          <Typography variant="h5" component="h2" sx={{ mt: 5, mb: 2 }}>
            Past Workouts
          </Typography>
          <List sx={{ width: '100%' }}>
            {pastWorkouts.length === 0 ? (
              <Typography>No workouts logged yet.</Typography>
            ) : (
              pastWorkouts.map((workout) => (
                <Paper key={workout.id} elevation={2} sx={{ p: 2, mb: 2 }}>
                  <ListItemText primary={workout.name} secondary={`ID: ${workout.id}`} />
                  <List dense>
                    {workout.exercises.map((ex) => (
                      <ListItem key={ex.id}>
                        <ListItemText
                          primary={`${ex.name}: ${ex.sets} sets, ${ex.reps} reps, ${ex.weight}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              ))
            )}
          </List>
        </Box>
      </Container>
    </Box>
  );
};

export default WorkoutLogPage;
