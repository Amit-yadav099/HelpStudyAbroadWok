'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  IconButton,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Avatar,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/src/stores/userStore';
import ProtectedRoute from '@/src/components/Layout/ProtectedRoute';

// 1. Define the Custom Hook (You can move this to a separate file later)
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

export default function UsersPage() {
  const router = useRouter();
  const { 
    users, 
    total, 
    limit, 
    isLoading, 
    error, 
    fetchUsers, 
    searchUsers 
  } = useUserStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // 2. Create the debounced value
  const debouncedSearchTerm = useDebounce(searchQuery, 500);

  // 3. Unified Effect: Handles both Pagination AND Search
  useEffect(() => {
    // If we have a search term, call the search API
    if (debouncedSearchTerm.trim()) {
      searchUsers(debouncedSearchTerm);
    } else {
      // If search is empty, fetch standard paginated list
      fetchUsers(limit, (page - 1) * limit);
    }
    // This effect runs when the page changes OR the debounced text changes
  }, [debouncedSearchTerm, page, limit, fetchUsers, searchUsers]);

  // 4. Handle input change (Updates UI instantly)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // We reset page to 1 when user starts typing a new search
    setPage(1);
  };

  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleViewUser = (id: number) => {
    router.push(`/users/${id}`);
  };

  return (
    <ProtectedRoute>
      <Box>
        <Typography variant="h4" gutterBottom>
          Users Management
        </Typography>
        
        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search users by name, email, or username..."
            value={searchQuery} // Binds to immediate state
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
        </Box>
        
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Loading State */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Users Grid for Mobile */}
            <Grid container spacing={2} sx={{ display: { xs: 'flex', md: 'none' } }}>
              {users.map((user) => (
                <Grid item xs={12} key={user.id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar src={user.image} sx={{ mr: 2 }}>
                          {user.firstName?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography>Phone: {user.phone}</Typography>
                      <Typography>Gender: {user.gender}</Typography>
                      <Typography>Company: {user.company?.name}</Typography>
                      <IconButton 
                        onClick={() => handleViewUser(user.id)}
                        sx={{ mt: 1 }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {/* Users Table for Desktop */}
            <TableContainer 
              component={Paper} 
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar src={user.image} sx={{ mr: 2 }}>
                            {user.firstName?.charAt(0)}
                          </Avatar>
                          {user.firstName} {user.lastName}
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.gender}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.company?.name}</TableCell>
                      <TableCell>
                        <IconButton 
                          onClick={() => handleViewUser(user.id)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
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