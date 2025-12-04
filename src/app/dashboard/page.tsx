'use client';

import { useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ProtectedRoute from '@/src/components/Layout/ProtectedRoute';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <ProtectedRoute>
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Welcome back, {session?.user?.firstName} {session?.user?.lastName}!
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <PeopleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Users Management
                </Typography>
                <Typography color="text.secondary">
                  View, search, and manage user information from the DummyJSON API.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="large" 
                  onClick={() => router.push('/users')}
                  sx={{ color: 'primary.main' }}
                >
                  Go to Users
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <ShoppingCartIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Products Management
                </Typography>
                <Typography color="text.secondary">
                  Browse, search, and filter products from the DummyJSON API.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="large" 
                  onClick={() => router.push('/products')}
                  sx={{ color: 'secondary.main' }}
                >
                  Go to Products
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ProtectedRoute>
  );
}