import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, LockOpen } from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if redirected because of expired session
  const queryParams = new URLSearchParams(location.search);
  const isExpired = queryParams.get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      // Route based on role
      if (loggedUser.roles.includes('ROLE_ADMIN')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Card sx={{ width: '100%', borderRadius: 4, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Header branding icon */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <LockOpen fontSize="large" />
              </Avatar>
            </Box>

            <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
              Enter credentials to access your CampusExchange account
            </Typography>

            {isExpired && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                Your session has expired. Please login again.
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Box>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register" fontWeight="bold">
                  Register here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

// Import Avatar manually as it is used above
import { Avatar } from '@mui/material';

export default Login;
