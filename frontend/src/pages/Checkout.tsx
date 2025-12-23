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
  const { items, removeItem, clearCart, getTotal } = useCart();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const total = getTotal();

  const placeOrderMutation = useMutation({
    mutationFn: orderApi.placeOrder,
    onSuccess: (order) => {
      clearCart();
      // Navigate to order history with success message
      navigate('/orders', { 
        state: { 
          newOrderId: order.id,
          message: 'Order placed successfully! Track your order below.' 
        } 
      });
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
        menuItemId: item.name,
        name: item.name,
        price: item.price,
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ 
            mr: 2,
            background: 'rgba(99, 102, 241, 0.1)',
            '&:hover': { background: 'rgba(99, 102, 241, 0.2)' },
          }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h3" component="h1" fontWeight="bold">
          Checkout
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, mb: 3, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
          Order from {items[0].restaurantName}
        </Typography>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              '& .MuiAlert-icon': { color: 'error.main' },
            }}
          >
            {error}
          </Alert>
        )}

        <List sx={{ mb: 2 }}>
          {items.map((item, index) => (
            <div key={item.name}>
              <ListItem
                sx={{ 
                  px: 2, 
                  py: 2,
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.05)',
                    borderRadius: 2,
                  },
                }}
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    onClick={() => removeItem(item.name)}
                    sx={{ 
                      color: 'error.main',
                      '&:hover': { background: 'rgba(239, 68, 68, 0.1)' },
                    }}
                  >
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Typography variant="h6" fontWeight="bold">
                      {item.name} × {item.quantity}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      ${(item.finalPrice || item.price).toFixed(2)} each
                    </Typography>
                  }
                />
                <Typography variant="h6" fontWeight="bold" sx={{ mr: 6 }}>
                  ${((item.finalPrice || item.price) * item.quantity).toFixed(2)}
                </Typography>
              </ListItem>
              {index < items.length - 1 && <Divider sx={{ my: 1 }} />}
            </div>
          ))}
        </List>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">Total:</Typography>
          <Typography 
            variant="h4" 
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ${total.toFixed(2)}
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          fullWidth
          sx={{ 
            mt: 2, 
            py: 1.5,
            fontSize: '1.1rem',
            borderRadius: 2,
          }}
          onClick={handlePlaceOrder}
          disabled={placeOrderMutation.isPending}
        >
          {placeOrderMutation.isPending ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            'Place Order'
          )}
        </Button>
      </Paper>
    </Container>
  );
}
