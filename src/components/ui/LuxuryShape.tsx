// src/components/ui/LuxuryShape.tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const LuxuryShape = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null); // To access the distort property directly

  useFrame((state, delta) => {
    // 🚀 FIXED & UPGRADED: Enhanced rotation and dynamic distortion
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.05;
      meshRef.current.rotation.z -= delta * 0.08;
    }

    // 🚀 FIXED: Dynamic distortion based on mouse horizontal movement
    // The void will morph and distort based on mouse horizontal movement
    if (materialRef.current) {
      // Calculate a dynamic distortion based on mouse position
      const baseDistort = 0.45;
      const mouseInfluence = 0.15;
      // state.mouse horizontal ranges from -1 to 1. Normalize and scale.
      const dynamicDistort = baseDistort + Math.sin(state.mouse.x * Math.PI) * mouseInfluence;
      materialRef.current.distort = dynamicDistort;
    }
  });

  return (
    // Float components for elegant breathing movement
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.5}>
        {/* Sphere segments increased for smoother curves */}
        <sphereGeometry args={[1, 128, 128]} />
        
        {/* Switched to a highly reflective, dynamic dark MeshPhysicalMaterial */}
        <MeshDistortMaterial
          ref={materialRef} // Pass the ref to Material here
          color="#000000" // Pure pitch black for maximum contrast against white text/gold bottle
          attach="material"
          distort={0.45} // Initial distortion
          speed={2} // Morphing speed
          roughness={0.02} // Super glossy, almost mirror finish
          metalness={0.95} // High metallic reflection to catch studio lights dramatically
          clearcoat={1} // Wet glassy layer on top
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  );
};