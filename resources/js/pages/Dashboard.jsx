import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';

// Icons
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PeopleIcon from '@mui/icons-material/People';
import LaunchIcon from '@mui/icons-material/Launch';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export default function Dashboard({ setCurrentPage }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = () => {
    setLoading(true);
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dashboard stats:', err);
        setLoading(false);
      });
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  if (loading || !stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  // Cards Data Configuration
  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.total_revenue),
      icon: <AttachMoneyIcon sx={{ color: '#10b981', fontSize: 30 }} />,
      bgColor: 'rgba(16, 185, 129, 0.1)',
      desc: "All-time earnings"
    },
    {
      title: "Vehicles on Road",
      value: stats.vehicles_on_road,
      icon: <DepartureBoardIcon sx={{ color: '#6366f1', fontSize: 30 }} />,
      bgColor: 'rgba(99, 102, 241, 0.1)',
      desc: "Currently rented out"
    },
    {
      title: "Available Fleet",
      value: stats.vehicles_available,
      icon: <DoneAllIcon sx={{ color: '#3b82f6', fontSize: 30 }} />,
      bgColor: 'rgba(59, 130, 246, 0.1)',
      desc: "Ready for rental desk"
    },
    {
      title: "Total Customers",
      value: stats.total_customers,
      icon: <PeopleIcon sx={{ color: '#f59e0b', fontSize: 30 }} />,
      bgColor: 'rgba(245, 158, 11, 0.1)',
      desc: "Registered clients"
    }
  ];

  // Calculate Max Value for SVG Chart height mapping
  const revenues = stats.monthly_revenue.map(r => r.revenue);
  const maxRevenue = Math.max(...revenues, 1000000);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Welcome Banner */}
      <Box sx={{
        p: { xs: 3, md: 4 },
        mb: 4,
        borderRadius: 4,
        background: (theme) => theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)'
          : 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
        display: 'flex',
        justifyContent: 'between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        border: (theme) => `1px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : '#27272a'}`
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, mb: 1, color: (theme) => theme.palette.text.primary }}>
            Welcome back, Alice!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here is the status of your vehicle rental operations today.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setCurrentPage('rental-desk')}
          startIcon={<LaunchIcon />}
          sx={{ py: 1.2, px: 3, borderRadius: 2 }}
        >
          Open Rental Desk
        </Button>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 3 }}>
                <Avatar sx={{ backgroundColor: card.bgColor, width: 56, height: 56, borderRadius: 3 }}>
                  {card.icon}
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, my: 0.5 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {card.desc}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts & Returns Grid */}
      <Grid container spacing={3}>
        {/* Revenue SVG Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', p: 3 }}>
            <Typography variant="h6" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, mb: 3 }}>
              Monthly Revenue Performance
            </Typography>

            {/* Custom SVG Bar Chart */}
            <Box sx={{ position: 'relative', height: 260, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'end' }}>
              <Box sx={{ display: 'flex', height: 220, alignItems: 'end', justifyContent: 'space-around', px: 2 }}>
                {stats.monthly_revenue.map((item, idx) => {
                  const percentageHeight = (item.revenue / maxRevenue) * 90 + 10; // Map between 10% and 100%
                  return (
                    <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '12%', height: '100%', justifyContent: 'end' }}>
                      {/* Hover Tooltip */}
                      <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.7rem', mb: 1, opacity: item.revenue > 0 ? 1 : 0 }}>
                        {item.revenue >= 1000000 ? (item.revenue / 1000000).toFixed(1) + 'M' : (item.revenue / 1000).toFixed(0) + 'K'}
                      </Typography>
                      {/* Chart Bar */}
                      <Box sx={{
                        height: `${percentageHeight}%`,
                        width: '100%',
                        background: 'linear-gradient(to top, #6366f1, #818cf8)',
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.8s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          background: 'linear-gradient(to top, #4f46e5, #6366f1)',
                        }
                      }} />
                      {/* Axis Label */}
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, fontWeight: 600 }}>
                        {item.month}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Return Alerts */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', p: 3, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <NotificationsActiveIcon sx={{ color: '#f59e0b' }} />
              <Typography variant="h6" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
                Upcoming Return Alerts
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {stats.upcoming_returns.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6, textAlign: 'center', flexGrow: 1 }}>
                  <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', mb: 2, width: 48, height: 48 }}>
                    <DoneAllIcon sx={{ color: '#10b981' }} />
                  </Avatar>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    No pending returns
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    All rented vehicles are currently within schedule.
                  </Typography>
                </Box>
              ) : (
                stats.upcoming_returns.map((rental, index) => {
                  const end = new Date(rental.end_date);
                  const today = new Date();
                  const diffTime = end - today;
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  let chipLabel = `${diffDays} days left`;
                  let chipColor = 'primary';
                  if (diffDays <= 0) {
                    chipLabel = "Overdue";
                    chipColor = "error";
                  } else if (diffDays === 1) {
                    chipLabel = "Due tomorrow";
                    chipColor = "warning";
                  }

                  return (
                    <Paper
                      key={rental.id}
                      variant="outlined"
                      sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 }}
                    >
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {rental.vehicle.brand} {rental.vehicle.model}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Customer: {rental.customer.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          License Plate: <strong>{rental.vehicle.license_plate}</strong>
                        </Typography>
                      </Box>
                      <Chip label={chipLabel} color={chipColor} size="small" sx={{ fontWeight: 600, borderRadius: 1 }} />
                    </Paper>
                  );
                })
              )}
            </Box>

            {stats.upcoming_returns.length > 0 && (
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setCurrentPage('rentals')}
                sx={{ mt: 3, borderRadius: 2 }}
              >
                Manage Active Rentals
              </Button>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
