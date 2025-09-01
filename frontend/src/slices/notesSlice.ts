import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Note {
  _id: string;
  content: string;
  createdAt: string;
}

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null,
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNotes(state, action: PayloadAction<Note[]>) {
      state.notes = action.payload;
    },
    addNote(state, action: PayloadAction<Note>) {
      state.notes.unshift(action.payload);
    },
    removeNote(state, action: PayloadAction<string>) {
      state.notes = state.notes.filter(note => note._id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setNotes, addNote, removeNote, setLoading, setError } = notesSlice.actions;
export default notesSlice.reducer;
