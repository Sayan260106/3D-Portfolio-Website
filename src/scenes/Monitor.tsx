import React, { useLayoutEffect, useMemo } from "react";
import { Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "motion/react";

import SayanOS from "../os/SayanOS";

const MONITOR_MODEL =
  "/models/asus_pc_gaming_monitor-transformed.glb";

const MONITOR_HEIGHT = 3.2;
const FLOOR_CLEARANCE = 0.015;

interface MonitorProps {
  setMonitorHovered?: (
    value: boolean
  ) => void;
}

export default function Monitor({
  setMonitorHovered,
  ...props
}: MonitorProps & any) {
  const { scene } = useGLTF(MONITOR_MODEL);

  const claimMonitorInteraction = (
    event:
      | React.PointerEvent<HTMLDivElement>
      | React.WheelEvent<HTMLDivElement>
      | React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
  };

  const { monitor, modelScale, modelPosition } = useMemo(() => {
    const monitor = scene.clone(true);

    const bounds = new THREE.Box3().setFromObject(monitor);

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    const modelScale =
      size.y > 0 ? MONITOR_HEIGHT / size.y : 1;

    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      FLOOR_CLEARANCE - bounds.min.y * modelScale,
      -center.z * modelScale,
    ];

    return {
      monitor,
      modelScale,
      modelPosition,
    };
  }, [scene]);

  /* =========================================================
     REALISTIC MATERIALS
  ========================================================= */

  useLayoutEffect(() => {
    monitor.traverse((object: any) => {
      if (!object.isMesh) return;

      object.castShadow = true;
      object.receiveShadow = true;

      if (object.geometry) {
        object.geometry.computeVertexNormals();
      }

      object.material = object.material.clone();

      const mat = object.material;
      const name = object.name.toLowerCase();

      mat.side = THREE.FrontSide;
      mat.transparent = false;
      mat.opacity = 1;

      mat.depthWrite = true;
      mat.depthTest = true;

      mat.envMapIntensity = 1;

      /* =====================================================
         SCREEN
      ===================================================== */

      if (
        name.includes("screen") ||
        name.includes("display")
      ) {
        mat.color = new THREE.Color("#040404");

        mat.metalness = 0.08;
        mat.roughness = 0.04;

        mat.emissive = new THREE.Color("#0b1220");
        mat.emissiveIntensity = 0.12;
      }

      /* =====================================================
         BODY
      ===================================================== */

      else if (
        name.includes("frame") ||
        name.includes("body") ||
        name.includes("bezel") ||
        name.includes("panel")
      ) {
        mat.color = new THREE.Color("#111111");

        mat.metalness = 0.12;
        mat.roughness = 0.82;
      }

      /* =====================================================
         STAND
      ===================================================== */

      else if (
        name.includes("stand") ||
        name.includes("base") ||
        name.includes("arm") ||
        name.includes("metal")
      ) {
        mat.color = new THREE.Color("#2a2a2a");

        mat.metalness = 0.95;
        mat.roughness = 0.26;
      }

      /* =====================================================
         GLASS
      ===================================================== */

      else if (name.includes("glass")) {
        mat.color = new THREE.Color("#101828");

        mat.transparent = true;
        mat.opacity = 0.15;

        mat.metalness = 0;
        mat.roughness = 0.01;

        if ("transmission" in mat) {
          (mat as any).transmission = 1;
          (mat as any).ior = 1.45;
          (mat as any).thickness = 0.05;
        }
      }

      /* =====================================================
         RGB
      ===================================================== */

      else if (
        name.includes("rgb") ||
        name.includes("led") ||
        name.includes("light")
      ) {
        mat.color = new THREE.Color("#60a5fa");

        mat.emissive = new THREE.Color("#3b82f6");
        mat.emissiveIntensity = 2;

        mat.metalness = 0.2;
        mat.roughness = 0.2;
      }

      /* =====================================================
         GOLD
      ===================================================== */

      else if (
        name.includes("gold") ||
        name.includes("trim") ||
        name.includes("accent")
      ) {
        mat.color = new THREE.Color("#c5a059");

        mat.metalness = 1;
        mat.roughness = 0.24;
      }

      /* =====================================================
         FALLBACK
      ===================================================== */

      else {
        mat.color = new THREE.Color("#181818");

        mat.metalness = 0.1;
        mat.roughness = 0.7;
      }

      mat.needsUpdate = true;
    });
  }, [monitor]);

  return (
    <group {...props}>
      {/* =====================================================
         MONITOR MODEL
      ===================================================== */}

      <primitive
        object={monitor}
        position={modelPosition}
        scale={modelScale}
        rotation={[0, Math.PI, 0]}
      />

      {/* =====================================================
         INTERACTION HIT AREA
         THIS IS THE IMPORTANT PART
      ===================================================== */}

      <mesh
        position={[0, 1.82, 0.79]}
        rotation={[0, Math.PI, 0]}
        onPointerEnter={(event) => {
          event.stopPropagation();
          setMonitorHovered?.(true)
        }}
        onPointerMove={(event) => {
          event.stopPropagation();
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
        onPointerUp={(event) => {
          event.stopPropagation();
        }}
        onPointerLeave={(event) => {
          event.stopPropagation();
          setMonitorHovered?.(false)
        }}
      >
        <planeGeometry args={[2.7, 1.55]} />

        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* =====================================================
         REALISTIC HTML SCREEN
      ===================================================== */}

      <Html
        transform
        occlude="blending"
        position={[0, 1.82, 0.8]}
        rotation={[0, Math.PI, 0]}
        distanceFactor={1.15}
        zIndexRange={[100, 0]}
        className="pointer-events-auto"
      >
        <motion.div
          onPointerEnter={(event) => {
            claimMonitorInteraction(event);
            setMonitorHovered?.(true);
          }}
          onPointerMove={claimMonitorInteraction}
          onPointerDown={claimMonitorInteraction}
          onPointerUp={claimMonitorInteraction}
          onClick={claimMonitorInteraction}
          onWheel={claimMonitorInteraction}
          onPointerLeave={(event) => {
            claimMonitorInteraction(event);
            setMonitorHovered?.(false);
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1.4,
            delay: 0.4,
          }}
          style={{
            width: "1520px",
            height: "915px",
            transform: "scaleX(-1)",
            transformStyle: "preserve-3d",
          }}
          className="
            relative
            overflow-hidden
            rounded-[20px]
            border
            border-white/10
            bg-[#050505]
            shadow-[0_0_60px_rgba(0,0,0,0.9)]
          "
        >
          {/* =================================================
             SCREEN DEPTH
          ================================================= */}

          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/20 via-transparent to-black/40" />

          {/* =================================================
             DESKTOP UI
          ================================================= */}

          <div className="absolute inset-[10px] rounded-[12px] overflow-hidden">
            <SayanOS />
          </div>

          {/* =================================================
             REFLECTIONS
          ================================================= */}

          <div
            className="
              absolute
              top-0
              left-[-20%]
              w-[140%]
              h-[220px]
              rotate-[-8deg]
              bg-gradient-to-b
              from-white/12
              via-white/4
              to-transparent
              blur-xl
              opacity-70
              pointer-events-none
            "
          />

          <div
            className="
              absolute
              top-0
              right-0
              w-[180px]
              h-full
              bg-gradient-to-l
              from-white/[0.08]
              to-transparent
              pointer-events-none
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-tr
              from-blue-500/[0.05]
              via-transparent
              to-purple-500/[0.04]
              mix-blend-screen
              pointer-events-none
            "
          />

          <div
            className="
              absolute
              inset-0
              rounded-[20px]
              shadow-[inset_0_0_180px_rgba(0,0,0,0.7)]
              pointer-events-none
            "
          />

          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  to bottom,
                  transparent 0px,
                  transparent 2px,
                  rgba(255,255,255,0.08) 3px
                )
              `,
            }}
          />

          <div
            className="
              absolute
              inset-0
              rounded-[20px]
              border
              border-blue-400/10
              shadow-[0_0_30px_rgba(96,165,250,0.12)]
              pointer-events-none
            "
          />

          <div
            className="
              absolute
              inset-0
              rounded-[20px]
              bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.28)_100%)]
              pointer-events-none
            "
          />

          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              h-[3px]
              bg-gradient-to-r
              from-transparent
              via-[#c5a059]/40
              to-transparent
              blur-sm
              pointer-events-none
            "
          />
        </motion.div>
      </Html>

      {/* =====================================================
         SCREEN LIGHT
      ===================================================== */}

      <rectAreaLight
        width={2.7}
        height={1.55}
        intensity={2.4}
        color="#b7d7ff"
        position={[0, 2.03, -0.12]}
        rotation={[0, Math.PI, 0]}
      />

      {/* =====================================================
         SCREEN GLOW
      ===================================================== */}

      <pointLight
        position={[0, 2.1, -0.1]}
        intensity={0.45}
        distance={4}
        color="#8ec5ff"
      />

      {/* =====================================================
         REAR RGB
      ===================================================== */}

      <pointLight
        position={[0, 2.7, 0.55]}
        intensity={0.25}
        distance={3}
        color="#60a5fa"
      />

      {/* =====================================================
         POWER LED
      ===================================================== */}

      <mesh position={[1.28, 0.38, -0.04]}>
        <sphereGeometry args={[0.012, 16, 16]} />

        <meshStandardMaterial
          color="#c5a059"
          emissive="#c5a059"
          emissiveIntensity={5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload(MONITOR_MODEL);
