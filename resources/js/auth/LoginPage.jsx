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
import { useAuth } from './AuthContext';

export default function LoginPage({ onGoRegister }) {
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
                            ? 'radial-gradient(ellipse at 60% 20%, #1a1a2e 0%, #0d0d0d 70%)'
                            : 'radial-gradient(ellipse at 60% 20%, #f0f4ff 0%, #f2f2f0 70%)',
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
                    backdropFilter: isMobile ? 'none' : 'blur(20px)',
                    WebkitBackdropFilter: isMobile ? 'none' : 'blur(20px)',
                    ...(isMobile && {
                        background: 'transparent !important',
                        backgroundColor: 'transparent !important',
                        border: 'none',
                        boxShadow: 'none',
                    }),
                }}
            >
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
                            color: isMobile ? '#fff' : 'text.primary',
                        }}>
                            Smart Rental
                        </Typography>
                        <Typography variant="caption" sx={{
                            letterSpacing: 0.5,
                            color: isMobile ? 'rgba(255,255,255,0.55)' : 'text.secondary',
                        }}>
                            MANAGEMENT SYSTEM
                        </Typography>
                    </Box>
                </Box>

                <Typography variant="h5" sx={{
                    fontWeight: 700, mb: 0.5,
                    color: isMobile ? '#fff' : 'text.primary',
                }}>
                    Selamat datang
                </Typography>
                <Typography variant="body2" sx={{
                    mb: 3,
                    color: isMobile ? 'rgba(255,255,255,0.6)' : 'text.secondary',
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
                        sx={isMobile ? mobileFieldSx : {}}
                    />
                    <TextField
                        label="Password"
                        type={showPass ? 'text' : 'password'}
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        required fullWidth autoComplete="current-password"
                        sx={isMobile ? mobileFieldSx : {}}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPass(v => !v)} edge="end" size="small"
                                        sx={isMobile ? { color: 'rgba(255,255,255,0.65)' } : {}}
                                    >
                                        {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        type="submit" variant="contained" fullWidth size="large"
                        disabled={loading}
                        sx={{ borderRadius: 2, fontWeight: 700, mt: 1, py: 1.4 }}
                    >
                        {loading ? <CircularProgress size={22} color="inherit" /> : 'Masuk'}
                    </Button>
                </Box>

                <Divider sx={{ my: 3, borderColor: isMobile ? 'rgba(255,255,255,0.12)' : undefined }} />

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{
                        color: isMobile ? 'rgba(255,255,255,0.6)' : 'text.secondary',
                    }}>
                        Belum punya akun?{' '}
                        <Typography
                            component="span" variant="body2"
                            sx={{ fontWeight: 700, cursor: 'pointer', color: isMobile ? '#e5e5e5' : 'primary.main' }}
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

const mobileFieldSx = {
    '& .MuiOutlinedInput-root': {
        background: 'rgba(255,255,255,0.07)',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.38)' },
        '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.65)', borderWidth: 1.5 },
        '& input': { color: '#fff' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.55)' },
    '& .MuiInputLabel-root.Mui-focused': { color: 'rgba(255,255,255,0.9)' },
};
