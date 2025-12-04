import { CircularProgress, Box } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  fullHeight?: boolean;
}

export default function LoadingSpinner({ size = 40, fullHeight = false }: LoadingSpinnerProps) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={fullHeight ? '80vh' : 'auto'}
      py={fullHeight ? 0 : 4}
    >
      <CircularProgress size={size} />
    </Box>
  );
}