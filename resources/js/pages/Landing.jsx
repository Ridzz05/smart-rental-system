import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Icons
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SecurityIcon from '@mui/icons-material/Security';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import PaidIcon from '@mui/icons-material/Paid';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LanguageIcon from '@mui/icons-material/Language';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useLanguage } from '../i18n/i18n';
import { useAuth } from '../auth/AuthContext';

export default function Landing({ onGoLogin, onGoRegister, setCurrentPage, mode, toggleColorMode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = mode === 'dark';
  const { t, language, toggleLanguage } = useLanguage();
  const { user } = useAuth();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch Fleet Data
  useEffect(() => {
    fetch('/api/vehicles')
      .then(res => res.json())
      .then(data => {
        setVehicles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading vehicles:', err);
        setLoading(false);
      });
  }, []);

  // Filter Categories
  const categories = ['All', ...new Set(vehicles.map(v => v.category?.name).filter(Boolean))];

  const filteredVehicles = vehicles.filter(v => {
    const matchesCategory = selectedCategory === 'All' || v.category?.name === selectedCategory;
    const matchesSearch = `${v.brand} ${v.model}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookNow = () => {
    if (user) {
      if (setCurrentPage) {
        setCurrentPage('rental-desk');
      }
    } else {
      onGoLogin();
    }
  };

  // Translations dictionary for Landing Page to avoid modifying translation.json directly
  const text = {
    eng: {
      tagline: 'Premium Fleet, Seamless Rental',
      titleHighlight: 'Berkendara Tanpa Batas,',
      titleRest: ' Sewa Tanpa Ribet',
      subtitle: 'Smart Rental offers the best selection of modern vehicles with simple booking, transparent rates, and premium service to elevate your journeys.',
      exploreBtn: 'Explore Fleet',
      startBtn: 'Get Started',
      featuresTitle: 'Why Choose Smart Rental?',
      featuresSubtitle: 'We deliver top-notch rental experience with advanced features and unparalleled comfort.',
      feature1Title: 'Pristine Maintenance',
      feature1Desc: 'All vehicles undergo rigorous safety and sanitation checks before every single booking.',
      feature2Title: 'Lightning Instant Booking',
      feature2Desc: 'Skip the line. Book in under 3 minutes with zero administrative hassle.',
      feature24Title: '24/7 Road Support',
      feature24Desc: 'Our dedicated support team and roadside assistance are always active for your peace of mind.',
      feature3Title: 'Best Daily Rates',
      feature3Desc: 'Premium fleet at highly competitive pricing with zero hidden insurance fees.',
      fleetTitle: 'Our Premium Fleet Catalog',
      fleetSubtitle: 'Browse our diverse fleet of SUVs, MPVs, City Cars, and Motorcycles ready for your next destination.',
      searchPlaceholder: 'Search vehicle...',
      daily: 'day',
      rentNow: 'Rent Now',
      available: 'Available',
      rented: 'Rented',
      maintenance: 'Maintenance',
      testimonialsTitle: 'Loved by Thousands of Drivers',
      testimonialsSubtitle: 'Here is what our valuable clients say about their driving experience with us.',
      footerDesc: 'Smart Rental is a state-of-the-art vehicle management and booking system designed for ultimate convenience and modern mobility.',
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      rights: 'All rights reserved.',
      viewDashboard: 'Go to Dashboard',
      login: 'Sign In',
      register: 'Register'
    },
    id: {
      tagline: 'Armada Premium, Sewa Instan',
      titleHighlight: 'Berkendara Tanpa Batas,',
      titleRest: ' Sewa Tanpa Ribet',
      subtitle: 'Smart Rental menawarkan pilihan kendaraan modern terbaik dengan proses pemesanan mudah, tarif transparan, dan layanan premium untuk setiap perjalanan Anda.',
      exploreBtn: 'Lihat Armada',
      startBtn: 'Mulai Sekarang',
      featuresTitle: 'Mengapa Memilih Smart Rental?',
      featuresSubtitle: 'Kami memberikan pengalaman sewa terbaik dengan fitur canggih dan kenyamanan tanpa kompromi.',
      feature1Title: 'Perawatan Berkala Prima',
      feature1Desc: 'Semua kendaraan menjalani pemeriksaan keamanan dan kebersihan ketat sebelum disewakan.',
      feature2Title: 'Pemesanan Kilat Instan',
      feature2Desc: 'Tanpa antre. Pesan kendaraan dalam waktu kurang dari 3 menit tanpa syarat berbelit.',
      feature24Title: 'Dukungan Jalan 24/7',
      feature24Desc: 'Tim support kami dan bantuan darurat di jalan selalu siaga menemani perjalanan Anda.',
      feature3Title: 'Tarif Sewa Terbaik',
      feature3Desc: 'Kendaraan premium dengan harga bersaing tanpa ada tambahan biaya tersembunyi.',
      fleetTitle: 'Katalog Armada Premium',
      fleetSubtitle: 'Temukan berbagai pilihan SUV, MPV, City Car, dan Motor yang siap menemani rute perjalanan Anda.',
      searchPlaceholder: 'Cari kendaraan...',
      daily: 'hari',
      rentNow: 'Sewa Sekarang',
      available: 'Tersedia',
      rented: 'Sedang Sewa',
      maintenance: 'Perawatan',
      testimonialsTitle: 'Dicintai oleh Ribuan Pengemudi',
      testimonialsSubtitle: 'Apa kata pelanggan setia kami tentang kenyamanan berkendara bersama Smart Rental.',
      footerDesc: 'Smart Rental adalah sistem manajemen dan pemesanan kendaraan modern yang dirancang untuk kenyamanan maksimal dan mobilitas masa kini.',
      quickLinks: 'Tautan Cepat',
      contactUs: 'Hubungi Kami',
      rights: 'Hak cipta dilindungi undang-undang.',
      viewDashboard: 'Ke Dasbor',
      login: 'Masuk',
      register: 'Daftar'
    }
  };

  const activeText = text[language] || text.eng;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'background.default', overflowX: 'hidden' }}>
      
      {/* ─── NAVBAR ──────────────────────────────────────────────────────────── */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          width: '100%',
          backgroundColor: isDark ? 'rgba(13, 13, 13, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          transition: 'background-color 0.3s ease',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ height: { xs: 60, md: 72 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, cursor: 'pointer' }} onClick={() => scrollToSection('hero')}>
              <TimeToLeaveIcon sx={{ color: 'primary.main', fontSize: { xs: 26, md: 30 } }} />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Google Sans", sans-serif',
                  fontWeight: 850,
                  fontSize: { xs: '1.1rem', md: '1.4rem' },
                  letterSpacing: '-0.02em',
                  color: 'text.primary',
                }}
              >
                Smart Rental
              </Typography>
            </Box>

            {/* Desktop Navigation Links */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 4 }}>
                {['features', 'fleet', 'testimonials'].map((sec) => (
                  <Typography
                    key={sec}
                    variant="body2"
                    onClick={() => scrollToSection(sec)}
                    sx={{
                      cursor: 'pointer',
                      fontWeight: 600,
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main' },
                      transition: 'color 0.2s ease',
                      textTransform: 'capitalize'
                    }}
                  >
                    {sec === 'features' ? (language === 'eng' ? 'Features' : 'Fitur') : 
                     sec === 'fleet' ? (language === 'eng' ? 'Fleet' : 'Armada') : 
                     (language === 'eng' ? 'Testimonials' : 'Testimoni')}
                  </Typography>
                ))}
              </Box>
            )}

            {/* Right Buttons: Theme, Language, Auth CTA */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1.5 } }}>
              {/* Language Toggle */}
              <IconButton onClick={toggleLanguage} size="small" color="inherit">
                <LanguageIcon fontSize="small" />
                <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 700, display: { xs: 'none', sm: 'inline' } }}>
                  {language.toUpperCase()}
                </Typography>
              </IconButton>

              {/* Theme Toggle */}
              <IconButton onClick={toggleColorMode} size="small" color="inherit">
                {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </IconButton>

              {/* CTA Action */}
              {user ? (
                <Button
                  variant="contained"
                  size={isMobile ? 'small' : 'medium'}
                  onClick={() => setCurrentPage ? setCurrentPage('dashboard') : handleBookNow()}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                    px: { xs: 1.5, md: 3 },
                    py: { xs: 0.6, md: 1 }
                  }}
                >
                  {activeText.viewDashboard}
                </Button>
              ) : (
                <>
                  <Button
                    variant="text"
                    size={isMobile ? 'small' : 'medium'}
                    onClick={onGoLogin}
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary',
                      display: { xs: 'none', sm: 'inline-flex' }
                    }}
                  >
                    {activeText.login}
                  </Button>
                  <Button
                    variant="contained"
                    size={isMobile ? 'small' : 'medium'}
                    onClick={onGoRegister}
                    sx={{
                      borderRadius: 2.5,
                      fontWeight: 700,
                      px: { xs: 1.8, md: 3 },
                      py: { xs: 0.7, md: 1 }
                    }}
                  >
                    {activeText.register}
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ─── HERO SECTION ────────────────────────────────────────────────────── */}
      <Box
        id="hero"
        sx={{
          position: 'relative',
          py: { xs: 10, md: 16 },
          overflow: 'hidden',
          background: isDark
            ? 'radial-gradient(ellipse at 50% 10%, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 70%)'
            : 'radial-gradient(ellipse at 50% 10%, rgba(10,10,10,0.02) 0%, rgba(0,0,0,0) 70%)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.6, borderRadius: 5, border: `1px solid ${theme.palette.divider}`, mb: 3 }}>
                <Chip label={activeText.tagline} size="small" variant="outlined" sx={{ border: 'none', fontWeight: 700, height: 22, '& .MuiChip-label': { p: 0 } }} />
              </Box>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  mb: 2.5,
                  color: 'text.primary',
                }}
              >
                <Box component="span" sx={{
                  background: isDark ? 'linear-gradient(90deg, #FFFFFF 0%, #A3A3A3 100%)' : 'linear-gradient(90deg, #0A0A0A 0%, #525252 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {activeText.titleHighlight}
                </Box>
                {activeText.titleRest}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '1rem', md: '1.15rem' },
                  mb: 4.5,
                  maxWidth: 540,
                  fontWeight: 500,
                  lineHeight: 1.6
                }}
              >
                {activeText.subtitle}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => scrollToSection('fleet')}
                  sx={{
                    borderRadius: 3,
                    fontWeight: 700,
                    px: 4,
                    py: 1.6,
                    fontSize: '1rem',
                  }}
                >
                  {activeText.exploreBtn}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleBookNow}
                  sx={{
                    borderRadius: 3,
                    fontWeight: 700,
                    px: 4,
                    py: 1.6,
                    fontSize: '1rem',
                  }}
                >
                  {activeText.startBtn}
                </Button>
              </Box>
            </Grid>

            {/* Interactive Hero Image Banner */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '80%',
                    height: '80%',
                    borderRadius: '50%',
                    background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0,0,0,0.015)',
                    filter: 'blur(60px)',
                    zIndex: -1,
                  }
                }}
              >
                <Card
                  sx={{
                    width: '100%',
                    maxWidth: 520,
                    borderRadius: 6,
                    boxShadow: isDark ? '0 30px 60px rgba(0,0,0,0.6)' : '0 30px 60px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                    transition: 'transform 0.4s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="320"
                    image="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800"
                    alt="Premium Vehicle Portfolio"
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 3, background: isDark ? '#141414' : '#FAFAFA' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Porsche Taycan EV</Typography>
                        <Typography variant="caption" color="text.secondary">ELECTRIC SEDAN</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'success.main' }}>Rp 3.500.000</Typography>
                        <Typography variant="caption" color="text.secondary">/ {activeText.daily}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── FEATURES SECTION ────────────────────────────────────────────────── */}
      <Box
        id="features"
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: isDark ? '#080808' : '#FAF9F6',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 800, mb: 2 }}>
              {activeText.featuresTitle}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', fontWeight: 500 }}>
              {activeText.featuresSubtitle}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                icon: <SecurityIcon fontSize="large" sx={{ color: isDark ? '#FFF' : '#0A0A0A' }} />,
                title: activeText.feature1Title,
                desc: activeText.feature1Desc
              },
              {
                icon: <FlashOnIcon fontSize="large" sx={{ color: isDark ? '#FFF' : '#0A0A0A' }} />,
                title: activeText.feature2Title,
                desc: activeText.feature2Desc
              },
              {
                icon: <DirectionsCarIcon fontSize="large" sx={{ color: isDark ? '#FFF' : '#0A0A0A' }} />,
                title: activeText.feature24Title,
                desc: activeText.feature24Desc
              },
              {
                icon: <PaidIcon fontSize="large" sx={{ color: isDark ? '#FFF' : '#0A0A0A' }} />,
                title: activeText.feature3Title,
                desc: activeText.feature3Desc
              }
            ].map((feature, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card
                  sx={{
                    height: '100%',
                    p: 2,
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    background: isDark ? '#141414' : '#FFFFFF',
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: 'primary.main',
                      boxShadow: isDark ? '0 12px 30px rgba(255,255,255,0.02)' : '0 12px 30px rgba(0,0,0,0.04)',
                    }
                  }}
                >
                  <Box sx={{ p: 1.5, borderRadius: 3, backgroundColor: isDark ? '#1F1F1F' : '#F5F5F3', mb: 2.5 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, fontSize: '1.05rem' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {feature.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── FLEET SECTION ───────────────────────────────────────────────────── */}
      <Box id="fleet" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 800, mb: 2 }}>
              {activeText.fleetTitle}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', mb: 4, fontWeight: 500 }}>
              {activeText.fleetSubtitle}
            </Typography>

            {/* Filter Search */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center', alignItems: 'center', maxWidth: 700, mx: 'auto', mb: 4 }}>
              <TextField
                placeholder={activeText.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3, background: isDark ? '#141414' : '#FFF' }
                }}
              />
            </Box>

            {/* Category Tabs */}
            {categories.length > 1 && (
              <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Tabs
                  value={selectedCategory}
                  onChange={(e, val) => setSelectedCategory(val)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    '& .MuiTabs-indicator': { backgroundColor: 'primary.main', height: 3 },
                    '& .MuiTab-root': { fontWeight: 700, px: 3, textTransform: 'uppercase', letterSpacing: 0.5 }
                  }}
                >
                  {categories.map((cat) => (
                    <Tab key={cat} label={cat === 'All' ? (language === 'eng' ? 'All Vehicles' : 'Semua') : cat} value={cat} />
                  ))}
                </Tabs>
              </Box>
            )}
          </Box>

          {/* Loader or Vehicle Cards Grid */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredVehicles.map((vehicle) => {
                const isAvail = vehicle.status === 'Available';
                const statusLabel = 
                  vehicle.status === 'Available' ? activeText.available : 
                  vehicle.status === 'Rented' ? activeText.rented : activeText.maintenance;
                
                let badgeColor = 'error';
                if (isAvail) badgeColor = 'success';
                else if (vehicle.status === 'Rented') badgeColor = 'warning';

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={vehicle.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 4.5,
                        overflow: 'hidden',
                        boxShadow: 'none',
                        border: `1px solid ${theme.palette.divider}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: isDark ? '0 15px 30px rgba(0,0,0,0.6)' : '0 15px 30px rgba(0,0,0,0.06)',
                          borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="180"
                          image={vehicle.image_url || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600'}
                          alt={vehicle.model}
                          sx={{ transition: 'transform 0.5s ease', '&:hover': { transform: 'scale(1.05)' } }}
                        />
                        <Chip
                          label={statusLabel}
                          size="small"
                          color={badgeColor}
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            fontWeight: 800,
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            backdropFilter: 'blur(8px)',
                            background: isAvail ? 'rgba(34,197,94,0.9)' : undefined
                          }}
                        />
                      </Box>

                      <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          {vehicle.category?.name || 'VEHICLE'}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, mt: 0.5, lineHeight: 1.2 }}>
                          {vehicle.brand} {vehicle.model}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, fontWeight: 600 }}>
                          No: {vehicle.license_plate}
                        </Typography>

                        <Box sx={{ mt: 'auto' }}>
                          <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main' }}>
                              Rp {Number(vehicle.daily_rate).toLocaleString('id-ID')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5, fontWeight: 700 }}>
                              / {activeText.daily}
                            </Typography>
                          </Box>

                          <Button
                            variant={isAvail ? 'contained' : 'outlined'}
                            fullWidth
                            disabled={!isAvail}
                            onClick={handleBookNow}
                            endIcon={<KeyboardArrowRightIcon />}
                            sx={{
                              borderRadius: 2.5,
                              fontWeight: 700,
                              py: 1,
                              textTransform: 'none'
                            }}
                          >
                            {activeText.rentNow}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </Box>

      {/* ─── TESTIMONIALS SECTION ────────────────────────────────────────────── */}
      <Box
        id="testimonials"
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: isDark ? '#080808' : '#FAF9F6',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 800, mb: 2 }}>
              {activeText.testimonialsTitle}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', fontWeight: 500 }}>
              {activeText.testimonialsSubtitle}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                name: 'Rian Hidayat',
                role: 'Wirausaha',
                quote: language === 'eng' 
                  ? 'Excellent interface, exceptionally maintained cars. Booking Innova Zenix was quick and the vehicle was pristine.'
                  : 'Layanan luar biasa, mobil sangat bersih dan terawat. Pemesanan Innova Zenix sangat cepat dan mobil dalam kondisi prima.',
                avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
              },
              {
                name: 'Dewi Lestari',
                role: 'Karyawan Swasta',
                quote: language === 'eng'
                  ? 'Highly recommended. Rental desk made pickup so simple. Toggling languages is seamless.'
                  : 'Sangat direkomendasikan. Pengambilan mobil di meja penyewaan sangat praktis. Sistem bahasanya juga sangat lancar.',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
              },
              {
                name: 'Budi Santoso',
                role: 'Pecinta Motor',
                quote: language === 'eng'
                  ? 'NMAX ride was phenomenal. Cheap daily rate, transparent, and direct service. Will book again!'
                  : 'Pengalaman berkendara NMAX sangat memuaskan. Tarif harian murah, transparan, dan pelayanan langsung. Pasti sewa lagi!',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
              }
            ].map((item, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    borderRadius: 4.5,
                    background: isDark ? '#141414' : '#FFFFFF',
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} fontSize="small" sx={{ color: 'warning.main' }} />
                      ))}
                    </Box>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', lineHeight: 1.7, color: 'text.secondary', mb: 3 }}>
                      "{item.quote}"
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar alt={item.name} src={item.avatar} sx={{ width: 44, height: 44 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.role}</Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── FOOTER SECTION ──────────────────────────────────────────────────── */}
      <Box
        component="footer"
        sx={{
          py: 6,
          mt: 'auto',
          backgroundColor: isDark ? '#0A0A0A' : '#FAFAFA',
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TimeToLeaveIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontFamily: '"Google Sans", sans-serif', fontWeight: 850 }}>
                  Smart Rental
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, lineHeight: 1.6, mb: 2 }}>
                {activeText.footerDesc}
              </Typography>
            </Grid>

            <Grid item xs={6} md={3}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>
                {activeText.quickLinks}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {['features', 'fleet', 'testimonials'].map((sec) => (
                  <Typography
                    key={sec}
                    variant="caption"
                    onClick={() => scrollToSection(sec)}
                    sx={{
                      cursor: 'pointer',
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main' },
                      transition: 'color 0.2s ease',
                      textTransform: 'capitalize',
                      fontWeight: 600
                    }}
                  >
                    {sec === 'features' ? (language === 'eng' ? 'Features' : 'Fitur') : 
                     sec === 'fleet' ? (language === 'eng' ? 'Fleet' : 'Armada') : 
                     (language === 'eng' ? 'Testimonials' : 'Testimoni')}
                  </Typography>
                ))}
              </Box>
            </Grid>

            <Grid item xs={6} md={3}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>
                {activeText.contactUs}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                Email: support@smartrental.com
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                Phone: +62 812-3456-7890
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                Address: Palembang, Sumatera Selatan, Indonesia
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              &copy; {new Date().getFullYear()} Smart Rental. {activeText.rights}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Made with Google Sans &amp; Material UI
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
