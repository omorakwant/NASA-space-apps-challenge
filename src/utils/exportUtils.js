/**
 * Export Utils - Functions for exporting habitat designs in various formats
 * Supports JSON, Markdown, and OBJ formats
 */

import { saveAs } from 'file-saver';
import moduleDefinitions from '../data/moduleDefinitions';

/**
 * Export habitat configuration as JSON
 */
export const exportJSON = (habitatData, filename = 'habitat-design') => {
  const exportData = {
    meta: {
      name: habitatData.name || 'Space Habitat Design',
      description: habitatData.description || 'Exported habitat configuration',
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      tool: 'Space Habitat Builder'
    },
    modules: habitatData.modules.map(module => {
      const definition = moduleDefinitions.find(def => def.id === module.definitionId);
      return {
        id: module.id,
        type: definition?.name || 'Unknown',
        definitionId: module.definitionId,
        position: module.position,
        rotation: module.rotation,
        specifications: definition ? {
          dimensions: definition.dimensions,
          mass: definition.mass,
          crewCapacity: definition.crewCapacity,
          powerConsumption: definition.powerConsumption,
          powerGeneration: definition.powerGeneration,
          cost: definition.cost
        } : null
      };
    }),
    connections: habitatData.connections || [],
    statistics: habitatData.statistics || {},
    validation: habitatData.validation || {}
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  saveAs(blob, `${filename}.json`);
  
  return exportData;
};

/**
 * Export habitat design as Markdown technical specification
 */
export const exportMarkdown = (habitatData, filename = 'habitat-spec') => {
  const stats = habitatData.statistics || {};
  const modules = habitatData.modules || [];
  
  let markdown = `# Space Habitat Design Specification\n\n`;
  
  // Overview section
  markdown += `## Overview\n\n`;
  markdown += `**Design Name:** ${habitatData.name || 'Space Habitat Design'}\n`;
  markdown += `**Description:** ${habitatData.description || 'Custom space habitat design'}\n`;
  markdown += `**Generated:** ${new Date().toLocaleDateString()}\n`;
  markdown += `**Tool:** Space Habitat Builder v1.0\n\n`;
  
  // Statistics section
  markdown += `## Habitat Statistics\n\n`;
  markdown += `| Metric | Value | Unit |\n`;
  markdown += `|--------|-------|------|\n`;
  markdown += `| Total Modules | ${stats.totalModules || 0} | modules |\n`;
  markdown += `| Total Mass | ${(stats.totalMass || 0).toLocaleString()} | kg |\n`;
  markdown += `| Crew Capacity | ${stats.totalCrewCapacity || 0} | persons |\n`;
  markdown += `| Power Consumption | ${(stats.totalPowerConsumption || 0).toLocaleString()} | watts |\n`;
  markdown += `| Power Generation | ${(stats.totalPowerGeneration || 0).toLocaleString()} | watts |\n`;
  markdown += `| Power Balance | ${stats.powerBalance || 0} | watts |\n`;
  markdown += `| Total Cost | $${(stats.totalCost || 0).toLocaleString()} | USD |\n\n`;
  
  // Module inventory
  markdown += `## Module Inventory\n\n`;
  const moduleInventory = {};
  modules.forEach(module => {
    const definition = moduleDefinitions.find(def => def.id === module.definitionId);
    if (definition) {
      if (!moduleInventory[definition.name]) {
        moduleInventory[definition.name] = {
          count: 0,
          definition
        };
      }
      moduleInventory[definition.name].count++;
    }
  });
  
  Object.entries(moduleInventory).forEach(([name, data]) => {
    const def = data.definition;
    markdown += `### ${name} (${data.count}x)\n\n`;
    markdown += `${def.description}\n\n`;
    markdown += `**Specifications:**\n`;
    markdown += `- Dimensions: ${def.dimensions.width}m × ${def.dimensions.height}m × ${def.dimensions.depth}m\n`;
    markdown += `- Mass: ${def.mass.toLocaleString()} kg\n`;
    markdown += `- Crew Capacity: ${def.crewCapacity} persons\n`;
    markdown += `- Power Consumption: ${def.powerConsumption} watts\n`;
    markdown += `- Power Generation: ${def.powerGeneration} watts\n`;
    markdown += `- Cost: $${def.cost.toLocaleString()}\n\n`;
  });
  
  // Detailed module layout
  markdown += `## Module Layout\n\n`;
  modules.forEach((module, index) => {
    const definition = moduleDefinitions.find(def => def.id === module.definitionId);
    if (definition) {
      markdown += `### ${index + 1}. ${definition.name} (${module.id})\n\n`;
      markdown += `**Position:** [${module.position.map(p => p.toFixed(2)).join(', ')}] meters\n`;
      markdown += `**Rotation:** [${module.rotation.map(r => (r * 180 / Math.PI).toFixed(1)).join(', ')}] degrees\n\n`;
    }
  });
  
  // Assembly sequence
  markdown += `## Assembly Sequence\n\n`;
  markdown += `### Phase 1: Core Structure\n`;
  markdown += `1. Deploy Central Hub module as primary structural node\n`;
  markdown += `2. Verify all connection points and structural integrity\n`;
  markdown += `3. Establish primary power and life support connections\n\n`;
  
  markdown += `### Phase 2: Essential Systems\n`;
  const criticalModules = modules.filter(module => {
    const def = moduleDefinitions.find(d => d.id === module.definitionId);
    return def && (def.type === 'Living Quarters' || def.type === 'EVA Airlock');
  });
  
  criticalModules.forEach((module, index) => {
    const def = moduleDefinitions.find(d => d.id === module.definitionId);
    markdown += `${index + 4}. Install ${def.name} module\n`;
  });
  markdown += `\n`;
  
  markdown += `### Phase 3: Secondary Systems\n`;
  const secondaryModules = modules.filter(module => {
    const def = moduleDefinitions.find(d => d.id === module.definitionId);
    return def && (def.type === 'Research Lab' || def.type === 'Storage' || def.type === 'Recreation');
  });
  
  secondaryModules.forEach((module, index) => {
    const def = moduleDefinitions.find(d => d.id === module.definitionId);
    markdown += `${criticalModules.length + index + 4}. Connect ${def.name} module\n`;
  });
  markdown += `\n`;
  
  // Safety considerations
  markdown += `## Safety & Operational Considerations\n\n`;
  markdown += `### Structural Integrity\n`;
  markdown += `- All modules connected via certified structural interfaces\n`;
  markdown += `- Redundant connection points for critical modules\n`;
  markdown += `- Regular structural health monitoring required\n\n`;
  
  markdown += `### Life Support Systems\n`;
  markdown += `- Atmospheric pressure maintained at 101.3 kPa\n`;
  markdown += `- Oxygen/nitrogen atmosphere (21%/79%)\n`;
  markdown += `- CO2 scrubbing and recycling systems operational\n`;
  markdown += `- Water recovery and recycling systems active\n\n`;
  
  markdown += `### Power Systems\n`;
  if (stats.powerBalance >= 0) {
    markdown += `- Power generation meets or exceeds consumption\n`;
    markdown += `- Battery backup systems for emergency power\n`;
  } else {
    markdown += `- ⚠️ **WARNING:** Power consumption exceeds generation by ${Math.abs(stats.powerBalance)} watts\n`;
    markdown += `- Additional power generation required\n`;
  }
  markdown += `- Redundant power distribution systems\n\n`;
  
  // Footer
  markdown += `---\n`;
  markdown += `*Generated by Space Habitat Builder - NASA Space Apps Challenge 2025*\n`;
  
  const blob = new Blob([markdown], { type: 'text/markdown' });
  saveAs(blob, `${filename}.md`);
  
  return markdown;
};

/**
 * Export habitat as OBJ 3D model (simplified geometry)
 */
export const exportOBJ = (habitatData, filename = 'habitat-model') => {
  const modules = habitatData.modules || [];
  let objContent = `# Space Habitat 3D Model\n`;
  objContent += `# Generated by Space Habitat Builder\n`;
  objContent += `# ${new Date().toISOString()}\n\n`;
  
  let vertexIndex = 1;
  
  modules.forEach((module, moduleIndex) => {
    const definition = moduleDefinitions.find(def => def.id === module.definitionId);
    if (!definition) return;
    
    objContent += `# Module: ${definition.name} (${module.id})\n`;
    objContent += `o Module_${moduleIndex + 1}_${definition.name.replace(/\s+/g, '_')}\n`;
    
    const { width, height, depth } = definition.dimensions;
    const [x, y, z] = module.position;
    const [rx, ry, rz] = module.rotation;
    
    // Generate box vertices (8 vertices per module)
    const vertices = [
      [-width/2, -height/2, -depth/2],
      [ width/2, -height/2, -depth/2],
      [ width/2,  height/2, -depth/2],
      [-width/2,  height/2, -depth/2],
      [-width/2, -height/2,  depth/2],
      [ width/2, -height/2,  depth/2],
      [ width/2,  height/2,  depth/2],
      [-width/2,  height/2,  depth/2]
    ];
    
    // Apply transformations and output vertices
    vertices.forEach(vertex => {
      // Apply rotation (simplified - Y rotation only)
      const cos = Math.cos(ry);
      const sin = Math.sin(ry);
      const rotatedX = vertex[0] * cos - vertex[2] * sin;
      const rotatedZ = vertex[0] * sin + vertex[2] * cos;
      
      // Apply translation
      const finalX = rotatedX + x;
      const finalY = vertex[1] + y;
      const finalZ = rotatedZ + z;
      
      objContent += `v ${finalX.toFixed(6)} ${finalY.toFixed(6)} ${finalZ.toFixed(6)}\n`;
    });
    
    // Generate faces (12 triangular faces per box)
    const faceIndices = [
      // Bottom face
      [0, 1, 2], [0, 2, 3],
      // Top face  
      [4, 7, 6], [4, 6, 5],
      // Front face
      [0, 4, 5], [0, 5, 1],
      // Back face
      [2, 6, 7], [2, 7, 3],
      // Left face
      [0, 3, 7], [0, 7, 4],
      // Right face
      [1, 5, 6], [1, 6, 2]
    ];
    
    faceIndices.forEach(face => {
      const v1 = vertexIndex + face[0];
      const v2 = vertexIndex + face[1];
      const v3 = vertexIndex + face[2];
      objContent += `f ${v1} ${v2} ${v3}\n`;
    });
    
    vertexIndex += 8;
    objContent += `\n`;
  });
  
  // Add connection points as small spheres (simplified as additional geometry)
  objContent += `# Connection Points\n`;
  modules.forEach((module, moduleIndex) => {
    const definition = moduleDefinitions.find(def => def.id === module.definitionId);
    if (!definition) return;
    
    definition.connectionPoints.forEach((point, pointIndex) => {
      const [x, y, z] = module.position;
      const [px, py, pz] = point.position;
      
      // Transform connection point position
      const cos = Math.cos(module.rotation[1]);
      const sin = Math.sin(module.rotation[1]);
      const rotatedX = px * cos - pz * sin;
      const rotatedZ = px * sin + pz * cos;
      
      const finalX = rotatedX + x;
      const finalY = py + y;
      const finalZ = rotatedZ + z;
      
      objContent += `o ConnectionPoint_${moduleIndex + 1}_${pointIndex + 1}\n`;
      objContent += `v ${finalX.toFixed(6)} ${finalY.toFixed(6)} ${finalZ.toFixed(6)}\n`;
      vertexIndex++;
    });
  });
  
  const blob = new Blob([objContent], { type: 'text/plain' });
  saveAs(blob, `${filename}.obj`);
  
  return objContent;
};

/**
 * Generate technical report with detailed analysis
 */
export const generateTechnicalReport = (habitatData) => {
  const stats = habitatData.statistics || {};
  const modules = habitatData.modules || [];
  
  const report = {
    summary: {
      designName: habitatData.name || 'Space Habitat Design',
      totalModules: stats.totalModules || 0,
      totalMass: stats.totalMass || 0,
      crewCapacity: stats.totalCrewCapacity || 0,
      powerBalance: stats.powerBalance || 0,
      estimatedCost: stats.totalCost || 0
    },
    massAnalysis: {
      totalMass: stats.totalMass || 0,
      massPerModule: modules.length > 0 ? (stats.totalMass || 0) / modules.length : 0,
      heaviestModule: modules.reduce((heaviest, module) => {
        const def = moduleDefinitions.find(d => d.id === module.definitionId);
        const currentMass = def ? def.mass : 0;
        return currentMass > (heaviest.mass || 0) ? { id: module.id, type: def?.name, mass: currentMass } : heaviest;
      }, {}),
      massDistribution: {}
    },
    powerAnalysis: {
      totalConsumption: stats.totalPowerConsumption || 0,
      totalGeneration: stats.totalPowerGeneration || 0,
      powerBalance: stats.powerBalance || 0,
      efficiency: stats.totalPowerGeneration > 0 ? (stats.totalPowerConsumption / stats.totalPowerGeneration) * 100 : 0,
      criticalSystems: modules.filter(module => {
        const def = moduleDefinitions.find(d => d.id === module.definitionId);
        return def && def.powerConsumption > 1000; // High power consumers
      }).map(module => {
        const def = moduleDefinitions.find(d => d.id === module.definitionId);
        return { type: def.name, consumption: def.powerConsumption };
      })
    },
    structuralAnalysis: {
      totalVolume: modules.reduce((total, module) => {
        const def = moduleDefinitions.find(d => d.id === module.definitionId);
        if (def) {
          const volume = def.dimensions.width * def.dimensions.height * def.dimensions.depth;
          return total + volume;
        }
        return total;
      }, 0),
      pressurizedVolume: 0, // Would need more detailed calculation
      connectionPoints: modules.reduce((total, module) => {
        const def = moduleDefinitions.find(d => d.id === module.definitionId);
        return total + (def ? def.connectionPoints.length : 0);
      }, 0)
    },
    costAnalysis: {
      totalCost: stats.totalCost || 0,
      costPerCrewMember: stats.totalCrewCapacity > 0 ? (stats.totalCost || 0) / stats.totalCrewCapacity : 0,
      costBreakdown: {},
      mostExpensiveModule: modules.reduce((expensive, module) => {
        const def = moduleDefinitions.find(d => d.id === module.definitionId);
        const currentCost = def ? def.cost : 0;
        return currentCost > (expensive.cost || 0) ? { type: def?.name, cost: currentCost } : expensive;
      }, {})
    },
    recommendations: []
  };
  
  // Generate recommendations based on analysis
  if (report.powerAnalysis.powerBalance < 0) {
    report.recommendations.push({
      type: 'power',
      priority: 'critical',
      message: 'Power generation insufficient. Consider adding power generation modules or reducing consumption.'
    });
  }
  
  if (report.summary.crewCapacity < 4) {
    report.recommendations.push({
      type: 'crew',
      priority: 'medium',
      message: 'Low crew capacity may limit operational effectiveness. Consider additional living quarters.'
    });
  }
  
  if (report.structuralAnalysis.connectionPoints < modules.length * 2) {
    report.recommendations.push({
      type: 'structural',
      priority: 'low',
      message: 'Limited connection redundancy. Consider modules with more connection points for flexibility.'
    });
  }
  
  return report;
};

export default {
  exportJSON,
  exportMarkdown,
  exportOBJ,
  generateTechnicalReport
};