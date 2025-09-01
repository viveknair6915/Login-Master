import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import notesReducer from './slices/notesSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    notes: notesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
