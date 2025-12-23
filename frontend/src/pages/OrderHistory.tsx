import { useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orders';
import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  Grid,
  Snackbar,
} from '@mui/material';
import { LocalShipping, Restaurant, AccessTime } from '@mui/icons-material';

export default function OrderHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [newOrderId, setNewOrderId] = useState<string | null>(null);

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders', user?._id],
    queryFn: () => orderApi.getUserOrders(user!._id),
    enabled: !!user?._id,
  });

  useEffect(() => {
    // Show success message if navigated from checkout
    if (location.state?.newOrderId) {
      setShowSuccess(true);
      setNewOrderId(location.state.newOrderId);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CREATED':
        return 'warning';
      case 'ASSIGNED':
        return 'info';
      case 'IN_TRANSIT':
        return 'primary';
      case 'DELIVERED':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load order history</Alert>
      </Container>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Order History
        </Typography>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Restaurant sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No orders yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start by browsing restaurants and placing your first order!
          </Typography>
          <Button variant="contained" onClick={() => navigate('/restaurants')}>
            Browse Restaurants
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Order History
      </Typography>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Order placed successfully! Your order is being prepared.
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid size={{ xs: 12, md: 6 }} key={order.id}>
            <Card 
              elevation={order.id === newOrderId ? 4 : 2}
              sx={{ 
                border: order.id === newOrderId ? '2px solid #1976d2' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Order #{order.id.substring(0, 8)}
                      {order.id === newOrderId && (
                        <Chip label="New" color="success" size="small" sx={{ ml: 1 }} />
                      )}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <AccessTime fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(order.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Items:
                </Typography>
                {order.items.map((item, idx) => (
                  <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                    • {item.name} x{item.qty} - ${(item.price * item.qty).toFixed(2)}
                  </Typography>
                ))}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total:
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${order.total.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<LocalShipping />}
                  onClick={() => navigate(`/order/${order.id}`)}
                >
                  Track Order
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
