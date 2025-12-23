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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => navigate('/restaurants')} 
            sx={{ 
              background: 'rgba(99, 102, 241, 0.1)',
              '&:hover': { background: 'rgba(99, 102, 241, 0.2)' },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h3" component="h1" fontWeight="bold">
              {restaurant.name}
            </Typography>
            {restaurant.category && (
              <Chip 
                label={restaurant.category} 
                size="small"
                sx={{ 
                  mt: 1,
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2))',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  fontWeight: 600,
                }}
              />
            )}
          </Box>
        </Box>
        <IconButton 
          onClick={() => navigate('/checkout')} 
          sx={{
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5, #db2777)',
            },
          }}
        >
          <Badge badgeContent={cartItems.length} color="error">
            <ShoppingCart />
          </Badge>
        </IconButton>
      </Box>

      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 5, mb: 3 }}>
        Menu Items
      </Typography>

      <Grid container spacing={3}>
        {restaurant.menu.map((item, index) => {
          const qty = quantities[item.name] || 0;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card elevation={0} sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ minHeight: 40 }}>
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      {item.finalPrice !== undefined && item.finalPrice !== item.price ? (
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                            ${item.price.toFixed(2)}
                          </Typography>
                          <Typography variant="h5" fontWeight="bold" sx={{ 
                            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}>
                            ${item.finalPrice.toFixed(2)}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="h5" fontWeight="bold" sx={{ 
                          background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}>
                          ${item.price.toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      background: 'rgba(99, 102, 241, 0.1)',
                      borderRadius: 2,
                      p: 0.5,
                    }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.name, -1)}
                        disabled={qty === 0}
                        sx={{ 
                          background: 'rgba(99, 102, 241, 0.2)',
                          '&:hover': { background: 'rgba(99, 102, 241, 0.3)' },
                        }}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography sx={{ minWidth: 30, textAlign: 'center', fontWeight: 'bold' }}>
                        {qty}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleQuantityChange(item.name, 1)}
                        sx={{ 
                          background: 'rgba(99, 102, 241, 0.2)',
                          '&:hover': { background: 'rgba(99, 102, 241, 0.3)' },
                        }}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                    <Button
                      variant="contained"
                      size="medium"
                      onClick={() => handleAddToCart(item)}
                      disabled={qty === 0}
                      fullWidth
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
