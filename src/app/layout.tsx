'use client';

import * as React from 'react';
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
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Navbar />
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box component="main">
                  {children}
                </Box>
              </Container>
            </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}