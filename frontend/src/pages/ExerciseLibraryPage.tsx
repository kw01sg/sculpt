import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  getExerciseDefinitions,
  createExerciseDefinition,
  updateExerciseDefinition,
  deleteExerciseDefinition,
} from '../services/api';
import { ExerciseDefinition } from '../types';
import { useAuth } from '../context/AuthContext';

const ExerciseLibraryPage: React.FC = () => {
  const { logout } = useAuth();
  const [exercises, setExercises] = useState<ExerciseDefinition[]>([]);
  const [newName, setNewName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Inline edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<ExerciseDefinition | null>(null);

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

  const handleAddKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  const startEdit = (ex: ExerciseDefinition) => {
    setEditingId(ex.id);
    setEditValue(ex.name);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const commitEdit = async (id: number) => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      setError('Exercise name cannot be empty.');
      return;
    }
    setError(null);
    try {
      const updated = await updateExerciseDefinition(id, trimmed);
      setExercises((prev) =>
        prev
          .map((e) => (e.id === id ? updated : e))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      setEditingId(null);
      setEditValue('');
    } catch (err) {
      console.error('Failed to update exercise:', err);
      setError('Failed to rename exercise. The name may already exist.');
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter') commitEdit(id);
    if (e.key === 'Escape') cancelEdit();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteExerciseDefinition(deleteTarget.id);
      setExercises((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    } catch (err) {
      console.error('Failed to delete exercise:', err);
      setError('Failed to delete exercise. Please try again.');
    } finally {
      setDeleteTarget(null);
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
                onKeyDown={handleAddKeyDown}
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
                  <ListItem
                    secondaryAction={
                      editingId === ex.id ? (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => commitEdit(ex.id)}
                            aria-label="Save"
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={cancelEdit}
                            aria-label="Cancel"
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => startEdit(ex)}
                            aria-label={`Edit ${ex.name}`}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteTarget(ex)}
                            aria-label={`Delete ${ex.name}`}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )
                    }
                  >
                    {editingId === ex.id ? (
                      <TextField
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleEditKeyDown(e, ex.id)}
                        size="small"
                        autoFocus
                        sx={{ mr: 1 }}
                        slotProps={{
                          input: {
                            endAdornment: <InputAdornment position="end" />,
                          },
                        }}
                      />
                    ) : (
                      <ListItemText primary={ex.name} />
                    )}
                  </ListItem>
                </Paper>
              ))}
            </List>
          )}
        </Box>
      </Container>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete Exercise</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete <strong>{deleteTarget?.name}</strong>? This won't affect exercises already logged in your workouts.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExerciseLibraryPage;
