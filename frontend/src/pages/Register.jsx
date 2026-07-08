import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  Grid,
  MenuItem,
  Avatar,
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';

const YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  '5th Year',
  'Postgraduate',
  'PhD / Research',
];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    branch: '',
    year: '',
    phoneNumber: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Phone validation (numeric check)
    const phoneRegex = /^[0-9]{10,12}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError('Please enter a valid phone number (10-12 digits, numbers only)');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        college: formData.college,
        branch: formData.branch,
        year: formData.year,
        phoneNumber: formData.phoneNumber,
      });
      // Redirect with success flag
      navigate('/login?registered=true');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        'Registration failed. Please verify your info.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Card sx={{ width: '100%', borderRadius: 4, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Header Icon */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
                <PersonAdd fontSize="large" />
              </Avatar>
            </Box>

            <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
              Create Student Account
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
              Register using your college credentials to buy and sell second-hand educational items
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    name="name"
                    fullWidth
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    fullWidth
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    required
                    value={formData.password}
                    onChange={handleChange}
                    helperText="Minimum 6 characters"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    fullWidth
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="College Name"
                    name="college"
                    fullWidth
                    required
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="e.g. IIT Delhi"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Branch / Major"
                    name="branch"
                    fullWidth
                    required
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Year of Study"
                    name="year"
                    fullWidth
                    required
                    value={formData.year}
                    onChange={handleChange}
                  >
                    {YEARS.map((y) => (
                      <MenuItem key={y} value={y}>
                        {y}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    fullWidth
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ mt: 4, mb: 2 }}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </Box>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" fontWeight="bold">
                  Login here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Register;
