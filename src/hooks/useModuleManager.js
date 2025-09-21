/**
 * Module Manager Hook - Custom hook for managing module operations
 * Provides high-level operations for adding, positioning, and managing modules
 */

import { useCallback, useMemo } from 'react';
import { useHabitat } from '../contexts/HabitatContext';
import { snapToGrid } from '../utils/connectionValidator';
import moduleDefinitions from '../data/moduleDefinitions';

export const useModuleManager = () => {
  const {
    modules,
    selectedModuleId,
    addModule,
    removeModule,
    updateModule,
    selectModule,
    deselectModule,
    getModule,
    getModuleDefinition,
    getSelectedModule,
    getSelectedModuleDefinition,
    statistics
  } = useHabitat();

  /**
   * Add a module at a specific position with grid snapping
   */
  const addModuleAtPosition = useCallback((definitionId, position = [0, 0, 0], snapToGridEnabled = true) => {
    const finalPosition = snapToGridEnabled ? snapToGrid(position, 0.5) : position;
    const moduleId = addModule(definitionId, finalPosition);
    
    // Auto-select the newly added module
    if (moduleId) {
      selectModule(moduleId);
    }
    
    return moduleId;
  }, [addModule, selectModule]);

  /**
   * Move a module to a new position
   */
  const moveModule = useCallback((moduleId, newPosition, snapToGridEnabled = true) => {
    const finalPosition = snapToGridEnabled ? snapToGrid(newPosition, 0.1) : newPosition;
    updateModule(moduleId, { position: finalPosition });
  }, [updateModule]);

  /**
   * Rotate a module
   */
  const rotateModule = useCallback((moduleId, rotation) => {
    updateModule(moduleId, { rotation });
  }, [updateModule]);

  /**
   * Delete the currently selected module
   */
  const deleteSelectedModule = useCallback(() => {
    if (selectedModuleId) {
      removeModule(selectedModuleId);
      deselectModule();
    }
  }, [selectedModuleId, removeModule, deselectModule]);

  /**
   * Clone a module at a new position
   */
  const cloneModule = useCallback((sourceModuleId, offset = [2, 0, 0]) => {
    const sourceModule = getModule(sourceModuleId);
    if (!sourceModule) return null;

    const newPosition = [
      sourceModule.position[0] + offset[0],
      sourceModule.position[1] + offset[1],
      sourceModule.position[2] + offset[2]
    ];

    return addModuleAtPosition(sourceModule.definitionId, newPosition);
  }, [getModule, addModuleAtPosition]);

  /**
   * Get available module types that can be added
   */
  const getAvailableModuleTypes = useMemo(() => {
    return moduleDefinitions.map(def => ({
      id: def.id,
      name: def.name,
      type: def.type,
      description: def.description,
      cost: def.cost,
      thumbnailColor: def.color
    }));
  }, []);

  /**
   * Get modules by type
   */
  const getModulesByType = useCallback((moduleType) => {
    return modules.filter(module => {
      const definition = getModuleDefinition(module.id);
      return definition && definition.type === moduleType;
    });
  }, [modules, getModuleDefinition]);

  /**
   * Get module count by type
   */
  const getModuleCountByType = useMemo(() => {
    const counts = {};
    modules.forEach(module => {
      const definition = getModuleDefinition(module.id);
      if (definition) {
        counts[definition.type] = (counts[definition.type] || 0) + 1;
      }
    });
    return counts;
  }, [modules, getModuleDefinition]);

  /**
   * Find optimal position for a new module near existing modules
   */
  const findOptimalPosition = useCallback((definitionId, targetModuleId = null) => {
    if (modules.length === 0) {
      return [0, 0, 0]; // Origin for first module
    }

    const definition = moduleDefinitions.find(def => def.id === definitionId);
    if (!definition) return [0, 0, 0];

    let referencePosition = [0, 0, 0];
    
    if (targetModuleId) {
      const targetModule = getModule(targetModuleId);
      if (targetModule) {
        referencePosition = targetModule.position;
      }
    } else {
      // Use the position of the last added module or center of mass
      const lastModule = modules[modules.length - 1];
      if (lastModule) {
        referencePosition = lastModule.position;
      }
    }

    // Try positions around the reference module
    const spacing = 8; // meters
    const candidates = [
      [referencePosition[0] + spacing, referencePosition[1], referencePosition[2]],
      [referencePosition[0] - spacing, referencePosition[1], referencePosition[2]],
      [referencePosition[0], referencePosition[1], referencePosition[2] + spacing],
      [referencePosition[0], referencePosition[1], referencePosition[2] - spacing],
      [referencePosition[0], referencePosition[1] + spacing, referencePosition[2]],
      [referencePosition[0], referencePosition[1] - spacing, referencePosition[2]]
    ];

    // Return the first position that doesn't collide
    // (In a real implementation, you'd check for collisions here)
    return snapToGrid(candidates[0], 0.5);
  }, [modules, getModule]);

  /**
   * Get center of mass for all modules
   */
  const getCenterOfMass = useMemo(() => {
    if (modules.length === 0) return [0, 0, 0];

    const totalMass = modules.reduce((sum, module) => {
      const definition = getModuleDefinition(module.id);
      return sum + (definition ? definition.mass : 0);
    }, 0);

    if (totalMass === 0) return [0, 0, 0];

    const weightedSum = modules.reduce((sum, module) => {
      const definition = getModuleDefinition(module.id);
      const mass = definition ? definition.mass : 0;
      return [
        sum[0] + module.position[0] * mass,
        sum[1] + module.position[1] * mass,
        sum[2] + module.position[2] * mass
      ];
    }, [0, 0, 0]);

    return [
      weightedSum[0] / totalMass,
      weightedSum[1] / totalMass,
      weightedSum[2] / totalMass
    ];
  }, [modules, getModuleDefinition]);

  /**
   * Get bounding box of all modules
   */
  const getBoundingBox = useMemo(() => {
    if (modules.length === 0) {
      return { min: [0, 0, 0], max: [0, 0, 0] };
    }

    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    modules.forEach(module => {
      const definition = getModuleDefinition(module.id);
      if (definition) {
        const { width, height, depth } = definition.dimensions;
        const [x, y, z] = module.position;

        minX = Math.min(minX, x - width / 2);
        maxX = Math.max(maxX, x + width / 2);
        minY = Math.min(minY, y - height / 2);
        maxY = Math.max(maxY, y + height / 2);
        minZ = Math.min(minZ, z - depth / 2);
        maxZ = Math.max(maxZ, z + depth / 2);
      }
    });

    return {
      min: [minX, minY, minZ],
      max: [maxX, maxY, maxZ]
    };
  }, [modules, getModuleDefinition]);

  /**
   * Check if a position is occupied
   */
  const isPositionOccupied = useCallback((position, excludeModuleId = null, tolerance = 1.0) => {
    return modules.some(module => {
      if (excludeModuleId && module.id === excludeModuleId) return false;
      
      const distance = Math.sqrt(
        Math.pow(module.position[0] - position[0], 2) +
        Math.pow(module.position[1] - position[1], 2) +
        Math.pow(module.position[2] - position[2], 2)
      );
      
      return distance < tolerance;
    });
  }, [modules]);

  /**
   * Get module density (modules per cubic meter)
   */
  const getModuleDensity = useMemo(() => {
    const bbox = getBoundingBox;
    const volume = (bbox.max[0] - bbox.min[0]) * 
                   (bbox.max[1] - bbox.min[1]) * 
                   (bbox.max[2] - bbox.min[2]);
    
    return volume > 0 ? modules.length / volume : 0;
  }, [modules.length, getBoundingBox]);

  return {
    // State
    modules,
    selectedModuleId,
    statistics,
    
    // Basic operations
    addModuleAtPosition,
    moveModule,
    rotateModule,
    deleteSelectedModule,
    cloneModule,
    selectModule,
    deselectModule,
    
    // Getters
    getModule,
    getModuleDefinition,
    getSelectedModule,
    getSelectedModuleDefinition,
    getAvailableModuleTypes,
    getModulesByType,
    getModuleCountByType,
    
    // Utilities
    findOptimalPosition,
    getCenterOfMass,
    getBoundingBox,
    isPositionOccupied,
    getModuleDensity
  };
};

export default useModuleManager;