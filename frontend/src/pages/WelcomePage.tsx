
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setUser } from '../slices/userSlice';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const WelcomePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in URL (Google OAuth callback)
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        dispatch(setUser({ id: decoded.id, email: decoded.email, token }));
        // Remove token from URL
        window.history.replaceState({}, document.title, '/welcome');
        setTimeout(() => navigate('/notes'), 1000);
      } catch {
        // Invalid token, ignore
      }
    }
  }, [dispatch, navigate]);

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={3} borderRadius={2} textAlign="center">
      <Box display="flex" justifyContent="center" mb={2}>
        <img
          src="/assets/Sign Up 1.png"
          alt="Welcome Illustration"
          style={{ maxWidth: '180px', width: '100%', height: 'auto', borderRadius: 12 }}
        />
      </Box>
      <Typography variant="h4" mb={2}>Welcome, {user.name || user.email}!</Typography>
      <Typography variant="body1" mb={2}>You are now logged in.</Typography>
      <Button variant="contained" color="primary" href="/notes">Go to Notes</Button>
    </Box>
  );
};

export default WelcomePage;
