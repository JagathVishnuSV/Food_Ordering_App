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
      <Box sx={{ textAlign: 'center', my: 10 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          fontWeight="bold"
          sx={{
            background: 'linear-gradient(135deg, #6366f1, #ec4899, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Delicious Food, Delivered Fast
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          Order from your favorite restaurants and track your delivery in real-time
        </Typography>
        <Box sx={{ mt: 5 }}>
          {isAuthenticated ? (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/restaurants')}
              sx={{ 
                px: 6, 
                py: 2, 
                fontSize: '1.1rem',
                borderRadius: 3,
              }}
            >
              Explore Restaurants
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{ px: 5, py: 2, fontSize: '1.1rem', borderRadius: 3 }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{ px: 5, py: 2, fontSize: '1.1rem', borderRadius: 3 }}
              >
                Login
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 6, mb: 10 }}>
        {features.map((feature, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                height: '100%',
                borderRadius: 3,
              }}
            >
              <Box sx={{ 
                color: 'primary.main', 
                mb: 2,
                display: 'flex',
                justifyContent: 'center',
                '& svg': {
                  filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))',
                },
              }}>
                {feature.icon}
              </Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
