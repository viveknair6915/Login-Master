import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading, setError } from '../slices/userSlice';
import { RootState } from '../store';
import axios from 'axios';
import { Button, TextField, Typography, Box, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const SignupPage: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');

  const handleSignup = async () => {
    dispatch(setLoading(true));
    try {
      await axios.post('/api/auth/send-otp', { email });
      setStep('otp');
      dispatch(setError(null));
    } catch (err: any) {
      dispatch(setError(err.response?.data?.message || 'Failed to send OTP'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleVerifyOtp = async () => {
    dispatch(setLoading(true));
    try {
      const res = await axios.post('/api/auth/signup', { email, password, otp });
      dispatch(setUser({ ...res.data.user, token: res.data.token }));
      dispatch(setError(null));
    } catch (err: any) {
      dispatch(setError(err.response?.data?.message || 'Signup failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={3} borderRadius={2}>
      <Box display="flex" justifyContent="center" mb={2}>
        <img
          src="/assets/Sign Up 1.png"
          alt="Sign Up Illustration"
          style={{ maxWidth: '180px', width: '100%', height: 'auto', borderRadius: 12 }}
        />
      </Box>
      <Typography variant="h4" mb={2}>Sign Up</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {step === 'email' ? (
        <>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSignup}
            disabled={loading}
          >
            Send OTP
          </Button>
        </>
      ) : (
        <>
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <TextField
            label="OTP"
            type="text"
            fullWidth
            margin="normal"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleVerifyOtp}
            disabled={loading}
          >
            Verify & Sign Up
          </Button>
        </>
      )}
      <Box mt={2}>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          href="/login"
        >
          Already have an account? Log In
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
          Sign Up with Google
        </Button>
      </Box>
    </Box>
  );
};

export default SignupPage;
