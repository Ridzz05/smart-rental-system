import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// i18n
import { useLanguage } from '../i18n/i18n';

export default function Customers() {
  const { t } = useLanguage();
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    address: '',
    driver_license: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    setLoading(true);
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        showToast(t('customers.toast_load_failed'), 'error');
        setLoading(false);
      });
  };

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const handleOpenAdd = () => {
    setEditMode(false);
    setCurrentCustomer({
      id: null,
      name: '',
      email: '',
      phone: '',
      address: '',
      driver_license: ''
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (customer) => {
    setEditMode(true);
    setCurrentCustomer({
      id: customer.id,
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone,
      address: customer.address || '',
      driver_license: customer.driver_license || ''
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('customers.confirm_delete'))) return;
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      });
      if (response.ok) {
        showToast(t('customers.toast_delete_success'));
        fetchCustomers();
      } else {
        const data = await response.json();
        showToast(data.message || t('customers.toast_connection_error'), 'error');
      }
    } catch (err) {
      console.error(err);
      showToast(t('customers.toast_connection_error'), 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const url = editMode ? `/api/customers/${currentCustomer.id}` : '/api/customers';
    const method = editMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify(currentCustomer)
      });
      
      const data = await response.json();
      if (response.ok) {
        showToast(editMode ? t('customers.toast_update_success') : t('customers.toast_register_success'));
        setOpenDialog(false);
        fetchCustomers();
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

  const filteredCustomers = customers.filter(c => {
    const query = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(query) || 
           (c.email && c.email.toLowerCase().includes(query)) ||
           c.phone.includes(query) ||
           (c.driver_license && c.driver_license.includes(query));
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
      {/* Header Panel */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: '"Google Sans", sans-serif', fontWeight: 800 }}>
            {t('customers.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('customers.subtitle')}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ borderRadius: 2, py: 1 }}
        >
          {t('customers.register')}
        </Button>
      </Box>

      {/* Search and Table Card */}
      <Card sx={{ border: 'none', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' }}>
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'start' }}>
          <TextField
            placeholder={t('customers.search_placeholder')}
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
            sx={{ minWidth: 350, bgcolor: 'background.paper', borderRadius: 2 }}
          />
        </Box>
        <Divider />

        {/* Table List */}
        <TableContainer component={Paper} sx={{ border: 'none', boxShadow: 'none' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'light' ? '#f8fafc' : '#1e1e24' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>{t('customers.client_details')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('customers.contact_info')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('customers.drivers_license')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('customers.full_address')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">{t('customers.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {t('customers.no_customers')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {customer.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('customers.client_id')}: #CUST-{String(customer.id).padStart(4, '0')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {customer.phone}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {customer.email || t('customers.no_email')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        {customer.driver_license || t('customers.not_recorded')}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 220 }}>
                      <Typography variant="body2" noWrap title={customer.address}>
                        {customer.address || t('customers.no_address')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'end' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                          onClick={() => handleOpenEdit(customer)}
                          sx={{ borderRadius: 1.5, py: 0.5 }}
                        >
                          {t('common.edit')}
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(customer.id)}
                          sx={{ minWidth: 40, p: 0, borderRadius: 1.5 }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontFamily: '"Google Sans", sans-serif', fontWeight: 700 }}>
          {editMode ? t('customers.edit_title') : t('customers.register_title')}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              label={t('customers.full_name')}
              placeholder="e.g. John Doe"
              value={currentCustomer.name}
              onChange={(e) => setCurrentCustomer({ ...currentCustomer, name: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label={t('customers.phone_number')}
              placeholder="e.g. 081234567890"
              value={currentCustomer.phone}
              onChange={(e) => setCurrentCustomer({ ...currentCustomer, phone: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label={t('customers.email_address')}
              type="email"
              placeholder="e.g. john@example.com"
              value={currentCustomer.email}
              onChange={(e) => setCurrentCustomer({ ...currentCustomer, email: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('customers.sim_number')}
              placeholder="e.g. 1234-5678-901234"
              value={currentCustomer.driver_license}
              onChange={(e) => setCurrentCustomer({ ...currentCustomer, driver_license: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label={t('customers.residential_address')}
              multiline
              rows={3}
              placeholder="e.g. Jl. Sudirman No. 12, Jakarta"
              value={currentCustomer.address}
              onChange={(e) => setCurrentCustomer({ ...currentCustomer, address: e.target.value })}
              fullWidth
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenDialog(false)} color="inherit">{t('common.cancel')}</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={submitting}
              sx={{ borderRadius: 2 }}
            >
              {submitting ? t('rentals.processing') : t('customers.save_customer')}
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
