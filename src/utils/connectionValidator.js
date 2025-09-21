/**
 * Connection Validator - Utility functions for validating module connections
 * Handles collision detection, connection point validation, and structural integrity
 */

import { connectionRules, connectionConstraints } from '../data/connectionTypes';
import moduleDefinitions from '../data/moduleDefinitions';

/**
 * Calculate distance between two 3D points
 */
export const distance3D = (point1, point2) => {
  const dx = point1[0] - point2[0];
  const dy = point1[1] - point2[1];
  const dz = point1[2] - point2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

/**
 * Calculate dot product of two 3D vectors
 */
export const dotProduct = (vec1, vec2) => {
  return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
};

/**
 * Normalize a 3D vector
 */
export const normalize = (vector) => {
  const length = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]);
  if (length === 0) return [0, 0, 0];
  return [vector[0] / length, vector[1] / length, vector[2] / length];
};

/**
 * Transform a local point to world coordinates
 */
export const transformPoint = (localPoint, position, rotation) => {
  // Apply rotation (simplified - assumes rotation around Y axis only for now)
  const cos = Math.cos(rotation[1]);
  const sin = Math.sin(rotation[1]);
  
  const rotatedX = localPoint[0] * cos - localPoint[2] * sin;
  const rotatedY = localPoint[1];
  const rotatedZ = localPoint[0] * sin + localPoint[2] * cos;
  
  // Apply translation
  return [
    rotatedX + position[0],
    rotatedY + position[1],
    rotatedZ + position[2]
  ];
};

/**
 * Transform a local normal to world coordinates
 */
export const transformNormal = (localNormal, rotation) => {
  // Apply rotation (simplified - assumes rotation around Y axis only)
  const cos = Math.cos(rotation[1]);
  const sin = Math.sin(rotation[1]);
  
  return normalize([
    localNormal[0] * cos - localNormal[2] * sin,
    localNormal[1],
    localNormal[0] * sin + localNormal[2] * cos
  ]);
};

/**
 * Get world-space connection points for a module
 */
export const getWorldConnectionPoints = (module) => {
  const definition = moduleDefinitions.find(def => def.id === module.definitionId);
  if (!definition) return [];
  
  return definition.connectionPoints.map(point => ({
    ...point,
    worldPosition: transformPoint(point.position, module.position, module.rotation),
    worldNormal: transformNormal(point.normal, module.rotation),
    moduleId: module.id
  }));
};

/**
 * Check if two connection points can connect
 */
export const canConnect = (point1, point2) => {
  // Check if connection types are compatible
  const type1Rules = connectionRules[point1.type] || [];
  if (!type1Rules.includes(point2.type)) {
    return {
      canConnect: false,
      reason: `Incompatible connection types: ${point1.type} cannot connect to ${point2.type}`
    };
  }
  
  // Check distance constraint
  const dist = distance3D(point1.worldPosition, point2.worldPosition);
  if (dist > connectionConstraints.MAX_CONNECTION_DISTANCE) {
    return {
      canConnect: false,
      reason: `Connection points too far apart: ${dist.toFixed(2)}m (max ${connectionConstraints.MAX_CONNECTION_DISTANCE}m)`
    };
  }
  
  // Check normal alignment (should be roughly opposite)
  const alignment = dotProduct(point1.worldNormal, point2.worldNormal);
  if (alignment > -0.7) { // Allow some tolerance
    return {
      canConnect: false,
      reason: `Connection points not properly aligned: ${(Math.acos(-alignment) * 180 / Math.PI).toFixed(1)}° (should be ~180°)`
    };
  }
  
  return {
    canConnect: true,
    reason: 'Connection valid'
  };
};

/**
 * Check for collisions between two modules
 */
export const checkModuleCollision = (module1, module2) => {
  const def1 = moduleDefinitions.find(def => def.id === module1.definitionId);
  const def2 = moduleDefinitions.find(def => def.id === module2.definitionId);
  
  if (!def1 || !def2) return false;
  
  // Simple bounding box collision detection
  const pos1 = module1.position;
  const pos2 = module2.position;
  const dim1 = def1.dimensions;
  const dim2 = def2.dimensions;
  
  const buffer = connectionConstraints.COLLISION_BUFFER;
  
  // Check overlap in each axis
  const overlapX = Math.abs(pos1[0] - pos2[0]) < (dim1.width + dim2.width) / 2 + buffer;
  const overlapY = Math.abs(pos1[1] - pos2[1]) < (dim1.height + dim2.height) / 2 + buffer;
  const overlapZ = Math.abs(pos1[2] - pos2[2]) < (dim1.depth + dim2.depth) / 2 + buffer;
  
  return overlapX && overlapY && overlapZ;
};

