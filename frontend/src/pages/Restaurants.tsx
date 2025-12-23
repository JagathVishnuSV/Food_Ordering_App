import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { restaurantApi } from '../api/restaurants';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CircularProgress,
  Alert,
  Box,
  Chip,
} from '@mui/material';
import { Restaurant as RestaurantIcon, LocationOn } from '@mui/icons-material';

export default function Restaurants() {
  const navigate = useNavigate();
  const { data: restaurants, isLoading, error } = useQuery({
    queryKey: ['restaurants'],
    queryFn: restaurantApi.getAll,
  });

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
        <Alert severity="error">Failed to load restaurants</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 5 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          fontWeight="bold"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <RestaurantIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          Explore Restaurants
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover delicious food from top-rated restaurants
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {restaurants?.map((restaurant) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={restaurant._id}>
            <Card elevation={0}>
              <CardActionArea 
                onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                sx={{ height: '100%' }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                    {restaurant.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 0.5 }}>
                    <LocationOn fontSize="small" sx={{ color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      {restaurant.location.coordinates.join(', ')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    {restaurant.category && (
                      <Chip 
                        label={restaurant.category} 
                        size="small" 
                        sx={{
                          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2))',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                          fontWeight: 600,
                        }}
                      />
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {restaurant.menu.length} items available
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {restaurants?.length === 0 && (
        <Alert 
          severity="info" 
          sx={{ 
            mt: 4, 
            borderRadius: 2,
            '& .MuiAlert-icon': {
              color: 'primary.main',
            },
          }}
        >
          No restaurants available at the moment. Check back soon!
        </Alert>
      )}
    </Container>
  );
}
