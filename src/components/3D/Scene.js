/**
 * 3D Scene Component - Main Three.js scene using React Three Fiber
 * Handles camera, lighting, environment, and module rendering
 */

import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Grid,
  Environment,
  Stars,
  Text,
  Html
} from '@react-three/drei';
import { Box, CircularProgress, Typography } from '@mui/material';
import * as THREE from 'three';

// Import components
import Module from './Module';
import ConnectionPoint from './ConnectionPoint';
import Ground from './Ground';

// Import hooks
import { useHabitat } from '../../contexts/HabitatContext';
import moduleDefinitions from '../../data/moduleDefinitions';

// Loading fallback component
const SceneLoading = () => (
  <Html center>
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      sx={{
        background: 'rgba(0, 0, 0, 0.8)',
        padding: 3,
        borderRadius: 2,
        backdropFilter: 'blur(10px)'
      }}
    >
      <CircularProgress size={40} sx={{ color: '#00ff88' }} />
      <Typography variant="body2" color="white">
        Loading 3D Scene...
      </Typography>
    </Box>
  </Html>
);

// Scene content component
const SceneContent = () => {
  const { modules, selectedModuleId, selectModule, deselectModule } = useHabitat();
  const groupRef = useRef();

  // Calculate scene bounds for camera positioning
  const sceneBounds = useMemo(() => {
    if (modules.length === 0) {
      return { center: [0, 0, 0], size: 10 };
    }

    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    modules.forEach(module => {
      const definition = moduleDefinitions.find(def => def.id === module.definitionId);
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

    const center = [
      (minX + maxX) / 2,
      (minY + maxY) / 2,
      (minZ + maxZ) / 2
    ];

    const size = Math.max(
      maxX - minX,
      maxY - minY,
      maxZ - minZ,
      20 // Minimum size
    );

    return { center, size };
  }, [modules]);

  // Handle click events
  const handleModuleClick = (moduleId, event) => {
    event.stopPropagation();
    if (selectedModuleId === moduleId) {
      deselectModule();
    } else {
      selectModule(moduleId);
    }
  };

  const handleBackgroundClick = () => {
    deselectModule();
  };

  // Auto-rotate animation (optional)
  useFrame((state) => {
    if (groupRef.current && modules.length > 0) {
      // Gentle breathing animation for the whole scene
      const time = state.clock.elapsedTime;
      groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.05;
    }
  });

  return (
    <>
      {/* Environment and Atmosphere */}
      {/* <Environment preset="night" /> */}
      <Stars 
        radius={300} 
        depth={50} 
        count={2000} 
        factor={4} 
        saturation={0.5} 
        fade 
        speed={0.5}
      />

      {/* Lighting Setup */}
      <ambientLight intensity={0.3} color="#4a90e2" />
      <directionalLight
        position={[50, 50, 25]}
        intensity={1}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <pointLight position={[0, 20, 0]} intensity={0.5} color="#00ff88" />
      <pointLight position={[-20, -10, -20]} intensity={0.3} color="#ff6b35" />

      {/* Ground and Grid */}
      <Ground />
      <Grid
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#00ff88"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#4fc3f7"
        fadeDistance={50}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
        position={[0, -0.01, 0]}
      />

      {/* Scene Group */}
      <group 
        ref={groupRef} 
        onClick={handleBackgroundClick}
      >
        {/* Render all modules */}
        {modules.map(module => {
          const definition = moduleDefinitions.find(def => def.id === module.definitionId);
          if (!definition) return null;

          const isSelected = selectedModuleId === module.id;

          return (
            <group key={module.id}>
              {/* Main module */}
              <Module
                module={module}
                definition={definition}
                isSelected={isSelected}
                onClick={(event) => handleModuleClick(module.id, event)}
              />

              {/* Module label */}
              <Text
                position={[
                  module.position[0],
                  module.position[1] + definition.dimensions.height / 2 + 1,
                  module.position[2]
                ]}
                fontSize={0.8}
                color={isSelected ? "#00ff88" : "#ffffff"}
                anchorX="center"
                anchorY="middle"
                fontWeight={isSelected ? "bold" : "normal"}
              >
                {definition.name}
              </Text>

              {/* Connection points (show when selected) */}
              {isSelected && definition.connectionPoints.map(point => (
                <ConnectionPoint
                  key={`${module.id}-${point.id}`}
                  module={module}
                  point={point}
                  definition={definition}
                />
              ))}
            </group>
          );
        })}

        {/* Center of mass indicator (when multiple modules) */}
        {modules.length > 1 && (
          <mesh position={sceneBounds.center}>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial color="#ff6b35" transparent opacity={0.7} />
          </mesh>
        )}

        {/* Instructions text (when no modules) */}
        {modules.length === 0 && (
          <Text
            position={[0, 2, 0]}
            fontSize={2}
            color="#4fc3f7"
            anchorX="center"
            anchorY="middle"
            fontWeight="300"
          >
            Add modules from the library
          </Text>
        )}
      </group>

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        dampingFactor={0.05}
        target={sceneBounds.center}
        maxPolarAngle={Math.PI * 0.9}
        minPolarAngle={Math.PI * 0.1}
        maxDistance={sceneBounds.size * 3}
        minDistance={sceneBounds.size * 0.1}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />

      {/* Performance monitor (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <Html position={[10, 10, 0]} transform={false}>
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: 1,
              borderRadius: 1,
              fontSize: 12,
              fontFamily: 'monospace',
              pointerEvents: 'none'
            }}
          >
            Modules: {modules.length} | FPS: ~60
          </Box>
        </Html>
      )}
    </>
  );
};

// Main Scene component
const Scene = () => {
  return (
    <Canvas
      camera={{
        position: [15, 15, 15],
        fov: 60,
        near: 0.1,
        far: 1000
      }}
      shadows
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: true
      }}
      style={{
        width: '100%',
        height: '100%',
        background: 'transparent'
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
    >
      <Suspense fallback={<SceneLoading />}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
};

export default Scene;