import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useLanguage } from '../i18n/i18n';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'; // Rental Desk
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'; // Rentals
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'; // Fleet
import PeopleIcon from '@mui/icons-material/People'; // Customers
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave'; // Logo

const drawerWidth = 260;

export default function Layout({ children, currentPage, setCurrentPage, mode, toggleColorMode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = mode === 'dark';

  const { t, language, toggleLanguage } = useLanguage();

  const menuItems = [
    { text: t('menu.dashboard'), short: language === 'eng' ? 'Home' : 'Dasbor', id: 'dashboard', icon: <DashboardIcon /> },
    { text: t('menu.rental_desk'), short: language === 'eng' ? 'Desk' : 'Meja', id: 'rental-desk', icon: <AppRegistrationIcon /> },
    { text: t('menu.rentals'), short: language === 'eng' ? 'Logs' : 'Log', id: 'rentals', icon: <ReceiptLongIcon /> },
    { text: t('menu.fleet'), short: language === 'eng' ? 'Fleet' : 'Armada', id: 'fleet', icon: <DirectionsCarIcon /> },
    { text: t('menu.customers'), short: language === 'eng' ? 'Customers' : 'Pelanggan', id: 'customers', icon: <PeopleIcon /> },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Brand Logo Header */}
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1.5,
        background: isDark ? '#141414' : '#FFFFFF',
        borderBottom: `1px solid ${isDark ? '#2A2A2A' : '#E5E5E5'}`,
        color: isDark ? '#F5F5F5' : '#0A0A0A',
      }}>
        <TimeToLeaveIcon sx={{ fontSize: 28 }} />
        <Box>
          <Typography variant="h6" sx={{ fontFamily: '"Google Sans", sans-serif', fontWeight: 800, lineHeight: 1.2 }}>
            Smart Rental
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem', fontWeight: 500, letterSpacing: 0.5 }}>
            MANAGEMENT SYSTEM
          </Typography>
        </Box>
      </Box>
      <Divider />

      {/* Nav List */}
      <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const active = currentPage === item.id;
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  setCurrentPage(item.id);
                }}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  backgroundColor: active ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)') : 'transparent',
                  color: active ? (isDark ? '#FFFFFF' : '#0A0A0A') : theme.palette.text.secondary,
                  fontWeight: active ? 700 : 400,
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    color: isDark ? '#FFFFFF' : '#0A0A0A',
                  },
                  transition: 'all 0.15s ease',
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40, 
                  color: active ? (isDark ? '#FFFFFF' : '#0A0A0A') : theme.palette.text.secondary,
                  transition: 'all 0.15s ease',
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: '0.925rem', 
                    fontWeight: active ? 700 : 500,
                  }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />

      {/* Sidebar Footer / User Info */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar 
          alt="Staff Admin" 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
          sx={{ width: 40, height: 40, border: `2px solid ${theme.palette.primary.main}` }}
        />
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
            Alice Johnson
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
            Rental Officer
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top Navbar Header */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" noWrap component="div" sx={{ fontFamily: '"Google Sans", sans-serif', fontWeight: 700, fontSize: '1.25rem' }}>
              {menuItems.find(item => item.id === currentPage)?.text || 'Smart Rental'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton onClick={toggleLanguage} color="inherit" sx={{ p: 0.5 }}>
              {language === 'eng' ? (
                <svg width={20} height={20} viewBox="0 0 20 20" fill="none" style={{ borderRadius: '50%', overflow: 'hidden' }}>
                  <path
                      d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
                      fill="#F0F0F0"
                  />
                  <path
                      d="M2.06645 3.91174C1.28094 4.93374 0.688633 6.11167 0.34375 7.39131H5.54602L2.06645 3.91174Z"
                      fill="#0052B4"
                  />
                  <path d="M19.6553 7.3914C19.3104 6.11179 18.7181 4.93386 17.9326 3.91187L14.4531 7.3914H19.6553Z" fill="#0052B4" />
                  <path
                      d="M0.34375 12.6088C0.688672 13.8884 1.28098 15.0663 2.06645 16.0883L5.5459 12.6088H0.34375Z"
                      fill="#0052B4"
                  />
                  <path
                      d="M16.0889 2.06722C15.0669 1.28171 13.889 0.689404 12.6094 0.344482V5.54671L16.0889 2.06722Z"
                      fill="#0052B4"
                  />
                  <path d="M3.91211 17.9328C4.9341 18.7183 6.11203 19.3106 7.39164 19.6556V14.4534L3.91211 17.9328Z" fill="#0052B4" />
                  <path
                      d="M7.3916 0.344482C6.11199 0.689404 4.93406 1.28171 3.91211 2.06718L7.3916 5.54667V0.344482Z"
                      fill="#0052B4"
                  />
                  <path d="M12.6094 19.6556C13.889 19.3106 15.0669 18.7183 16.0889 17.9329L12.6094 14.4534V19.6556Z" fill="#0052B4" />
                  <path
                      d="M14.4531 12.6088L17.9326 16.0883C18.7181 15.0663 19.3104 13.8884 19.6553 12.6088H14.4531Z"
                      fill="#0052B4"
                  />
                  <path
                      d="M19.9154 8.69566H11.3044H11.3044V0.0846484C10.8774 0.0290625 10.4421 0 10 0C9.55785 0 9.12262 0.0290625 8.69566 0.0846484V8.69559V8.69563H0.0846484C0.0290625 9.12262 0 9.55793 0 10C0 10.4421 0.0290625 10.8774 0.0846484 11.3043H8.69559H8.69563V19.9154C9.12262 19.9709 9.55785 20 10 20C10.4421 20 10.8774 19.971 11.3043 19.9154V11.3044V11.3044H19.9154C19.9709 10.8774 20 10.4421 20 10C20 9.55793 19.9709 9.12262 19.9154 8.69566Z"
                      fill="#D80027"
                  />
                  <path
                      d="M12.6094 12.6088L17.0717 17.0711C17.277 16.866 17.4727 16.6515 17.6595 16.4292L13.8391 12.6088H12.6094V12.6088Z"
                      fill="#D80027"
                  />
                  <path
                      d="M7.39207 12.6088H7.39199L2.92969 17.0711C3.13484 17.2763 3.34934 17.4721 3.57168 17.6589L7.39207 13.8384V12.6088Z"
                      fill="#D80027"
                  />
                  <path
                      d="M7.39195 7.39142V7.39134L2.92961 2.92896C2.72438 3.13411 2.52859 3.3486 2.3418 3.57095L6.16223 7.39138L7.39195 7.39142Z"
                      fill="#D80027"
                  />
                  <path
                      d="M12.6094 7.39138L17.0718 2.92896C16.8666 2.72373 16.6521 2.52794 16.4298 2.34119L12.6094 6.16162V7.39138Z"
                      fill="#D80027"
                  />
                </svg>
              ) : (
                <svg width={20} height={20} viewBox="0 0 20 20" fill="none" style={{ borderRadius: '50%', overflow: 'hidden' }}>
                  <path
                      d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
                      fill="#F0F0F0"
                  />
                  <path d="M0 10C0 4.47719 4.47719 0 10 0C15.5228 0 20 4.47719 20 10" fill="#A2001D" />
                </svg>
              )}
            </IconButton>
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Typography variant="body2" sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
              Alice Johnson
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawers */}
      <Box
        component="nav"
        sx={{ 
          width: { md: drawerWidth }, 
          flexShrink: { md: 0 },
          display: { xs: 'none', md: 'block' } 
        }}
        aria-label="mailbox folders"
      >
        {/* Desktop View Permanent Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: `1px solid ${theme.palette.divider}` },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Rounded Bottom Navbar for Mobile View */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 16,
          left: 16,
          right: 16,
          height: 64,
          backgroundColor: isDark ? 'rgba(10, 10, 10, 0.92)' : 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '24px',
          boxShadow: isDark
            ? '0 10px 30px -10px rgba(245, 197, 24, 0.15), 0 1px 3px rgba(0, 0, 0, 0.5)'
            : '0 10px 30px -10px rgba(245, 197, 24, 0.2), 0 2px 8px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${theme.palette.divider}`,
          zIndex: theme.zIndex.appBar,
          justifyContent: 'space-around',
          alignItems: 'center',
          px: 1,
        }}
      >
        {menuItems.map((item) => {
          const active = currentPage === item.id;
          return (
            <Box
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flex: 1,
                py: 0.5,
                borderRadius: '16px',
                color: active ? theme.palette.primary.main : theme.palette.text.secondary,
                transition: 'all 0.2s ease',
                position: 'relative',
                '&:active': {
                  transform: 'scale(0.95)',
                }
              }}
            >
              {active && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 4,
                    bottom: 4,
                    left: 6,
                    right: 6,
                    backgroundColor: 'rgba(245, 197, 24, 0.15)',
                    borderRadius: '12px',
                    zIndex: -1,
                  }}
                />
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25 }}>
                {item.icon}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.65rem',
                  fontWeight: active ? 700 : 500,
                  letterSpacing: 0.2,
                  textAlign: 'center',
                  lineHeight: 1
                }}
              >
                {item.short}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Main Main Content Container */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          pb: { xs: '96px', sm: '96px', md: 4 },
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          maxWidth: '100%',
          mt: '64px', // Space for AppBar
          backgroundColor: theme.palette.background.default,
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
