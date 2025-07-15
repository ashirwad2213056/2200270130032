import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  FormControlLabel,
  Switch,
  Chip,
  Divider,
} from '@mui/material';
import {
  ContentCopy,
  Launch,
  QrCode,
  Delete,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { urlService } from '../services/urlService';
import QRCodeGenerator from './QRCodeGenerator';

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  customCode?: string;
  clicks: number;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
}

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [useCustomCode, setUseCustomCode] = useState(false);
  const [expirationDays, setExpirationDays] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState('');

  useEffect(() => {
    loadUserUrls();
  }, [isAuthenticated]);

  const loadUserUrls = async () => {
    if (isAuthenticated) {
      try {
        const urls = await urlService.getUserUrls();
        setShortenedUrls(urls);
      } catch (error) {
        console.error('Failed to load URLs:', error);
      }
    }
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!originalUrl) {
      setError('Please enter a URL to shorten');
      return;
    }

    if (!validateUrl(originalUrl)) {
      setError('Please enter a valid URL (including http:// or https://)');
      return;
    }

    if (useCustomCode && !customCode) {
      setError('Please enter a custom shortcode');
      return;
    }

    if (customCode && customCode.length < 3) {
      setError('Custom shortcode must be at least 3 characters long');
      return;
    }

    setLoading(true);

    try {
      const options = {
        customCode: useCustomCode ? customCode : undefined,
        expirationDays: expirationDays ? parseInt(expirationDays) : undefined,
      };

      const result = await urlService.shortenUrl(originalUrl, options);
      
      setSuccess(`URL shortened successfully! Short URL: ${result.shortUrl}`);
      setOriginalUrl('');
      setCustomCode('');
      setExpirationDays('');
      setUseCustomCode(false);
      
      if (isAuthenticated) {
        loadUserUrls();
      } else {
        setShortenedUrls([result]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to shorten URL. Please try again.');
    }

    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbarOpen(true);
  };

  const deleteUrl = async (id: string) => {
    try {
      await urlService.deleteUrl(id);
      loadUserUrls();
    } catch (error) {
      setError('Failed to delete URL');
    }
  };

  const showQRCode = (shortUrl: string) => {
    setSelectedUrl(shortUrl);
    setQrDialogOpen(true);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        URL Shortener
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
        Shorten your long URLs into easy-to-share links
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Enter URL to shorten"
            placeholder="https://example.com/very-long-url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            margin="normal"
            required
            error={!!error && error.includes('URL')}
          />

          {isAuthenticated && (
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useCustomCode}
                    onChange={(e) => setUseCustomCode(e.target.checked)}
                  />
                }
                label="Use custom shortcode"
              />
              
              {useCustomCode && (
                <TextField
                  fullWidth
                  label="Custom shortcode"
                  placeholder="my-custom-code"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  margin="normal"
                  helperText="Minimum 3 characters, alphanumeric and hyphens only"
                />
              )}

              <TextField
                fullWidth
                label="Expiration (days)"
                type="number"
                placeholder="30"
                value={expirationDays}
                onChange={(e) => setExpirationDays(e.target.value)}
                margin="normal"
                helperText="Leave empty for no expiration"
              />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? 'Shortening...' : 'Shorten URL'}
          </Button>
        </form>
      </Paper>

      {shortenedUrls.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            {isAuthenticated ? 'Your URLs' : 'Recently Shortened'}
          </Typography>
          
          {shortenedUrls.map((url) => (
            <Card key={url.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1, mr: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Original URL:
                    </Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-all', mb: 1 }}>
                      {url.originalUrl}
                    </Typography>
                    
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Short URL:
                    </Typography>
                    <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {url.shortUrl}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={`${url.clicks} clicks`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {url.customCode && (
                        <Chip
                          label="Custom"
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      )}
                      {url.expiresAt && (
                        <Chip
                          label={`Expires: ${new Date(url.expiresAt).toLocaleDateString()}`}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(url.shortUrl)}
                      title="Copy to clipboard"
                    >
                      <ContentCopy />
                    </IconButton>
                    
                    <IconButton
                      size="small"
                      onClick={() => window.open(url.shortUrl, '_blank')}
                      title="Open in new tab"
                    >
                      <Launch />
                    </IconButton>
                    
                    <IconButton
                      size="small"
                      onClick={() => showQRCode(url.shortUrl)}
                      title="Show QR Code"
                    >
                      <QrCode />
                    </IconButton>

                    {isAuthenticated && (
                      <IconButton
                        size="small"
                        onClick={() => deleteUrl(url.id)}
                        title="Delete"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Copied to clipboard!"
      />

      <QRCodeGenerator
        open={qrDialogOpen}
        onClose={() => setQrDialogOpen(false)}
        url={selectedUrl}
      />
    </Box>
  );
};

export default Home;
