import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Typography, Box, Button, TextField, List, ListItem,
  ListItemText, Paper, AppBar, Toolbar, IconButton, Select, MenuItem,
  FormControl, InputLabel, Collapse, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  createWorkout, getWorkouts, getExerciseDefinitions,
  updateWorkout, deleteWorkout, addExerciseToWorkout,
  updateExercise, deleteExercise,
} from '../services/api';
import { Workout, Exercise as ExerciseType, ExerciseDefinition } from '../types';
import { useAuth } from '../context/AuthContext';

const WorkoutLogPage: React.FC = () => {
  const { logout } = useAuth();

  // New workout form
  const [workoutName, setWorkoutName] = useState<string>(new Date().toISOString().slice(0, 10));
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const [newExerciseName, setNewExerciseName] = useState<string>('');
  const [newSets, setNewSets] = useState<number>(0);
  const [newReps, setNewReps] = useState<number>(0);
  const [newWeight, setNewWeight] = useState<number>(0);

  // Past workouts
  const [pastWorkouts, setPastWorkouts] = useState<Workout[]>([]);
  const [exerciseOptions, setExerciseOptions] = useState<ExerciseDefinition[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Expand / collapse
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<number | null>(null);

  // Inline workout name edit
  const [editingWorkoutId, setEditingWorkoutId] = useState<number | null>(null);
  const [editingWorkoutName, setEditingWorkoutName] = useState<string>('');

  // Inline exercise edit
  const [editingExerciseId, setEditingExerciseId] = useState<number | null>(null);
  const [editingExercise, setEditingExercise] = useState<{ name: string; sets: string; reps: string; weight: string }>({
    name: '', sets: '', reps: '', weight: '',
  });

  // Add exercise to existing workout
  const [addingExerciseToWorkoutId, setAddingExerciseToWorkoutId] = useState<number | null>(null);
  const [newExForExisting, setNewExForExisting] = useState<{ name: string; sets: string; reps: string; weight: string }>({
    name: '', sets: '', reps: '', weight: '',
  });

  // Delete confirmation dialogs
  const [deleteWorkoutTarget, setDeleteWorkoutTarget] = useState<Workout | null>(null);
  const [deleteExerciseTarget, setDeleteExerciseTarget] = useState<{ workoutId: number; exercise: ExerciseType } | null>(null);

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

  // ─── New workout form handlers ─────────────────────────────────────────────

  const handleAddExercise = () => {
    if (newExerciseName && newSets > 0 && newReps > 0 && newWeight > 0) {
      setExercises([...exercises, { name: newExerciseName, sets: newSets, reps: newReps, weight: newWeight }]);
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
      await createWorkout({ name: workoutName, exercises });
      setWorkoutName(new Date().toISOString().slice(0, 10));
      setExercises([]);
      fetchWorkouts();
    } catch (err) {
      console.error('Failed to log workout:', err);
      setError('Failed to log workout. Please try again.');
    }
  };

  // ─── Workout name edit ─────────────────────────────────────────────────────

  const startEditWorkoutName = (workout: Workout) => {
    setEditingWorkoutId(workout.id!);
    setEditingWorkoutName(workout.name);
  };

  const cancelEditWorkoutName = () => {
    setEditingWorkoutId(null);
    setEditingWorkoutName('');
  };

  const saveWorkoutName = async (workoutId: number) => {
    if (!editingWorkoutName.trim()) return;
    try {
      const updated = await updateWorkout(workoutId, { name: editingWorkoutName.trim() });
      setPastWorkouts((prev) => prev.map((w) => (w.id === workoutId ? updated : w)));
      cancelEditWorkoutName();
    } catch (err) {
      console.error('Failed to update workout:', err);
      setError('Failed to update workout name.');
    }
  };

  // ─── Workout delete ────────────────────────────────────────────────────────

  const confirmDeleteWorkout = async () => {
    if (!deleteWorkoutTarget?.id) return;
    try {
      await deleteWorkout(deleteWorkoutTarget.id);
      setPastWorkouts((prev) => prev.filter((w) => w.id !== deleteWorkoutTarget.id));
      if (expandedWorkoutId === deleteWorkoutTarget.id) setExpandedWorkoutId(null);
    } catch (err) {
      console.error('Failed to delete workout:', err);
      setError('Failed to delete workout.');
    } finally {
      setDeleteWorkoutTarget(null);
    }
  };

  // ─── Exercise inline edit ──────────────────────────────────────────────────

  const startEditExercise = (ex: ExerciseType) => {
    setEditingExerciseId(ex.id!);
    setEditingExercise({
      name: ex.name,
      sets: String(ex.sets),
      reps: String(ex.reps),
      weight: String(ex.weight),
    });
  };

  const cancelEditExercise = () => {
    setEditingExerciseId(null);
  };

  const saveExercise = async (workoutId: number, exerciseId: number) => {
    try {
      const updated = await updateExercise(workoutId, exerciseId, {
        name: editingExercise.name || undefined,
        sets: editingExercise.sets ? parseInt(editingExercise.sets) : undefined,
        reps: editingExercise.reps ? parseInt(editingExercise.reps) : undefined,
        weight: editingExercise.weight ? parseInt(editingExercise.weight) : undefined,
      });
      setPastWorkouts((prev) =>
        prev.map((w) =>
          w.id === workoutId
            ? { ...w, exercises: w.exercises.map((e) => (e.id === exerciseId ? updated : e)) }
            : w
        )
      );
      cancelEditExercise();
    } catch (err) {
      console.error('Failed to update exercise:', err);
      setError('Failed to update exercise.');
    }
  };

  // ─── Exercise delete ───────────────────────────────────────────────────────

  const confirmDeleteExercise = async () => {
    if (!deleteExerciseTarget) return;
    const { workoutId, exercise } = deleteExerciseTarget;
    try {
      await deleteExercise(workoutId, exercise.id!);
      setPastWorkouts((prev) =>
        prev.map((w) =>
          w.id === workoutId ? { ...w, exercises: w.exercises.filter((e) => e.id !== exercise.id) } : w
        )
      );
    } catch (err) {
      console.error('Failed to delete exercise:', err);
      setError('Failed to delete exercise.');
    } finally {
      setDeleteExerciseTarget(null);
    }
  };

  // ─── Add exercise to existing workout ─────────────────────────────────────

  const startAddExercise = (workoutId: number) => {
    setAddingExerciseToWorkoutId(workoutId);
    setNewExForExisting({ name: '', sets: '', reps: '', weight: '' });
  };

  const cancelAddExercise = () => {
    setAddingExerciseToWorkoutId(null);
  };

  const saveAddExercise = async (workoutId: number) => {
    const { name, sets, reps, weight } = newExForExisting;
    if (!name || !sets || !reps || !weight) {
      setError('Please fill in all fields for the new exercise.');
      return;
    }
    try {
      const updated = await addExerciseToWorkout(workoutId, {
        name,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: parseInt(weight),
      });
      setPastWorkouts((prev) => prev.map((w) => (w.id === workoutId ? updated : w)));
      cancelAddExercise();
    } catch (err) {
      console.error('Failed to add exercise:', err);
      setError('Failed to add exercise.');
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

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

          {/* ── New Workout Form ── */}
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
                  <ListItemText primary={`${ex.name}: ${ex.sets} sets, ${ex.reps} reps, ${ex.weight}kg`} />
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
                    <MenuItem disabled value="">No exercises in library — add some first</MenuItem>
                  ) : (
                    exerciseOptions.map((opt) => (
                      <MenuItem key={opt.id} value={opt.name}>{opt.name}</MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              <TextField label="Sets" type="number" value={newSets} onChange={(e) => setNewSets(parseInt(e.target.value))} size="small" sx={{ width: 80 }} />
              <TextField label="Reps" type="number" value={newReps} onChange={(e) => setNewReps(parseInt(e.target.value))} size="small" sx={{ width: 80 }} />
              <TextField label="Weight" type="number" value={newWeight} onChange={(e) => setNewWeight(parseInt(e.target.value))} size="small" sx={{ width: 100 }} />
              <IconButton color="primary" onClick={handleAddExercise}><AddIcon /></IconButton>
            </Box>
            <Button variant="contained" color="primary" onClick={handleLogWorkout} sx={{ mt: 3 }} fullWidth>
              Log Workout
            </Button>
          </Paper>

          {/* ── Past Workouts ── */}
          <Typography variant="h5" component="h2" sx={{ mt: 5, mb: 2 }}>
            Past Workouts
          </Typography>
          <List sx={{ width: '100%' }}>
            {pastWorkouts.length === 0 ? (
              <Typography>No workouts logged yet.</Typography>
            ) : (
              pastWorkouts.map((workout) => {
                const isExpanded = expandedWorkoutId === workout.id;
                const isEditingName = editingWorkoutId === workout.id;
                const isAddingEx = addingExerciseToWorkoutId === workout.id;

                return (
                  <Paper key={workout.id} elevation={2} sx={{ p: 2, mb: 2 }}>
                    {/* Workout header row */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton size="small" onClick={() => setExpandedWorkoutId(isExpanded ? null : workout.id!)}>
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>

                      {isEditingName ? (
                        <>
                          <TextField
                            size="small"
                            value={editingWorkoutName}
                            onChange={(e) => setEditingWorkoutName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') saveWorkoutName(workout.id!); if (e.key === 'Escape') cancelEditWorkoutName(); }}
                            autoFocus
                            sx={{ flexGrow: 1 }}
                          />
                          <IconButton size="small" color="primary" onClick={() => saveWorkoutName(workout.id!)}><CheckIcon /></IconButton>
                          <IconButton size="small" onClick={cancelEditWorkoutName}><CloseIcon /></IconButton>
                        </>
                      ) : (
                        <>
                          <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 600 }}>
                            {workout.name}
                          </Typography>
                          <IconButton size="small" onClick={() => startEditWorkoutName(workout)}><EditOutlinedIcon fontSize="small" /></IconButton>
                          <IconButton size="small" color="error" onClick={() => setDeleteWorkoutTarget(workout)}><DeleteOutlineIcon fontSize="small" /></IconButton>
                        </>
                      )}
                    </Box>

                    {/* Collapsible exercise list */}
                    <Collapse in={isExpanded}>
                      <List dense sx={{ mt: 1 }}>
                        {workout.exercises.map((ex) => {
                          const isEditingEx = editingExerciseId === ex.id;
                          return (
                            <ListItem key={ex.id} sx={{ pl: 1 }}
                              secondaryAction={
                                !isEditingEx && (
                                  <>
                                    <IconButton size="small" edge="end" onClick={() => startEditExercise(ex)}><EditOutlinedIcon fontSize="small" /></IconButton>
                                    <IconButton size="small" edge="end" color="error" onClick={() => setDeleteExerciseTarget({ workoutId: workout.id!, exercise: ex })}><DeleteOutlineIcon fontSize="small" /></IconButton>
                                  </>
                                )
                              }
                            >
                              {isEditingEx ? (
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
                                  <FormControl size="small" sx={{ minWidth: 140 }}>
                                    <InputLabel>Exercise</InputLabel>
                                    <Select
                                      value={editingExercise.name}
                                      label="Exercise"
                                      onChange={(e) => setEditingExercise((prev) => ({ ...prev, name: e.target.value }))}
                                    >
                                      {exerciseOptions.map((opt) => (
                                        <MenuItem key={opt.id} value={opt.name}>{opt.name}</MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                  <TextField label="Sets" type="number" size="small" value={editingExercise.sets} onChange={(e) => setEditingExercise((prev) => ({ ...prev, sets: e.target.value }))} sx={{ width: 70 }} />
                                  <TextField label="Reps" type="number" size="small" value={editingExercise.reps} onChange={(e) => setEditingExercise((prev) => ({ ...prev, reps: e.target.value }))} sx={{ width: 70 }} />
                                  <TextField label="Weight" type="number" size="small" value={editingExercise.weight} onChange={(e) => setEditingExercise((prev) => ({ ...prev, weight: e.target.value }))} sx={{ width: 80 }} />
                                  <IconButton size="small" color="primary" onClick={() => saveExercise(workout.id!, ex.id!)}><CheckIcon /></IconButton>
                                  <IconButton size="small" onClick={cancelEditExercise}><CloseIcon /></IconButton>
                                </Box>
                              ) : (
                                <ListItemText primary={`${ex.name}: ${ex.sets} sets × ${ex.reps} reps @ ${ex.weight}kg`} />
                              )}
                            </ListItem>
                          );
                        })}

                        {/* Add exercise to existing workout row */}
                        {isAddingEx ? (
                          <ListItem sx={{ pl: 1 }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
                              <FormControl size="small" sx={{ minWidth: 140 }}>
                                <InputLabel>Exercise</InputLabel>
                                <Select
                                  value={newExForExisting.name}
                                  label="Exercise"
                                  onChange={(e) => setNewExForExisting((prev) => ({ ...prev, name: e.target.value }))}
                                >
                                  {exerciseOptions.map((opt) => (
                                    <MenuItem key={opt.id} value={opt.name}>{opt.name}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <TextField label="Sets" type="number" size="small" value={newExForExisting.sets} onChange={(e) => setNewExForExisting((prev) => ({ ...prev, sets: e.target.value }))} sx={{ width: 70 }} />
                              <TextField label="Reps" type="number" size="small" value={newExForExisting.reps} onChange={(e) => setNewExForExisting((prev) => ({ ...prev, reps: e.target.value }))} sx={{ width: 70 }} />
                              <TextField label="Weight" type="number" size="small" value={newExForExisting.weight} onChange={(e) => setNewExForExisting((prev) => ({ ...prev, weight: e.target.value }))} sx={{ width: 80 }} />
                              <IconButton size="small" color="primary" onClick={() => saveAddExercise(workout.id!)}><CheckIcon /></IconButton>
                              <IconButton size="small" onClick={cancelAddExercise}><CloseIcon /></IconButton>
                            </Box>
                          </ListItem>
                        ) : (
                          <ListItem sx={{ pl: 1 }}>
                            <Button size="small" startIcon={<AddIcon />} onClick={() => startAddExercise(workout.id!)}>
                              Add Exercise
                            </Button>
                          </ListItem>
                        )}
                      </List>
                    </Collapse>
                  </Paper>
                );
              })
            )}
          </List>
        </Box>
      </Container>

      {/* ── Delete Workout Dialog ── */}
      <Dialog open={!!deleteWorkoutTarget} onClose={() => setDeleteWorkoutTarget(null)}>
        <DialogTitle>Delete Workout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete <strong>{deleteWorkoutTarget?.name}</strong> and all its exercises? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteWorkoutTarget(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDeleteWorkout}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Exercise Dialog ── */}
      <Dialog open={!!deleteExerciseTarget} onClose={() => setDeleteExerciseTarget(null)}>
        <DialogTitle>Remove Exercise</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remove <strong>{deleteExerciseTarget?.exercise.name}</strong> from this workout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteExerciseTarget(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDeleteExercise}>Remove</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkoutLogPage;
