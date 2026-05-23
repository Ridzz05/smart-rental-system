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

export default function LoginPage({ onGoRegister, onBackHome }) {
    const { login } = useAuth();
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState('');

    const isMobile = useMediaQuery('(max-width:600px)');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            const msg =
                err?.errors?.email?.[0] ||
                err?.message ||
                'Login gagal. Periksa kembali email & password.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

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
                            ? 'radial-gradient(ellipse at 60% 20%, #121212 0%, #0d0d0d 70%)'
                            : 'radial-gradient(ellipse at 60% 20%, #f4f6fa 0%, #f2f2f0 70%)',
                p: 2,
            }}
        >
            <Card
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                    maxWidth: 420,
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
                            Masuk
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            onClick={onGoRegister}
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
                    Selamat datang
                </Typography>
                <Typography variant="body2" sx={{
                    mb: 3,
                    color: 'text.secondary',
                }}>
                    Masuk untuk melanjutkan ke dashboard
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Email" type="email"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        required fullWidth autoComplete="email" autoFocus
                        sx={isMobile ? { '& .MuiOutlinedInput-root': { background: 'transparent' } } : undefined}
                    />
                    <TextField
                        label="Password"
                        type={showPass ? 'text' : 'password'}
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        required fullWidth autoComplete="current-password"
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
                        {loading ? <CircularProgress size={22} color="inherit" /> : 'Masuk'}
                    </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{
                        color: 'text.secondary',
                    }}>
                        Belum punya akun?{' '}
                        <Typography
                            component="span" variant="body2"
                            sx={{ fontWeight: 700, cursor: 'pointer', color: 'primary.main' }}
                            onClick={onGoRegister}
                        >
                            Daftar sekarang
                        </Typography>
                    </Typography>
                </Box>
            </Card>
        </Box>
    );
}
