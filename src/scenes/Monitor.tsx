import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'motion/react';
import Desktop from '../components/Desktop';

export default function Monitor(props: any) {
  return (
    <group {...props}>
      {/* Modern Architectural Stand - Base */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.65, 0.03, 32]} />
        <meshStandardMaterial color="#444" metalness={1} roughness={0.1} />
      </mesh>
      
      {/* Stand - Structured Neck with Joint */}
      <group position={[0, 0, -0.1]}>
        <mesh position={[0, 0.7, -0.1]} castShadow>
          <boxGeometry args={[0.2, 1.4, 0.08]} />
          <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* VESA Mount Connection Area */}
        <mesh position={[0, 1.65, 0]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.1]} />
          <meshStandardMaterial color="#222" metalness={0.8} />
        </mesh>
      </group>

      {/* Display Housing - Tapered Back Panel */}
      <group position={[0, 1.65, 0]}>
        {/* Main Chassis (Front plate) */}
        <mesh castShadow>
          <boxGeometry args={[2.8, 1.8, 0.08]} />
          <meshStandardMaterial color="#111" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Solid Occluder (Strictly prevents see-through from back) */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[2.8, 1.8]} />
          <meshBasicMaterial color="#000" side={THREE.BackSide} />
        </mesh>

        {/* Tapered Back Panel (Modern structured volume) */}
        <mesh position={[0, 0, -0.15]} castShadow>
          <boxGeometry args={[2.4, 1.4, 0.3]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Ambient Bias Light (Ambilight effect) */}
        <pointLight position={[0, 0, -0.2]} intensity={0.5} distance={3} color="#c5a059" />
        <mesh position={[0, 0, -0.2]}>
          <planeGeometry args={[2, 1.2]} />
          <meshBasicMaterial color="#c5a059" transparent opacity={0.05} />
        </mesh>

        {/* Screen Bezel / Border */}
        <mesh position={[0, 0, 0.05]} castShadow>
          <boxGeometry args={[2.72, 1.72, 0.02]} />
          <meshStandardMaterial color="#050505" roughness={0} />
        </mesh>

        {/* Screen Surface (Active Area) */}
        <mesh position={[0, 0, 0.065]}>
          <planeGeometry args={[2.65, 1.65]} />
          <meshStandardMaterial 
            color="#000" 
            roughness={0.1}
            metalness={0.2}
          />
          
          {/* The Actual OS UI */}
          <Html
            transform
            distanceFactor={1.4}
            position={[0, 0, 0.01]}
            scale={[1, 1, 1]}
            className="w-[1280px] h-[800px] bg-[#050505] overflow-hidden pointer-events-auto rounded-[8px]"
            occlude="blending"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 2 }}
              className="relative w-full h-full"
            >
              <Desktop />
              {/* Modern Screen Finishes (Glass/Glow) */}
              <div className="absolute inset-0 pointer-events-none rounded-[8px]">
                {/* Subtle outer glow */}
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#c5a059]/20 blur-sm" />
                {/* Anti-reflective coating effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 mix-blend-overlay" />
              </div>
            </motion.div>
          </Html>
        </mesh>
      </group>

      {/* Discrete Status Indicator (Modern) */}
      <mesh position={[1.3, 0.38, 0.06]}>
        <sphereGeometry args={[0.005, 16, 16]} />
        <meshStandardMaterial color="#c5a059" emissive="#c5a059" emissiveIntensity={4} />
      </mesh>
    </group>
  );
}

