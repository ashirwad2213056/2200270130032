import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Button,
} from '@mui/material';
import { Launch } from '@mui/icons-material';
import { urlService } from '../services/urlService';

const Redirect: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (shortCode) {
      handleRedirect();
    } else {
      setError('No short code provided');
      setLoading(false);
    }
  }, [shortCode]);

  useEffect(() => {
    if (originalUrl && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (originalUrl && countdown === 0) {
      window.location.href = originalUrl;
    }
  }, [originalUrl, countdown]);

  const handleRedirect = async () => {
    try {
      if (!shortCode) {
        throw new Error('No short code provided');
      }

      const urlData = await urlService.getUrlByShortCode(shortCode);
      
      if (!urlData) {
        throw new Error('URL not found or has expired');
      }

      setOriginalUrl(urlData.originalUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to find URL');
    }
    setLoading(false);
  };

  const handleManualRedirect = () => {
    if (originalUrl) {
      window.location.href = originalUrl;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Looking up URL...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            URL Not Found
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            The short URL you're looking for doesn't exist or has expired.
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.href = '/'}
          >
            Go to Homepage
          </Button>
        </Paper>
      </Box>
    );
  }

  if (originalUrl) {
    return (
      <Box sx={{ mt: 4 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Redirecting...
          </Typography>
          
          <Typography variant="body1" paragraph>
            You will be redirected to:
          </Typography>
          
          <Typography
            variant="body1"
            color="primary"
            sx={{ fontWeight: 'bold', mb: 3, wordBreak: 'break-all' }}
          >
            {originalUrl}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <CircularProgress
              variant="determinate"
              value={(5 - countdown) * 20}
              size={60}
            />
            <Typography variant="h6" sx={{ mt: 1 }}>
              {countdown}
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Launch />}
            onClick={handleManualRedirect}
            size="large"
          >
            Go Now
          </Button>
        </Paper>
      </Box>
    );
  }

  return <Navigate to="/" replace />;
};

export default Redirect;
