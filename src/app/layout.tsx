'use client';

import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/src/theme/theme';
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/src/components/Layout/Navbar';
import { Container, Box } from '@mui/material';
// import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Navbar />
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box component="main">
                  {children}
                </Box>
              </Container>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}