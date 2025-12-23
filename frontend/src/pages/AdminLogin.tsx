import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Alert, Box } from '@mui/material';
import { adminApi } from '../api/admin';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await adminApi.login(secret.trim());
      navigate('/admin');
    } catch (err: any) {
      setError(err?.message || 'Invalid secret');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Admin Login
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter the admin secret to access the management console.
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Admin Secret"
            type="password"
            fullWidth
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <Button variant="contained" type="submit" fullWidth>
            Continue
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
