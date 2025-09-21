/**
 * Main Layout Component - Root layout with three-panel design
 * Left: Module Library, Center: 3D Scene, Right: Properties Panel, Bottom: Status Bar
 */

import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  GetApp as ExportIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// Import components (will be created next)
import ModuleLibrary from '../UI/ModuleLibrary';
import PropertiesPanel from '../UI/PropertiesPanel';
import StatusBar from '../UI/StatusBar';
import Scene from '../3D/Scene';

// Layout configuration
const DRAWER_WIDTH = 320;
const PROPERTIES_WIDTH = 300;
const APPBAR_HEIGHT = 64;
const STATUSBAR_HEIGHT = 60;

const MainLayout = ({
  onExport,
  onSettings,
  onHelp,
  onRefresh,
  leftDrawerOpen = true,
  onLeftDrawerToggle,
  rightDrawerOpen = true,
  onRightDrawerToggle
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          height: APPBAR_HEIGHT,
          background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.dark} 100%)`,
        }}
      >
        <Toolbar sx={{ minHeight: `${APPBAR_HEIGHT}px !important`, px: 2 }}>
          {/* Left Menu Toggle */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={onLeftDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* App Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{
                fontWeight: 300,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mr: 2
              }}
            >
              Space Habitat Builder
            </Typography>
            <Typography
              variant="caption"
              sx={{
                opacity: 0.7,
                fontWeight: 300,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              NASA Space Apps Challenge 2025
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Export Design">
              <IconButton color="inherit" onClick={onExport}>
                <ExportIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Refresh View">
              <IconButton color="inherit" onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Settings">
              <IconButton color="inherit" onClick={onSettings}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Help">
              <IconButton color="inherit" onClick={onHelp}>
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Left Drawer - Module Library */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={leftDrawerOpen}
        onClose={onLeftDrawerToggle}
        sx={{
          width: leftDrawerOpen ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            top: APPBAR_HEIGHT,
            height: `calc(100vh - ${APPBAR_HEIGHT + STATUSBAR_HEIGHT}px)`,
            background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            borderRight: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden'
          },
        }}
      >
        <ModuleLibrary />
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          ml: leftDrawerOpen && !isMobile ? 0 : 0,
          mr: rightDrawerOpen && !isMobile ? 0 : 0,
        }}
      >
        {/* 3D Scene */}
        <Box
          sx={{
            flexGrow: 1,
            mt: `${APPBAR_HEIGHT}px`,
            mb: `${STATUSBAR_HEIGHT}px`,
            position: 'relative',
            background: 'radial-gradient(ellipse at center, #001122 0%, #000000 100%)',
            overflow: 'hidden'
          }}
        >
          <Scene />
        </Box>
      </Box>

      {/* Right Drawer - Properties Panel */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        anchor="right"
        open={rightDrawerOpen}
        onClose={onRightDrawerToggle}
        sx={{
          width: rightDrawerOpen ? PROPERTIES_WIDTH : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: PROPERTIES_WIDTH,
            boxSizing: 'border-box',
            top: APPBAR_HEIGHT,
            height: `calc(100vh - ${APPBAR_HEIGHT + STATUSBAR_HEIGHT}px)`,
            background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            borderLeft: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden'
          },
        }}
      >
        <PropertiesPanel />
      </Drawer>

      {/* Bottom Status Bar */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: STATUSBAR_HEIGHT,
          zIndex: theme.zIndex.drawer - 1,
          background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <StatusBar />
      </Box>

      {/* Loading Overlay (optional) */}
      {/* You can add a loading overlay here if needed */}
    </Box>
  );
};

export default MainLayout;