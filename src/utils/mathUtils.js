/**
 * Math Utilities for 3D calculations and transformations
 * Common mathematical functions for space habitat builder
 */

/**
 * Convert degrees to radians
 */
export const degToRad = (degrees) => degrees * (Math.PI / 180);

/**
 * Convert radians to degrees
 */
export const radToDeg = (radians) => radians * (180 / Math.PI);

/**
 * Clamp a value between min and max
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Linear interpolation between two values
 */
export const lerp = (start, end, t) => start + (end - start) * t;

/**
 * Map a value from one range to another
 */
export const map = (value, fromMin, fromMax, toMin, toMax) => {
  return toMin + ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin);
};

/**
 * Check if a number is approximately equal to another (with epsilon tolerance)
 */
export const approximately = (a, b, epsilon = 1e-6) => Math.abs(a - b) < epsilon;

/**
 * 3D Vector operations
 */
export const Vector3 = {
  /**
   * Create a new vector
   */
  create: (x = 0, y = 0, z = 0) => [x, y, z],

  /**
   * Add two vectors
   */
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],

  /**
   * Subtract two vectors
   */
  subtract: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],

  /**
   * Multiply vector by scalar
   */
  multiply: (vector, scalar) => [vector[0] * scalar, vector[1] * scalar, vector[2] * scalar],

  /**
   * Divide vector by scalar
   */
  divide: (vector, scalar) => [vector[0] / scalar, vector[1] / scalar, vector[2] / scalar],

  /**
   * Calculate vector length (magnitude)
   */
  length: (vector) => Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]),

  /**
   * Calculate squared length (more efficient when you don't need the actual length)
   */
  lengthSquared: (vector) => vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2],

  /**
   * Normalize vector to unit length
   */
  normalize: (vector) => {
    const length = Vector3.length(vector);
    return length > 0 ? Vector3.divide(vector, length) : [0, 0, 0];
  },

  /**
   * Calculate dot product
   */
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],

  /**
   * Calculate cross product
   */
  cross: (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ],

  /**
   * Calculate distance between two points
   */
  distance: (a, b) => Vector3.length(Vector3.subtract(b, a)),

  /**
   * Calculate squared distance (more efficient)
   */
  distanceSquared: (a, b) => Vector3.lengthSquared(Vector3.subtract(b, a)),

  /**
   * Linear interpolation between two vectors
   */
  lerp: (a, b, t) => [
    lerp(a[0], b[0], t),
    lerp(a[1], b[1], t),
    lerp(a[2], b[2], t)
  ],

  /**
   * Check if two vectors are approximately equal
   */
  approximately: (a, b, epsilon = 1e-6) => 
    approximately(a[0], b[0], epsilon) && 
    approximately(a[1], b[1], epsilon) && 
    approximately(a[2], b[2], epsilon),

  /**
   * Get angle between two vectors (in radians)
   */
  angle: (a, b) => {
    const normA = Vector3.normalize(a);
    const normB = Vector3.normalize(b);
    const dot = Vector3.dot(normA, normB);
    return Math.acos(clamp(dot, -1, 1));
  },

  /**
   * Project vector a onto vector b
   */
  project: (a, b) => {
    const bNorm = Vector3.normalize(b);
    const scalar = Vector3.dot(a, bNorm);
    return Vector3.multiply(bNorm, scalar);
  },

  /**
   * Reflect vector across a normal
   */
  reflect: (vector, normal) => {
    const normalizedNormal = Vector3.normalize(normal);
    const dot = Vector3.dot(vector, normalizedNormal);
    return Vector3.subtract(vector, Vector3.multiply(normalizedNormal, 2 * dot));
  }
};

/**
 * 3D Matrix operations (4x4 matrices in column-major order)
 */
