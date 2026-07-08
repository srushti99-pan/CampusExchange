import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  Avatar,
  MenuItem,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Report,
  Phone,
  ArrowBack,
  CalendarToday,
  School,
} from "@mui/icons-material";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Wishlist toggle state
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Contact toggle
  const [showPhone, setShowPhone] = useState(false);

  // Report dialog state
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState("");

  // Fetch product data
  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);

      // If user is authenticated, check if this product is in their wishlist
      if (isAuthenticated) {
        const wishRes = await api.get("/users/wishlist");
        const list = wishRes.data || [];
        setIsWishlisted(list.some((item) => item.id === res.data.id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id, isAuthenticated]);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await api.post(`/users/wishlist/${product.id}`);
      setIsWishlisted(!isWishlisted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenReport = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setOpenReportDialog(true);
  };

  const handleCloseReport = () => {
    setOpenReportDialog(false);
    setReportReason("");
    setReportDetails("");
    setReportSuccess(false);
    setReportError("");
  };

  const handleSendReport = async () => {
    setReportError("");
    if (!reportReason) {
      setReportError("Please provide a reason");
      return;
    }
    try {
      await api.post(`/products/${product.id}/report`, {
        reason: reportReason,
        details: reportDetails,
      });
      setReportSuccess(true);
      setTimeout(handleCloseReport, 2000);
    } catch (err) {
      console.error(err);
      setReportError("Failed to send report. Please try again.");
    }
  };

  if (loading) {
    return (
      <Typography align="center" sx={{ py: 8 }}>
        Loading details...
      </Typography>
    );
  }

  if (!product) {
    return (
      <Paper sx={{ p: 4, textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Product not found
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/products")}
          sx={{ mt: 2 }}
        >
          Back to listings
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Back button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 4 }}
        color="inherit"
      >
        Back
      </Button>

      <Grid container spacing={5}>
        {/* Gallery Column (Left side) */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 1,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Main Image */}
            <Box
              component="img"
              src={
                product.images && product.images.length > 0
                  ? `http://localhost:8080${product.images[activeImage]}`
                  : "https://via.placeholder.com/600x400?text=No+Image"
              }
              alt={product.title}
              sx={{
                width: "100%",
                height: 400, // Fixed height to maintain consistency
                objectFit: "contain", // Prevent stretching
                borderRadius: 3,
                bgcolor: "#f1f5f9",
                mb: 2,
              }}
            />

            {/* Thumbnail selector */}
            {product.images && product.images.length > 1 && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {product.images.map((img, idx) => (
                  <Box
                    key={img}
                    component="img"
                    src={`http://localhost:8080${img}`}
                    alt={`${product.title} thumbnail ${idx}`}
                    onClick={() => setActiveImage(idx)}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 2,
                      cursor: "pointer",
                      border: "2px solid",
                      borderColor:
                        activeImage === idx ? "primary.main" : "transparent",
                      transition: "all 0.1s ease",
                      "&:hover": { opacity: 0.8 },
                    }}
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Details Column (Right side) */}
        <Grid item xs={12} md={6}>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                mb: 1,
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                {product.title}
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="secondary.main">
                ₹{product.price}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
              <Chip
                label={product.categoryName}
                size="small"
                variant="outlined"
              />
              <Chip
                label={`Condition: ${product.itemCondition}`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                label={product.status}
                size="small"
                color={product.status === "AVAILABLE" ? "success" : "error"}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Product Meta */}
            <Box
              sx={{
                display: "flex",
                gap: 3,
                color: "text.secondary",
                mb: 3,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CalendarToday sx={{ fontSize: 18 }} />
                <Typography variant="body2">
                  Listed {new Date(product.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <School sx={{ fontSize: 18 }} />
                <Typography variant="body2">
                  College: {product.sellerCollege}
                </Typography>
              </Box>
            </Box>

            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Description
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                mb: 4,
                whiteSpace: "pre-line",
                wordBreak: "break-word",
              }}
            >
              {product.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Seller profile card */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                mb: 4,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Seller Details
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Avatar sx={{ bgcolor: "primary.main", width: 44, height: 44 }}>
                  {product.sellerName
                    ? product.sellerName.charAt(0).toUpperCase()
                    : ""}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {product.sellerName}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {product.sellerCollege}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {showPhone ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<Phone />}
                      href={`tel:${product.phoneNumber}`}
                      fullWidth
                    >
                      {product.phoneNumber}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Phone />}
                      onClick={() => setShowPhone(true)}
                      fullWidth
                    >
                      Contact Seller
                    </Button>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={
                      isWishlisted ? (
                        <Favorite sx={{ color: "error.main" }} />
                      ) : (
                        <FavoriteBorder />
                      )
                    }
                    onClick={handleToggleWishlist}
                    fullWidth
                  >
                    {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Report Button */}
            {product.sellerId !== user?.id && (
              <Button
                size="small"
                startIcon={<Report />}
                color="error"
                variant="text"
                onClick={handleOpenReport}
              >
                Report this Listing
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Report dialog modal */}
      <Dialog
        open={openReportDialog}
        onClose={handleCloseReport}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontWeight="bold">Report Listing</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Help us keep CampusExchange clean. Please let us know why you are
            flagging this product.
          </Typography>

          {reportSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Report submitted successfully! Resolving dialog...
            </Alert>
          )}
          {reportError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {reportError}
            </Alert>
          )}

          <TextField
            select
            label="Reason for Report"
            fullWidth
            required
            margin="normal"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          >
            <MenuItem value="Fake / Fraudulent Listing">
              Fake / Fraudulent Listing
            </MenuItem>
            <MenuItem value="Inappropriate Content">
              Inappropriate Content
            </MenuItem>
            <MenuItem value="Incorrect Pricing">Incorrect Pricing</MenuItem>
            <MenuItem value="Sold but Listing is Active">
              Sold but Listing is Active
            </MenuItem>
            <MenuItem value="Incorrect Category">Incorrect Category</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>

          <TextField
            label="Additional Details"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={reportDetails}
            onChange={(e) => setReportDetails(e.target.value)}
            placeholder="Provide any additional details to help the admin audit this report"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseReport}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleSendReport}>
            Send Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductDetails;
