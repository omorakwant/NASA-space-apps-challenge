/**
 * Properties Panel Component - Right sidebar for selected module properties
 * Shows module details, position controls, specifications, and actions
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Grid,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  ExpandMore as ExpandMoreIcon,
  LocationOn as LocationIcon,
  Link as ConnectionIcon,
  Power as PowerIcon,
  Group as GroupIcon,
  Scale as MassIcon,
  AttachMoney as CostIcon
} from '@mui/icons-material';

import { useModuleManager } from '../../hooks/useModuleManager';
import { useConnectionValidator } from '../../hooks/useConnectionValidator';

const PropertiesPanel = () => {
  const {
    getSelectedModule,
    getSelectedModuleDefinition,
    moveModule,
    rotateModule,
    deleteSelectedModule,
    cloneModule,
    deselectModule
  } = useModuleManager();

  const {
    getModuleConnections,
    autoConnect
  } = useConnectionValidator();

  const [editMode, setEditMode] = useState(false);
  const [tempPosition, setTempPosition] = useState([0, 0, 0]);
  const [tempRotation, setTempRotation] = useState([0, 0, 0]);

  const selectedModule = getSelectedModule();
  const selectedDefinition = getSelectedModuleDefinition();
  const connections = selectedModule ? getModuleConnections(selectedModule.id) : [];

  // Initialize temp values when module selection changes
  React.useEffect(() => {
    if (selectedModule) {
      setTempPosition([...selectedModule.position]);
      setTempRotation([...selectedModule.rotation.map(r => r * 180 / Math.PI)]); // Convert to degrees
      setEditMode(false);
    }
  }, [selectedModule]);

  // Handle position changes
  const handlePositionChange = (axis, value) => {
    const newPosition = [...tempPosition];
    newPosition[axis] = parseFloat(value) || 0;
    setTempPosition(newPosition);
  };

  // Handle rotation changes
  const handleRotationChange = (axis, value) => {
    const newRotation = [...tempRotation];
    newRotation[axis] = parseFloat(value) || 0;
    setTempRotation(newRotation);
  };

  // Apply changes
  const applyChanges = () => {
    if (selectedModule) {
      moveModule(selectedModule.id, tempPosition);
      rotateModule(selectedModule.id, tempRotation.map(r => r * Math.PI / 180)); // Convert to radians
      setEditMode(false);
    }
  };

  // Cancel changes
  const cancelChanges = () => {
    if (selectedModule) {
      setTempPosition([...selectedModule.position]);
      setTempRotation([...selectedModule.rotation.map(r => r * 180 / Math.PI)]);
      setEditMode(false);
    }
  };

  // Handle module deletion with confirmation
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      deleteSelectedModule();
    }
  };

  // Handle module cloning
  const handleClone = () => {
    if (selectedModule) {
      cloneModule(selectedModule.id);
    }
  };

  // Auto-connect module
  const handleAutoConnect = () => {
    if (selectedModule) {
      autoConnect(selectedModule.id);
    }
  };

  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // No module selected
  if (!selectedModule || !selectedDefinition) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 300 }}>
          Properties
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
            opacity: 0.6
          }}
        >
          <LocationIcon sx={{ fontSize: 48 }} />
          <Typography variant="body1" color="textSecondary" textAlign="center">
            Select a module in the 3D scene to view and edit its properties
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: selectedDefinition.color,
            mr: 1,
            boxShadow: `0 0 10px ${selectedDefinition.color}80`
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 300, flexGrow: 1 }}>
          {selectedDefinition.name}
        </Typography>
        <IconButton size="small" onClick={deselectModule}>
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {/* Module Info Card */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              {selectedDefinition.type}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {selectedDefinition.description}
            </Typography>
            
            {/* Key specs */}
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <MassIcon fontSize="small" color="action" />
                  <Typography variant="caption">
                    {formatNumber(selectedDefinition.mass)} kg
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <GroupIcon fontSize="small" color="action" />
                  <Typography variant="caption">
                    {selectedDefinition.crewCapacity} crew
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PowerIcon fontSize="small" color="action" />
                  <Typography variant="caption">
                    {selectedDefinition.powerConsumption}W
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CostIcon fontSize="small" color="action" />
                  <Typography variant="caption">
                    ${formatNumber(selectedDefinition.cost)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Position Controls */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <LocationIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1">Position & Rotation</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ minWidth: 80 }}>
                  Position:
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setEditMode(!editMode)}
                  sx={{ ml: 'auto' }}
                >
                  {editMode ? 'Cancel' : 'Edit'}
                </Button>
              </Box>
              
              <Grid container spacing={1}>
                {['X', 'Y', 'Z'].map((axis, index) => (
                  <Grid item xs={4} key={axis}>
                    <TextField
                      label={axis}
                      size="small"
                      fullWidth
                      type="number"
                      value={editMode ? tempPosition[index] : selectedModule.position[index].toFixed(2)}
                      onChange={(e) => handlePositionChange(index, e.target.value)}
                      disabled={!editMode}
                      inputProps={{ step: 0.1 }}
                    />
                  </Grid>
                ))}
              </Grid>

              <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                Rotation (degrees):
              </Typography>
              <Grid container spacing={1}>
                {['X', 'Y', 'Z'].map((axis, index) => (
                  <Grid item xs={4} key={axis}>
                    <TextField
                      label={axis}
                      size="small"
                      fullWidth
                      type="number"
                      value={editMode ? tempRotation[index] : (selectedModule.rotation[index] * 180 / Math.PI).toFixed(1)}
                      onChange={(e) => handleRotationChange(index, e.target.value)}
                      disabled={!editMode}
                      inputProps={{ step: 15, min: -180, max: 180 }}
                    />
                  </Grid>
                ))}
              </Grid>

              {editMode && (
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={applyChanges}
                  >
                    Apply
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={cancelChanges}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Connections */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ConnectionIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1">
              Connections ({connections.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {connections.length > 0 ? (
              <List dense>
                {connections.map((connection, index) => (
                  <ListItem key={connection.id}>
                    <ListItemIcon>
                      <ConnectionIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Connection ${index + 1}`}
                      secondary={`${connection.pointId1} → ${connection.pointId2}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  No connections. Try positioning this module near others.
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleAutoConnect}
                  disabled={connections.length > 0}
                >
                  Auto-Connect
                </Button>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Connection Points */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              Connection Points ({selectedDefinition.connectionPoints.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {selectedDefinition.connectionPoints.map(point => (
                <ListItem key={point.id}>
                  <ListItemText
                    primary={point.id}
                    secondary={point.type}
                  />
                  <Chip
                    label={point.type}
                    size="small"
                    variant="outlined"
                    color={point.type === 'structural' ? 'primary' : 'secondary'}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Technical Specifications */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Technical Specifications</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>
                  <strong>Dimensions:</strong> {selectedDefinition.dimensions.width} × {selectedDefinition.dimensions.height} × {selectedDefinition.dimensions.depth} meters
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Mass:</strong> {formatNumber(selectedDefinition.mass)} kg
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Volume:</strong> {(selectedDefinition.dimensions.width * selectedDefinition.dimensions.height * selectedDefinition.dimensions.depth).toFixed(1)} m³
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Power Consumption:</strong> {selectedDefinition.powerConsumption}W
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Power Generation:</strong> {selectedDefinition.powerGeneration}W
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  <strong>Estimated Cost:</strong> ${formatNumber(selectedDefinition.cost)}
                </Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Actions */}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<CopyIcon />}
          onClick={handleClone}
          sx={{ flex: 1 }}
        >
          Clone
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          sx={{ flex: 1 }}
        >
          Delete
        </Button>
      </Box>

      <Typography variant="caption" color="textSecondary" sx={{ textAlign: 'center', mt: 1 }}>
        Module ID: {selectedModule.id}
      </Typography>
    </Box>
  );
};

export default PropertiesPanel;