import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { deliveryApi } from '../api/delivery';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  LinearProgress,
  Chip,
  Grid,
  Button,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { LocalShipping, CheckCircle, Schedule, Restaurant, ArrowBack } from '@mui/icons-material';

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const { data: assignment, isLoading, error } = useQuery({
    queryKey: ['delivery', orderId],
    queryFn: () => deliveryApi.getAssignment(orderId!),
    enabled: !!orderId,
    refetchInterval: (data) => {
      // Stop polling if delivered
      if (data?.status === 'DELIVERED') return false;
      return 5000; // Poll every 5 seconds
    },
    retry: 2,
    retryDelay: 2000,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CREATED':
        return 'default';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle />;
      case 'IN_TRANSIT':
        return <LocalShipping />;
      default:
        return <Schedule />;
    }
  };

  const getActiveStep = (status?: string) => {
    switch (status) {
      case 'CREATED': return 0;
      case 'ASSIGNED': return 1;
      case 'IN_TRANSIT': return 2;
      case 'DELIVERED': return 3;
      default: return 0;
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !assignment) {
    return (
      <Container sx={{ mt: 4 }}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Button startIcon={<ArrowBack />} onClick={() => navigate('/orders')} sx={{ mr: 2 }}>
              Back to Orders
            </Button>
          </Box>
          <Typography variant="h5" gutterBottom>
            Order #{orderId?.substring(0, 8)}
          </Typography>
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Your order has been delivered! 🎉
            </Typography>
            <Typography variant="body2">
              Thanks for ordering with us. Enjoy your meal!
            </Typography>
          </Alert>
          <Button 
            variant="outlined" 
            startIcon={<Restaurant />} 
            onClick={() => navigate('/restaurants')}
          >
            Order Again
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/orders')} sx={{ mr: 2 }}>
          Back to Orders
        </Button>
      </Box>

      <Typography variant="h4" component="h1" gutterBottom>
        Order Tracking
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Order #{orderId?.substring(0, 8)}</Typography>
          <Chip
            icon={getStatusIcon(assignment?.status || '')}
            label={assignment?.status || 'UNKNOWN'}
            color={getStatusColor(assignment?.status || '')}
          />
        </Box>

        {assignment && (
          <>
            <Stepper activeStep={getActiveStep(assignment.status)} sx={{ mb: 4 }}>
              <Step>
                <StepLabel>Order Placed</StepLabel>
              </Step>
              <Step>
                <StepLabel>Rider Assigned</StepLabel>
              </Step>
              <Step>
                <StepLabel>Out for Delivery</StepLabel>
              </Step>
              <Step>
                <StepLabel>Delivered</StepLabel>
              </Step>
            </Stepper>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Delivery Progress
              </Typography>
              <LinearProgress
                variant="determinate"
                value={assignment.progress}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography variant="body2" align="right" sx={{ mt: 1 }}>
                {assignment.progress}%
              </Typography>
            </Box>

            {assignment.rider_id && (
              <Alert severity="info" icon={<LocalShipping />} sx={{ mb: 2 }}>
                Rider {assignment.rider_id} is handling your delivery
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Current Location
                </Typography>
                <Typography variant="body1">
                  {assignment.location.join(', ')}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Destination
                </Typography>
                <Typography variant="body1">
                  {assignment.dest.join(', ')}
                </Typography>
              </Grid>
            </Grid>

            {assignment.status === 'DELIVERED' && (
              <Alert severity="success" sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Your order has been delivered! 🎉
                </Typography>
                <Typography variant="body2">
                  Enjoy your meal! Thank you for ordering with us.
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/restaurants')}
                >
                  Order Again
                </Button>
              </Alert>
            )}

            {assignment.status === 'CREATED' && (
              <Alert severity="info" icon={<Restaurant />} sx={{ mt: 3 }}>
                Your order is being prepared by the restaurant. A rider will be assigned shortly.
              </Alert>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
}
