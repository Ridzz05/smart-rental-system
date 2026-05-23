import React, { useState, useEffect, useMemo } from 'react';
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
import ConfirmDialog from '../components/ConfirmDialog';

// i18n
import { useLanguage } from '../i18n/i18n';

export default function Fleet() {
  const { t } = useLanguage();
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
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const currencyFormatter = useMemo(() => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }), []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vehiclesRes, categoriesRes] = await Promise.all([
        fetch('/api/vehicles', { headers: { 'Accept': 'application/json' } }),
        fetch('/api/categories', { headers: { 'Accept': 'application/json' } }),
      ]);
      
      if (!vehiclesRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch fleet data');
      }

      const [vehiclesData, categoriesData] = await Promise.all([
        vehiclesRes.json(),
        categoriesRes.json(),
      ]);
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      console.error(err);
      showToast(t('fleet.toast_load_failed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = () => {
    setLoading(true);
    fetch('/api/vehicles', { headers: { 'Accept': 'application/json' } })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setVehicles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        showToast(t('fleet.toast_load_failed'), 'error');
        setVehicles([]);
        setLoading(false);
      });
  };

  const fetchCategories = () => {
    fetch('/api/categories', { headers: { 'Accept': 'application/json' } })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error(err);
        setCategories([]);
      });
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
        showToast(`${t('fleet.toast_update_status')} ${nextStatus}`);
        setVehicles((items) => items.map((item) => (
          item.id === vehicle.id ? { ...item, status: nextStatus } : item
        )));
      } else {
        const data = await response.json();
        showToast(data.message || t('customers.toast_validation_error'), 'error');
      }
    } catch (err) {
      console.error(err);
      showToast(t('customers.toast_connection_error'), 'error');
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ open: false, id: null });
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      });
      
      if (response.ok) {
        showToast(t('fleet.toast_delete_success'));
        setVehicles((items) => items.filter((item) => item.id !== id));
      } else {
        const data = await response.json();
        showToast(data.message || t('customers.toast_connection_error'), 'error');
      }
    } catch (err) {
      console.error(err);
      showToast(t('customers.toast_connection_error'), 'error');
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
        showToast(t('fleet.toast_register_success'));
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
        showToast(data.message || t('customers.toast_validation_error'), 'error');
      }
    } catch (err) {
      console.error(err);
      showToast(t('customers.toast_connection_error'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val) => currencyFormatter.format(val);

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
      <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-end', sm: 'space-between' }, alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Typography variant="h5" sx={{ fontFamily: '"Google Sans", sans-serif', fontWeight: 800 }}>
            {t('fleet.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('fleet.subtitle')}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
          sx={{ borderRadius: 2, py: 1, width: { xs: '100%', sm: 'auto' } }}
        >
          {t('fleet.add_vehicle')}
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
                transition: { xs: 'none', sm: 'box-shadow 0.2s ease, transform 0.2s ease' },
                '@media (hover: hover)': {
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) => theme.shadows[2],
                  },
                }
              }}>
                {/* Vehicle Thumbnail */}
                <Box sx={{ position: 'relative', height: 160, overflow: 'hidden', bgcolor: 'grey.100' }}>
                  <img 
                    src={vehicle.image_url || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400"}
                    alt={vehicle.brand}
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Chip
                    label={vehicle.status}
                    color={vehicle.status === 'Available' ? 'success' : vehicle.status === 'Rented' ? 'info' : 'warning'}
                    size="small"
                    sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 700, borderRadius: 1 }}
                  />
                  <Chip
                    label={vehicle.category?.name || 'Uncategorized'}
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
                  <Typography variant="h6" sx={{ fontFamily: '"Google Sans", sans-serif', fontWeight: 700, mt: 0.5, mb: 1.5 }}>
                    {vehicle.brand} {vehicle.model}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">{t('fleet.daily_rate')}</Typography>
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
                      {isMaint ? t('fleet.resolve_maint') : t('fleet.maint_mode')}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      disabled={isRented}
                      onClick={() => handleDeleteClick(vehicle.id)}
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
        <DialogTitle sx={{ fontFamily: '"Google Sans", sans-serif', fontWeight: 700 }}>
          {t('fleet.register_title')}
        </DialogTitle>
        <form onSubmit={handleAddSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('fleet.brand')}
                  placeholder="e.g. Toyota, Yamaha"
                  value={newVehicle.brand}
                  onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('fleet.model')}
                  placeholder="e.g. Innova Zenix, NMAX"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('fleet.license_plate')}
                  placeholder="e.g. B 1234 ABC"
                  value={newVehicle.license_plate}
                  onChange={(e) => setNewVehicle({ ...newVehicle, license_plate: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('fleet.rate_idr')}
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
                  label={t('fleet.category')}
                  value={newVehicle.category_id}
                  onChange={(e) => setNewVehicle({ ...newVehicle, category_id: e.target.value })}
                  required
                  fullWidth
                >
                  <MenuItem value="" disabled>{t('fleet.choose_category')}</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={t('fleet.image_url')}
                  placeholder="e.g. https://images.unsplash.com/... or keep blank"
                  value={newVehicle.image_url}
                  onChange={(e) => setNewVehicle({ ...newVehicle, image_url: e.target.value })}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenAdd(false)} color="inherit">{t('common.cancel')}</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={submitting}
              sx={{ borderRadius: 2 }}
            >
              {submitting ? t('fleet.registering') : t('fleet.add_vehicle')}
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        title={t('common.confirm') || 'Konfirmasi'}
        message={t('fleet.confirm_delete')}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
        confirmText={t('common.delete') || 'Hapus'}
        cancelText={t('common.cancel') || 'Batal'}
        severity="error"
      />
    </Box>
  );
}
