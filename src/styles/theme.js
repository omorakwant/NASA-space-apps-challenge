/**
 * Material-UI Dark Space Theme
 * Professional dark theme with space-inspired colors and styling
 */

import { createTheme } from '@mui/material/styles';

const spaceColors = {
  // Primary dark backgrounds
  darkPrimary: '#0a0a0a',
  darkSecondary: '#1a1a2e',
  darkTertiary: '#16213e',
  
  // Accent colors
  neonGreen: '#00ff88',
  spaceBlue: '#4fc3f7',
  warningOrange: '#ff6b35',
  errorRed: '#ff3333',
  
  // UI colors
  surfaceLight: '#2a2a3e',
  surfaceDark: '#1e1e2e',
  textPrimary: '#ffffff',
  textSecondary: '#b0bec5',
  textDisabled: '#616161',
  
  // Status colors
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3'
};

export const darkSpaceTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: spaceColors.neonGreen,
      light: '#4dffaa',
      dark: '#00cc6a',
      contrastText: spaceColors.darkPrimary,
    },
    secondary: {
      main: spaceColors.spaceBlue,
      light: '#7fd4f7',
      dark: '#3ba2c4',
      contrastText: spaceColors.darkPrimary,
    },
    error: {
      main: spaceColors.errorRed,
      light: '#ff6666',
      dark: '#cc0000',
    },
    warning: {
      main: spaceColors.warningOrange,
      light: '#ff9668',
      dark: '#cc4400',
    },
    success: {
      main: spaceColors.success,
      light: '#6fbf73',
      dark: '#357a38',
    },
    info: {
      main: spaceColors.info,
      light: '#4fc3f7',
      dark: '#1976d2',
    },
    background: {
      default: spaceColors.darkPrimary,
      paper: spaceColors.darkSecondary,
    },
    surface: {
      main: spaceColors.surfaceLight,
      dark: spaceColors.surfaceDark,
    },
    text: {
      primary: spaceColors.textPrimary,
      secondary: spaceColors.textSecondary,
      disabled: spaceColors.textDisabled,
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 300,
      letterSpacing: '-0.02em',
      color: spaceColors.textPrimary,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 300,
      letterSpacing: '-0.01em',
      color: spaceColors.textPrimary,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 400,
      color: spaceColors.textPrimary,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 400,
      color: spaceColors.textPrimary,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: spaceColors.textPrimary,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: spaceColors.textPrimary,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
      color: spaceColors.textSecondary,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: spaceColors.textSecondary,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: spaceColors.textPrimary,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,
      color: spaceColors.textSecondary,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      color: spaceColors.textDisabled,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 400,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: spaceColors.textDisabled,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: spaceColors.darkPrimary,
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)`,
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: spaceColors.darkSecondary,
          backgroundImage: 'none',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: spaceColors.darkSecondary,
          backgroundImage: 'none',
          borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
          border: `1px solid rgba(255, 255, 255, 0.1)`,
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        },
        elevation3: {
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: spaceColors.darkSecondary,
          borderRadius: 12,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.2)',
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.4)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: spaceColors.neonGreen,
            },
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: spaceColors.neonGreen,
          '& .MuiSlider-rail': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
          '& .MuiSlider-track': {
            backgroundColor: spaceColors.neonGreen,
          },
          '& .MuiSlider-thumb': {
            backgroundColor: spaceColors.neonGreen,
            boxShadow: '0 2px 8px rgba(0, 255, 136, 0.4)',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0, 255, 136, 0.6)',
            },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: spaceColors.surfaceLight,
          color: spaceColors.textPrimary,
          '&:hover': {
            backgroundColor: spaceColors.surfaceDark,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: spaceColors.darkTertiary,
          border: `1px solid rgba(255, 255, 255, 0.2)`,
          borderRadius: 6,
          fontSize: '0.875rem',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
});

export default darkSpaceTheme;