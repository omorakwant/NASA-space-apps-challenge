/**
 * Module Component - 3D representation of a habitat module
 * Renders individual modules with proper geometry, materials, and interactions
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Module = ({ module, definition, isSelected, onClick }) => {
  const meshRef = useRef();
  const outlineRef = useRef();

  // Create geometry based on module dimensions
  const geometry = useMemo(() => {
    const { width, height, depth } = definition.dimensions;
    return new THREE.BoxGeometry(width, height, depth);
  }, [definition.dimensions]);

  // Create materials
  const material = useMemo(() => {
    const baseColor = new THREE.Color(definition.color);
    
    return new THREE.MeshStandardMaterial({
      color: baseColor,
      metalness: 0.3,
      roughness: 0.4,
      emissive: baseColor.clone().multiplyScalar(0.1),
      transparent: true,
      opacity: 0.9
    });
  }, [definition.color]);

  // Selection outline material
  const outlineMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#00ff88',
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
  }, []);

  // Hover animation
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      const time = state.clock.elapsedTime;
      const floatOffset = Math.sin(time * 2 + module.position[0]) * 0.02;
      meshRef.current.position.y = module.position[1] + floatOffset;

      // Selection pulsing
      if (isSelected && outlineRef.current) {
        const pulse = 1 + Math.sin(time * 4) * 0.1;
        outlineRef.current.scale.setScalar(pulse);
      }

      // Rotation from module rotation property
      meshRef.current.rotation.set(...module.rotation);
    }
  });

  // Handle module interactions
  const handlePointerOver = (event) => {
    event.stopPropagation();
    if (meshRef.current) {
      document.body.style.cursor = 'pointer';
      // Slight scale up on hover
      meshRef.current.scale.set(1.02, 1.02, 1.02);
    }
  };

  const handlePointerOut = (event) => {
    event.stopPropagation();
    if (meshRef.current) {
      document.body.style.cursor = 'auto';
      // Reset scale
      meshRef.current.scale.set(1, 1, 1);
    }
  };

  return (
    <group position={[module.position[0], 0, module.position[2]]}>
      {/* Main module mesh */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        castShadow
        receiveShadow
        onClick={onClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        position={[0, module.position[1], 0]}
      />

      {/* Selection outline */}
      {isSelected && (
        <mesh
          ref={outlineRef}
          geometry={geometry}
          material={outlineMaterial}
          position={[0, module.position[1], 0]}
          scale={1.05}
        />
      )}

      {/* Module type indicator (small geometric shape) */}
      <mesh position={[0, module.position[1] + definition.dimensions.height/2 + 0.3, 0]}>
        {definition.type === 'Central Hub' && (
          <octahedronGeometry args={[0.2]} />
        )}
        {definition.type === 'Living Quarters' && (
          <cylinderGeometry args={[0.15, 0.15, 0.3]} />
        )}
        {definition.type === 'Research Lab' && (
          <coneGeometry args={[0.2, 0.4]} />
        )}
        {definition.type === 'EVA Airlock' && (
          <sphereGeometry args={[0.15]} />
        )}
        {definition.type === 'Storage' && (
          <boxGeometry args={[0.3, 0.2, 0.3]} />
        )}
        {definition.type === 'Recreation' && (
          <torusGeometry args={[0.2, 0.08]} />
        )}
        <meshBasicMaterial
          color={isSelected ? '#00ff88' : definition.color}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Status indicators */}
      {definition.powerConsumption > 1000 && (
        <mesh position={[definition.dimensions.width/2 + 0.2, module.position[1], 0]}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color="#ff6b35" emissive="#ff6b35" emissiveIntensity={0.5} />
        </mesh>
      )}

      {definition.crewCapacity > 0 && (
        <mesh position={[0, module.position[1] + definition.dimensions.height/2 + 0.6, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2]} />
          <meshBasicMaterial color="#4fc3f7" emissive="#4fc3f7" emissiveIntensity={0.3} />
        </mesh>
      )}
    </group>
  );
};

export default Module;