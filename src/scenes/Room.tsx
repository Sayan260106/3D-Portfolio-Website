import React, { Suspense } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import Computer from './Computer';
import Monitor from './Monitor';
import Lamp from './Lamp';
import Keyboard from './Keyboard';
import Plant from './Plant';
import WallPlant from './WallPlant';

function Painting() {
  // Using a stunning ethereal abstract piece that matches the "deity" vibe (Blue/Gold/Divine)
  const texture = useTexture('https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=1600');
  texture.colorSpace = THREE.SRGBColorSpace;
  
  return (
    <mesh position={[0, 0, 0.09]}>
      <planeGeometry args={[4, 2.4]} />
      <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function Room() {
  return (
    <group>
      {/* Floor - Wider for a sense of space */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#080808" roughness={0.8} />
      </mesh>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Baseboard */}
      <mesh position={[0, -0.2, -3.95]}>
        <boxGeometry args={[20, 0.5, 0.1]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.5} />
      </mesh>

      {/* Back Wall - Warm Professional Grey */}
      <mesh position={[0, 4, -4]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#1c1c1e" roughness={0.9} />
      </mesh>

      {/* Frame & Painting on the wall */}
      <group position={[0, 3.2, -3.98]}>
        {/* Elegant Frame with Bevel-like feel */}
        <mesh castShadow>
          <boxGeometry args={[4.4, 2.8, 0.1]} />
          <meshStandardMaterial color="#c5a059" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.03]} castShadow>
          <boxGeometry args={[4.2, 2.6, 0.05]} />
          <meshStandardMaterial color="#050505" metalness={0.5} />
        </mesh>
        
        {/* Canvas with Texture */}
        <Painting />

        {/* Accent light for the painting */}
        <spotLight position={[0, 2, 2]} target-position={[0, 0, 0]} intensity={1} angle={0.5} penumbra={1} color="#c5a059" />
      </group>

      {/* Side Wall (Left) */}
      <mesh position={[-6, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#222222" roughness={0.9} />
      </mesh>

      {/* Architectural Light Bar (Horizontal) - Moved from desk to wall */}
      <group position={[0, 1.2, -3.95]}>
        <mesh>
          <boxGeometry args={[12, 0.05, 0.05]} />
          <meshStandardMaterial color="#c5a059" emissive="#c5a059" emissiveIntensity={2} />
        </mesh>
        <pointLight position={[0, 0, 0.1]} intensity={0.5} color="#c5a059" distance={10} />
      </group>

      {/* Architectural Floor Light / Corner Detail */}
      <group position={[-5.8, -0.4, -3.8]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 4, 16]} />
          <meshStandardMaterial color="#c5a059" metalness={1} roughness={0.1} />
        </mesh>
        <pointLight position={[0, 2, 0.1]} intensity={0.8} color="#c5a059" distance={5} />
      </group>

      {/* Desk - Executive Walnut */}
      <group position={[0, 0.45, 0]}>
        {/* Main Body (Walnut) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[7, 0.12, 2.5]} />
          <meshStandardMaterial color="#1a120b" roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Subtle Dark Wood Inlay (Instead of bright marble) */}
        <mesh position={[0, 0.065, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7, 0.4]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
        </mesh>
        {/* Gold Trim */}
        <mesh position={[0, -0.06, 0]}>
          <boxGeometry args={[7.02, 0.02, 2.52]} />
          <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      
      {/* Desk Legs - High-end gold finish */}
      <mesh position={[-3.2, 0, 1]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.9]} />
        <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[3.2, 0, 1]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.9]} />
        <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-3.2, 0, -1]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.9]} />
        <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[3.2, 0, -1]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.9]} />
        <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.1} />
      </mesh>

      <group position={[0, 0.5, 0]}>
        <Computer position={[-2.2, 0, -0.4]} />
        <Monitor position={[0, 0, -0.2]} />
        <Keyboard position={[0, 0, 0.8]} />
        <Lamp position={[2.5, 0, 0.6]} />
        <Plant position={[-2.5, 0, 0.7]} />
        
        {/* Designer Desk Accessory - Minimalist Polished Box */}
        <group position={[2.5, 0, -0.6]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.3, 0.5]} />
            <meshStandardMaterial color="#050505" roughness={0.1} metalness={1} />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.52, 0.02, 0.52]} />
            <meshStandardMaterial color="#c5a059" metalness={1} roughness={0.05} />
          </mesh>
        </group>
      </group>
      <WallPlant
        position={[5, 1.05, -3.2]}
        rotation={[0, Math.PI / 7, 0]}
        scale={2.3}
      />
    </group>
  );
}
