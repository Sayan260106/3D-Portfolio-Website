import React, {
  Suspense,
  useRef,
  useState,
  useEffect,
  useMemo,
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

import { motion } from 'motion/react';

import * as THREE from 'three';

const Room = React.lazy<
  React.ComponentType<{
    setMonitorHovered: React.Dispatch<
      React.SetStateAction<boolean>
    >;
    onMonitorReady?: () => void;
    monitorFocused?: boolean;
    onMonitorFocus?: () => void;
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

const MONITOR_CAMERA_POSITION: [
  number,
  number,
  number,
] = [0, 3.75, 7];

const MONITOR_CAMERA_TARGET: [
  number,
  number,
  number,
] = [0, 2.82, 0.08];

type CameraIntent =
  | 'free'
  | 'monitor'
  | 'overview';

interface MainSceneProps {
  onLoadProgress?: (progress: number) => void;
  onAssetsReady?: () => void;
  onMonitorReady?: () => void;
}

function SceneLoadStatus({
  onLoadProgress,
  onAssetsReady,
}: Pick<
  MainSceneProps,
  'onLoadProgress' | 'onAssetsReady'
>) {
  const { active, progress } = useProgress();
  const pct = Math.min(100, Math.round(progress));
  const didNotifyReady = useRef(false);

  useEffect(() => {
    onLoadProgress?.(pct);
  }, [onLoadProgress, pct]);

  useEffect(() => {
    if (active || progress < 100 || didNotifyReady.current) return;

    const timer = setTimeout(() => {
      didNotifyReady.current = true;
      onAssetsReady?.();
    }, 300);

    return () => clearTimeout(timer);
  }, [active, onAssetsReady, progress]);

  return null;
}

/* =========================================================
   CINEMATIC CAMERA
========================================================= */

function CinematicCamera({
  cinematicEnabled,
  monitorHovered,
  cameraIntent,
}: {
  cinematicEnabled: boolean;
  monitorHovered: boolean;
  cameraIntent: CameraIntent;
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
      monitorHovered ||
      cameraIntent !== 'free'
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

function CameraFocusRig({
  intent,
  controlsRef,
  onOverviewSettled,
}: {
  intent: CameraIntent;
  controlsRef: React.MutableRefObject<any>;
  onOverviewSettled: () => void;
}) {
  const monitorPosition = useMemo(
    () => new THREE.Vector3(...MONITOR_CAMERA_POSITION),
    []
  );
  const monitorTarget = useMemo(
    () => new THREE.Vector3(...MONITOR_CAMERA_TARGET),
    []
  );
  const overviewPosition = useMemo(
    () => new THREE.Vector3(...INITIAL_CAMERA_POSITION),
    []
  );
  const overviewTarget = useMemo(
    () => new THREE.Vector3(...MONITOR_FOCUS),
    []
  );

  useFrame((state) => {
    if (intent === 'free') return;

    const targetPosition =
      intent === 'monitor'
        ? monitorPosition
        : overviewPosition;

    const targetLookAt =
      intent === 'monitor'
        ? monitorTarget
        : overviewTarget;

    state.camera.position.lerp(targetPosition, 0.085);

    if (controlsRef.current?.target) {
      controlsRef.current.target.lerp(targetLookAt, 0.1);
      controlsRef.current.update();
    } else {
      state.camera.lookAt(targetLookAt);
    }

    const positionSettled =
      state.camera.position.distanceTo(targetPosition) < 0.035;

    const targetSettled = controlsRef.current?.target
      ? controlsRef.current.target.distanceTo(targetLookAt) < 0.035
      : true;

    if (
      intent === 'overview' &&
      positionSettled &&
      targetSettled
    ) {
      onOverviewSettled();
    }
  });

  return null;
}

export default function MainScene({
  onLoadProgress,
  onAssetsReady,
  onMonitorReady,
}: MainSceneProps) {
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

  const [monitorFocused, setMonitorFocused] =
    useState(false);

  const [cameraIntent, setCameraIntent] =
    useState<CameraIntent>('free');

  const controlsRef = useRef<any>(null);

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
    if (cameraIntent !== 'free') return;

    setCinematicEnabled(false);

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
  };

  /* =========================================================
     IDLE DETECTION
  ========================================================= */

  const handleInteractionEnd = () => {
    if (cameraIntent !== 'free') return;

    idleTimerRef.current = setTimeout(() => {
      setCinematicEnabled(true);
    }, 180000);
  };

  const focusMonitor = () => {
    setMonitorFocused(true);
    setMonitorHovered(true);
    setCinematicEnabled(false);
    setCameraIntent('monitor');

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
  };

  const exitMonitorFocus = () => {
    setMonitorFocused(false);
    setMonitorHovered(false);
    setCinematicEnabled(false);
    setCameraIntent('overview');
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      exitMonitorFocus();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
      <SceneLoadStatus
        onLoadProgress={onLoadProgress}
        onAssetsReady={onAssetsReady}
      />

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
          cameraIntent={cameraIntent}
        />

        <CameraFocusRig
          intent={cameraIntent}
          controlsRef={controlsRef}
          onOverviewSettled={() => {
            setCameraIntent('free');
          }}
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
          ref={controlsRef}
          enabled={
            !monitorHovered &&
            cameraIntent === 'free'
          }
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
              onMonitorReady={
                onMonitorReady
              }
              monitorFocused={
                monitorFocused
              }
              onMonitorFocus={
                focusMonitor
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
