import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Box,
  Typography,
  Tab,
  Tabs,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  MenuItem,
  Alert,
  Avatar,
  Divider,
  Paper,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Delete,
  Edit,
  CheckCircle,
  Favorite,
  Notifications,
  Person,
  ShoppingBag,
  CloudUpload,
} from '@mui/icons-material';

const YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  '5th Year',
  'Postgraduate',
  'PhD / Research',
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, updateProfileState } = useAuth();
  
  const [activeTab, setActiveTab] = useState(0);
  
  // Data lists
  const [myProducts, setMyProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: '',
    college: '',
    branch: '',
    year: '',
    phoneNumber: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch initial profile values and user data lists
  const fetchDashboardData = async () => {
    try {
      const [prodRes, wishRes, notifRes, profileRes] = await Promise.all([
        api.get('/users/my-products'),
        api.get('/users/wishlist'),
        api.get('/users/notifications'),
        api.get('/users/profile'),
      ]);
      
      setMyProducts(prodRes.data || []);
      setWishlist(wishRes.data || []);
      setNotifications(notifRes.data || []);
      
      const prof = profileRes.data;
      setProfileData({
        name: prof.name,
        college: prof.college,
        branch: prof.branch,
        year: prof.year,
        phoneNumber: prof.phoneNumber,
      });
    } catch (err) {
      console.error('Error fetching dashboard records', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    setSuccess('');
  };

  // Mark product as sold
  const handleMarkAsSold = async (id) => {
    try {
      await api.patch(`/products/${id}/sold`);
      setMyProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'SOLD' } : p))
      );
      setSuccess('Product marked as SOLD successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to update product status');
    }
  };

  // Delete product listing
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.delete(`/products/${id}`);
      setMyProducts((prev) => prev.filter((p) => p.id !== id));
      setSuccess('Product listing deleted successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to delete listing');
    }
  };

  // Remove item from wishlist
  const handleRemoveFromWishlist = async (id) => {
    try {
      await api.post(`/users/wishlist/${id}`);
      setWishlist((prev) => prev.filter((p) => p.id !== id));
      setSuccess('Removed from wishlist');
    } catch (err) {
      console.error(err);
    }
  };

  // Update profile textual details
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.put('/users/profile', profileData);
      updateProfileState(res.data);
      setSuccess('Profile details updated successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to update profile details.');
    } finally {
      setLoading(false);
    }
  };

  // Upload profile photo
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append('file', file);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/users/profile/picture', fileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Force reload auth profile photo url state
      const userStored = JSON.parse(localStorage.getItem('user'));
      userStored.profilePictureUrl = res.data.profilePictureUrl;
      localStorage.setItem('user', JSON.stringify(userStored));
      window.location.reload(); // Quick refresh to update avatar
    } catch (err) {
      console.error(err);
      setError('Failed to upload profile photo');
    }
  };

  return (
    <Box>
      {/* Header Profile Badge Card */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 4, bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            sx={{ width: 90, height: 90, bgcolor: 'primary.main', fontSize: 36 }}
            src={user?.profilePictureUrl ? `http://localhost:8080${user.profilePictureUrl}` : undefined}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : ''}
          </Avatar>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            sx={{
              position: 'absolute',
              bottom: -6,
              right: -6,
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <input hidden accept="image/*" type="file" onChange={handlePhotoUpload} />
            <CloudUpload fontSize="small" />
          </IconButton>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="bold">
            {profileData.name || user?.name}
          </Typography>
          <Typography color="text.secondary" variant="body2" gutterBottom>
            {user?.email}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            <Chip icon={<ShoppingBag />} label="Seller Account" color="primary" variant="outlined" size="small" />
            <Chip icon={<Person />} label={profileData.college || 'No college'} color="secondary" variant="outlined" size="small" />
          </Box>
        </Box>
      </Paper>

      {/* Alert Banners */}
      {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      {/* Navigation tabs */}
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tab icon={<ShoppingBag />} iconPosition="start" label="My Listings" />
        <Tab icon={<Favorite />} iconPosition="start" label="Wishlist" />
        <Tab icon={<Person />} iconPosition="start" label="Profile Settings" />
        <Tab icon={<Notifications />} iconPosition="start" label="Notifications" />
      </Tabs>

      {/* Tab Panels */}
      {/* 1. My Listings Tab */}
      {activeTab === 0 && (
        <Box>
          {myProducts.length === 0 ? (
            <Paper sx={{ py: 6, textAlign: 'center', border: '1px dashed', borderColor: 'divider' }}>
              <Typography color="text.secondary" sx={{ mb: 2 }}>You haven't posted any second-hand items yet.</Typography>
              <Button variant="contained" onClick={() => navigate('/products/new')}>Add Listing</Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {myProducts.map((prod) => (
                <Grid item xs={12} sm={6} md={3} key={prod.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
                    <CardMedia
                      component="img"
                      height="150"
                      image={
                        prod.images && prod.images.length > 0
                          ? `http://localhost:8080${prod.images[0]}`
                          : 'https://via.placeholder.com/300x150?text=No+Image'
                      }
                      alt={prod.title}
                    />
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ maxWidth: '70%' }}>
                            {prod.title}
                          </Typography>
                          <Typography variant="subtitle1" fontWeight="bold" color="secondary.main">
                            ₹{prod.price}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                          <Chip label={prod.categoryName} size="small" variant="outlined" />
                          <Chip
                            label={prod.status}
                            size="small"
                            color={prod.status === 'AVAILABLE' ? 'success' : 'error'}
                          />
                        </Box>
                      </Box>

                      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {prod.status === 'AVAILABLE' && (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckCircle />}
                            onClick={() => handleMarkAsSold(prod.id)}
                            fullWidth
                          >
                            Mark as Sold
                          </Button>
                        )}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Edit />}
                            onClick={() => navigate(`/products/${prod.id}/edit`)}
                            fullWidth
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => handleDeleteProduct(prod.id)}
                            fullWidth
                          >
                            Delete
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* 2. Wishlist Tab */}
      {activeTab === 1 && (
        <Box>
          {wishlist.length === 0 ? (
            <Paper sx={{ py: 6, textAlign: 'center', border: '1px dashed', borderColor: 'divider' }}>
              <Typography color="text.secondary">Your wishlist is empty.</Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {wishlist.map((prod) => (
                <Grid item xs={12} sm={6} md={3} key={prod.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
                    <CardMedia
                      component="img"
                      height="150"
                      image={
                        prod.images && prod.images.length > 0
                          ? `http://localhost:8080${prod.images[0]}`
                          : 'https://via.placeholder.com/300x150?text=No+Image'
                      }
                      alt={prod.title}
                    />
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ maxWidth: '70%' }}>
                            {prod.title}
                          </Typography>
                          <Typography variant="subtitle1" fontWeight="bold" color="secondary.main">
                            ₹{prod.price}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                          <Chip label={prod.categoryName} size="small" variant="outlined" />
                          <Chip label={prod.status} size="small" color={prod.status === 'AVAILABLE' ? 'success' : 'error'} />
                        </Box>
                      </Box>

                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate(`/products/${prod.id}`)}
                          fullWidth
                        >
                          View details
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => handleRemoveFromWishlist(prod.id)}
                        >
                          <Delete />
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* 3. Profile Settings Tab */}
      {activeTab === 2 && (
        <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 600 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Edit Profile Info</Typography>
          <Box component="form" onSubmit={handleProfileSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Full Name"
                  name="name"
                  fullWidth
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="College / Campus"
                  name="college"
                  fullWidth
                  required
                  value={profileData.college}
                  onChange={(e) => setProfileData({ ...profileData, college: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Branch / Major"
                  name="branch"
                  fullWidth
                  required
                  value={profileData.branch}
                  onChange={(e) => setProfileData({ ...profileData, branch: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Year"
                  name="year"
                  fullWidth
                  required
                  value={profileData.year}
                  onChange={(e) => setProfileData({ ...profileData, year: e.target.value })}
                >
                  {YEARS.map((y) => (
                    <MenuItem key={y} value={y}>{y}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Contact Phone"
                  name="phoneNumber"
                  fullWidth
                  required
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                />
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 3 }}>
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </Box>
        </Paper>
      )}

      {/* 4. Notifications Inbox Tab */}
      {activeTab === 3 && (
        <Paper sx={{ borderRadius: 3 }}>
          <List>
            {notifications.length === 0 ? (
              <ListItem><ListItemText primary="No notifications in your inbox." /></ListItem>
            ) : (
              notifications.map((notif) => (
                <ListItem key={notif.id} divider>
                  <ListItemText
                    primary={notif.content}
                    secondary={new Date(notif.createdAt).toLocaleString()}
                    primaryTypographyProps={{ fontWeight: notif.isRead ? 400 : 600 }}
                  />
                  {!notif.isRead && (
                    <Chip label="Unread" size="small" color="primary" />
                  )}
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default Dashboard;
