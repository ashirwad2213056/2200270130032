import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  open: boolean;
  onClose: () => void;
  url: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ open, onClose, url }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  useEffect(() => {
    if (open && url) {
      generateQRCode();
    }
  }, [open, url]);

  const generateQRCode = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'M',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        width: 256,
      });
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.download = `qr-code-${url.split('/').pop()}.png`;
      link.href = qrCodeDataUrl;
      link.click();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>QR Code</DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Scan this QR code to access:
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, wordBreak: 'break-all' }}>
            {url}
          </Typography>
          
          {qrCodeDataUrl && (
            <Paper elevation={2} sx={{ display: 'inline-block', p: 2 }}>
              <img
                src={qrCodeDataUrl}
                alt="QR Code"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </Paper>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={downloadQRCode} variant="contained" disabled={!qrCodeDataUrl}>
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QRCodeGenerator;
