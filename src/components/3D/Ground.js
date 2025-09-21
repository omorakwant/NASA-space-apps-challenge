/**
 * Ground Component - 3D ground plane with grid and reference markers
 * Provides visual reference for the 3D scene
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';

const Ground = () => {
  // Ground geometry
  const groundGeometry = useMemo(() => {
    return new THREE.PlaneGeometry(200, 200);
  }, []);

  // Ground material with space-themed appearance
  const groundMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#0a0a0a',
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
      roughness: 1,
      metalness: 0
    });
  }, []);

  // Origin marker geometry
  const originGeometry = useMemo(() => {
    return new THREE.RingGeometry(0.8, 1.2, 32);
  }, []);

  const originMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#00ff88',
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
  }, []);

  // Axis markers
  const axisMarkers = useMemo(() => {
    const markers = [];
    
    // X-axis (red)
    markers.push({
      position: [5, 0.01, 0],
      rotation: [0, 0, -Math.PI / 2],
      color: '#ff3333',
      label: 'X'
    });

    // Y-axis (green) 
    markers.push({
      position: [0, 5, 0],
      rotation: [0, 0, 0],
      color: '#33ff33',
      label: 'Y'
    });

    // Z-axis (blue)
    markers.push({
      position: [0, 0.01, 5],
      rotation: [Math.PI / 2, 0, 0],
      color: '#3333ff',
      label: 'Z'
    });

    return markers;
  }, []);

  return (
    <group>
      {/* Main ground plane */}
      <mesh
        geometry={groundGeometry}
        material={groundMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        receiveShadow
      />

      {/* Origin marker */}
      <mesh
        geometry={originGeometry}
        material={originMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
      />

      {/* Axis markers */}
      {axisMarkers.map((marker, index) => (
        <group key={index}>
          <mesh position={marker.position} rotation={marker.rotation}>
            <cylinderGeometry args={[0.05, 0.15, 1]} />
            <meshBasicMaterial 
              color={marker.color}
              transparent
              opacity={0.7}
            />
          </mesh>
          
          {/* Axis labels would go here if we had Text component available */}
        </group>
      ))}

      {/* Reference circles at regular intervals */}
      {[5, 10, 20, 50].map((radius, index) => (
        <mesh
          key={radius}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.005, 0]}
        >
          <ringGeometry args={[radius - 0.1, radius + 0.1, 64]} />
          <meshBasicMaterial 
            color="#ffffff"
            transparent
            opacity={0.1 - index * 0.02}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Distance markers (every 10 units) */}
      {[-50, -40, -30, -20, -10, 10, 20, 30, 40, 50].map(distance => (
        <group key={distance}>
          {/* X-axis markers */}
          <mesh position={[distance, 0.01, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.2]} />
            <meshBasicMaterial 
              color="#ff6b35"
              transparent
              opacity={0.5}
            />
          </mesh>

          {/* Z-axis markers */}
          <mesh position={[0, 0.01, distance]}>
            <cylinderGeometry args={[0.1, 0.1, 0.2]} />
            <meshBasicMaterial 
              color="#4fc3f7"
              transparent
              opacity={0.5}
            />
          </mesh>
        </group>
      ))}

      {/* Subtle ambient particles for atmosphere */}
      {Array.from({ length: 50 }, (_, i) => {
        const angle = (i / 50) * Math.PI * 2;
        const radius = 10 + Math.random() * 40;
        const height = Math.random() * 2 + 0.1;
        
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial 
              color="#4fc3f7"
              transparent
              opacity={0.3}
              emissive="#4fc3f7"
              emissiveIntensity={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default Ground;