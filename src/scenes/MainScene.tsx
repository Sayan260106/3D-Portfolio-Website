import React, {
  Suspense,
  useRef,
  useState,
  useEffect,
} from 'react';

import { Canvas, useFrame } from '@react-three/fiber';

import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
  AdaptiveDpr,
  AdaptiveEvents,
} from '@react-three/drei';

import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
  ChromaticAberration,
} from '@react-three/postprocessing';

import { motion } from 'framer-motion';

import * as THREE from 'three';

const Room = React.lazy(() => import('./Room'));
const Particles = React.lazy(() => import('./Particles'));

import Loader from './Loader';

/* =========================================================
   CINEMATIC CAMERA SYSTEM
   ---------------------------------------------------------
   INITIAL LOAD:
   → cinematic motion active

   USER INTERACTS:
   → cinematic disabled
   → full OrbitControls enabled

   USER IDLE 3 MIN:
   → cinematic resumes
   → FROM CURRENT CAMERA POSITION
========================================================= */

function CinematicCamera({
  cinematicEnabled,
}: {
  cinematicEnabled: boolean;
}) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

  useFrame((state) => {
    if (!cinematicEnabled) return;

    const t = state.clock.getElapsedTime();

    /* VERY subtle luxury motion */
    const driftX = Math.sin(t * 0.12) * 0.02;
    const floatY = Math.sin(t * 0.22) * 0.015;

    const zoom =
      Math.sin(t * 0.15) * 0.04;

    /* IMPORTANT:
       ADD motion to CURRENT position
       NOT fixed position

       This allows cinematic mode
       to resume FROM USER'S LAST VIEW
    */

    state.camera.position.x +=
      driftX * 0.015;

    state.camera.position.y +=
      floatY * 0.015;

    state.camera.position.z +=
      zoom * 0.01;

    state.camera.lookAt(0, 3, 0);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[-4, 3, 8.5]}
      fov={45}
    />
  );
}

export default function MainScene() {
  /* =========================================================
     STATES
  ========================================================= */

  const [effectsReady, setEffectsReady] =
    useState(false);

  const [showParticles, setShowParticles] =
    useState(false);

  /* TRUE initially → cinematic active */
  const [cinematicEnabled, setCinematicEnabled] =
    useState(true);

  /* =========================================================
     TIMERS
  ========================================================= */

  const idleTimerRef = useRef<NodeJS.Timeout | null>(
    null
  );

  /* =========================================================
     POST FX DELAY
  ========================================================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setEffectsReady(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  /* =========================================================
     PARTICLE DELAY
  ========================================================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowParticles(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  /* =========================================================
     USER INTERACTION HANDLER
  ========================================================= */

  const handleInteractionStart = () => {
    /* Disable cinematic instantly */
    setCinematicEnabled(false);

    /* Clear existing timer */
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
  };

  /* =========================================================
     IDLE DETECTION
  ========================================================= */

  const handleInteractionEnd = () => {
    /* Start 3 minute idle timer */
    idleTimerRef.current = setTimeout(() => {
      setCinematicEnabled(true);
    }, 180000); // 3 minutes
  };

  /* =========================================================
     CLEANUP
  ========================================================= */

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4 }}
      className="w-full h-full"
    >
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          stencil: false,
          depth: true,
        }}
      >
        {/* =====================================================
           CAMERA
        ===================================================== */}

        <CinematicCamera
          cinematicEnabled={cinematicEnabled}
        />

        {/* =====================================================
           PERFORMANCE
        ===================================================== */}

        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        {/* =====================================================
           CONTROLS
        ===================================================== */}

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
          autoRotate={false}

          onStart={handleInteractionStart}

          onEnd={handleInteractionEnd}
        />

        {/* =====================================================
           LIGHTING
        ===================================================== */}

        <ambientLight
          intensity={0.18}
          color="#f0ece4"
        />

        <spotLight
          position={[3, 9, 3]}
          angle={0.38}
          penumbra={0.92}
          intensity={1.6}
          castShadow
          color="#fff8f0"
          shadow-mapSize={[512, 512]}
          shadow-bias={-0.0004}
        />

        <directionalLight
          position={[-6, 4, 5]}
          intensity={0.38}
          color="#dce8f5"
        />

        <directionalLight
          position={[0, 10, -6]}
          intensity={0.14}
          color="#cdd9e8"
        />

        <pointLight
          position={[3.5, 1.8, 2]}
          intensity={0.5}
          distance={7}
          decay={2}
          color="#e8c47a"
        />

        <pointLight
          position={[-3.5, 1.8, -2]}
          intensity={0.28}
          distance={6}
          decay={2}
          color="#b8935a"
        />

        {/* =====================================================
           SCENE
        ===================================================== */}

        <Suspense fallback={<Loader />}>
          <group position={[0, -1, 0]}>
            <Room />

            <ContactShadows
              opacity={0.55}
              scale={30}
              blur={1.5}
              far={4.5}
              resolution={256}
              color="#000000"
            />
          </group>

          {showParticles && <Particles />}

          <Environment preset="apartment" />
        </Suspense>

        {/* =====================================================
           POST PROCESSING
        ===================================================== */}

        {effectsReady && (
          <EffectComposer enableNormalPass={false}>
            <Bloom
              luminanceThreshold={1}
              mipmapBlur
              intensity={0.12}
              radius={0.42}
            />

            <Noise opacity={0.018} />

            <Vignette
              eskil={false}
              offset={0.08}
              darkness={0.82}
            />

            <ChromaticAberration
              offset={[0.0001, 0.0001]}
            />
          </EffectComposer>
        )}

        <color
          attach="background"
          args={['#030303']}
        />
      </Canvas>
    </motion.div>
  );
}