import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import BuildIcon from '@mui/icons-material/Build';
import DoneIcon from '@mui/icons-material/Done';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function Fleet() {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog State
  const [openAdd, setOpenAdd] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    brand: '',
    model: '',
    license_plate: '',
    daily_rate: '',
    category_id: '',
    image_url: '',
    status: 'Available'
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchVehicles();
    fetchCategories();
  }, []);

  const fetchVehicles = () => {
    setLoading(true);
    fetch('/api/vehicles')
      .then(res => res.json())
      .then(data => {
        setVehicles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        showToast('Failed to load fleet data', 'error');
        setLoading(false);
      });
  };

  const fetchCategories = () => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  };

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const handleToggleMaintenance = async (vehicle) => {
    const nextStatus = vehicle.status === 'Maintenance' ? 'Available' : 'Maintenance';
    try {
      const response = await fetch(`/api/vehicles/${vehicle.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({ status: nextStatus })
      });
      
      if (response.ok) {
        showToast(`Vehicle status updated to ${nextStatus}`);
        fetchVehicles();
      } else {
        const data = await response.json();
        showToast(data.message || 'Failed to update status', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('A connection error occurred', 'error');
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to remove this vehicle from fleet records?')) return;
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      });
      
      if (response.ok) {
        showToast('Vehicle deleted successfully');
        fetchVehicles();
      } else {
        const data = await response.json();
        showToast(data.message || 'Failed to delete vehicle', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('A connection error occurred', 'error');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify(newVehicle)
      });
      
      const data = await response.json();
      if (response.ok) {
        showToast('New vehicle registered in fleet successfully!');
        setOpenAdd(false);
        setNewVehicle({
          brand: '',
          model: '',
          license_plate: '',
          daily_rate: '',
          category_id: '',
          image_url: '',
          status: 'Available'
        });
        fetchVehicles();
      } else {
        showToast(data.message || 'Validation failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('A connection error occurred', 'error');
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header Area */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>
            Fleet Directory
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your rental collection, configure daily rates, and trigger maintenance logs.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
          sx={{ borderRadius: 2, py: 1 }}
        >
          Add New Vehicle
        </Button>
      </Box>

      {/* Fleet Cards Grid */}
      <Grid container spacing={3}>
        {vehicles.map((vehicle) => {
          const isMaint = vehicle.status === 'Maintenance';
          const isRented = vehicle.status === 'Rented';
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={vehicle.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }
              }}>
                {/* Vehicle Thumbnail */}
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

                {/* Details */}
                <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>
                    {vehicle.license_plate}
                  </Typography>
                  <Typography variant="h6" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, mt: 0.5, mb: 1.5 }}>
                    {vehicle.brand} {vehicle.model}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">DAILY RATE</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      {formatCurrency(vehicle.daily_rate)}
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2, mt: 'auto' }} />

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={isRented}
                      startIcon={isMaint ? <DoneIcon /> : <BuildIcon />}
                      onClick={() => handleToggleMaintenance(vehicle)}
                      sx={{ flexGrow: 1, borderRadius: 1.5 }}
                    >
                      {isMaint ? 'Resolve Maint.' : 'Maint. Mode'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      disabled={isRented}
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      sx={{ minWidth: 40, p: 0, borderRadius: 1.5 }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Add New Vehicle Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
          Register New Vehicle
        </DialogTitle>
        <form onSubmit={handleAddSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Brand Name"
                  placeholder="e.g. Toyota, Yamaha"
                  value={newVehicle.brand}
                  onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Model/Type"
                  placeholder="e.g. Innova Zenix, NMAX"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="License Plate Number"
                  placeholder="e.g. B 1234 ABC"
                  value={newVehicle.license_plate}
                  onChange={(e) => setNewVehicle({ ...newVehicle, license_plate: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Daily Rental Rate (IDR)"
                  type="number"
                  placeholder="e.g. 500000"
                  value={newVehicle.daily_rate}
                  onChange={(e) => setNewVehicle({ ...newVehicle, daily_rate: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Vehicle Category"
                  value={newVehicle.category_id}
                  onChange={(e) => setNewVehicle({ ...newVehicle, category_id: e.target.value })}
                  required
                  fullWidth
                >
                  <MenuItem value="" disabled>-- Choose Category --</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Image URL Address"
                  placeholder="e.g. https://images.unsplash.com/... or keep blank"
                  value={newVehicle.image_url}
                  onChange={(e) => setNewVehicle({ ...newVehicle, image_url: e.target.value })}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenAdd(false)} color="inherit">Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={submitting}
              sx={{ borderRadius: 2 }}
            >
              {submitting ? 'Registering...' : 'Add Vehicle'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Toast Notification */}
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
