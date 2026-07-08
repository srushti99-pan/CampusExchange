import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  Slider,
  Chip,
  Pagination,
  Paper,
  Divider,
} from '@mui/material';

const CONDITIONS = ['NEW', 'EXCELLENT', 'GOOD', 'FAIR'];

const BrowseProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read URL query params on mount
  const queryParams = new URLSearchParams(location.search);
  
  // State for search and filter inputs
  const [search, setSearch] = useState(queryParams.get('search') || '');
  const [categoryId, setCategoryId] = useState(queryParams.get('categoryId') || '');
  const [college, setCollege] = useState(queryParams.get('college') || '');
  const [minPrice, setMinPrice] = useState(queryParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(queryParams.get('maxPrice') || '');
  const [status, setStatus] = useState(queryParams.get('status') || 'AVAILABLE');
  
  // Sorting options: format "field,dir"
  const [sortOption, setSortOption] = useState('createdAt,desc');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories catalog
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  // Fetch products list dynamically
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [sortBy, sortDir] = sortOption.split(',');
      const params = {
        page,
        size: 8,
        sortBy,
        sortDir,
        status,
      };
      if (search) params.search = search;
      if (categoryId) params.categoryId = categoryId;
      if (college) params.college = college;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get('/products', { params });
      setProducts(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, categoryId, status, sortOption]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(0); // Reset to first page
    fetchProducts();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategoryId('');
    setCollege('');
    setMinPrice('');
    setMaxPrice('');
    setStatus('AVAILABLE');
    setSortOption('createdAt,desc');
    setPage(0);
    // Overwrite location so URL updates
    navigate('/products');
  };

  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  return (
    <Grid container spacing={4}>
      {/* Filters Column (Left side) */}
      <Grid item xs={12} md={3}>
        <Paper component="form" onSubmit={handleFilterSubmit} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Filter Options
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Product Keyword"
                fullWidth
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryId}
                  label="Category"
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Campus / College"
                fullWidth
                size="small"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Min Price"
                type="number"
                fullWidth
                size="small"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Max Price"
                type="number"
                fullWidth
                size="small"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Availability</InputLabel>
                <Select
                  value={status}
                  label="Availability"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="AVAILABLE">Available</MenuItem>
                  <MenuItem value="SOLD">Sold Out</MenuItem>
                  <MenuItem value="">All Statuses</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 1 }}>
                Apply Filters
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" color="secondary" fullWidth onClick={handleResetFilters}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Listings Column (Right side) */}
      <Grid item xs={12} md={9}>
        {/* Results Info bar */}
        <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {products.length === 0 ? 'No items found' : `Showing listings (Page ${page + 1} of ${totalPages})`}
          </Typography>

          {/* Sort selection */}
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOption}
              label="Sort By"
              onChange={(e) => setSortOption(e.target.value)}
            >
              <MenuItem value="createdAt,desc">Recently Added</MenuItem>
              <MenuItem value="price,asc">Price: Low to High</MenuItem>
              <MenuItem value="price,desc">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {/* Listings Grid */}
        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12}>
              <Typography align="center" sx={{ py: 6 }}>Loading listings...</Typography>
            </Grid>
          ) : products.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ py: 8, px: 2, textAlign: 'center', border: '1px dashed', borderColor: 'divider' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Listings Match Your Criteria
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search queries or clearing the filter fields.
                </Typography>
              </Paper>
            </Grid>
          ) : (
            products.map((prod) => (
              <Grid item xs={12} sm={6} md={4} key={prod.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={
                      prod.images && prod.images.length > 0
                        ? `http://localhost:8080${prod.images[0]}`
                        : 'https://via.placeholder.com/300x180?text=No+Image'
                    }
                    alt={prod.title}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ maxWidth: '70%' }}>
                          {prod.title}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="bold" color="secondary.main">
                          ₹{prod.price}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: 40
                      }}>
                        {prod.description}
                      </Typography>
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                        <Chip label={prod.categoryName} size="small" variant="outlined" />
                        <Chip label={prod.itemCondition} size="small" color="primary" variant="outlined" />
                        {prod.status === 'SOLD' && (
                          <Chip label="SOLD" size="small" color="error" />
                        )}
                      </Box>
                      <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                        College: {prod.sellerCollege}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate(`/products/${prod.id}`)}
                        sx={{ mt: 1 }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default BrowseProducts;