/**
 * Snap position to grid
 */
export const snapToGrid = (position, gridSize = connectionConstraints.GRID_SNAP) => {
  return position.map(coord => Math.round(coord / gridSize) * gridSize);
};

/**
 * Find potential connections for a module at a given position
 */
export const findPotentialConnections = (targetModule, targetPosition, existingModules) => {
  const tempModule = { ...targetModule, position: targetPosition };
  const targetPoints = getWorldConnectionPoints(tempModule);
  const potentialConnections = [];
  
  existingModules.forEach(existingModule => {
    if (existingModule.id === targetModule.id) return;
    
    const existingPoints = getWorldConnectionPoints(existingModule);
    
    targetPoints.forEach(targetPoint => {
      existingPoints.forEach(existingPoint => {
        const connection = canConnect(targetPoint, existingPoint);
        if (connection.canConnect) {
          potentialConnections.push({
            targetPoint,
            existingPoint,
            existingModule,
            distance: distance3D(targetPoint.worldPosition, existingPoint.worldPosition)
          });
        }
      });
    });
  });
  
  // Sort by distance (closest first)
  return potentialConnections.sort((a, b) => a.distance - b.distance);
};

/**
 * Validate entire habitat structure
 */
export const validateHabitat = (modules, connections) => {
  const errors = [];
  const warnings = [];
  
  // Check for module collisions
  for (let i = 0; i < modules.length; i++) {
    for (let j = i + 1; j < modules.length; j++) {
      if (checkModuleCollision(modules[i], modules[j])) {
        errors.push({
          type: 'collision',
          message: `Modules ${modules[i].id} and ${modules[j].id} are colliding`,
          moduleIds: [modules[i].id, modules[j].id]
        });
      }
    }
  }
  
  // Check connection validity
  connections.forEach(connection => {
    const module1 = modules.find(m => m.id === connection.moduleId1);
    const module2 = modules.find(m => m.id === connection.moduleId2);
    
    if (!module1 || !module2) {
      errors.push({
        type: 'invalid_connection',
        message: `Connection references non-existent module`,
        connectionId: connection.id
      });
      return;
    }
    
    const points1 = getWorldConnectionPoints(module1);
    const points2 = getWorldConnectionPoints(module2);
    
    const point1 = points1.find(p => p.id === connection.pointId1);
    const point2 = points2.find(p => p.id === connection.pointId2);
    
    if (!point1 || !point2) {
      errors.push({
        type: 'invalid_connection_point',
        message: `Connection references invalid connection point`,
        connectionId: connection.id
      });
      return;
    }
    
    const validation = canConnect(point1, point2);
    if (!validation.canConnect) {
      errors.push({
        type: 'invalid_connection',
        message: validation.reason,
        connectionId: connection.id
      });
    }
  });
  
  // Check structural connectivity (basic reachability)
  if (modules.length > 1) {
    const connected = new Set();
    const toVisit = [modules[0].id];
    
    while (toVisit.length > 0) {
      const currentId = toVisit.pop();
      if (connected.has(currentId)) continue;
      
      connected.add(currentId);
      
      connections.forEach(connection => {
        if (connection.moduleId1 === currentId && !connected.has(connection.moduleId2)) {
          toVisit.push(connection.moduleId2);
        } else if (connection.moduleId2 === currentId && !connected.has(connection.moduleId1)) {
          toVisit.push(connection.moduleId1);
        }
      });
    }
    
    if (connected.size < modules.length) {
      warnings.push({
        type: 'disconnected_modules',
        message: `${modules.length - connected.size} module(s) are not connected to the main structure`,
        severity: 'warning'
      });
    }
  }
  
  return {
    errors,
    warnings,
    isValid: errors.length === 0
  };
};

export default {
  distance3D,
  dotProduct,
  normalize,
  transformPoint,
  transformNormal,
  getWorldConnectionPoints,
  canConnect,
  checkModuleCollision,
  snapToGrid,
  findPotentialConnections,
  validateHabitat
};