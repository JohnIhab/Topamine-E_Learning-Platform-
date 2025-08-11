import React, { createContext, useContext, useState } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import type { ReactNode } from 'react';
import type { PaletteMode } from '@mui/material';

interface ThemeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#2563EB',
            light: '#60A5FA',
            dark: '#1D4ED8',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#7C3AED',
            light: '#A78BFA',
            dark: '#5B21B6',
            contrastText: '#FFFFFF',
          },
          background: {
            default: '#F9FAFB',
            paper: '#FFFFFF',
          },
          text: {
            primary: '#111827',
            secondary: '#6B7280',
          },
          grey: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          },
        }
      : {
          primary: {
            main: '#60A5FA',
            light: '#93C5FD',
            dark: '#3B82F6',
            contrastText: '#1F2937',
          },
          secondary: {
            main: '#A78BFA',
            light: '#C4B5FD',
            dark: '#8B5CF6',
            contrastText: '#1F2937',
          },
          background: {
            default: '#0F172A',
            paper: '#1E293B',
          },
          text: {
            primary: '#f1f6f9ff',
            secondary: '#676c71ff',
          },
          grey: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          },
        }),
  },
  typography: {
    fontFamily: `'Tajawal', 'sans-serif'`,
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontWeight: 400,
    },
    body2: {
      fontWeight: 400,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none' as const,
    },
  },
  direction: 'rtl' as const,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: mode === 'dark' ? '#475569 #1E293B' : '#CBD5E1 #F1F5F9',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: mode === 'dark' ? '#1E293B' : '#F1F5F9',
          },
          '&::-webkit-scrollbar-thumb': {
            background: mode === 'dark' ? '#475569' : '#CBD5E1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: mode === 'dark' ? '#64748B' : '#94A3B8',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontFamily: 'Tajawal, sans-serif',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: mode === 'dark' 
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('themeMode') as PaletteMode;
    return savedMode || 'light';
  });

  const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const theme = React.useMemo(
    () => createTheme(getDesignTokens(mode)),
    [mode]
  );

  const isDarkMode = mode === 'dark';

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode, isDarkMode }}>
      <MUIThemeProvider theme={theme}>
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
