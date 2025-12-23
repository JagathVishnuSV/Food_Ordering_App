import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, Button, Box, Paper, Grid } from '@mui/material';
import { Restaurant, ShoppingCart, LocalShipping, Notifications } from '@mui/icons-material';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Restaurant sx={{ fontSize: 60 }} />,
      title: 'Browse Restaurants',
      description: 'Discover a variety of restaurants and cuisines',
    },
    {
      icon: <ShoppingCart sx={{ fontSize: 60 }} />,
      title: 'Easy Ordering',
      description: 'Add items to cart and checkout seamlessly',
    },
    {
      icon: <LocalShipping sx={{ fontSize: 60 }} />,
      title: 'Live Tracking',
      description: 'Track your order in real-time',
    },
    {
      icon: <Notifications sx={{ fontSize: 60 }} />,
      title: 'Stay Updated',
      description: 'Get notified about your order status',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ textAlign: 'center', my: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          Welcome to Food Ordering
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Order delicious food from your favorite restaurants
        </Typography>
        <Box sx={{ mt: 4 }}>
          {isAuthenticated ? (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/restaurants')}
              sx={{ px: 4, py: 1.5 }}
            >
              Browse Restaurants
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{ px: 4, py: 1.5, mr: 2 }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{ px: 4, py: 1.5 }}
              >
                Login
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4, mb: 8 }}>
        {features.map((feature, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                textAlign: 'center',
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
              <Typography variant="h6" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
