import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import Room from './Room';
import Particles from './Particles';

function CinematicCamera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
  
  useFrame((state) => {
    // Keep looking at the target
    state.camera.lookAt(0, 1.15, 0);
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[-3, 2, 6]} fov={45} />;
}

export default function MainScene() {
  return (
    <Canvas shadows gl={{ antialias: false, stencil: false, depth: true }}>
      <CinematicCamera />
      <OrbitControls 
        enablePan={false} 
        minDistance={4} 
        maxDistance={8}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.1}
        minAzimuthAngle={-Math.PI / 3}
        maxAzimuthAngle={Math.PI / 3}
        target={[0, 1.15, 0]}
        enableDamping
        dampingFactor={0.05}
      />
      
      {/* High-End Studio Lighting */}
      <ambientLight intensity={0.8} />
      <spotLight 
        position={[2, 8, 2]} 
        angle={0.4} 
        penumbra={1} 
        intensity={6} 
        castShadow 
        color="#fff4e6"
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-8, 5, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[0, 12, -4]} intensity={0.5} color="#e6f2ff" />
      
      {/* Accent Point Lights for Gold Materials */}
      <pointLight position={[3, 2, 2]} intensity={1.5} color="#ffd700" />
      <pointLight position={[-3, 2, -2]} intensity={0.8} color="#c5a059" />

      <Suspense fallback={null}>
        <group position={[0, -1, 0]}>
          <Room />
          <ContactShadows 
            opacity={0.8} 
            scale={30} 
            blur={2.5} 
            far={4.5} 
            resolution={1024} 
            color="#000000" 
          />
        </group>
        <Particles />
        <Environment preset="studio" />
      </Suspense>

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={0.4} radius={0.5} />
        <Noise opacity={0.03} />
        <Vignette eskil={false} offset={0.05} darkness={0.9} />
        <ChromaticAberration offset={[0.0005, 0.0005]} />
      </EffectComposer>

      <color attach="background" args={['#030303']} />
    </Canvas>
  );
}
