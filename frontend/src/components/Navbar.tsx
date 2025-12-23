import { AppBar, Toolbar, Typography, Button, Box, Badge, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../store/cart';
import { ShoppingCart, ListAlt, AdminPanelSettings } from '@mui/icons-material';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const { items } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ py: 1 }}>
        <Typography
          variant="h5"
          component="div"
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer', 
            fontWeight: 800, 
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 0.5,
          }}
          onClick={() => navigate(isAuthenticated ? '/restaurants' : '/')}
        >
          🍔 FoodHub
        </Typography>

        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary', fontWeight: 500 }}>
              {user?.name}
            </Typography>
            
            <Button 
              color="inherit" 
              startIcon={<ListAlt />}
              onClick={() => navigate('/orders')}
              sx={{ color: 'text.primary' }}
            >
              Orders
            </Button>

            <Button
              color="inherit"
              startIcon={<AdminPanelSettings />}
              onClick={() => navigate('/admin')}
              sx={{ color: 'text.primary' }}
            >
              Admin
            </Button>
            
            <IconButton 
              color="inherit" 
              onClick={() => navigate('/checkout')}
              sx={{ 
                background: 'rgba(99, 102, 241, 0.15)',
                '&:hover': { background: 'rgba(99, 102, 241, 0.25)' }
              }}
            >
              <Badge badgeContent={items.length} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            <Button 
              variant="outlined" 
              onClick={handleLogout}
              sx={{ ml: 1 }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button variant="outlined" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button variant="contained" onClick={() => navigate('/register')}>
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
