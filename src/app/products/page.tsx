'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Pagination,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Rating,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import { useProductStore } from '@/src/stores/productStore';
import ProtectedRoute from '@/src/components/Layout/ProtectedRoute';

// 1. The Reusable Hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ProductsPage() {
  const router = useRouter();
  const { 
    products, 
    categories, 
    total, 
    limit, 
    isLoading, 
    error, 
    fetchProducts, 
    searchProducts,
    fetchCategories,
    fetchProductsByCategory 
  } = useProductStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formattedCategories, setFormattedCategories] = useState<string[]>([]);

  // 2. Create the debounced value (500ms delay)
  const debouncedSearchTerm = useDebounce(searchQuery, 500);

  // Initial fetch for categories only
  useEffect(() => {
    fetchCategories();
  }, []);

  // Format category values
  useEffect(() => {
    if (categories?.length > 0) {
      if (typeof categories[0] === 'string') {
        setFormattedCategories(categories);
      } else {
        const catStrings = categories.map((cat: any) => 
          typeof cat === 'string' ? cat : cat.slug || cat.name || String(cat)
        );
        setFormattedCategories(catStrings);
      }
    }
  }, [categories]);

  // 3. MASTER EFFECT: Handles Search, Category Filter, and Pagination
  useEffect(() => {
    // Priority 1: Search (Global)
    if (debouncedSearchTerm.trim()) {
      searchProducts(debouncedSearchTerm);
    } 
    // Priority 2: Category Filter
    else if (selectedCategory !== 'all') {
      fetchProductsByCategory(selectedCategory, limit, (page - 1) * limit);
    } 
    // Priority 3: Default Fetch
    else {
      fetchProducts(limit, (page - 1) * limit);
    }
  }, [debouncedSearchTerm, selectedCategory, page, limit]); 

  // 4. Handle Search Input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Always reset to page 1 on new search
    
    // Optional: If you want search to automatically reset category to 'all'
    if (selectedCategory !== 'all') {
      setSelectedCategory('all');
    }
  };

  // 5. Handle Category Change
  const handleCategoryChange = (e: any) => {
    setSelectedCategory(e.target.value);
    setPage(1);
    setSearchQuery(''); // Clear search when picking a category
  };

  const formatCategoryName = (category: string) =>
    category
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const totalPages = Math.ceil(total / limit);

  const handleViewProduct = (id: number) => {
    router.push(`/products/${id}`);
  };

  return (
    <ProtectedRoute>
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          Product Management
        </Typography>

        {/* Search + Filter */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            mb: 4,
            bgcolor: 'background.paper',
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchQuery} // Binds to immediate state
                onChange={handleSearchChange}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    bgcolor: '#fafafa',
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={handleCategoryChange}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {formattedCategories.map(category => (
                    <MenuItem key={category} value={category}>
                      {formatCategoryName(category)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Product Cards */}
            <Grid container spacing={4}>
              {products.map(product => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      transition: '0.3s',
                      '&:hover': {
                        boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.thumbnail}
                      alt={product.title}
                      sx={{
                        objectFit: 'cover',
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                      }}
                    />

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {product.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                        {product.description.length > 100
                          ? product.description.substring(0, 100) + '...'
                          : product.description}
                      </Typography>

                      <Box display="flex" alignItems="center" mb={1}>
                        <Rating value={product.rating} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({product.rating.toFixed(1)})
                        </Typography>
                      </Box>

                      <Chip
                        label={formatCategoryName(product.category)}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={product.brand}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </CardContent>

                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                      <Typography variant="h6" color="primary" fontWeight={700}>
                        ${product.price.toFixed(2)}
                      </Typography>

                      <Button
                        size="small"
                        variant="contained"
                        sx={{ borderRadius: 2 }}
                        onClick={() => handleViewProduct(product.id)}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, v) => setPage(v)}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': { borderRadius: 2 },
                  }}
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </ProtectedRoute>
  );
}