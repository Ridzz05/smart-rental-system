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

  const menuItems = [
    { text: 'Dashboard', short: 'Home', id: 'dashboard', icon: <DashboardIcon /> },
    { text: 'Rental Desk', short: 'Desk', id: 'rental-desk', icon: <AppRegistrationIcon /> },
    { text: 'Rentals Logs', short: 'Logs', id: 'rentals', icon: <ReceiptLongIcon /> },
    { text: 'Fleet Manager', short: 'Fleet', id: 'fleet', icon: <DirectionsCarIcon /> },
    { text: 'Customer Base', short: 'Customers', id: 'customers', icon: <PeopleIcon /> },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Brand Logo Header */}
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1.5,
        background: theme.palette.mode === 'light' 
          ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' 
          : 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        color: '#ffffff'
      }}>
        <TimeToLeaveIcon sx={{ fontSize: 28 }} />
        <Box>
          <Typography variant="h6" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, lineHeight: 1.2 }}>
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
                  backgroundColor: active 
                    ? (theme.palette.mode === 'light' ? '#eef2ff' : '#27272a') 
                    : 'transparent',
                  color: active 
                    ? theme.palette.primary.main 
                    : theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light' ? '#f1f5f9' : '#1f1f22',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40, 
                  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
                  transition: 'all 0.2s ease',
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
          boxShadow: 'none',
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" noWrap component="div" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem' }}>
              {menuItems.find(item => item.id === currentPage)?.text || 'Smart Rental'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
        sx={{ width: { md: drawerWidth }, shrink: { md: 0 } }}
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
          backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(24, 24, 27, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '24px',
          boxShadow: theme.palette.mode === 'light'
            ? '0 10px 30px -10px rgba(79, 70, 229, 0.15), 0 1px 3px rgba(0, 0, 0, 0.05)'
            : '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(255, 255, 255, 0.02)',
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
                    backgroundColor: theme.palette.mode === 'light' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(129, 140, 248, 0.1)',
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
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px', // Space for AppBar
          backgroundColor: theme.palette.background.default,
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
