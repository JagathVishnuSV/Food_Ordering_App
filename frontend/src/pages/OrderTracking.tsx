import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
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
} from '@mui/material';
import { LocalShipping, CheckCircle, Schedule } from '@mui/icons-material';

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();

  const { data: assignment, isLoading, error } = useQuery({
    queryKey: ['delivery', orderId],
    queryFn: () => deliveryApi.getAssignment(orderId!),
    enabled: !!orderId,
    refetchInterval: 3000, // Poll every 3 seconds for updates
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
        <Alert severity="warning">
          Delivery information not available yet. Your order may still be processing.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Order Tracking
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Order ID: {orderId}</Typography>
          <Chip
            icon={getStatusIcon(assignment?.status || '')}
            label={assignment?.status || 'UNKNOWN'}
            color={getStatusColor(assignment?.status || '')}
          />
        </Box>

        {assignment && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Progress
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
              <Alert severity="info" sx={{ mb: 2 }}>
                Rider {assignment.rider_id} has been assigned to your order
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
                Your order has been delivered! Enjoy your meal! 🎉
              </Alert>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
}
