/**
 * Module Definitions for Space Habitat Builder
 * Complete specifications for 6 different habitat module types
 * Based on NASA technical standards and ISS module data
 */

export const moduleTypes = {
  CENTRAL_HUB: 'Central Hub',
  LIVING_QUARTERS: 'Living Quarters',
  LABORATORY: 'Research Lab',
  AIRLOCK: 'EVA Airlock',
  STORAGE: 'Storage',
  RECREATION: 'Recreation'
};

export const moduleDefinitions = [
  {
    id: 'central-hub',
    name: 'Central Hub',
    type: moduleTypes.CENTRAL_HUB,
    description: 'Primary structural node with multi-port connectivity',
    dimensions: { width: 4.2, height: 4.2, depth: 4.2 },
    mass: 15000, // kg
    crewCapacity: 0,
    powerConsumption: 500, // watts
    powerGeneration: 0,
    connectionPoints: [
      { id: 'north', position: [0, 0, 2.1], normal: [0, 0, 1], type: 'structural' },
      { id: 'south', position: [0, 0, -2.1], normal: [0, 0, -1], type: 'structural' },
      { id: 'east', position: [2.1, 0, 0], normal: [1, 0, 0], type: 'structural' },
      { id: 'west', position: [-2.1, 0, 0], normal: [-1, 0, 0], type: 'structural' },
      { id: 'up', position: [0, 2.1, 0], normal: [0, 1, 0], type: 'structural' },
      { id: 'down', position: [0, -2.1, 0], normal: [0, -1, 0], type: 'structural' }
    ],
    color: '#4fc3f7',
    cost: 25000000 // USD
  },
  {
    id: 'living-quarters',
    name: 'Living Quarters',
    type: moduleTypes.LIVING_QUARTERS,
    description: 'Residential module with sleeping and personal areas',
    dimensions: { width: 4.2, height: 4.2, depth: 8.5 },
    mass: 12000,
    crewCapacity: 4,
    powerConsumption: 800,
    powerGeneration: 0,
    connectionPoints: [
      { id: 'front', position: [0, 0, 4.25], normal: [0, 0, 1], type: 'structural' },
      { id: 'back', position: [0, 0, -4.25], normal: [0, 0, -1], type: 'structural' }
    ],
    color: '#81c784',
    cost: 18000000
  },
  {
    id: 'laboratory',
    name: 'Research Laboratory',
    type: moduleTypes.LABORATORY,
    description: 'Advanced research facility with specialized equipment',
    dimensions: { width: 4.2, height: 4.2, depth: 10.7 },
    mass: 14000,
    crewCapacity: 2,
    powerConsumption: 1500,
    powerGeneration: 0,
    connectionPoints: [
      { id: 'front', position: [0, 0, 5.35], normal: [0, 0, 1], type: 'structural' },
      { id: 'back', position: [0, 0, -5.35], normal: [0, 0, -1], type: 'structural' },
      { id: 'utility', position: [2.1, 0, 0], normal: [1, 0, 0], type: 'utility' }
    ],
    color: '#ba68c8',
    cost: 35000000
  },
  {
    id: 'airlock',
    name: 'EVA Airlock',
    type: moduleTypes.AIRLOCK,
    description: 'Pressurized chamber for extravehicular activities',
    dimensions: { width: 4.2, height: 4.2, depth: 3.0 },
    mass: 8000,
    crewCapacity: 2,
    powerConsumption: 300,
    powerGeneration: 0,
    connectionPoints: [
      { id: 'inner', position: [0, 0, -1.5], normal: [0, 0, -1], type: 'structural' },
      { id: 'outer', position: [0, 0, 1.5], normal: [0, 0, 1], type: 'external' }
    ],
    color: '#ffb74d',
    cost: 12000000
  },
  {
    id: 'storage',
    name: 'Storage Module',
    type: moduleTypes.STORAGE,
    description: 'High-capacity storage for supplies and equipment',
    dimensions: { width: 4.2, height: 4.2, depth: 6.0 },
    mass: 5000,
    crewCapacity: 0,
    powerConsumption: 100,
    powerGeneration: 0,
    connectionPoints: [
      { id: 'front', position: [0, 0, 3.0], normal: [0, 0, 1], type: 'structural' },
      { id: 'back', position: [0, 0, -3.0], normal: [0, 0, -1], type: 'structural' }
    ],
    color: '#f06292',
    cost: 8000000
  },
  {
    id: 'recreation',
    name: 'Recreation Module',
    type: moduleTypes.RECREATION,
    description: 'Multi-purpose space for exercise and relaxation',
    dimensions: { width: 6.0, height: 6.0, depth: 8.0 },
    mass: 10000,
    crewCapacity: 8,
    powerConsumption: 600,
    powerGeneration: 0,
    connectionPoints: [
      { id: 'front', position: [0, 0, 4.0], normal: [0, 0, 1], type: 'structural' },
      { id: 'back', position: [0, 0, -4.0], normal: [0, 0, -1], type: 'structural' }
    ],
    color: '#4db6ac',
    cost: 15000000
  }
];

// Sample habitat configurations
export const sampleConfigurations = {
  'mars-research-station': {
    name: 'Mars Research Station',
    description: 'Compact research outpost for 6 crew members',
    modules: [
      {
        id: 'hub-1',
        definitionId: 'central-hub',
        position: [0, 0, 0],
        rotation: [0, 0, 0]
      },
      {
        id: 'lab-1',
        definitionId: 'laboratory',
        position: [0, 0, 9.35],
        rotation: [0, 0, 0]
      },
      {
        id: 'quarters-1',
        definitionId: 'living-quarters',
        position: [6.3, 0, 0],
        rotation: [0, Math.PI/2, 0]
      },
      {
        id: 'airlock-1',
        definitionId: 'airlock',
        position: [-3.6, 0, 0],
        rotation: [0, -Math.PI/2, 0]
      }
    ]
  },
  'lunar-base': {
    name: 'Lunar Base Alpha',
    description: 'Large permanent settlement for 12 crew members',
    modules: [
      {
        id: 'hub-1',
        definitionId: 'central-hub',
        position: [0, 0, 0],
        rotation: [0, 0, 0]
      },
      {
        id: 'quarters-1',
        definitionId: 'living-quarters',
        position: [0, 0, 8.7],
        rotation: [0, 0, 0]
      },
      {
        id: 'quarters-2',
        definitionId: 'living-quarters',
        position: [0, 0, -8.7],
        rotation: [0, Math.PI, 0]
      },
      {
        id: 'lab-1',
        definitionId: 'laboratory',
        position: [6.3, 0, 0],
        rotation: [0, Math.PI/2, 0]
      },
      {
        id: 'lab-2',
        definitionId: 'laboratory',
        position: [-6.3, 0, 0],
        rotation: [0, -Math.PI/2, 0]
      },
      {
        id: 'storage-1',
        definitionId: 'storage',
        position: [0, 6.2, 0],
        rotation: [Math.PI/2, 0, 0]
      },
      {
        id: 'recreation-1',
        definitionId: 'recreation',
        position: [0, -8.1, 0],
        rotation: [-Math.PI/2, 0, 0]
      },
      {
        id: 'airlock-1',
        definitionId: 'airlock',
        position: [6.3, 0, 11.85],
        rotation: [0, Math.PI/2, 0]
      }
    ]
  }
};

export default moduleDefinitions;