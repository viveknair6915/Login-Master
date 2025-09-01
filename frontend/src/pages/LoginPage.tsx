import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading, setError } from '../slices/userSlice';
import { RootState } from '../store';
import axios from 'axios';
import { Button, TextField, Typography, Box, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    dispatch(setLoading(true));
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      dispatch(setUser({ ...res.data.user, token: res.data.token }));
      dispatch(setError(null));
    } catch (err: any) {
      dispatch(setError(err.response?.data?.message || 'Login failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={3} borderRadius={2}>
      <Box display="flex" justifyContent="center" mb={2}>
        <img
          src="/assets/Sign Up 2.png"
          alt="Login Illustration"
          style={{ maxWidth: '180px', width: '100%', height: 'auto', borderRadius: 12 }}
        />
      </Box>
      <Typography variant="h4" mb={2}>Log In</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
        disabled={loading}
      >
        Log In
      </Button>
      <Box mt={2}>
        <Button variant="outlined" color="secondary" fullWidth href="/signup">
          Don't have an account? Sign Up
        </Button>
      </Box>
      <Box mt={2}>
        <Button
          variant="contained"
          color="inherit"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={() => window.location.href = '/api/auth/google'}
        >
          Log In with Google
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
