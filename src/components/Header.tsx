import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Tab,
  Tabs,
  Alert,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { LinkOutlined } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, login, logout, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authTab, setAuthTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuthSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      let success = false;
      if (authTab === 0) {
        // Login
        success = await login(email, password);
      } else {
        // Register
        success = await register(email, password, name);
      }

      if (success) {
        setAuthDialogOpen(false);
        setEmail('');
        setPassword('');
        setName('');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <LinkOutlined sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            AffordMedical URL Shortener
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/analytics"
                >
                  Analytics
                </Button>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Welcome, {user?.name}
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={() => setAuthDialogOpen(true)}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Tabs
            value={authTab}
            onChange={(_, newValue) => setAuthTab(newValue)}
            centered
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {authTab === 1 && (
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                required
              />
            )}
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAuthDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAuthSubmit}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Processing...' : authTab === 0 ? 'Login' : 'Register'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
