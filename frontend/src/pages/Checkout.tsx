import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useCart } from '../store/cart';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orders';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Delete, ArrowBack } from '@mui/icons-material';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, removeItem, clearCart, total } = useCart();
  const { user } = useAuth();
  const [error, setError] = useState('');

  const placeOrderMutation = useMutation({
    mutationFn: orderApi.placeOrder,
    onSuccess: (order) => {
      clearCart();
      navigate(`/order/${order.id}`);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to place order');
    },
  });

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const restaurantId = items[0].restaurantId;
    const orderData = {
      userId: user._id,
      restaurantId,
      items: items.map((item) => ({
        name: item.name,
        price: item.finalPrice || item.price,
        qty: item.quantity,
      })),
    };

    placeOrderMutation.mutate(orderData);
  };

  if (items.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">
          Your cart is empty. <Button onClick={() => navigate('/restaurants')}>Browse restaurants</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          Checkout
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Order from {items[0].restaurantName}
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <List>
          {items.map((item, index) => (
            <div key={item.name}>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" onClick={() => removeItem(item.name)}>
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${item.name} x${item.quantity}`}
                  secondary={`$${(item.finalPrice || item.price).toFixed(2)} each`}
                />
                <Typography variant="body1" sx={{ mr: 2 }}>
                  ${((item.finalPrice || item.price) * item.quantity).toFixed(2)}
                </Typography>
              </ListItem>
              {index < items.length - 1 && <Divider />}
            </div>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6" color="primary">
            ${total.toFixed(2)}
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handlePlaceOrder}
          disabled={placeOrderMutation.isPending}
        >
          {placeOrderMutation.isPending ? <CircularProgress size={24} /> : 'Place Order'}
        </Button>
      </Paper>
    </Container>
  );
}
