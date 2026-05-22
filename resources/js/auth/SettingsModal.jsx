import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import { useAuth } from './AuthContext';

export default function SettingsModal({ open, onClose }) {
    const { user, updateUser } = useAuth();

    const [name, setName]               = useState('');
    const [pictureUrl, setPictureUrl]   = useState('');
    const [preview, setPreview]         = useState('');
    const [loading, setLoading]         = useState(false);
    const [success, setSuccess]         = useState(false);
    const [error, setError]             = useState('');

    // Sync form when user changes or modal opens
    useEffect(() => {
        if (user && open) {
            setName(user.name || '');
            setPictureUrl(user.profile_picture || '');
            setPreview(user.profile_picture || '');
            setSuccess(false);
            setError('');
        }
    }, [user, open]);

    const handlePreview = () => {
        setPreview(pictureUrl.trim() || '');
    };

    const handleSave = async () => {
        setError('');
        setSuccess(false);
        setLoading(true);
        try {
            const payload = { name: name.trim() };
            if (pictureUrl.trim()) payload.profile_picture = pictureUrl.trim();
            else payload.profile_picture = null;

            await updateUser(payload);
            setSuccess(true);
            setTimeout(() => onClose(), 1200);
        } catch (err) {
            const msg =
                err?.errors?.name?.[0] ||
                err?.errors?.profile_picture?.[0] ||
                err?.message ||
                'Gagal menyimpan perubahan.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const avatarSrc = preview || undefined;
    const avatarLetter = (name || user?.name || 'U')[0].toUpperCase();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
        >
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Edit Profil</DialogTitle>
            <Divider />

            <DialogContent sx={{ pt: 3, pb: 1 }}>
                {/* Avatar Preview */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, gap: 1 }}>
                    <Avatar
                        src={avatarSrc}
                        alt={name}
                        sx={{
                            width: 80, height: 80,
                            fontSize: 32, fontWeight: 700,
                            border: (t) => `3px solid ${t.palette.primary.main}`,
                        }}
                    >
                        {!avatarSrc && avatarLetter}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                        Preview foto profil
                    </Typography>
                </Box>

                {success && (
                    <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>Profil berhasil diperbarui!</Alert>
                )}
                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Nama Lengkap"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        size="small"
                    />

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            label="URL Foto Profil"
                            value={pictureUrl}
                            onChange={(e) => { setPictureUrl(e.target.value); }}
                            onBlur={handlePreview}
                            fullWidth
                            size="small"
                            placeholder="https://..."
                            helperText="Paste URL gambar, lalu klik Preview"
                        />
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handlePreview}
                            sx={{ whiteSpace: 'nowrap', minWidth: 72, alignSelf: 'flex-start', mt: '0px' }}
                        >
                            Preview
                        </Button>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button onClick={onClose} disabled={loading} color="inherit">
                    Batal
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={loading || !name.trim()}
                    sx={{ fontWeight: 700, borderRadius: 2 }}
                >
                    {loading ? <CircularProgress size={18} color="inherit" /> : 'Simpan'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
