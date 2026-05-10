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
  useProgress,
} from '@react-three/drei';

import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
  ChromaticAberration,
} from '@react-three/postprocessing';

import { AnimatePresence, motion } from 'motion/react';

import * as THREE from 'three';

const Room = React.lazy<
  React.ComponentType<{
    setMonitorHovered: React.Dispatch<
      React.SetStateAction<boolean>
    >;
  }>
>(() => import('./Room'));
const Particles = React.lazy(() => import('./Particles'));

import Loader from './Loader';

const MONITOR_FOCUS: [number, number, number] = [
  0,
  3.62,
  -0.55,
];

const INITIAL_CAMERA_POSITION: [
  number,
  number,
  number,
] = [-1.55, 4.05, 7.35];

const CAMERA_MIN_POLAR_ANGLE =
  Math.PI / 2.75;

const CAMERA_MAX_POLAR_ANGLE =
  Math.PI / 2.04;

function SceneLoadOverlay() {
  const { active, progress } = useProgress();
  const [isVisible, setIsVisible] = useState(true);
  const pct = Math.min(100, Math.round(progress));

  useEffect(() => {
    if (active || progress < 100) {
      setIsVisible(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [active, progress]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#030303] pointer-events-none"
        >
          <div className="w-56 space-y-5 text-center">
            <div className="relative mx-auto size-28">
              <div className="absolute inset-0 rounded-full border border-[#c5a059]/10" />
              <div className="absolute inset-3 rounded-full border border-[#c5a059]/20" />
              <motion.div
                className="absolute inset-0 rounded-full border-t border-[#c5a059]"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-[#c5a059] luxury-title text-3xl">
                {pct}
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-px bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full bg-[#c5a059]"
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                />
              </div>
              <div className="text-[#c5a059]/50 luxury-mono text-[10px] tracking-[0.4em] uppercase">
                Loading Workspace
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* =========================================================
   CINEMATIC CAMERA
========================================================= */

function CinematicCamera({
  cinematicEnabled,
  monitorHovered,
}: {
  cinematicEnabled: boolean;
  monitorHovered: boolean;
}) {
  const basePosition = useRef(
    new THREE.Vector3(
      ...INITIAL_CAMERA_POSITION
    )
  );

  useFrame((state) => {
    const camera = state.camera;

    /* =====================================================
      HARD CAMERA HEIGHT LIMIT
    ===================================================== */

    const MAX_CAMERA_HEIGHT = 6.8;

    /* Prevent camera crossing ceiling */
    if (camera.position.y > MAX_CAMERA_HEIGHT) {
      camera.position.y = MAX_CAMERA_HEIGHT;
    }

    /* Stop cinematic motion while interacting */
    if (
      !cinematicEnabled ||
      monitorHovered
    ) {
      return;
    }

    const t =
      state.clock.getElapsedTime();

    /* Luxury cinematic movement */
    const driftX =
      Math.sin(t * 0.12) * 0.08;

    const floatY =
      Math.sin(t * 0.22) * 0.05;

    const zoom =
      Math.sin(t * 0.15) * 0.12;

    const targetPosition =
      new THREE.Vector3(
        basePosition.current.x +
          driftX,

        Math.min(
          basePosition.current.y +
            floatY,
          MAX_CAMERA_HEIGHT
        ),

        basePosition.current.z +
          zoom
      );

    camera.position.lerp(
      targetPosition,
      0.02
    );

    camera.lookAt(...MONITOR_FOCUS);
  });

  return (
    <PerspectiveCamera
      makeDefault
      position={INITIAL_CAMERA_POSITION}
      fov={38}
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

  const [cinematicEnabled, setCinematicEnabled] =
    useState(true);

  /* NEW */
  const [monitorHovered, setMonitorHovered] =
    useState(false);

  /* =========================================================
     TIMERS
  ========================================================= */

  const idleTimerRef = useRef<
    NodeJS.Timeout | null
  >(null);

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
     USER INTERACTION
  ========================================================= */

  const handleInteractionStart = () => {
    setCinematicEnabled(false);

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
  };

  /* =========================================================
     IDLE DETECTION
  ========================================================= */

  const handleInteractionEnd = () => {
    idleTimerRef.current = setTimeout(() => {
      setCinematicEnabled(true);
    }, 180000);
  };

  /* =========================================================
     CLEANUP
  ========================================================= */

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(
          idleTimerRef.current
        );
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4 }}
      className="relative w-full h-full"
    >
      <SceneLoadOverlay />

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
          cinematicEnabled={
            cinematicEnabled
          }
          monitorHovered={
            monitorHovered
          }
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
          enabled={!monitorHovered}
          enablePan={false}
          minDistance={2.15}
          maxDistance={19}
          minPolarAngle={Math.PI / 3.1}
          maxPolarAngle={Math.PI / 2.04}
          minAzimuthAngle={
            -Math.PI / 5
          }
          maxAzimuthAngle={
            Math.PI / 5
          }
          target={MONITOR_FOCUS}
          enableDamping
          dampingFactor={0.05}
          autoRotate={false}
          onStart={
            handleInteractionStart
          }
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
            <Room
              setMonitorHovered={
                setMonitorHovered
              }
            />

            <ContactShadows
              opacity={0.55}
              scale={30}
              blur={1.5}
              far={4.5}
              resolution={256}
              color="#000000"
            />
          </group>

          {showParticles && (
            <Particles />
          )}

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
              offset={[
                0.0001,
                0.0001,
              ]}
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
