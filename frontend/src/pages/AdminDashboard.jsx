import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Box,
  Typography,
  Tab,
  Tabs,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  Report,
  Category,
  People,
  Delete,
  Edit,
  CheckCircle,
  Block,
} from '@mui/icons-material';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Lists
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  // Forms
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  
  // Category Edit Dialog states
  const [editCat, setEditCat] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchReports = async () => {
    try {
      const res = await api.get('/admin/reports/pending');
      setReports(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchCategories();
    fetchUsers();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    setSuccess('');
  };

  // Resolve Report
  const handleResolveReport = async (reportId, action) => {
    try {
      await api.patch(`/admin/reports/${reportId}/resolve?action=${action}`);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      setSuccess(`Report resolved successfully with action: ${action}`);
    } catch (err) {
      console.error(err);
      setError('Failed to resolve report');
    }
  };

  // Block/Unblock User
  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      await api.patch(`/admin/users/${userId}/status?isActive=${newStatus}`);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: newStatus } : u))
      );
      setSuccess(`User status updated successfully!`);
    } catch (err) {
      console.error(err);
      setError('Failed to update user status');
    }
  };

  // Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catName) return;
    try {
      const res = await api.post('/admin/categories', {
        name: catName,
        description: catDesc,
      });
      setCategories((prev) => [...prev, res.data]);
      setCatName('');
      setCatDesc('');
      setSuccess('Category created successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to create category');
    }
  };

  // Open Edit Category
  const handleOpenEdit = (category) => {
    setEditCat(category);
    setEditName(category.name);
    setEditDesc(category.description);
    setOpenEditDialog(true);
  };

  const handleCloseEdit = () => {
    setEditCat(null);
    setOpenEditDialog(false);
  };

  // Update Category
  const handleSaveEdit = async () => {
    try {
      const res = await api.put(`/admin/categories/${editCat.id}`, {
        name: editName,
        description: editDesc,
      });
      setCategories((prev) =>
        prev.map((c) => (c.id === editCat.id ? res.data : c))
      );
      setSuccess('Category updated successfully!');
      handleCloseEdit();
    } catch (err) {
      console.error(err);
      setError('Failed to update category');
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setSuccess('Category deleted successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to delete category');
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Admin Moderation Panel
      </Typography>

      {/* Messages */}
      {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      {/* Tabs */}
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tab icon={<Report />} iconPosition="start" label={`Pending Reports (${reports.length})`} />
        <Tab icon={<Category />} iconPosition="start" label="Categories Manager" />
        <Tab icon={<People />} iconPosition="start" label="Users Audit" />
      </Tabs>

      {/* 1. Reports Queue */}
      {activeTab === 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell fontWeight="bold">Product ID</TableCell>
                <TableCell fontWeight="bold">Product Title</TableCell>
                <TableCell fontWeight="bold">Reporter</TableCell>
                <TableCell fontWeight="bold">Reason</TableCell>
                <TableCell fontWeight="bold">Details</TableCell>
                <TableCell fontWeight="bold" align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    No pending product reports in queue.
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((rep) => (
                  <TableRow key={rep.id}>
                    <TableCell>{rep.productId}</TableCell>
                    <TableCell fontWeight="bold">{rep.productTitle}</TableCell>
                    <TableCell>{rep.reporterEmail}</TableCell>
                    <TableCell>
                      <Chip label={rep.reason} size="small" color="warning" variant="outlined" />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {rep.details || '-'}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircle />}
                          onClick={() => handleResolveReport(rep.id, 'DISMISS')}
                        >
                          Dismiss
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleResolveReport(rep.id, 'DELETE_PRODUCT')}
                        >
                          Remove Listing
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* 2. Categories Tab */}
      {activeTab === 1 && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'action.hover' }}>
                    <TableCell fontWeight="bold">Category Name</TableCell>
                    <TableCell fontWeight="bold">Description</TableCell>
                    <TableCell fontWeight="bold" align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell fontWeight="bold">{cat.name}</TableCell>
                      <TableCell>{cat.description}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Edit />}
                            onClick={() => handleOpenEdit(cat)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => handleDeleteCategory(cat.id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Add Category Form */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Add New Category
              </Typography>
              <Box component="form" onSubmit={handleAddCategory}>
                <TextField
                  label="Category Name"
                  fullWidth
                  required
                  size="small"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  margin="normal"
                />
                <TextField
                  label="Category Description"
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  margin="normal"
                />
                <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>
                  Create Category
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* 3. Users Audit Tab */}
      {activeTab === 2 && (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell fontWeight="bold">Name</TableCell>
                <TableCell fontWeight="bold">Email</TableCell>
                <TableCell fontWeight="bold">College</TableCell>
                <TableCell fontWeight="bold">Phone</TableCell>
                <TableCell fontWeight="bold">Status</TableCell>
                <TableCell fontWeight="bold" align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell fontWeight="bold">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.college}</TableCell>
                  <TableCell>{u.phoneNumber}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.isActive ? 'Active' : 'Banned'}
                      size="small"
                      color={u.isActive ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      color={u.isActive ? 'error' : 'success'}
                      startIcon={<Block />}
                      onClick={() => handleToggleUserStatus(u.id, u.isActive)}
                    >
                      {u.isActive ? 'Block User' : 'Unblock User'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Category Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEdit} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight="bold">Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            fullWidth
            required
            margin="normal"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <TextField
            label="Category Description"
            fullWidth
            multiline
            rows={2}
            margin="normal"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
