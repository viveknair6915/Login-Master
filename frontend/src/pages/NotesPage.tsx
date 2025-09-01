import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotes, addNote, removeNote, setLoading, setError } from '../slices/notesSlice';
import { RootState } from '../store';
import axios from 'axios';
import { Box, Typography, Button, TextField, List, ListItem, ListItemText, IconButton, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const NotesPage: React.FC = () => {
  const dispatch = useDispatch();
  const { notes, loading, error } = useSelector((state: RootState) => state.notes);
  const token = useSelector((state: RootState) => state.user.token);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axios.get('/api/notes', { headers: { Authorization: `Bearer ${token}` } });
        dispatch(setNotes(res.data));
        dispatch(setError(null));
      } catch (err: any) {
        dispatch(setError(err.response?.data?.message || 'Failed to fetch notes'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchNotes();
  }, [dispatch, token]);

  const handleAddNote = async () => {
    if (!content.trim()) return;
    dispatch(setLoading(true));
    try {
      const res = await axios.post('/api/notes', { content }, { headers: { Authorization: `Bearer ${token}` } });
      dispatch(addNote(res.data));
      setContent('');
      dispatch(setError(null));
    } catch (err: any) {
      dispatch(setError(err.response?.data?.message || 'Failed to add note'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDeleteNote = async (id: string) => {
    dispatch(setLoading(true));
    try {
      await axios.delete(`/api/notes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      dispatch(removeNote(id));
      dispatch(setError(null));
    } catch (err: any) {
      dispatch(setError(err.response?.data?.message || 'Failed to delete note'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Box maxWidth={500} mx="auto" mt={8} p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h4" mb={2}>Your Notes</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box display="flex" mb={2}>
        <TextField
          label="New Note"
          fullWidth
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={loading}
        />
        <Button variant="contained" color="primary" onClick={handleAddNote} disabled={loading || !content.trim()} sx={{ ml: 2 }}>
          Add
        </Button>
      </Box>
      <List>
        {notes.map(note => (
          <ListItem key={note._id} secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteNote(note._id)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemText primary={note.content} secondary={new Date(note.createdAt).toLocaleString()} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default NotesPage;
