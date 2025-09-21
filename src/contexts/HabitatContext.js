/**
 * Habitat Context - React Context for global state management
 * Manages modules, connections, validation, and habitat statistics
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import moduleDefinitions from '../data/moduleDefinitions';

// Action types
export const HABITAT_ACTIONS = {
  ADD_MODULE: 'ADD_MODULE',
  REMOVE_MODULE: 'REMOVE_MODULE',
  UPDATE_MODULE: 'UPDATE_MODULE',
  SELECT_MODULE: 'SELECT_MODULE',
  DESELECT_MODULE: 'DESELECT_MODULE',
  SET_MODULES: 'SET_MODULES',
  ADD_CONNECTION: 'ADD_CONNECTION',
  REMOVE_CONNECTION: 'REMOVE_CONNECTION',
  SET_VALIDATION_ERRORS: 'SET_VALIDATION_ERRORS',
  CLEAR_VALIDATION_ERRORS: 'CLEAR_VALIDATION_ERRORS',
  LOAD_CONFIGURATION: 'LOAD_CONFIGURATION',
  RESET_HABITAT: 'RESET_HABITAT'
};

// Initial state
const initialState = {
  modules: [],
  selectedModuleId: null,
  connections: [],
  validationErrors: [],
  statistics: {
    totalModules: 0,
    totalMass: 0,
    totalCrewCapacity: 0,
    totalPowerConsumption: 0,
    totalPowerGeneration: 0,
    powerBalance: 0,
    totalCost: 0
  }
};

// Calculate habitat statistics
const calculateStatistics = (modules) => {
  const stats = modules.reduce((acc, module) => {
    const definition = moduleDefinitions.find(def => def.id === module.definitionId);
    if (definition) {
      acc.totalMass += definition.mass;
      acc.totalCrewCapacity += definition.crewCapacity;
      acc.totalPowerConsumption += definition.powerConsumption;
      acc.totalPowerGeneration += definition.powerGeneration;
      acc.totalCost += definition.cost;
    }
    return acc;
  }, {
    totalMass: 0,
    totalCrewCapacity: 0,
    totalPowerConsumption: 0,
    totalPowerGeneration: 0,
    totalCost: 0
  });

  return {
    ...stats,
    totalModules: modules.length,
    powerBalance: stats.totalPowerGeneration - stats.totalPowerConsumption
  };
};

// Reducer function
const habitatReducer = (state, action) => {
  switch (action.type) {
    case HABITAT_ACTIONS.ADD_MODULE:
      const newModules = [...state.modules, action.payload];
      return {
        ...state,
        modules: newModules,
        statistics: calculateStatistics(newModules)
      };

    case HABITAT_ACTIONS.REMOVE_MODULE:
      const filteredModules = state.modules.filter(module => module.id !== action.payload);
      return {
        ...state,
        modules: filteredModules,
        selectedModuleId: state.selectedModuleId === action.payload ? null : state.selectedModuleId,
        statistics: calculateStatistics(filteredModules)
      };

    case HABITAT_ACTIONS.UPDATE_MODULE:
      const updatedModules = state.modules.map(module =>
        module.id === action.payload.id ? { ...module, ...action.payload.updates } : module
      );
      return {
        ...state,
        modules: updatedModules,
        statistics: calculateStatistics(updatedModules)
      };

    case HABITAT_ACTIONS.SELECT_MODULE:
      return {
        ...state,
        selectedModuleId: action.payload
      };

    case HABITAT_ACTIONS.DESELECT_MODULE:
      return {
        ...state,
        selectedModuleId: null
      };

    case HABITAT_ACTIONS.SET_MODULES:
      return {
        ...state,
        modules: action.payload,
        statistics: calculateStatistics(action.payload)
      };

    case HABITAT_ACTIONS.ADD_CONNECTION:
      return {
        ...state,
        connections: [...state.connections, action.payload]
      };

    case HABITAT_ACTIONS.REMOVE_CONNECTION:
      return {
        ...state,
        connections: state.connections.filter(conn => conn.id !== action.payload)
      };

    case HABITAT_ACTIONS.SET_VALIDATION_ERRORS:
      return {
        ...state,
        validationErrors: action.payload
      };

    case HABITAT_ACTIONS.CLEAR_VALIDATION_ERRORS:
      return {
        ...state,
        validationErrors: []
      };

    case HABITAT_ACTIONS.LOAD_CONFIGURATION:
      const configModules = action.payload.modules || [];
      return {
        ...state,
        modules: configModules,
        selectedModuleId: null,
        connections: action.payload.connections || [],
        validationErrors: [],
        statistics: calculateStatistics(configModules)
      };

    case HABITAT_ACTIONS.RESET_HABITAT:
      return {
        ...initialState,
        statistics: calculateStatistics([])
      };

    default:
      return state;
  }
};

// Context creation
const HabitatContext = createContext();

// Context provider component
export const HabitatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(habitatReducer, initialState);

  // Action creators
  const addModule = useCallback((definitionId, position = [0, 0, 0], rotation = [0, 0, 0]) => {
    const definition = moduleDefinitions.find(def => def.id === definitionId);
    if (!definition) {
      console.error('Module definition not found:', definitionId);
      return;
    }

    const newModule = {
      id: uuidv4(),
      definitionId,
      position: [...position],
      rotation: [...rotation],
      timestamp: Date.now()
    };

    dispatch({
      type: HABITAT_ACTIONS.ADD_MODULE,
      payload: newModule
    });

    return newModule.id;
  }, []);

  const removeModule = useCallback((moduleId) => {
    dispatch({
      type: HABITAT_ACTIONS.REMOVE_MODULE,
      payload: moduleId
    });
  }, []);

  const updateModule = useCallback((moduleId, updates) => {
    dispatch({
      type: HABITAT_ACTIONS.UPDATE_MODULE,
      payload: { id: moduleId, updates }
    });
  }, []);

  const selectModule = useCallback((moduleId) => {
    dispatch({
      type: HABITAT_ACTIONS.SELECT_MODULE,
      payload: moduleId
    });
  }, []);

  const deselectModule = useCallback(() => {
    dispatch({
      type: HABITAT_ACTIONS.DESELECT_MODULE
    });
  }, []);

  const addConnection = useCallback((moduleId1, pointId1, moduleId2, pointId2) => {
    const connection = {
      id: uuidv4(),
      moduleId1,
      pointId1,
      moduleId2,
      pointId2,
      timestamp: Date.now()
    };

    dispatch({
      type: HABITAT_ACTIONS.ADD_CONNECTION,
      payload: connection
    });

    return connection.id;
  }, []);

  const removeConnection = useCallback((connectionId) => {
    dispatch({
      type: HABITAT_ACTIONS.REMOVE_CONNECTION,
      payload: connectionId
    });
  }, []);

  const setValidationErrors = useCallback((errors) => {
    dispatch({
      type: HABITAT_ACTIONS.SET_VALIDATION_ERRORS,
      payload: errors
    });
  }, []);

  const clearValidationErrors = useCallback(() => {
    dispatch({
      type: HABITAT_ACTIONS.CLEAR_VALIDATION_ERRORS
    });
  }, []);

  const loadConfiguration = useCallback((config) => {
    dispatch({
      type: HABITAT_ACTIONS.LOAD_CONFIGURATION,
      payload: config
    });
  }, []);

  const resetHabitat = useCallback(() => {
    dispatch({
      type: HABITAT_ACTIONS.RESET_HABITAT
    });
  }, []);

  // Get module by ID
  const getModule = useCallback((moduleId) => {
    return state.modules.find(module => module.id === moduleId);
  }, [state.modules]);

  // Get module definition by module ID
  const getModuleDefinition = useCallback((moduleId) => {
    const module = getModule(moduleId);
    if (!module) return null;
    return moduleDefinitions.find(def => def.id === module.definitionId);
  }, [getModule]);

  // Get selected module
  const getSelectedModule = useCallback(() => {
    return state.selectedModuleId ? getModule(state.selectedModuleId) : null;
  }, [state.selectedModuleId, getModule]);

  // Get selected module definition
  const getSelectedModuleDefinition = useCallback(() => {
    const selectedModule = getSelectedModule();
    if (!selectedModule) return null;
    return moduleDefinitions.find(def => def.id === selectedModule.definitionId);
  }, [getSelectedModule]);

  // Export habitat configuration
  const exportConfiguration = useCallback(() => {
    return {
      name: 'Custom Habitat Configuration',
      description: 'User-designed space habitat',
      modules: state.modules,
      connections: state.connections,
      statistics: state.statistics,
      exportTimestamp: Date.now()
    };
  }, [state.modules, state.connections, state.statistics]);

  const contextValue = {
    // State
    ...state,
    
    // Actions
    addModule,
    removeModule,
    updateModule,
    selectModule,
    deselectModule,
    addConnection,
    removeConnection,
    setValidationErrors,
    clearValidationErrors,
    loadConfiguration,
    resetHabitat,
    
    // Getters
    getModule,
    getModuleDefinition,
    getSelectedModule,
    getSelectedModuleDefinition,
    exportConfiguration
  };

  return (
    <HabitatContext.Provider value={contextValue}>
      {children}
    </HabitatContext.Provider>
  );
};

// Custom hook to use the habitat context
export const useHabitat = () => {
  const context = useContext(HabitatContext);
  if (!context) {
    throw new Error('useHabitat must be used within a HabitatProvider');
  }
  return context;
};

export default HabitatContext;