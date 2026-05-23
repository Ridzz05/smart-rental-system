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
import useMediaQuery from '@mui/material/useMediaQuery';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from './AuthContext';

export default function RegisterPage({ onGoLogin, onBackHome }) {
    const { register } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading]   = useState(false);
    const [errors, setErrors]     = useState({});

    const isMobile = useMediaQuery('(max-width:600px)');

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
                position: 'relative',
                zIndex: 2,
                background: isMobile
                    ? 'transparent'
                    : (t) =>
                        t.palette.mode === 'dark'
                            ? 'radial-gradient(ellipse at 40% 80%, #121212 0%, #0d0d0d 70%)'
                            : 'radial-gradient(ellipse at 40% 80%, #f4f6fa 0%, #f2f2f0 70%)',
                p: 2,
            }}
        >
            <Card
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                    maxWidth: 440,
                    p: { xs: 3, sm: 4 },
                    borderRadius: 4,
                    background: isMobile ? 'transparent' : undefined,
                    boxShadow: isMobile ? 'none' : undefined,
                    backdropFilter: isMobile ? 'none' : 'blur(20px)',
                    WebkitBackdropFilter: isMobile ? 'none' : 'blur(20px)',
                }}
            >
                {/* Back to Home Button */}
                <Box sx={{ mb: 2 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={onBackHome}
                        size="small"
                        sx={{
                            color: 'text.secondary',
                            fontWeight: 700,
                            '&:hover': { color: 'text.primary' }
                        }}
                    >
                        Kembali ke Beranda
                    </Button>
                </Box>

                {/* Mobile Login / Register Switcher */}
                {isMobile && (
                    <Box
                        sx={{
                            display: 'flex',
                            borderRadius: '24px',
                            bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                            p: 0.5,
                            mb: 4,
                            border: (t) => t.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)'
                        }}
                    >
                        <Button
                            fullWidth
                            variant="text"
                            onClick={onGoLogin}
                            sx={{
                                borderRadius: '20px',
                                py: 1,
                                color: 'text.secondary',
                                fontWeight: 500,
                                '&:hover': {
                                    bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                                    color: 'text.primary'
                                }
                            }}
                        >
                            Masuk
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            sx={{
                                borderRadius: '20px',
                                py: 1,
                                bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                                color: 'text.primary',
                                fontWeight: 700,
                                '&:hover': {
                                    bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                                }
                            }}
                        >
                            Daftar
                        </Button>
                    </Box>
                )}

                {/* Brand */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                    <Box sx={{
                        width: 44, height: 44, borderRadius: 2.5,
                        background: (t) => t.palette.primary.main,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <TimeToLeaveIcon sx={{ color: (t) => t.palette.primary.contrastText, fontSize: 24 }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{
                            fontWeight: 800, lineHeight: 1.1,
                            fontFamily: '"Google Sans", sans-serif',
                            color: 'text.primary',
                        }}>
                            Smart Rental
                        </Typography>
                        <Typography variant="caption" sx={{
                            letterSpacing: 0.5,
                            color: 'text.secondary',
                        }}>
                            MANAGEMENT SYSTEM
                        </Typography>
                    </Box>
                </Box>

                <Typography variant="h5" sx={{
                    fontWeight: 700, mb: 0.5,
                    color: 'text.primary',
                }}>
                    Buat akun
                </Typography>
                <Typography variant="body2" sx={{
                    mb: 3,
                    color: 'text.secondary',
                }}>
                    Daftarkan akun baru untuk mulai menggunakan sistem
                </Typography>

                {fieldError('general') && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{fieldError('general')}</Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Nama Lengkap" value={form.name} onChange={set('name')}
                        required fullWidth autoFocus
                        error={!!fieldError('name')} helperText={fieldError('name')}
                        sx={isMobile ? { '& .MuiOutlinedInput-root': { background: 'transparent' } } : undefined}
                    />
                    <TextField
                        label="Email" type="email" value={form.email} onChange={set('email')}
                        required fullWidth autoComplete="email"
                        error={!!fieldError('email')} helperText={fieldError('email')}
                        sx={isMobile ? { '& .MuiOutlinedInput-root': { background: 'transparent' } } : undefined}
                    />
                    <TextField
                        label="Password" type={showPass ? 'text' : 'password'}
                        value={form.password} onChange={set('password')}
                        required fullWidth
                        error={!!fieldError('password')}
                        helperText={fieldError('password') || 'Minimal 6 karakter'}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPass(v => !v)} edge="end" size="small"
                                    >
                                        {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={isMobile ? { '& .MuiOutlinedInput-root': { background: 'transparent' } } : undefined}
                    />
                    <TextField
                        label="Konfirmasi Password" type={showPass ? 'text' : 'password'}
                        value={form.password_confirmation} onChange={set('password_confirmation')}
                        required fullWidth
                        error={form.password !== form.password_confirmation && form.password_confirmation.length > 0}
                        helperText={
                            form.password !== form.password_confirmation && form.password_confirmation.length > 0
                                ? 'Password tidak cocok' : ''
                        }
                        sx={isMobile ? { '& .MuiOutlinedInput-root': { background: 'transparent' } } : undefined}
                    />
                    <Button
                        type="submit" variant="contained" fullWidth size="large"
                        disabled={loading}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 700,
                            mt: 1,
                            py: 1.4,
                            ...(isMobile && {
                                background: 'transparent',
                                border: (t) => `1px solid ${t.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'}`,
                                color: 'text.primary',
                                '&:hover': {
                                    background: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                                    border: (t) => `1px solid ${t.palette.mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'}`,
                                }
                            })
                        }}
                    >
                        {loading ? <CircularProgress size={22} color="inherit" /> : 'Daftar'}
                    </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{
                        color: 'text.secondary',
                    }}>
                        Sudah punya akun?{' '}
                        <Typography
                            component="span" variant="body2"
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
