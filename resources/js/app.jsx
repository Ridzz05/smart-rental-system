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

  // Custom MUI Theme
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#6366f1' : '#818cf8', // Indigo
      },
      secondary: {
        main: '#f59e0b', // Amber
      },
      background: {
        default: mode === 'light' ? '#f8fafc' : '#09090b',
        paper: mode === 'light' ? '#ffffff' : '#18181b',
      },
      text: {
        primary: mode === 'light' ? '#0f172a' : '#f4f4f5',
        secondary: mode === 'light' ? '#475569' : '#a1a1aa',
      },
      divider: mode === 'light' ? '#e2e8f0' : '#27272a',
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontFamily: 'Outfit, sans-serif', fontWeight: 700 },
      h2: { fontFamily: 'Outfit, sans-serif', fontWeight: 700 },
      h3: { fontFamily: 'Outfit, sans-serif', fontWeight: 600 },
      h4: { fontFamily: 'Outfit, sans-serif', fontWeight: 600 },
      h5: { fontFamily: 'Outfit, sans-serif', fontWeight: 600 },
      h6: { fontFamily: 'Outfit, sans-serif', fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light' 
              ? '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)' 
              : 'none',
            border: `1px solid ${mode === 'light' ? '#f1f5f9' : '#27272a'}`,
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
