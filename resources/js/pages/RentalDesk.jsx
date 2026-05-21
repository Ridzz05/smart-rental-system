import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function RentalDesk() {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [rentalStatus, setRentalStatus] = useState('Active');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Notification State
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vRes, cRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/customers')
      ]);
      const vData = await vRes.json();
      const cData = await cRes.json();
      
      setVehicles(vData);
      setCustomers(cData);
      
      // Extract unique categories from vehicle data
      const cats = ['All', ...new Set(vData.map(v => v.category.name))];
      setCategories(cats);
    } catch (err) {
      console.error('Error fetching checkout data:', err);
      showToast('Failed to load fleet or customer database', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  // Helper to calculate total price
  const calculation = () => {
    if (!selectedVehicle || !startDate || !endDate) return { days: 0, total: 0 };
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.max(0, end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const total = days * selectedVehicle.daily_rate;
    return { days, total };
  };

  const { days, total } = calculation();

  const handleSelectVehicle = (vehicle) => {
    if (vehicle.status !== 'Available') {
      showToast('This vehicle is currently rented or under maintenance', 'warning');
      return;
    }
    setSelectedVehicle(vehicle);
    
    // Set default dates if empty: today and tomorrow
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (!startDate) setStartDate(formatDate(today));
    if (!endDate) setEndDate(formatDate(tomorrow));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!selectedVehicle) {
      showToast('Please select a vehicle to checkout', 'error');
      return;
    }
    if (!selectedCustomer) {
      showToast('Please select a customer', 'error');
      return;
    }
    if (!startDate || !endDate) {
      showToast('Please provide start and end dates', 'error');
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      showToast('Return date must be after pickup date', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // Map UI payment methods to DB enum ('Cash', 'QRIS', 'Card')
      let dbPaymentMethod = 'Cash';
      if (paymentMethod === 'Bank Transfer' || paymentMethod === 'E-Wallet') {
        dbPaymentMethod = 'QRIS';
      } else if (paymentMethod === 'Credit Card') {
        dbPaymentMethod = 'Card';
      }

      const response = await fetch('/api/rentals/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({
          vehicle_id: selectedVehicle.id,
          customer_id: selectedCustomer,
          start_date: startDate,
          end_date: endDate,
          payment_method: dbPaymentMethod
        })
      });

      const data = await response.json();
      if (response.status === 200 || response.status === 210) {
        showToast('Rental transaction checked out successfully!');
        setSelectedVehicle(null);
        setSelectedCustomer('');
        // Refresh fleet
        fetchData();
      } else {
        showToast(data.message || 'Checkout failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('A connection error occurred during checkout', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  // Filter logic
  const filteredVehicles = vehicles.filter(v => {
    const matchesCategory = selectedCategory === 'All' || v.category.name === selectedCategory;
    const matchesSearch = v.brand.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.license_plate.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3} sx={{ height: '100%' }}>
        {/* Vehicles Showcase Grid (Left Hand Side) */}
        <Grid item xs={12} lg={selectedVehicle ? 8 : 12} sx={{ transition: 'all 0.3s ease' }}>
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Search */}
            <TextField
              placeholder="Search fleet (Innova, Avanza, Yamaha...)"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300, bgcolor: 'background.paper', borderRadius: 2 }}
            />

            {/* Categories scroll area */}
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', py: 0.5 }}>
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  onClick={() => setSelectedCategory(cat)}
                  color={selectedCategory === cat ? 'primary' : 'default'}
                  sx={{ 
                    fontWeight: 600, 
                    px: 1,
                    borderRadius: 2,
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-1px)' },
                    transition: 'all 0.15s ease'
                  }}
                />
              ))}
            </Box>
          </Box>

          <Grid container spacing={2}>
            {filteredVehicles.map((vehicle) => {
              const isAvailable = vehicle.status === 'Available';
              const isSelected = selectedVehicle?.id === vehicle.id;
              
              return (
                <Grid item xs={12} sm={6} md={selectedVehicle ? 6 : 4} key={vehicle.id}>
                  <Card 
                    onClick={() => handleSelectVehicle(vehicle)}
                    sx={{ 
                      cursor: isAvailable ? 'pointer' : 'not-allowed',
                      opacity: isAvailable ? 1 : 0.65,
                      border: isSelected 
                        ? (theme) => `2px solid ${theme.palette.primary.main}` 
                        : (theme) => `1px solid ${theme.palette.divider}`,
                      boxShadow: isSelected 
                        ? '0 4px 20px rgba(99, 102, 241, 0.15)' 
                        : 'none',
                      '&:hover': isAvailable ? {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
                        borderColor: isSelected ? 'primary.main' : 'divider'
                      } : {},
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <Box sx={{ position: 'relative', height: 160, overflow: 'hidden', bgcolor: 'grey.100' }}>
                      <img 
                        src={vehicle.image_url || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400"}
                        alt={vehicle.brand}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <Chip
                        label={vehicle.status}
                        color={vehicle.status === 'Available' ? 'success' : vehicle.status === 'Rented' ? 'info' : 'warning'}
                        size="small"
                        sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 700, borderRadius: 1 }}
                      />
                      <Chip
                        label={vehicle.category.name}
                        color="secondary"
                        size="small"
                        sx={{ position: 'absolute', bottom: 12, left: 12, fontWeight: 700, borderRadius: 1 }}
                      />
                    </Box>
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>
                        {vehicle.license_plate}
                      </Typography>
                      <Typography variant="h6" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, mt: 0.5 }}>
                        {vehicle.brand} {vehicle.model}
                      </Typography>
                      <Divider sx={{ my: 1.5 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          DAILY RATE
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                          {formatCurrency(vehicle.daily_rate)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        {/* Checkout Side Panel Cart Drawer */}
        {selectedVehicle && (
          <Grid item xs={12} lg={4}>
            <Card 
              sx={{ 
                p: 3, 
                position: 'sticky', 
                top: 84, 
                maxHeight: 'calc(100vh - 120px)', 
                overflowY: 'auto',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
                  Rental Checkout
                </Typography>
                <IconButton onClick={() => setSelectedVehicle(null)} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Selected Vehicle Info Banner */}
              <Paper variant="outlined" sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center', borderRadius: 2 }}>
                <Avatar 
                  src={selectedVehicle.image_url} 
                  variant="rounded" 
                  sx={{ width: 56, height: 56, bgcolor: 'grey.100' }}
                />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {selectedVehicle.brand} {selectedVehicle.model}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Rate: {formatCurrency(selectedVehicle.daily_rate)}/day
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Plate: <strong>{selectedVehicle.license_plate}</strong>
                  </Typography>
                </Box>
              </Paper>

              <form onSubmit={handleCheckout}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {/* Customer Search Dropdown */}
                  <TextField
                    select
                    label="Select Customer"
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    required
                    fullWidth
                  >
                    <MenuItem value="" disabled>-- Choose Client --</MenuItem>
                    {customers.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name} ({c.phone})
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Start Date */}
                  <TextField
                    label="Pickup Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />

                  {/* End Date */}
                  <TextField
                    label="Return Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />

                  {/* Payment Method */}
                  <TextField
                    select
                    label="Payment Method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                    fullWidth
                  >
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                    <MenuItem value="Credit Card">Credit Card</MenuItem>
                    <MenuItem value="E-Wallet">E-Wallet</MenuItem>
                  </TextField>


                  {/* Price Calculation details summary */}
                  <Paper sx={{ p: 2, mt: 2, bgcolor: (theme) => theme.palette.mode === 'light' ? '#fafafa' : '#1f1f22', borderRadius: 2 }} variant="outlined">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Daily Rate</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(selectedVehicle.daily_rate)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">Rental Duration</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{days} days</Typography>
                    </Box>
                    <Divider sx={{ my: 1.5 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Total Charge</Typography>
                      <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
                        {formatCurrency(total)}
                      </Typography>
                    </Box>
                  </Paper>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={submitting}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ py: 1.5, mt: 2, borderRadius: 2, fontWeight: 700 }}
                  >
                    {submitting ? 'Checking out...' : 'Confirm Rental Checkout'}
                  </Button>
                </Box>
              </form>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Snackbar notification popup */}
      <Snackbar 
        open={toast.open} 
        autoHideDuration={4000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%', borderRadius: 2 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
