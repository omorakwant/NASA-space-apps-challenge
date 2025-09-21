/**
 * Connection Validator Hook - Custom hook for real-time connection validation
 * Provides connection checking, validation feedback, and auto-connection features
 */

import { useCallback, useMemo, useEffect } from 'react';
import { useHabitat } from '../contexts/HabitatContext';
import {
  getWorldConnectionPoints,
  canConnect,
  findPotentialConnections,
  validateHabitat,
  distance3D
} from '../utils/connectionValidator';

export const useConnectionValidator = () => {
  const {
    modules,
    connections,
    validationErrors,
    setValidationErrors,
    clearValidationErrors,
    addConnection,
    removeConnection
  } = useHabitat();

  /**
   * Validate the entire habitat and update validation errors
   */
  const validateAndUpdateErrors = useCallback(() => {
    const validation = validateHabitat(modules, connections);
    setValidationErrors([...validation.errors, ...validation.warnings]);
    return validation;
  }, [modules, connections, setValidationErrors]);

  /**
   * Auto-validate whenever modules or connections change
   */
  useEffect(() => {
    if (modules.length > 0) {
      validateAndUpdateErrors();
    } else {
      clearValidationErrors();
    }
  }, [modules, connections, validateAndUpdateErrors, clearValidationErrors]);

  /**
   * Get all available connection points in world space
   */
  const getAllConnectionPoints = useMemo(() => {
    const allPoints = [];
    modules.forEach(module => {
      const points = getWorldConnectionPoints(module);
      allPoints.push(...points);
    });
    return allPoints;
  }, [modules]);

  /**
   * Find potential connections for a module at a specific position
   */
  const getPotentialConnections = useCallback((moduleId, position = null) => {
    const targetModule = modules.find(m => m.id === moduleId);
    if (!targetModule) return [];

    const moduleAtPosition = position 
      ? { ...targetModule, position }
      : targetModule;

    const otherModules = modules.filter(m => m.id !== moduleId);
    return findPotentialConnections(moduleAtPosition, moduleAtPosition.position, otherModules);
  }, [modules]);

  /**
   * Get the closest potential connection for a module
   */
  const getClosestConnection = useCallback((moduleId, position = null) => {
    const potentials = getPotentialConnections(moduleId, position);
    return potentials.length > 0 ? potentials[0] : null;
  }, [getPotentialConnections]);

  /**
   * Attempt to auto-connect a module to the closest compatible connection
   */
  const autoConnect = useCallback((moduleId) => {
    const closest = getClosestConnection(moduleId);
    if (closest) {
      const connectionId = addConnection(
        moduleId,
        closest.targetPoint.id,
        closest.existingModule.id,
        closest.existingPoint.id
      );
      return connectionId;
    }
    return null;
  }, [getClosestConnection, addConnection]);

  /**
   * Check if two specific modules can connect
   */
  const canModulesConnect = useCallback((moduleId1, pointId1, moduleId2, pointId2) => {
    const module1 = modules.find(m => m.id === moduleId1);
    const module2 = modules.find(m => m.id === moduleId2);
    
    if (!module1 || !module2) return { canConnect: false, reason: 'Module not found' };

    const points1 = getWorldConnectionPoints(module1);
    const points2 = getWorldConnectionPoints(module2);
    
    const point1 = points1.find(p => p.id === pointId1);
    const point2 = points2.find(p => p.id === pointId2);
    
    if (!point1 || !point2) return { canConnect: false, reason: 'Connection point not found' };

    return canConnect(point1, point2);
  }, [modules]);

  /**
   * Get all connections for a specific module
   */
  const getModuleConnections = useCallback((moduleId) => {
    return connections.filter(conn => 
      conn.moduleId1 === moduleId || conn.moduleId2 === moduleId
    );
  }, [connections]);

  /**
   * Check if a module is connected to the main structure
   */
  const isModuleConnected = useCallback((moduleId) => {
    if (modules.length <= 1) return true; // Single module is always "connected"
    
    const visited = new Set();
    const toVisit = [moduleId];
    
    while (toVisit.length > 0) {
      const currentId = toVisit.pop();
      if (visited.has(currentId)) continue;
      
      visited.add(currentId);
      
      connections.forEach(connection => {
        if (connection.moduleId1 === currentId && !visited.has(connection.moduleId2)) {
          toVisit.push(connection.moduleId2);
        } else if (connection.moduleId2 === currentId && !visited.has(connection.moduleId1)) {
          toVisit.push(connection.moduleId1);
        }
      });
    }
    
    // Check if we can reach all modules from this starting module
    return visited.size === modules.length;
  }, [modules, connections]);

  /**
   * Get connection suggestions for a module being moved
   */
  const getConnectionSuggestions = useCallback((moduleId, newPosition, maxSuggestions = 3) => {
    const potentials = getPotentialConnections(moduleId, newPosition);
    return potentials
      .slice(0, maxSuggestions)
      .map(potential => ({
        targetModuleId: potential.existingModule.id,
        targetModuleName: potential.existingModule.name,
        targetPointId: potential.existingPoint.id,
        sourcePointId: potential.targetPoint.id,
        distance: potential.distance,
        connectionType: potential.targetPoint.type,
        confidence: Math.max(0, 1 - (potential.distance / 2)) // Higher confidence for closer connections
      }));
  }, [getPotentialConnections]);

  /**
   * Validate a specific connection
   */
  const validateConnection = useCallback((connectionId) => {
    const connection = connections.find(c => c.id === connectionId);
    if (!connection) return { isValid: false, reason: 'Connection not found' };

    const validation = canModulesConnect(
      connection.moduleId1,
      connection.pointId1,
      connection.moduleId2,
      connection.pointId2
    );

    return {
      isValid: validation.canConnect,
      reason: validation.reason,
      connectionId
    };
  }, [connections, canModulesConnect]);

  /**
   * Get connection statistics
   */
  const getConnectionStatistics = useMemo(() => {
    const totalPoints = getAllConnectionPoints.length;
    const connectedPoints = connections.length * 2; // Each connection uses 2 points
    const utilizationRate = totalPoints > 0 ? (connectedPoints / totalPoints) * 100 : 0;

    const connectionsByType = {};
    connections.forEach(connection => {
      const module1 = modules.find(m => m.id === connection.moduleId1);
      const module2 = modules.find(m => m.id === connection.moduleId2);
      
      if (module1 && module2) {
        const points1 = getWorldConnectionPoints(module1);
        const point1 = points1.find(p => p.id === connection.pointId1);
        
        if (point1) {
          connectionsByType[point1.type] = (connectionsByType[point1.type] || 0) + 1;
        }
      }
    });

    const averageConnectionDistance = connections.length > 0 
      ? connections.reduce((sum, connection) => {
          const module1 = modules.find(m => m.id === connection.moduleId1);
          const module2 = modules.find(m => m.id === connection.moduleId2);
          
          if (module1 && module2) {
            const points1 = getWorldConnectionPoints(module1);
            const points2 = getWorldConnectionPoints(module2);
            const point1 = points1.find(p => p.id === connection.pointId1);
            const point2 = points2.find(p => p.id === connection.pointId2);
            
            if (point1 && point2) {
              return sum + distance3D(point1.worldPosition, point2.worldPosition);
            }
          }
          return sum;
        }, 0) / connections.length 
      : 0;

    return {
      totalConnections: connections.length,
      totalConnectionPoints: totalPoints,
      connectedPoints,
      availablePoints: totalPoints - connectedPoints,
      utilizationRate,
      connectionsByType,
      averageConnectionDistance
    };
  }, [connections, modules, getAllConnectionPoints]);

  /**
   * Get validation summary
   */
  const getValidationSummary = useMemo(() => {
    const errors = validationErrors.filter(error => error.type === 'error' || !error.severity);
    const warnings = validationErrors.filter(error => error.severity === 'warning');
    
    return {
      isValid: errors.length === 0,
      errorCount: errors.length,
      warningCount: warnings.length,
      totalIssues: validationErrors.length,
      criticalIssues: errors.filter(error => 
        error.type === 'collision' || 
        error.type === 'invalid_connection'
      ).length
    };
  }, [validationErrors]);

  /**
   * Clear a specific validation error
   */
  const dismissValidationError = useCallback((errorIndex) => {
    const newErrors = validationErrors.filter((_, index) => index !== errorIndex);
    setValidationErrors(newErrors);
  }, [validationErrors, setValidationErrors]);

  /**
   * Force revalidation
   */
  const revalidate = useCallback(() => {
    return validateAndUpdateErrors();
  }, [validateAndUpdateErrors]);

  return {
    // Connection data
    connections,
    validationErrors,
    getAllConnectionPoints,
    
    // Validation functions
    validateAndUpdateErrors,
    canModulesConnect,
    isModuleConnected,
    validateConnection,
    revalidate,
    
    // Connection discovery
    getPotentialConnections,
    getClosestConnection,
    getConnectionSuggestions,
    autoConnect,
    
    // Module-specific functions
    getModuleConnections,
    
    // Statistics and summaries
    getConnectionStatistics,
    getValidationSummary,
    
    // Error management
    dismissValidationError,
    clearValidationErrors
  };
};

export default useConnectionValidator;