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
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        <RestaurantIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Restaurants
      </Typography>

      <Grid container spacing={3}>
        {restaurants?.map((restaurant) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={restaurant._id}>
            <Card elevation={2}>
              <CardActionArea onClick={() => navigate(`/restaurant/${restaurant._id}`)}>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {restaurant.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {restaurant.location.coordinates.join(', ')}
                    </Typography>
                  </Box>
                  {restaurant.category && (
                    <Chip label={restaurant.category} size="small" color="primary" />
                  )}
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {restaurant.menu.length} items
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {restaurants?.length === 0 && (
        <Alert severity="info" sx={{ mt: 4 }}>
          No restaurants available at the moment.
        </Alert>
      )}
    </Container>
  );
}
