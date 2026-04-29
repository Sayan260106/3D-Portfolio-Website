import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Lamp(props: any) {
  const lightRef = useRef<THREE.PointLight>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // High-fidelity tungsten flicker logic
    if (lightRef.current) {
      const n = Math.sin(time * 10) * Math.sin(time * 20);
      const isFlickering = Math.random() > 0.995; 
      const flickerFactor = isFlickering ? 0.7 + Math.random() * 0.3 : 1;
      
      lightRef.current.intensity = 1.8 * flickerFactor * (0.98 + n * 0.02);
    }
  });

  return (
    <group {...props}>
      {/* Base - Heavy Polished Obsidian */}
      <mesh castShadow>
        <cylinderGeometry args={[0.18, 0.2, 0.04, 32]} />
        <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.5} />
      </mesh>
      
      {/* Main Support - Elegant Minimalist Gold Rod */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 1, 16]} />
        <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Horizontal Cantilever Arm */}
      <group position={[0, 1, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.4, 16]} />
          <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Designer Shade - Conical Brushed Gold */}
        <group position={[-0.4, -0.05, 0]} rotation={[0.2, 0, 0.4]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.22, 0.3, 32, 1, true]} />
            <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
          </mesh>
          
          {/* Light Source */}
          <pointLight 
            ref={lightRef}
            position={[0, -0.1, 0]} 
            color="#ffcc88" 
            intensity={1.8} 
            distance={6} 
            decay={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          
          {/* Subtle Glow inside shade */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#ffcc88" transparent opacity={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
