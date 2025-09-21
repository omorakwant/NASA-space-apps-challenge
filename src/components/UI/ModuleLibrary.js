/**
 * Module Library Component - Left sidebar showing available modules
 * Displays module types with specifications, search/filter, and add buttons
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon,
  Power as PowerIcon,
  Group as GroupIcon,
  Scale as MassIcon
} from '@mui/icons-material';

import { useModuleManager } from '../../hooks/useModuleManager';
import moduleDefinitions, { sampleConfigurations } from '../../data/moduleDefinitions';

const ModuleLibrary = () => {
  const {
    addModuleAtPosition,
    findOptimalPosition,
    getModuleCountByType,
    statistics
  } = useModuleManager();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [expandedCards, setExpandedCards] = useState({});
  const [showSamples, setShowSamples] = useState(false);

  // Filter modules based on search and type
  const filteredModules = useMemo(() => {
    return moduleDefinitions.filter(module => {
      const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           module.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = !selectedType || module.type === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType]);

  // Get unique module types for filtering
  const moduleTypes = useMemo(() => {
    const types = [...new Set(moduleDefinitions.map(mod => mod.type))];
    return types.sort();
  }, []);

  // Module counts
  const moduleCounts = getModuleCountByType;

  // Handle adding a module
  const handleAddModule = (definitionId) => {
    const optimalPosition = findOptimalPosition(definitionId);
    addModuleAtPosition(definitionId, optimalPosition, true);
  };

  // Handle sample configuration loading
  const handleLoadSample = (configName) => {
    const config = sampleConfigurations[configName];
    if (config) {
      // This would need to be implemented in the habitat context
      console.log('Loading sample configuration:', configName);
    }
  };

  // Toggle card expansion
  const toggleCard = (moduleId) => {
    setExpandedCards(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      {/* Header */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 300, mb: 2 }}>
        Module Library
      </Typography>

      {/* Search and Filter */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search modules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{ mb: 1 }}
        />

        {/* Type filter chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          <Chip
            label="All"
            variant={selectedType === '' ? 'filled' : 'outlined'}
            size="small"
            onClick={() => setSelectedType('')}
            color="primary"
          />
          {moduleTypes.map(type => (
            <Chip
              key={type}
              label={type.replace(/([A-Z])/g, ' $1').trim()}
              variant={selectedType === type ? 'filled' : 'outlined'}
              size="small"
              onClick={() => setSelectedType(type)}
              color="secondary"
            />
          ))}
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Sample Configurations */}
      <Box sx={{ mb: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          size="small"
          onClick={() => setShowSamples(!showSamples)}
          endIcon={showSamples ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{ mb: 1 }}
        >
          Sample Configurations
        </Button>
        
        <Collapse in={showSamples}>
          <List dense>
            {Object.entries(sampleConfigurations).map(([key, config]) => (
              <ListItem key={key} dense>
                <ListItemText
                  primary={config.name}
                  secondary={config.description}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleLoadSample(key)}
                  >
                    <AddIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Module Cards */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Grid container spacing={2}>
          {filteredModules.map(module => {
            const isExpanded = expandedCards[module.id];
            const count = moduleCounts[module.type] || 0;

            return (
              <Grid item xs={12} key={module.id}>
                <Card
                  sx={{
                    transition: 'all 0.3s ease',
                    border: `1px solid ${module.color}40`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    {/* Module header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: module.color,
                          mr: 1,
                          boxShadow: `0 0 8px ${module.color}80`
                        }}
                      />
                      <Typography variant="subtitle1" sx={{ fontWeight: 500, flexGrow: 1 }}>
                        {module.name}
                      </Typography>
                      {count > 0 && (
                        <Chip
                          label={count}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                      <IconButton
                        size="small"
                        onClick={() => toggleCard(module.id)}
                      >
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>

                    {/* Module type */}
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {module.description}
                    </Typography>

                    {/* Key specs (always visible) */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      <Tooltip title="Mass">
                        <Chip
                          icon={<MassIcon />}
                          label={`${formatNumber(module.mass)} kg`}
                          size="small"
                          variant="outlined"
                        />
                      </Tooltip>
                      <Tooltip title="Crew Capacity">
                        <Chip
                          icon={<GroupIcon />}
                          label={module.crewCapacity}
                          size="small"
                          variant="outlined"
                        />
                      </Tooltip>
                      <Tooltip title="Power Consumption">
                        <Chip
                          icon={<PowerIcon />}
                          label={`${module.powerConsumption}W`}
                          size="small"
                          variant="outlined"
                          color={module.powerConsumption > 1000 ? 'warning' : 'default'}
                        />
                      </Tooltip>
                    </Box>

                    {/* Detailed specs (expandable) */}
                    <Collapse in={isExpanded}>
                      <Divider sx={{ my: 1 }} />
                      
                      <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
                        Detailed Specifications:
                      </Typography>
                      
                      <Grid container spacing={1} sx={{ fontSize: '0.75rem' }}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="textSecondary">
                            Dimensions (W×H×D):
                          </Typography>
                          <Typography variant="body2">
                            {module.dimensions.width}×{module.dimensions.height}×{module.dimensions.depth}m
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <Typography variant="caption" color="textSecondary">
                            Cost:
                          </Typography>
                          <Typography variant="body2">
                            ${formatNumber(module.cost)}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <Typography variant="caption" color="textSecondary">
                            Connection Points:
                          </Typography>
                          <Typography variant="body2">
                            {module.connectionPoints.length}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <Typography variant="caption" color="textSecondary">
                            Power Generation:
                          </Typography>
                          <Typography variant="body2">
                            {module.powerGeneration}W
                          </Typography>
                        </Grid>
                      </Grid>

                      {/* Connection points list */}
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                        Connection Points:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {module.connectionPoints.map(point => (
                          <Chip
                            key={point.id}
                            label={`${point.id} (${point.type})`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.65rem' }}
                          />
                        ))}
                      </Box>
                    </Collapse>
                  </CardContent>

                  <CardActions sx={{ pt: 0, justifyContent: 'space-between' }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddModule(module.id)}
                      sx={{
                        background: `linear-gradient(45deg, ${module.color}, ${module.color}80)`,
                        '&:hover': {
                          background: `linear-gradient(45deg, ${module.color}CC, ${module.color})`
                        }
                      }}
                    >
                      Add Module
                    </Button>

                    <Tooltip title="View detailed information">
                      <IconButton size="small" color="primary">
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Footer stats */}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="caption" color="textSecondary">
          {filteredModules.length} modules available
        </Typography>
        {statistics.totalModules > 0 && (
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
            {statistics.totalModules} modules in habitat
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ModuleLibrary;