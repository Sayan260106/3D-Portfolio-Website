import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
  ChromaticAberration,
} from '@react-three/postprocessing';
import * as THREE from 'three';

import Room from './Room';
import Particles from './Particles';

function CinematicCamera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

  useFrame((state) => {
    state.camera.lookAt(0, 3, 0);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 0, 8.5]}
      fov={45}
    />
  );
}

export default function MainScene() {
  return (
    <Canvas
      shadows
      gl={{
        antialias: false,
        stencil: false,
        depth: true,
      }}
    >
      <CinematicCamera />

      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={12}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.1}
        minAzimuthAngle={-Math.PI / 3}
        maxAzimuthAngle={Math.PI / 3}
        target={[0, 1.15, 0]}
        enableDamping
        dampingFactor={0.05}
      />

      {/* ─── Cinematic 3-Point Lighting ─────────────────────────────── */}

      {/* Global fill — barely perceptible, keeps shadows from going pure black */}
      <ambientLight intensity={0.18} color="#f0ece4" />

      {/* KEY LIGHT — soft overhead spot, warm ivory, primary shadow caster */}
      <spotLight
        position={[3, 9, 3]}
        angle={0.38}
        penumbra={0.92}
        intensity={1.6}
        castShadow
        color="#fff8f0"
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
      />

      {/* FILL LIGHT — wide, cool-toned directional from camera-left,
          lifts shadow areas without flattening the scene */}
      <directionalLight
        position={[-6, 4, 5]}
        intensity={0.38}
        color="#dce8f5"
      />

      {/* RIM / BACK LIGHT — subtle cool strip from behind-top,
          separates subjects from background */}
      <directionalLight
        position={[0, 10, -6]}
        intensity={0.14}
        color="#cdd9e8"
      />

      {/* ACCENT — low warm glow on the right, mimics practical / lamp light */}
      <pointLight
        position={[3.5, 1.8, 2]}
        intensity={0.5}
        distance={7}
        decay={2}
        color="#e8c47a"
      />

      {/* COUNTER ACCENT — muted amber on the left for tonal balance */}
      <pointLight
        position={[-3.5, 1.8, -2]}
        intensity={0.28}
        distance={6}
        decay={2}
        color="#b8935a"
      />

      {/* ─────────────────────────────────────────────────────────────── */}

      <Suspense fallback={null}>
        <group position={[0, -1, 0]}>
          <Room />

          <ContactShadows
            opacity={0.55}
            scale={30}
            blur={2.8}
            far={4.5}
            resolution={1024}
            color="#000000"
          />
        </group>

        <Particles />

        <Environment preset="studio" />
      </Suspense>

      {/* ─── Post Processing ─────────────────────────────────────────── */}

      <EffectComposer enableNormalPass={false}>
        <Bloom
          luminanceThreshold={1}
          mipmapBlur
          intensity={0.22}
          radius={0.42}
        />

        <Noise opacity={0.018} />

        <Vignette
          eskil={false}
          offset={0.08}
          darkness={0.82}
        />

        <ChromaticAberration offset={[0.0003, 0.0003]} />
      </EffectComposer>

      <color attach="background" args={['#030303']} />
    </Canvas>
  );
}