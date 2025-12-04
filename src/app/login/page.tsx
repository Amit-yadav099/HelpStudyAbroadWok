'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  Avatar,
  Fade,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuthStore } from '@/src/stores/authStore';
import { signIn } from 'next-auth/react';

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [authError, setAuthError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data: LoginForm) => {
    setAuthError('');
    clearError();

    try {
      const result = await signIn('credentials', {
        redirect: false,
        username: data.username,
        password: data.password,
      });

      if (result?.error) {
        setAuthError('Invalid credentials');
      } else {
        await login(data.username, data.password);
        router.push('/dashboard');
      }
    } catch (err) {
      setAuthError('Login failed. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // background: 'radial-gradient(circle at 50% 50%, #f0f4f8 0%, #dde1e7 100%)',
        padding: 2,
      }}
    >
      <Container maxWidth="xs">
        <Fade in={true} timeout={800}>
          <Paper
            elevation={12}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            }}
          >
            {/* Header Icon */}
            <Avatar
              sx={{
                m: 1,
                bgcolor: 'primary.main',
                width: 56,
                height: 56,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
              }}
            >
              <AdminPanelSettingsIcon fontSize="large" />
            </Avatar>

            <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 3, fontWeight: 700, color: '#334155' }}>
              Welcome Back
            </Typography>

            {(error || authError) && (
              <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
                {error || authError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Min 3 chars',
                  },
                })}
                error={!!errors.username}
                helperText={errors.username?.message}
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  }
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Min 6 chars',
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 4,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                  }
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Demo Credentials Box */}
              <Box 
                sx={{ 
                  mt: 2, 
                  p: 2, 
                  bgcolor: 'grey.50', 
                  borderRadius: 2, 
                  border: '1px dashed',
                  borderColor: 'grey.300',
                  textAlign: 'center'
                }}
              >
                <Typography variant="caption" color="text.secondary" display="block">
                  Demo Credentials
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 0.5 }}>
                  <strong>emilys</strong> / <strong>emilyspass</strong>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}