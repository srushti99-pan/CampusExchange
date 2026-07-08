import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextField,
  InputAdornment,
  Container,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import {
  Search,
  Book,
  Laptop,
  Chair,
  Bed,
  Calculate,
  Science,
  PedalBike,
  Create,
  Description,
  Memory,
  Category,
  SportsSoccer,
  Checkroom,
  MusicNote,
  LocalOffer,
} from '@mui/icons-material';

const CATEGORY_ICONS = {
  'Books': <Book fontSize="large" />,
  'Electronics': <Laptop fontSize="large" />,
  'Furniture': <Chair fontSize="large" />,
  'Hostel Items': <Bed fontSize="large" />,
  'Hostel Essentials': <Bed fontSize="large" />,
  'Calculators': <Calculate fontSize="large" />,
  'Lab Equipment': <Science fontSize="large" />,
  'Cycles': <PedalBike fontSize="large" />,
  'Bicycle': <PedalBike fontSize="large" />,
  'Stationery': <Create fontSize="large" />,
  'Notes': <Description fontSize="large" />,
  'Project Components': <Memory fontSize="large" />,
  'Sports': <SportsSoccer fontSize="large" />,
  'Clothing': <Checkroom fontSize="large" />,
  'Musical Instruments': <MusicNote fontSize="large" />,
  'Miscellaneous': <Category fontSize="large" />,
  'Others': <Category fontSize="large" />,
};

const Home = () => {
  const navigate = useNavigate();
  const [recentProducts, setRecentProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [college, setCollege] = useState('');

  useEffect(() => {
    // Fetch recent items and categories
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?size=4&status=AVAILABLE'),
          api.get('/categories'),
        ]);
        setRecentProducts(prodRes.data.content || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error('Error fetching landing page data', err);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(search)}&college=${encodeURIComponent(college)}`);
  };

  const handleCategoryClick = (id) => {
    navigate(`/products?categoryId=${id}`);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          py: 8,
          px: 4,
          mb: 6,
          background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
          color: 'white',
          borderRadius: 4,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Declutter Your Dorm. Find Great Campus Deals.
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            A trusted marketplace built exclusively for college students to buy and sell second-hand courseware, electronics, hostel essentials, and cycles.
          </Typography>

          {/* Search bar inside Hero */}
          <Paper
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              p: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              maxWidth: 600,
              mx: 'auto',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            <TextField
              placeholder="What are you looking for?"
              variant="standard"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start" sx={{ pl: 1 }}>
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1, px: 1 }}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <TextField
              placeholder="Enter College..."
              variant="standard"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              InputProps={{
                disableUnderline: true,
              }}
              sx={{ flexGrow: 0.8, px: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ borderRadius: 2, py: 1, px: 3 }}
            >
              Search
            </Button>
          </Paper>
        </Container>
      </Paper>

      {/* Categories Catalog */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          Browse by Category
        </Typography>
        <Grid container spacing={2}>
          {categories.map((cat) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={cat.id}>
              <Card
                onClick={() => handleCategoryClick(cat.id)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 130, // Uniform fixed height for all cards
                  p: 2.5, // Uniform padding for all cards
                  cursor: 'pointer',
                  borderRadius: 3, // Uniform border radius
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  textAlign: 'center', // Uniform center alignment
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(99, 102, 241, 0.1)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
                  {CATEGORY_ICONS[cat.name] || <Category fontSize="large" />}
                </Box>
                <Typography 
                  variant="subtitle2" 
                  fontWeight="bold" 
                  align="center"
                  sx={{ 
                    wordBreak: 'break-word',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.2,
                  }}
                >
                  {cat.name}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Recent Products Grid */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Recently Added Listings
          </Typography>
          <Button variant="outlined" color="primary" onClick={() => navigate('/products')}>
            View All Listings
          </Button>
        </Box>
        <Grid container spacing={3}>
          {recentProducts.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center', border: '1px dashed', borderColor: 'divider' }}>
                <Typography color="text.secondary">No items available at the moment.</Typography>
              </Paper>
            </Grid>
          ) : (
            recentProducts.map((prod) => (
              <Grid item xs={12} sm={6} md={3} key={prod.id}>
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
      </Box>
    </Box>
  );
};

export default Home;
