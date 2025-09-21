/**
 * Main App Component - Root application component
 * Integrates all providers, themes, and main layout
 */

import React, { useState, useCallback } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';

// Theme and Context
import { darkSpaceTheme } from './styles/theme';
import { HabitatProvider } from './contexts/HabitatContext';

// Main Layout
import MainLayout from './components/Layout/MainLayout';

// Hooks and utilities
import { useHabitat } from './contexts/HabitatContext';
import { exportJSON, exportMarkdown, exportOBJ } from './utils/exportUtils';
import { sampleConfigurations } from './data/moduleDefinitions';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Space Habitat Builder Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ThemeProvider theme={darkSpaceTheme}>
          <CssBaseline />
          <Box
            sx={{
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              p: 4,
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" color="error">
              Houston, we have a problem! 🚀
            </Typography>
            <Typography variant="body1" color="textSecondary">
              The Space Habitat Builder encountered an unexpected error.
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', opacity: 0.7 }}>
              {this.state.error?.message}
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{ mt: 2 }}
            >
              Restart Mission
            </Button>
          </Box>
        </ThemeProvider>
      );
    }

    return this.props.children;
  }
}

// App Content Component (needs to be inside providers)
const AppContent = () => {
  const {
    exportConfiguration,
    loadConfiguration,
    resetHabitat
  } = useHabitat();

  const [leftDrawerOpen, setLeftDrawerOpen] = useState(true);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [helpDialog, setHelpDialog] = useState(false);
  const [settingsDialog, setSettingsDialog] = useState(false);

  // Show notification
  const showNotification = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Handle export operations
  const handleExport = useCallback(() => {
    try {
      const habitatData = exportConfiguration();
      
      // Export all formats
      exportJSON(habitatData, `habitat-design-${Date.now()}`);
      exportMarkdown(habitatData, `habitat-spec-${Date.now()}`);
      exportOBJ(habitatData, `habitat-model-${Date.now()}`);
      
      showNotification('Design exported successfully in JSON, Markdown, and OBJ formats!', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showNotification('Failed to export design. Please try again.', 'error');
    }
  }, [exportConfiguration, showNotification]);

  // Handle settings
  const handleSettings = useCallback(() => {
    setSettingsDialog(true);
  }, []);

  // Handle help
  const handleHelp = useCallback(() => {
    setHelpDialog(true);
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    // Force re-render of 3D scene
    showNotification('View refreshed', 'info');
  }, [showNotification]);

  // Load sample configuration
  const handleLoadSample = useCallback((configKey) => {
    try {
      const config = sampleConfigurations[configKey];
      if (config) {
        loadConfiguration(config);
        showNotification(`Loaded ${config.name} configuration`, 'success');
      }
    } catch (error) {
      console.error('Failed to load sample:', error);
      showNotification('Failed to load sample configuration', 'error');
    }
  }, [loadConfiguration, showNotification]);

  // Handle drawer toggles
  const handleLeftDrawerToggle = useCallback(() => {
    setLeftDrawerOpen(prev => !prev);
  }, []);

  const handleRightDrawerToggle = useCallback(() => {
    setRightDrawerOpen(prev => !prev);
  }, []);

  // Close dialogs
  const closeHelpDialog = () => setHelpDialog(false);
  const closeSettingsDialog = () => setSettingsDialog(false);

  return (
    <>
      <MainLayout
        onExport={handleExport}
        onSettings={handleSettings}
        onHelp={handleHelp}
        onRefresh={handleRefresh}
        leftDrawerOpen={leftDrawerOpen}
        onLeftDrawerToggle={handleLeftDrawerToggle}
        rightDrawerOpen={rightDrawerOpen}
        onRightDrawerToggle={handleRightDrawerToggle}
      />

      {/* Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Help Dialog */}
      <Dialog
        open={helpDialog}
        onClose={closeHelpDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(16, 33, 62, 0.95) 100%)',
            backdropFilter: 'blur(20px)'
          }
        }}
      >
        <DialogTitle>Space Habitat Builder - Help</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
            🚀 Getting Started
          </Typography>
          <Typography variant="body2" paragraph>
            Welcome to the Space Habitat Builder! This tool helps you design modular space habitats for Mars, lunar bases, and other space missions.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mt: 2 }}>
            📚 How to Use
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2">
              <strong>Browse Modules:</strong> Use the left panel to explore available habitat modules
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Add Modules:</strong> Click the "Add Module" button to place modules in the 3D scene
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Position Modules:</strong> Click and drag modules in the 3D view to position them
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Select Modules:</strong> Click on a module to select it and view its properties
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Monitor Status:</strong> Check the bottom status bar for real-time habitat statistics
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Export Design:</strong> Use the export button to save your design in multiple formats
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mt: 2 }}>
            ⌨️ Controls
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2">
              <strong>Camera:</strong> Left-click and drag to rotate, scroll to zoom, right-click and drag to pan
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Selection:</strong> Left-click on modules to select them
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Deselection:</strong> Click on empty space to deselect modules
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mt: 2 }}>
            🔧 Features
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2">Real-time connection validation</Typography>
            <Typography component="li" variant="body2">Power balance monitoring</Typography>
            <Typography component="li" variant="body2">Mass and cost calculations</Typography>
            <Typography component="li" variant="body2">Multiple export formats (JSON, Markdown, OBJ)</Typography>
            <Typography component="li" variant="body2">Sample habitat configurations</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHelpDialog} variant="contained">
            Got it!
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog
        open={settingsDialog}
        onClose={closeSettingsDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary">
            Settings and preferences will be available in a future update.
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sample Configurations
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {Object.entries(sampleConfigurations).map(([key, config]) => (
                <Button
                  key={key}
                  variant="outlined"
                  onClick={() => {
                    handleLoadSample(key);
                    closeSettingsDialog();
                  }}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {config.name}
                </Button>
              ))}
            </Box>

            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all modules?')) {
                  resetHabitat();
                  showNotification('Habitat cleared', 'info');
                  closeSettingsDialog();
                }
              }}
              sx={{ mt: 2, width: '100%' }}
            >
              Clear All Modules
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSettingsDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={darkSpaceTheme}>
        <CssBaseline />
        <HabitatProvider>
          <AppContent />
        </HabitatProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
