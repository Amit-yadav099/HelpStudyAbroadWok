'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Rating,
  Chip,
  ImageList,
  ImageListItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useProductStore } from '@/src/stores/productStore';
import ProtectedRoute from '@/src/components/Layout/ProtectedRoute';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { selectedProduct, isLoading, error, fetchProduct } = useProductStore();
  const productId = parseInt(params.id as string);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  useEffect(() => {
    if (selectedProduct?.images?.[0]) {
      setSelectedImage(selectedProduct.images[0]);
    }
  }, [selectedProduct]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/products')}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </ProtectedRoute>
    );
  }

  if (!selectedProduct) {
    return (
      <ProtectedRoute>
        <Alert severity="info">Product not found</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/products')}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/products')}
          sx={{ mb: 3 }}
        >
          Back to Products
        </Button>
        
        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={4}>
            {/* Product Images */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <img
                  src={selectedImage || selectedProduct.thumbnail}
                  alt={selectedProduct.title}
                  style={{ 
                    width: '100%', 
                    height: '400px', 
                    objectFit: 'contain',
                    borderRadius: '8px' 
                  }}
                />
              </Box>
              
              <ImageList cols={4} rowHeight={100} sx={{ m: 0 }}>
                {selectedProduct.images.map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={image}
                      alt={`${selectedProduct.title} ${index + 1}`}
                      loading="lazy"
                      style={{ 
                        cursor: 'pointer',
                        border: selectedImage === image ? '2px solid #1976d2' : 'none',
                        borderRadius: '4px'
                      }}
                      onClick={() => setSelectedImage(image)}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
            
            {/* Product Details */}
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                {selectedProduct.title}
              </Typography>
              
              <Box display="flex" alignItems="center" mb={2}>
                <Rating value={selectedProduct.rating} readOnly />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  ({selectedProduct.rating} • {selectedProduct.reviews?.length || 0} reviews)
                </Typography>
              </Box>
              
              <Typography variant="h5" color="primary" gutterBottom>
                ${selectedProduct.price}
                {selectedProduct.discountPercentage > 0 && (
                  <Typography 
                    component="span" 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ ml: 1, textDecoration: 'line-through' }}
                  >
                    ${(selectedProduct.price / (1 - selectedProduct.discountPercentage/100)).toFixed(2)}
                  </Typography>
                )}
              </Typography>
              
              {selectedProduct.discountPercentage > 0 && (
                <Chip 
                  label={`${selectedProduct.discountPercentage}% OFF`}
                  color="error"
                  size="small"
                  sx={{ mb: 2 }}
                />
              )}
              
              <Box mb={3}>
                <Chip 
                  label={selectedProduct.category} 
                  color="primary" 
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={selectedProduct.brand} 
                  color="secondary" 
                  variant="outlined"
                />
              </Box>
              
              <Typography variant="body1" paragraph>
                {selectedProduct.description}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Specifications */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Stock Available
                  </Typography>
                  <Typography variant="body1">
                    {selectedProduct.stock} units
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Brand
                  </Typography>
                  <Typography variant="body1">
                    {selectedProduct.brand}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1">
                    {selectedProduct.category}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    SKU
                  </Typography>
                  <Typography variant="body1">
                    {selectedProduct.sku || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          
          {/* Additional Details */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Additional Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Dimensions
                      </Typography>
                      <Typography variant="body1">
                        {selectedProduct.dimensions?.width || 'N/A'} × {selectedProduct.dimensions?.height || 'N/A'} × {selectedProduct.dimensions?.depth || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Warranty
                      </Typography>
                      <Typography variant="body1">
                        {selectedProduct.warrantyInformation || '1 Year'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Shipping
                      </Typography>
                      <Typography variant="body1">
                        {selectedProduct.shippingInformation || 'Free shipping'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </ProtectedRoute>
  );
}