/**
 * Status Bar Component - Bottom status bar with habitat statistics and validation
 * Shows real-time habitat performance metrics and system status
 */

import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Chip,
  Grid,
  Tooltip,
  IconButton,
  Alert,
  Collapse,
  Paper
} from '@mui/material';
import {
  Group as GroupIcon,
  Power as PowerIcon,
  Scale as MassIcon,
  AttachMoney as CostIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

import { useHabitat } from '../../contexts/HabitatContext';
import { useConnectionValidator } from '../../hooks/useConnectionValidator';

const StatusBar = () => {
  const { statistics } = useHabitat();
  const { 
    validationErrors, 
    getValidationSummary, 
    getConnectionStatistics,
    revalidate 
  } = useConnectionValidator();

  const [showDetails, setShowDetails] = React.useState(false);
  const [showErrors, setShowErrors] = React.useState(false);

  // Get validation summary
  const validationSummary = getValidationSummary;
  const connectionStats = getConnectionStatistics;

  // Calculate power status
  const powerStatus = useMemo(() => {
    const { powerBalance } = statistics;
    
    if (powerBalance > 500) return { color: 'success', label: 'Excellent' };
    if (powerBalance > 100) return { color: 'success', label: 'Good' };
    if (powerBalance > 0) return { color: 'warning', label: 'Adequate' };
    if (powerBalance > -500) return { color: 'warning', label: 'Low' };
    return { color: 'error', label: 'Critical' };
  }, [statistics]);

  // Calculate overall system health
  const systemHealth = useMemo(() => {
    const { errorCount, warningCount } = validationSummary;
    const { powerBalance } = statistics;
    
    let score = 100;
    score -= errorCount * 20;
    score -= warningCount * 5;
    if (powerBalance < 0) score -= Math.abs(powerBalance) / 10;
    
    score = Math.max(0, Math.min(100, score));
    
    if (score >= 90) return { color: 'success', label: 'Excellent', value: score };
    if (score >= 75) return { color: 'success', label: 'Good', value: score };
    if (score >= 60) return { color: 'warning', label: 'Fair', value: score };
    if (score >= 40) return { color: 'warning', label: 'Poor', value: score };
    return { color: 'error', label: 'Critical', value: score };
  }, [validationSummary, statistics]);

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Format power with units
  const formatPower = (watts) => {
    if (Math.abs(watts) >= 1000) return (watts / 1000).toFixed(1) + 'kW';
    return watts + 'W';
  };

  // Get status icon
  const getStatusIcon = () => {
    if (validationSummary.errorCount > 0) return <ErrorIcon color="error" />;
    if (validationSummary.warningCount > 0) return <WarningIcon color="warning" />;
    return <CheckIcon color="success" />;
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 0,
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      {/* Main Status Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1,
          minHeight: 40,
          background: 'linear-gradient(90deg, rgba(26, 26, 46, 0.8) 0%, rgba(16, 33, 62, 0.8) 100%)'
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          {/* System Status */}
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getStatusIcon()}
              <Box>
                <Typography variant="caption" color="textSecondary">
                  System Health
                </Typography>
                <Typography variant="body2" fontWeight="bold" color={`${systemHealth.color}.main`}>
                  {systemHealth.label} ({systemHealth.value.toFixed(0)}%)
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Modules Count */}
          <Grid item xs={6} sm={3} md={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <GroupIcon fontSize="small" color="action" />
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Modules
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {statistics.totalModules}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Crew Capacity */}
          <Grid item xs={6} sm={3} md={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <GroupIcon fontSize="small" color="action" />
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Crew
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {statistics.totalCrewCapacity}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Mass */}
          <Grid item xs={6} sm={3} md={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <MassIcon fontSize="small" color="action" />
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Mass
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {formatNumber(statistics.totalMass)} kg
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Power Status */}
          <Grid item xs={6} sm={3} md={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PowerIcon fontSize="small" color="action" />
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="caption" color="textSecondary">
                  Power Balance
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography 
                    variant="body2" 
                    fontWeight="bold" 
                    color={`${powerStatus.color}.main`}
                  >
                    {formatPower(statistics.powerBalance)}
                  </Typography>
                  <Chip
                    label={powerStatus.label}
                    size="small"
                    color={powerStatus.color}
                    variant="outlined"
                    sx={{ height: 16, fontSize: '0.65rem' }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Cost */}
          <Grid item xs={6} sm={3} md={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CostIcon fontSize="small" color="action" />
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Cost
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  ${formatNumber(statistics.totalCost)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Actions */}
          <Grid item xs={12} sm={6} md={1}>
            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
              <Tooltip title="Refresh validation">
                <IconButton size="small" onClick={revalidate}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title={showDetails ? "Hide details" : "Show details"}>
                <IconButton 
                  size="small" 
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Power Balance Progress Bar */}
      {statistics.totalPowerConsumption > 0 && (
        <Box sx={{ px: 2, py: 0.5 }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, (statistics.totalPowerGeneration / statistics.totalPowerConsumption) * 100)}
            color={powerStatus.color}
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 2,
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption" color="textSecondary">
              Generation: {formatPower(statistics.totalPowerGeneration)}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Consumption: {formatPower(statistics.totalPowerConsumption)}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Detailed Information Panel */}
      <Collapse in={showDetails}>
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', background: 'rgba(0, 0, 0, 0.2)' }}>
          <Grid container spacing={2}>
            {/* Connection Statistics */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Connection Statistics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Total Connections:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {connectionStats.totalConnections}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Available Points:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {connectionStats.availablePoints}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Utilization:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {connectionStats.utilizationRate.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* System Metrics */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                System Metrics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Power Efficiency:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {statistics.totalPowerGeneration > 0 
                      ? ((statistics.totalPowerGeneration - statistics.totalPowerConsumption) / statistics.totalPowerGeneration * 100).toFixed(1)
                      : 0}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Mass per Crew:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {statistics.totalCrewCapacity > 0 
                      ? formatNumber(statistics.totalMass / statistics.totalCrewCapacity) + ' kg'
                      : 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Cost per Crew:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {statistics.totalCrewCapacity > 0 
                      ? '$' + formatNumber(statistics.totalCost / statistics.totalCrewCapacity)
                      : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Collapse>

      {/* Validation Errors */}
      {validationSummary.totalIssues > 0 && (
        <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2,
              py: 0.5,
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
            }}
            onClick={() => setShowErrors(!showErrors)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
              {validationSummary.errorCount > 0 ? (
                <ErrorIcon fontSize="small" color="error" />
              ) : (
                <WarningIcon fontSize="small" color="warning" />
              )}
              <Typography variant="body2">
                {validationSummary.errorCount} errors, {validationSummary.warningCount} warnings
              </Typography>
            </Box>
            {showErrors ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </Box>

          <Collapse in={showErrors}>
            <Box sx={{ maxHeight: 120, overflow: 'auto', p: 1 }}>
              {validationErrors.slice(0, 5).map((error, index) => (
                <Alert
                  key={index}
                  severity={error.severity || (error.type === 'error' ? 'error' : 'warning')}
                  size="small"
                  sx={{ mb: 0.5, fontSize: '0.75rem' }}
                >
                  {error.message}
                </Alert>
              ))}
              {validationErrors.length > 5 && (
                <Typography variant="caption" color="textSecondary" sx={{ px: 1 }}>
                  ... and {validationErrors.length - 5} more issues
                </Typography>
              )}
            </Box>
          </Collapse>
        </Box>
      )}
    </Paper>
  );
};

export default StatusBar;