export const Matrix4 = {
  /**
   * Create identity matrix
   */
  identity: () => [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ],

  /**
   * Create translation matrix
   */
  translation: (x, y, z) => [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ],

  /**
   * Create rotation matrix around X axis
   */
  rotationX: (angle) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [
      1, 0, 0, 0,
      0, cos, sin, 0,
      0, -sin, cos, 0,
      0, 0, 0, 1
    ];
  },

  /**
   * Create rotation matrix around Y axis
   */
  rotationY: (angle) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [
      cos, 0, -sin, 0,
      0, 1, 0, 0,
      sin, 0, cos, 0,
      0, 0, 0, 1
    ];
  },

  /**
   * Create rotation matrix around Z axis
   */
  rotationZ: (angle) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [
      cos, sin, 0, 0,
      -sin, cos, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  },

  /**
   * Create scale matrix
   */
  scale: (x, y, z) => [
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z, 0,
    0, 0, 0, 1
  ],

  /**
   * Multiply two matrices
   */
  multiply: (a, b) => {
    const result = new Array(16);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += a[i * 4 + k] * b[k * 4 + j];
        }
        result[i * 4 + j] = sum;
      }
    }
    return result;
  },

  /**
   * Transform a point by matrix
   */
  transformPoint: (matrix, point) => {
    const [x, y, z] = point;
    const w = 1;
    
    return [
      matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12] * w,
      matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13] * w,
      matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14] * w
    ];
  },

  /**
   * Transform a direction by matrix (ignoring translation)
   */
  transformDirection: (matrix, direction) => {
    const [x, y, z] = direction;
    
    return [
      matrix[0] * x + matrix[4] * y + matrix[8] * z,
      matrix[1] * x + matrix[5] * y + matrix[9] * z,
      matrix[2] * x + matrix[6] * y + matrix[10] * z
    ];
  }
};

/**
 * Bounding box utilities
 */
export const BoundingBox = {
  /**
   * Create bounding box from center and size
   */
  fromCenterAndSize: (center, size) => ({
    min: [
      center[0] - size[0] / 2,
      center[1] - size[1] / 2,
      center[2] - size[2] / 2
    ],
    max: [
      center[0] + size[0] / 2,
      center[1] + size[1] / 2,
      center[2] + size[2] / 2
    ]
  }),

  /**
   * Check if two bounding boxes intersect
   */
  intersects: (box1, box2) => {
    return (
      box1.min[0] <= box2.max[0] && box1.max[0] >= box2.min[0] &&
      box1.min[1] <= box2.max[1] && box1.max[1] >= box2.min[1] &&
      box1.min[2] <= box2.max[2] && box1.max[2] >= box2.min[2]
    );
  },

  /**
   * Check if a point is inside a bounding box
   */
  containsPoint: (box, point) => {
    return (
      point[0] >= box.min[0] && point[0] <= box.max[0] &&
      point[1] >= box.min[1] && point[1] <= box.max[1] &&
      point[2] >= box.min[2] && point[2] <= box.max[2]
    );
  },

  /**
   * Get bounding box center
   */
  getCenter: (box) => [
    (box.min[0] + box.max[0]) / 2,
    (box.min[1] + box.max[1]) / 2,
    (box.min[2] + box.max[2]) / 2
  ],

  /**
   * Get bounding box size
   */
  getSize: (box) => [
    box.max[0] - box.min[0],
    box.max[1] - box.min[1],
    box.max[2] - box.min[2]
  ]
};

/**
 * Utility functions for grid snapping and positioning
 */
export const GridUtils = {
  /**
   * Snap a value to the nearest grid increment
   */
  snapToGrid: (value, gridSize) => Math.round(value / gridSize) * gridSize,

  /**
   * Snap a position to grid
   */
  snapPositionToGrid: (position, gridSize) => position.map(coord => 
    GridUtils.snapToGrid(coord, gridSize)
  ),

  /**
   * Get grid position from world position
   */
  worldToGrid: (position, gridSize) => position.map(coord => 
    Math.floor(coord / gridSize)
  ),

  /**
   * Get world position from grid position
   */
  gridToWorld: (gridPosition, gridSize) => gridPosition.map(coord => 
    coord * gridSize
  )
};

/**
 * Random utilities
 */
export const Random = {
  /**
   * Random float between min and max
   */
  range: (min, max) => Math.random() * (max - min) + min,

  /**
   * Random integer between min and max (inclusive)
   */
  rangeInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

  /**
   * Random point on unit sphere
   */
  pointOnSphere: () => {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    
    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.sin(phi) * Math.sin(theta);
    const z = Math.cos(phi);
    
    return [x, y, z];
  },

  /**
   * Random point in unit cube
   */
  pointInCube: () => [
    Random.range(-1, 1),
    Random.range(-1, 1),
    Random.range(-1, 1)
  ]
};

export default {
  degToRad,
  radToDeg,
  clamp,
  lerp,
  map,
  approximately,
  Vector3,
  Matrix4,
  BoundingBox,
  GridUtils,
  Random
};