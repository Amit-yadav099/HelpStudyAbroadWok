'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuthStore } from '@/src/stores/authStore';

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const { logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    signOut({ redirect: false });
    router.push('/login');
    handleMenuClose();
  };

  const isAuthenticated = !!session;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          HELP STUDY ABROAD
        </Typography>
        
        {isAuthenticated && (
          <>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              <Button
                color="inherit"
                startIcon={<DashboardIcon />}
                onClick={() => router.push('/dashboard')}
              >
                Dashboard
              </Button>
              <Button
                color="inherit"
                startIcon={<PeopleIcon />}
                onClick={() => router.push('/users')}
              >
                Users
              </Button>
              <Button
                color="inherit"
                startIcon={<ShoppingCartIcon />}
                onClick={() => router.push('/products')}
              >
                Products
              </Button>
            </Box>
            
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleMenuOpen}
              sx={{ ml: 2 }}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {session?.user?.firstName?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem disabled>
                {session?.user?.firstName} {session?.user?.LastName}
              </MenuItem>
              <MenuItem onClick={() => router.push('/dashboard')}>
                Dashboard
              </MenuItem>
              <MenuItem onClick={() => router.push('/users')}>
                Users
              </MenuItem>
              <MenuItem onClick={() => router.push('/products')}>
                Products
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}
        
        {!isAuthenticated && (
          <Button color="inherit" onClick={() => router.push('/login')}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}