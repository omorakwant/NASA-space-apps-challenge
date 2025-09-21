/**
 * Connection Point Component - 3D representation of module connection points
 * Shows available connection points on modules and their compatibility
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { transformPoint, transformNormal } from '../../utils/connectionValidator';

const ConnectionPoint = ({ module, point, definition }) => {
  const meshRef = useRef();
  const ringRef = useRef();

  // Calculate world position
  const worldPosition = useMemo(() => {
    return transformPoint(point.position, module.position, module.rotation);
  }, [point.position, module.position, module.rotation]);

  // Calculate world normal
  const worldNormal = useMemo(() => {
    return transformNormal(point.normal, module.rotation);
  }, [point.normal, module.rotation]);

  // Color based on connection type
  const pointColor = useMemo(() => {
    switch (point.type) {
      case 'structural':
        return '#00ff88'; // Green for structural
      case 'utility':
        return '#4fc3f7'; // Blue for utility
      case 'external':
        return '#ff6b35'; // Orange for external
      default:
        return '#ffffff';
    }
  }, [point.type]);

  // Materials
  const sphereMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: pointColor,
      transparent: true,
      opacity: 0.8,
      emissive: pointColor,
      emissiveIntensity: 0.3
    });
  }, [pointColor]);

  const ringMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: pointColor,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
  }, [pointColor]);

  // Animation
  useFrame((state) => {
    if (meshRef.current && ringRef.current) {
      const time = state.clock.elapsedTime;
      
      // Pulsing animation
      const pulse = 1 + Math.sin(time * 3) * 0.2;
      meshRef.current.scale.setScalar(pulse);
      
      // Ring rotation
      ringRef.current.rotation.z = time * 2;
      
      // Intensity pulsing
      const intensity = 0.3 + Math.sin(time * 4) * 0.2;
      sphereMaterial.emissiveIntensity = intensity;
    }
  });

  // Calculate ring orientation based on normal
  const ringRotation = useMemo(() => {
    const normal = new THREE.Vector3(...worldNormal);
    const up = new THREE.Vector3(0, 1, 0);
    
    // Create rotation to align ring with normal
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(up, normal);
    
    const euler = new THREE.Euler();
    euler.setFromQuaternion(quaternion);
    
    return [euler.x, euler.y, euler.z];
  }, [worldNormal]);

  return (
    <group>
      {/* Connection point sphere */}
      <mesh
        ref={meshRef}
        position={worldPosition}
        material={sphereMaterial}
      >
        <sphereGeometry args={[0.15]} />
      </mesh>

      {/* Connection ring indicator */}
      <mesh
        ref={ringRef}
        position={worldPosition}
        rotation={ringRotation}
        material={ringMaterial}
      >
        <ringGeometry args={[0.2, 0.3, 16]} />
      </mesh>

      {/* Normal direction indicator */}
      <mesh
        position={[
          worldPosition[0] + worldNormal[0] * 0.5,
          worldPosition[1] + worldNormal[1] * 0.5,
          worldPosition[2] + worldNormal[2] * 0.5
        ]}
      >
        <coneGeometry args={[0.05, 0.3]} />
        <meshBasicMaterial 
          color={pointColor} 
          transparent 
          opacity={0.6}
        />
      </mesh>

      {/* Connection type label */}
      <Text
        position={[
          worldPosition[0] + worldNormal[0] * 0.8,
          worldPosition[1] + worldNormal[1] * 0.8,
          worldPosition[2] + worldNormal[2] * 0.8
        ]}
        fontSize={0.3}
        color={pointColor}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {point.type.toUpperCase()}
      </Text>

      {/* Point ID label (smaller) */}
      <Text
        position={[
          worldPosition[0] + worldNormal[0] * 1.1,
          worldPosition[1] + worldNormal[1] * 1.1,
          worldPosition[2] + worldNormal[2] * 1.1
        ]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        opacity={0.7}
      >
        {point.id}
      </Text>
    </group>
  );
};

export default ConnectionPoint;