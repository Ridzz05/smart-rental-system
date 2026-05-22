import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from './AuthContext';

export default function RegisterPage({ onGoLogin }) {
    const { register } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading]   = useState(false);
    const [errors, setErrors]     = useState({});

    const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            await register(form.name, form.email, form.password, form.password_confirmation);
        } catch (err) {
            setErrors(err?.errors || { general: [err?.message || 'Registrasi gagal.'] });
        } finally {
            setLoading(false);
        }
    };

    const fieldError = (key) => errors?.[key]?.[0] || '';

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: (t) =>
                    t.palette.mode === 'dark'
                        ? 'radial-gradient(ellipse at 40% 80%, #1a2e1a 0%, #0d0d0d 70%)'
                        : 'radial-gradient(ellipse at 40% 80%, #f0fff4 0%, #f2f2f0 70%)',
                p: 2,
            }}
        >
            <Card
                sx={{
                    width: '100%',
                    maxWidth: 440,
                    p: { xs: 3, sm: 4 },
                    borderRadius: 4,
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                }}
            >
                {/* Brand */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                    <Box
                        sx={{
                            width: 44, height: 44,
                            borderRadius: 2.5,
                            background: (t) => t.palette.primary.main,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <TimeToLeaveIcon sx={{ color: (t) => t.palette.primary.contrastText, fontSize: 24 }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1, fontFamily: '"Google Sans", sans-serif' }}>
                            Smart Rental
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.5 }}>
                            MANAGEMENT SYSTEM
                        </Typography>
                    </Box>
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Buat akun</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Daftarkan akun baru untuk mulai menggunakan sistem
                </Typography>

                {fieldError('general') && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{fieldError('general')}</Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Nama Lengkap"
                        value={form.name}
                        onChange={set('name')}
                        required fullWidth autoFocus
                        error={!!fieldError('name')}
                        helperText={fieldError('name')}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={set('email')}
                        required fullWidth
                        autoComplete="email"
                        error={!!fieldError('email')}
                        helperText={fieldError('email')}
                    />
                    <TextField
                        label="Password"
                        type={showPass ? 'text' : 'password'}
                        value={form.password}
                        onChange={set('password')}
                        required fullWidth
                        error={!!fieldError('password')}
                        helperText={fieldError('password') || 'Minimal 6 karakter'}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPass(v => !v)} edge="end" size="small">
                                        {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Konfirmasi Password"
                        type={showPass ? 'text' : 'password'}
                        value={form.password_confirmation}
                        onChange={set('password_confirmation')}
                        required fullWidth
                        error={form.password !== form.password_confirmation && form.password_confirmation.length > 0}
                        helperText={
                            form.password !== form.password_confirmation && form.password_confirmation.length > 0
                                ? 'Password tidak cocok'
                                : ''
                        }
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={loading}
                        sx={{ borderRadius: 2, fontWeight: 700, mt: 1, py: 1.4 }}
                    >
                        {loading ? <CircularProgress size={22} color="inherit" /> : 'Daftar'}
                    </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Sudah punya akun?{' '}
                        <Typography
                            component="span"
                            variant="body2"
                            sx={{ fontWeight: 700, cursor: 'pointer', color: 'primary.main' }}
                            onClick={onGoLogin}
                        >
                            Masuk
                        </Typography>
                    </Typography>
                </Box>
            </Card>
        </Box>
    );
}
