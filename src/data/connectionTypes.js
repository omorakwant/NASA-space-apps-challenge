/**
 * Connection Types and Validation Rules
 * Defines how different module types can connect to each other
 */

export const connectionTypes = {
  STRUCTURAL: 'structural',
  UTILITY: 'utility',
  EXTERNAL: 'external'
};

export const connectionRules = {
  // Structural connections can connect to other structural connections
  [connectionTypes.STRUCTURAL]: [connectionTypes.STRUCTURAL],
  
  // Utility connections can connect to structural or other utility connections
  [connectionTypes.UTILITY]: [connectionTypes.STRUCTURAL, connectionTypes.UTILITY],
  
  // External connections are for airlocks and cannot connect to internal connections
  [connectionTypes.EXTERNAL]: []
};

export const connectionConstraints = {
  // Maximum distance for connection validation (meters)
  MAX_CONNECTION_DISTANCE: 0.5,
  
  // Minimum angle alignment for connection (radians)
  MIN_ALIGNMENT_ANGLE: Math.PI * 0.8, // 144 degrees (near opposite)
  
  // Grid snap increment (meters)
  GRID_SNAP: 0.1,
  
  // Module collision buffer (meters)
  COLLISION_BUFFER: 0.2
};

export const powerRequirements = {
  // Power system constraints
  MINIMUM_POWER_MARGIN: 100, // watts
  BATTERY_CAPACITY: 10000, // watt-hours
  SOLAR_PANEL_OUTPUT: 2000, // watts per panel
  REACTOR_OUTPUT: 5000 // watts per reactor
};

export default {
  connectionTypes,
  connectionRules,
  connectionConstraints,
  powerRequirements
};