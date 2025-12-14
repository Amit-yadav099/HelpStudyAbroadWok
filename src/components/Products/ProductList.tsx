'use client';

import React, { useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Rating,
  Chip,
} from '@mui/material';
import { Product } from '@/src/types/product';
import Link from 'next/link';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

const ProductGrid = React.memo(function ProductGrid({ products, isLoading }: ProductGridProps) {
  const memoizedProducts = useMemo(() => products, [products]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container spacing={3}>
      {memoizedProducts.map((product) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              height="200"
              image={product.thumbnail}
              alt={product.title}
              sx={{ objectFit: 'contain', p: 1 }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="div" noWrap>
                {product.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {product.brand}
              </Typography>
              <Chip
                label={product.category}
                size="small"
                sx={{ mb: 1 }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 8 }}>
                <Rating value={product.rating} precision={0.5} readOnly size="small" />
                <Typography variant="body2">({product.rating})</Typography>
              </div>
              <Typography variant="h6" color="primary">
                ${product.price}
                {product.discountPercentage > 0 && (
                  <Typography
                    component="span"
                    variant="body2"
                    color="error"
                    sx={{ ml: 1 }}
                  >
                    -{product.discountPercentage}%
                  </Typography>
                )}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                component={Link}
                href={`/products/${product.id}`}
                fullWidth
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
});

export default ProductGrid;