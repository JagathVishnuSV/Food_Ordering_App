import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material';
import { adminApi } from '../api/admin';

export default function AdminDashboard() {
  const [createMsg, setCreateMsg] = useState('');
  const [menuMsg, setMenuMsg] = useState('');
  const [error, setError] = useState('');
  const [restaurantId, setRestaurantId] = useState('');

  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    category: '',
    lat: '0',
    lng: '0',
  });

  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'USD',
  });

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setCreateMsg('');
    try {
      const res = await adminApi.createRestaurant({
        name: restaurantForm.name,
        category: restaurantForm.category,
        location: { coordinates: [parseFloat(restaurantForm.lng), parseFloat(restaurantForm.lat)] },
      });
      setCreateMsg(`Created restaurant ${res.name} (${res._id})`);
      setRestaurantId(res._id);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to create restaurant');
    }
  };

  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMenuMsg('');
    if (!restaurantId) {
      setError('Please create or provide a restaurant ID first');
      return;
    }
    try {
      const res = await adminApi.addMenuItem(restaurantId, {
        name: menuForm.name,
        description: menuForm.description,
        price: parseFloat(menuForm.price),
        currency: menuForm.currency,
      });
      setMenuMsg(`Added menu item to ${res.name}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to add menu item');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Console
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {createMsg && <Alert severity="success" sx={{ mb: 2 }}>{createMsg}</Alert>}
      {menuMsg && <Alert severity="success" sx={{ mb: 2 }}>{menuMsg}</Alert>}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Create Restaurant</Typography>
        <form onSubmit={handleCreateRestaurant}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Name" fullWidth required value={restaurantForm.name}
                onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Category" fullWidth required value={restaurantForm.category}
                onChange={(e) => setRestaurantForm({ ...restaurantForm, category: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Latitude" fullWidth required value={restaurantForm.lat}
                onChange={(e) => setRestaurantForm({ ...restaurantForm, lat: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Longitude" fullWidth required value={restaurantForm.lng}
                onChange={(e) => setRestaurantForm({ ...restaurantForm, lng: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained">Create</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Add Menu Item</Typography>
        <form onSubmit={handleAddMenu}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Restaurant ID" fullWidth required value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Item Name" fullWidth required value={menuForm.name}
                onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Price" type="number" fullWidth required value={menuForm.price}
                onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" fullWidth multiline minRows={2} value={menuForm.description}
                onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Currency" fullWidth value={menuForm.currency}
                onChange={(e) => setMenuForm({ ...menuForm, currency: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained">Add Menu Item</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
