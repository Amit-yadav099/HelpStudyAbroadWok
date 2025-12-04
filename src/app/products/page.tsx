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
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import { useProductStore } from '@/src/stores/productStore';
import ProtectedRoute from '@/src/components/Layout/ProtectedRoute';

const ITEMS_PER_PAGE = 12; 

const truncateStyle = (lines: number) => ({
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: lines,
  textOverflow: 'ellipsis',
  height: 'auto', 
});

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

  const debouncedSearchTerm = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchCategories();
  }, []);

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

  useEffect(() => {
    const skip = (page - 1) * ITEMS_PER_PAGE;

    if (debouncedSearchTerm.trim()) {
      searchProducts(debouncedSearchTerm);
    } 

    else if (selectedCategory !== 'all') {
      fetchProductsByCategory(selectedCategory, ITEMS_PER_PAGE, skip);
    } 

    else {
      fetchProducts(ITEMS_PER_PAGE, skip);
    }
  }, [debouncedSearchTerm, selectedCategory, page]); 

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); 
    if (selectedCategory !== 'all') {
      setSelectedCategory('all');
    }
  };

  const handleCategoryChange = (e: any) => {
    setSelectedCategory(e.target.value);
    setPage(1);
    setSearchQuery(''); 
  };

  const formatCategoryName = (category: string) =>
    category
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleViewProduct = (id: number) => {
    router.push(`/products/${id}`);
  };

  return (
    <ProtectedRoute>
      <Box sx={{ py: 3, px: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          Product Management
        </Typography>

        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 3,
            mb: 4,
            bgcolor: 'background.paper',
            border: '1px solid #eee'
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 2, bgcolor: '#fafafa' },
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

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}


        {isLoading ? (
          <Box display="flex" justifyContent="center" my={10}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {products.map(product => (

                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <Card
                    sx={{
                      height: '100%', 
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      transition: 'all 0.3s ease-in-out',
                      border: '1px solid transparent',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        borderColor: 'primary.light',
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="220" 
                        image={product.thumbnail}
                        alt={product.title}
                        sx={{
                          objectFit: 'cover', 
                          bgcolor: '#f5f5f5',
                        }}
                      />
                      <Chip 
                        label={product.brand}
                        size="small"
                        sx={{ 
                          position: 'absolute', 
                          top: 10, 
                          right: 10, 
                          bgcolor: 'rgba(255,255,255,0.9)',
                          fontWeight: 600
                        }} 
                      />
                    </Box>

                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box>
                         <Chip
                          label={formatCategoryName(product.category)}
                          size="small"
                          color="primary"
                          variant="soft" 
                          sx={{ 
                            height: 24, 
                            fontSize: '0.75rem',
                            mb: 1
                          }}
                        />
                      </Box>

                      <Typography 
                        variant="h6" 
                        fontWeight={700} 
                        lineHeight={1.2}
                        sx={truncateStyle(1)}
                        title={product.title} 
                      >
                        {product.title}
                      </Typography>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Rating value={product.rating} readOnly size="small" precision={0.1} />
                        <Typography variant="caption" color="text.secondary">
                          ({product.rating.toFixed(1)})
                        </Typography>
                      </Stack>

                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          ...truncateStyle(2),
                          mt: 1,
                          flexGrow: 1 
                        }}
                      >
                        {product.description}
                      </Typography>
                    </CardContent>

                   
                    <CardActions sx={{ p: 2, pt: 0, mt: 'auto' }}>
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                          <Typography variant="h6" color="primary" fontWeight={700}>
                            ${product.price.toFixed(2)}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            size="small"
                            disableElevation
                            onClick={() => handleViewProduct(product.id)}
                            sx={{ borderRadius: 2, textTransform: 'none' }}
                          >
                            View Details
                          </Button>
                        </Grid>
                      </Grid>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

          
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={6} mb={2}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, v) => setPage(v)}
                  color="primary"
                  size="large"
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