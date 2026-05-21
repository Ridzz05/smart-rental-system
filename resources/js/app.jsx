import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import RentalDesk from './pages/RentalDesk';
import Fleet from './pages/Fleet';
import Customers from './pages/Customers';
import Rentals from './pages/Rentals';
import { LanguageProvider } from './i18n/i18n';

function App() {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('theme-mode') || 'light';
  });

  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // ─── Minimalist Black × White Theme ────────────────────────────────────────
  const isDark = mode === 'dark';

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main:         isDark ? '#FFFFFF' : '#0A0A0A',
        light:        isDark ? '#E5E5E5' : '#333333',
        dark:         isDark ? '#CCCCCC' : '#000000',
        contrastText: isDark ? '#0A0A0A' : '#FFFFFF',
      },
      secondary: {
        main:         isDark ? '#A3A3A3' : '#525252',
        contrastText: isDark ? '#0A0A0A' : '#FFFFFF',
      },
      background: {
        default: isDark ? '#0D0D0D' : '#F2F2F0',  // near-black / warm light gray
        paper:   isDark ? '#1A1A1A' : '#FFFFFF',   // slightly lifted surface
      },
      text: {
        primary:   isDark ? '#F5F5F5' : '#0A0A0A',
        secondary: isDark ? '#737373' : '#737373',
        disabled:  isDark ? '#404040' : '#BDBDBD',
      },
      divider: isDark ? '#2A2A2A' : '#E5E5E5',
      action: {
        hover:    isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
        selected: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
      },
      error:   { main: '#EF4444' },
      warning: { main: '#F59E0B' },
      success: { main: '#22C55E' },
      info:    { main: '#3B82F6' },
    },
    typography: {
      fontFamily: '"Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontFamily: '"Google Sans", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
      h2: { fontFamily: '"Google Sans", sans-serif', fontWeight: 700, letterSpacing: '-0.01em' },
      h3: { fontFamily: '"Google Sans", sans-serif', fontWeight: 600, letterSpacing: '-0.01em' },
      h4: { fontFamily: '"Google Sans", sans-serif', fontWeight: 600, letterSpacing: '-0.01em' },
      h5: { fontFamily: '"Google Sans", sans-serif', fontWeight: 600 },
      h6: { fontFamily: '"Google Sans", sans-serif', fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      body1: { lineHeight: 1.65 },
      button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
    },
    shape: { borderRadius: 14 },
    shadows: [
      'none',
      // Elevation 1 – subtle card
      isDark
        ? '0 1px 2px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)'
        : '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
      // Elevation 2 – normal card
      isDark
        ? '0 4px 12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)'
        : '0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
      // Elevation 3 – dashboard stat card (pop)
      isDark
        ? '0 8px 24px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07)'
        : '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
      // Elevation 4 – hover
      isDark
        ? '0 16px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)'
        : '0 16px 48px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)',
      ...Array(20).fill('none'),
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            scrollbarColor: isDark ? '#2A2A2A transparent' : '#D1D1D1 transparent',
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 10,
            fontWeight: 600,
            '&:hover': { boxShadow: 'none' },
          },
          containedPrimary: {
            background: isDark ? '#FFFFFF' : '#0A0A0A',
            color:      isDark ? '#0A0A0A' : '#FFFFFF',
            '&:hover': {
              background: isDark ? '#E5E5E5' : '#262626',
            },
          },
          outlinedPrimary: {
            borderColor: isDark ? '#3A3A3A' : '#D1D1D1',
            color:       isDark ? '#FFFFFF'  : '#0A0A0A',
            '&:hover': {
              borderColor: isDark ? '#FFFFFF' : '#0A0A0A',
              background:  isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            },
          },
          textPrimary: {
            color: isDark ? '#FFFFFF' : '#0A0A0A',
            '&:hover': { background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' },
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 2 },
        styleOverrides: {
          root: {
            background: isDark ? '#1A1A1A' : '#FFFFFF',
            border: `1px solid ${isDark ? '#2A2A2A' : '#F0F0F0'}`,
            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            background:   isDark ? 'rgba(13,13,13,0.92)' : 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: `1px solid ${isDark ? '#2A2A2A' : '#E5E5E5'}`,
            color: isDark ? '#F5F5F5' : '#0A0A0A',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background:  isDark ? '#141414' : '#FFFFFF',
            borderRight: `1px solid ${isDark ? '#2A2A2A' : '#E5E5E5'}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          elevation1: {
            boxShadow: isDark
              ? '0 1px 2px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)'
              : '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
          },
          elevation2: {
            boxShadow: isDark
              ? '0 4px 12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)'
              : '0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            background: isDark ? '#1A1A1A' : '#FFFFFF',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              background:    isDark ? '#141414' : '#FAFAFA',
              color:         isDark ? '#737373' : '#737373',
              fontWeight:    700,
              fontSize:      '0.72rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              borderBottom:  `1px solid ${isDark ? '#2A2A2A' : '#E5E5E5'}`,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${isDark ? '#212121' : '#F0F0F0'}`,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            },
            '&:last-child td': { border: 0 },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              background: isDark ? '#141414' : '#FAFAFA',
              '& fieldset': { borderColor: isDark ? '#2A2A2A' : '#E0E0E0' },
              '&:hover fieldset': { borderColor: isDark ? '#505050' : '#A0A0A0' },
              '&.Mui-focused fieldset': { borderColor: isDark ? '#FFFFFF' : '#0A0A0A', borderWidth: 1.5 },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: isDark ? '#FFFFFF' : '#0A0A0A',
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            background: isDark ? '#141414' : '#FAFAFA',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            '&:hover': { background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' },
            '&.Mui-selected': {
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              '&:hover':  { background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, letterSpacing: '0.01em' },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: isDark ? '#2A2A2A' : '#E5E5E5' },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color:      isDark ? '#A3A3A3' : '#525252',
            '&:hover': { background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', color: isDark ? '#FFFFFF' : '#0A0A0A' },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&:hover': { background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            background: isDark ? '#1A1A1A' : '#FFFFFF',
            boxShadow: isDark
              ? '0 24px 64px rgba(0,0,0,0.8)'
              : '0 24px 64px rgba(0,0,0,0.15)',
          },
        },
      },
    },
  }), [mode]);

  // Render Page Component dynamically (keeps sidebar state and enables persistent-like cashier flow)
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case 'rental-desk':
        return <RentalDesk />;
      case 'fleet':
        return <Fleet />;
      case 'customers':
        return <Customers />;
      case 'rentals':
        return <Rentals />;
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          mode={mode} 
          toggleColorMode={toggleColorMode}
        >
          {renderPage()}
        </Layout>
      </ThemeProvider>
    </LanguageProvider>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
