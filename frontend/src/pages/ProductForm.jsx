import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Alert,
  Container,
  IconButton,
} from '@mui/material';
import { ArrowBack, PhotoCamera, Close } from '@mui/icons-material';

const CONDITIONS = ['NEW', 'EXCELLENT', 'GOOD', 'FAIR'];

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    itemCondition: '',
    categoryId: '',
    phoneNumber: '',
    images: [], // Keep track of existing images
  });
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch categories and product data if editing
  useEffect(() => {
    const loadData = async () => {
      try {
        const catRes = await api.get('/categories');
        setCategories(catRes.data);

        if (isEdit) {
          const prodRes = await api.get(`/products/${id}`);
          const prod = prodRes.data;
          setFormData({
            title: prod.title || '',
            description: prod.description || '',
            price: prod.price || '',
            itemCondition: prod.itemCondition || '',
            categoryId: prod.categoryId || '',
            phoneNumber: prod.phoneNumber || '',
            images: prod.images || [],
          });
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load form requirements');
      }
    };
    loadData();
  }, [id, isEdit]);

  const handleTextChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);

    // Generate object URLs for image previewing
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...filePreviews]);
  };

  const handleRemovePreview = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Numeric check for phone
    const phoneRegex = /^[0-9]{10,12}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError('Please enter a valid phone number (10-12 digits)');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        // Edit Endpoint (Only updates text details)
        await api.put(`/products/${id}`, formData);
        navigate(`/products/${id}`);
      } else {
        // Create Endpoint (Handles multipart files)
        const multiFormData = new FormData();
        
        // Append product details as JSON Blob
        const productBlob = new Blob([JSON.stringify(formData)], {
          type: 'application/json',
        });
        multiFormData.append('product', productBlob);

        // Append images
        if (selectedFiles.length === 0) {
          setError('Please upload at least one image of the product');
          setLoading(false);
          return;
        }

        selectedFiles.forEach((file) => {
          multiFormData.append('images', file);
        });

        await api.post('/products', multiFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        'Failed to save listing details. Verify form details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3 }} color="inherit">
        Back
      </Button>

      <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
            {isEdit ? 'Edit Listing Details' : 'Post Second-hand Item'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Provide complete details to attract students quickly.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Listing Title"
                  name="title"
                  fullWidth
                  required
                  value={formData.title}
                  onChange={handleTextChange}
                  placeholder="e.g. HC Verma Physics Vol 1, Hercules Cycle"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Listing Description"
                  name="description"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleTextChange}
                  placeholder="Detail the product condition, age, usage history, or any missing components"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price (₹)"
                  name="price"
                  type="number"
                  fullWidth
                  required
                  value={formData.price}
                  onChange={handleTextChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Item Condition"
                  name="itemCondition"
                  fullWidth
                  required
                  value={formData.itemCondition}
                  onChange={handleTextChange}
                >
                  {CONDITIONS.map((cond) => (
                    <MenuItem key={cond} value={cond}>
                      {cond}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Product Category"
                  name="categoryId"
                  fullWidth
                  required
                  value={formData.categoryId}
                  onChange={handleTextChange}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Contact Phone Number"
                  name="phoneNumber"
                  fullWidth
                  required
                  value={formData.phoneNumber}
                  onChange={handleTextChange}
                  placeholder="e.g. 9876543210"
                />
              </Grid>

              {/* Display existing listing images for verification if editing */}
              {isEdit && formData.images && formData.images.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                    Current Product Images
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}>
                    {formData.images.map((img, idx) => (
                      <Box key={img} sx={{ width: 80, height: 80 }}>
                        <Box
                          component="img"
                          src={`http://localhost:8080${img}`}
                          alt={`current preview ${idx}`}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2 }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}

              {/* Multiple Image Selector (For new products) */}
              {!isEdit && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                    Product Images
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<PhotoCamera />}
                      sx={{ height: 50 }}
                    >
                      Choose Images
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>

                    <Typography variant="caption" color="text.secondary">
                      Upload clear photos showing different angles of the item.
                    </Typography>
                  </Box>

                  {/* Previews grid */}
                  {previews.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}>
                      {previews.map((preview, idx) => (
                        <Box key={preview} sx={{ position: 'relative', width: 80, height: 80 }}>
                          <Box
                            component="img"
                            src={preview}
                            alt="preview"
                            sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2 }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemovePreview(idx)}
                            sx={{
                              position: 'absolute',
                              top: -6,
                              right: -6,
                              bgcolor: 'error.main',
                              color: 'white',
                              width: 20,
                              height: 20,
                              '&:hover': { bgcolor: 'error.dark' },
                            }}
                          >
                            <Close sx={{ fontSize: 12 }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Grid>
              )}
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ mt: 4 }}
            >
              {loading ? 'Saving Listing...' : isEdit ? 'Update Listing' : 'Post Listing'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductForm;
