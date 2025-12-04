'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useUserStore } from '@/src/stores/userStore';
import ProtectedRoute from '@/src/components/Layout/ProtectedRoute';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { selectedUser, isLoading, error, fetchUser } = useUserStore();
  const userId = parseInt(params.id as string);

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);

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
          onClick={() => router.push('/users')}
          sx={{ mt: 2 }}
        >
          Back to Users
        </Button>
      </ProtectedRoute>
    );
  }

  if (!selectedUser) {
    return (
      <ProtectedRoute>
        <Alert severity="info">User not found</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/users')}
          sx={{ mt: 2 }}
        >
          Back to Users
        </Button>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/users')}
          sx={{ mb: 3 }}
        >
          Back to Users
        </Button>
        
        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Profile Section */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  src={selectedUser.image}
                  sx={{ width: 100, height: 100, mr: 3 }}
                >
                  {selectedUser.firstName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h4">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {selectedUser.email}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Divider />
            </Grid>
            
            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Typography><strong>Username:</strong> {selectedUser.username}</Typography>
                  <Typography><strong>Gender:</strong> {selectedUser.gender}</Typography>
                  <Typography><strong>Birth Date:</strong> {selectedUser.birthDate}</Typography>
                  <Typography><strong>Phone:</strong> {selectedUser.phone}</Typography>
                  <Typography><strong>University:</strong> {selectedUser.university}</Typography>
                  <Typography><strong>Height:</strong> {selectedUser.height} cm</Typography>
                  <Typography><strong>Weight:</strong> {selectedUser.weight} kg</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Company Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Company Information
                  </Typography>
                  <Typography><strong>Company:</strong> {selectedUser.company.name}</Typography>
                  <Typography><strong>Department:</strong> {selectedUser.company.department}</Typography>
                  <Typography><strong>Title:</strong> {selectedUser.company.title}</Typography>
                  <Typography><strong>Address:</strong> {selectedUser.company.address.address}</Typography>
                  <Typography><strong>City:</strong> {selectedUser.company.address.city}</Typography>
                  <Typography><strong>State:</strong> {selectedUser.company.address.state}</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Address Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Address Information
                  </Typography>
                  <Typography><strong>Address:</strong> {selectedUser.address.address}</Typography>
                  <Typography><strong>City:</strong> {selectedUser.address.city}</Typography>
                  <Typography><strong>State:</strong> {selectedUser.address.state}</Typography>
                  <Typography><strong>Postal Code:</strong> {selectedUser.address.postalCode}</Typography>
                  <Typography><strong>Country:</strong> {selectedUser.address.country}</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Bank Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Bank Information
                  </Typography>
                  <Typography><strong>Card Type:</strong> {selectedUser.bank.cardType}</Typography>
                  <Typography><strong>Card Number:</strong> {selectedUser.bank.cardNumber}</Typography>
                  <Typography><strong>Card Expire:</strong> {selectedUser.bank.cardExpire}</Typography>
                  <Typography><strong>Currency:</strong> {selectedUser.bank.currency}</Typography>
                  <Typography><strong>IBAN:</strong> {selectedUser.bank.iban}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </ProtectedRoute>
  );
}