import { Alert, AlertTitle, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  severity?: 'error' | 'warning' | 'info';
}

export default function ErrorMessage({ 
  message, 
  onRetry, 
  severity = 'error' 
}: ErrorMessageProps) {
  return (
    <Alert 
      severity={severity}
      action={
        onRetry && (
          <Button 
            color="inherit" 
            size="small" 
            onClick={onRetry}
            startIcon={<RefreshIcon />}
          >
            Retry
          </Button>
        )
      }
    >
      <AlertTitle>
        {severity === 'error' ? 'Error' : 
         severity === 'warning' ? 'Warning' : 'Information'}
      </AlertTitle>
      {message}
    </Alert>
  );
}