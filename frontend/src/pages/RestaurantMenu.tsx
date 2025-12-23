import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { restaurantApi } from '../api/restaurants';
import { useCart } from '../store/cart';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Box,
  IconButton,
  Badge,
  Chip,
} from '@mui/material';
import { Add, Remove, ShoppingCart, ArrowBack } from '@mui/icons-material';

export default function RestaurantMenu() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, items: cartItems } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const { data: restaurant, isLoading, error } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => restaurantApi.getById(id!),
    enabled: !!id,
  });

  const handleQuantityChange = (itemName: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemName]: Math.max(0, (prev[itemName] || 0) + delta),
    }));
  };

  const handleAddToCart = (item: any) => {
    const qty = quantities[item.name] || 1;
    if (qty > 0) {
      addItem({
        ...item,
        quantity: qty,
        restaurantId: restaurant!._id,
        restaurantName: restaurant!.name,
      });
      setQuantities((prev) => ({ ...prev, [item.name]: 0 }));
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !restaurant) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load restaurant details</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/restaurants')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            {restaurant.name}
          </Typography>
        </Box>
        <Badge badgeContent={cartItems.length} color="primary">
          <IconButton onClick={() => navigate('/checkout')} color="primary">
            <ShoppingCart />
          </IconButton>
        </Badge>
      </Box>

      {restaurant.category && (
        <Chip label={restaurant.category} color="primary" sx={{ mb: 3 }} />
      )}

      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Menu
      </Typography>

      <Grid container spacing={3}>
        {restaurant.menu.map((item, index) => {
          const qty = quantities[item.name] || 0;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      {item.finalPrice !== undefined && item.finalPrice !== item.price ? (
                        <>
                          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                            ${item.price.toFixed(2)}
                          </Typography>
                          <Typography variant="h6" color="primary">
                            ${item.finalPrice.toFixed(2)}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="h6" color="primary">
                          ${item.price.toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.name, -1)}
                      disabled={qty === 0}
                    >
                      <Remove />
                    </IconButton>
                    <Typography sx={{ minWidth: 30, textAlign: 'center' }}>{qty}</Typography>
                    <IconButton size="small" onClick={() => handleQuantityChange(item.name, 1)}>
                      <Add />
                    </IconButton>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleAddToCart(item)}
                      disabled={qty === 0}
                      sx={{ ml: 'auto' }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
