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

// i18n
import { useLanguage } from '../i18n/i18n';
import { useTheme } from '@mui/material/styles';

// Icons
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PeopleIcon from '@mui/icons-material/People';
import LaunchIcon from '@mui/icons-material/Launch';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export default function Dashboard({ setCurrentPage }) {
  const { t } = useLanguage();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
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
      title: t('dashboard.total_revenue'),
      value: formatCurrency(stats.total_revenue),
      icon: <AttachMoneyIcon sx={{ fontSize: 24 }} />,
      desc: t('dashboard.revenue_desc')
    },
    {
      title: t('dashboard.vehicles_on_road'),
      value: stats.vehicles_on_road,
      icon: <DepartureBoardIcon sx={{ fontSize: 24 }} />,
      desc: t('dashboard.vehicles_on_road_desc')
    },
    {
      title: t('dashboard.available_fleet'),
      value: stats.vehicles_available,
      icon: <DoneAllIcon sx={{ fontSize: 24 }} />,
      desc: t('dashboard.available_fleet_desc')
    },
    {
      title: t('dashboard.total_customers'),
      value: stats.total_customers,
      icon: <PeopleIcon sx={{ fontSize: 24 }} />,
      desc: t('dashboard.total_customers_desc')
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
        borderRadius: 3,
        background: isDark ? '#1A1A1A' : '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        border: `1px solid ${isDark ? '#2A2A2A' : '#E5E5E5'}`,
        boxShadow: isDark
          ? '0 4px 12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)'
          : '0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"Google Sans", sans-serif', fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em' }}>
            {t('dashboard.welcome_alice')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('dashboard.subtitle')}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setCurrentPage('rental-desk')}
          startIcon={<LaunchIcon />}
          sx={{ py: 1.2, px: 3, borderRadius: 2, fontWeight: 700 }}
        >
          {t('dashboard.open_desk')}
        </Button>
      </Box>

      {/* Stats Grid — elevated cards that pop */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              elevation={1}
              sx={{
                height: '100%',
                cursor: 'default',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => theme.shadows[2],
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  mb: 2.5,
                  background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                  color: 'text.primary',
                }}>
                  {card.icon}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 1 }}>
                  {card.title}
                </Typography>
                <Typography variant="h4" sx={{ fontFamily: '"Google Sans", sans-serif', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, mb: 0.5 }}>
                  {card.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {card.desc}
                </Typography>
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
            <Typography variant="h6" sx={{ fontFamily: '"Google Sans", sans-serif', fontWeight: 700, mb: 3 }}>
              {t('dashboard.chart_title')}
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
                        background: isDark
                          ? 'linear-gradient(to top, #525252, #A3A3A3)'
                          : 'linear-gradient(to top, #0A0A0A, #525252)',
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.8s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          background: isDark
                            ? 'linear-gradient(to top, #737373, #D4D4D4)'
                            : 'linear-gradient(to top, #262626, #737373)',
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
              <Typography variant="h6" sx={{ fontFamily: '"Google Sans", sans-serif', fontWeight: 700 }}>
                {t('dashboard.alerts_title')}
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {stats.upcoming_returns.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6, textAlign: 'center', flexGrow: 1 }}>
                  <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', mb: 2, width: 48, height: 48 }}>
                    <DoneAllIcon sx={{ color: '#10b981' }} />
                  </Avatar>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {t('dashboard.no_pending')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('dashboard.no_pending_desc')}
                  </Typography>
                </Box>
              ) : (
                stats.upcoming_returns.map((rental, index) => {
                  const end = new Date(rental.end_date);
                  const today = new Date();
                  const diffTime = end - today;
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  let chipLabel = `${diffDays} ${t('dashboard.days_left')}`;
                  let chipColor = 'primary';
                  if (diffDays <= 0) {
                    chipLabel = t('dashboard.overdue');
                    chipColor = "error";
                  } else if (diffDays === 1) {
                    chipLabel = t('dashboard.due_tomorrow');
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
                          {t('dashboard.customer')}: {rental.customer.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {t('dashboard.license_plate')}: <strong>{rental.vehicle.license_plate}</strong>
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
                {t('dashboard.manage_rentals')}
              </Button>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
