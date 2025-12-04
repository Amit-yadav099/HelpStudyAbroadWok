'use client';

import React, { useCallback, useEffect } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useProductsStore } from '@/src/store/products.store';

interface ProductFiltersProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
}

const ProductFilters = React.memo(function ProductFilters({
  onSearch,
  onCategoryChange,
}: ProductFiltersProps) {
  const { 
    categories, 
    searchQuery, 
    selectedCategory,
    fetchCategories 
  } = useProductsStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onSearch(event.target.value);
    },
    [onSearch]
  );

  const handleCategoryChange = useCallback(
    (event: any) => {
      onCategoryChange(event.target.value);
    },
    [onCategoryChange]
  );

  const handleClearFilters = useCallback(() => {
    onSearch('');
    onCategoryChange('');
  }, [onSearch, onCategoryChange]);

  const hasActiveFilters = searchQuery || selectedCategory;

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Search Products"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1 }}
          placeholder="Search by title, brand, or description..."
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={handleCategoryChange}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {hasActiveFilters && (
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            startIcon={<ClearIcon />}
            sx={{ alignSelf: 'center' }}
          >
            Clear Filters
          </Button>
        )}
      </Stack>

      {hasActiveFilters && (
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {searchQuery && (
            <Chip
              label={`Search: "${searchQuery}"`}
              onDelete={() => onSearch('')}
              color="primary"
              variant="outlined"
            />
          )}
          {selectedCategory && (
            <Chip
              label={`Category: ${selectedCategory}`}
              onDelete={() => onCategoryChange('')}
              color="secondary"
              variant="outlined"
            />
          )}
        </Stack>
      )}
    </Box>
  );
});

export default ProductFilters;