import React, { useLayoutEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const CHAIR_MODEL = "/models/cushion_chair-transformed.glb";

const CHAIR_HEIGHT = 4.9;
const FLOOR_CLEARANCE = 0.015;

export default function Cushion(props: any) {
  const { scene } = useGLTF(CHAIR_MODEL);

  /* =========================================================
     AUTO SCALE + CENTER MODEL
  ========================================================= */

  const { chair, modelScale, modelPosition } = useMemo(() => {
    const chair = scene.clone(true);

    const bounds = new THREE.Box3().setFromObject(chair);

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    const modelScale =
      size.y > 0 ? CHAIR_HEIGHT / size.y : 1;

    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      FLOOR_CLEARANCE - bounds.min.y * modelScale,
      -center.z * modelScale,
    ];

    return {
      chair,
      modelScale,
      modelPosition,
    };
  }, [scene]);

  /* =========================================================
     REALISTIC MATERIALS
  ========================================================= */

  useLayoutEffect(() => {
    chair.traverse((object: any) => {
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
         CUSHION / FABRIC
      ===================================================== */

      if (
        name.includes("cushion") ||
        name.includes("seat") ||
        name.includes("fabric") ||
        name.includes("foam") ||
        name.includes("pillow")
      ) {
        mat.color = new THREE.Color("#d6c4aa");

        mat.metalness = 0;
        mat.roughness = 0.92;
      }

      /* =====================================================
         LEATHER
      ===================================================== */

      else if (
        name.includes("leather") ||
        name.includes("padding")
      ) {
        mat.color = new THREE.Color("#4b3a2f");

        mat.metalness = 0.05;
        mat.roughness = 0.58;
      }

      /* =====================================================
         WOOD
      ===================================================== */

      else if (
        name.includes("wood") ||
        name.includes("frame") ||
        name.includes("leg")
      ) {
        mat.color = new THREE.Color("#5b4636");

        mat.metalness = 0.08;
        mat.roughness = 0.72;
      }

      /* =====================================================
         METAL
      ===================================================== */

      else if (
        name.includes("metal") ||
        name.includes("steel") ||
        name.includes("support") ||
        name.includes("base")
      ) {
        mat.color = new THREE.Color("#2b2b2b");

        mat.metalness = 0.95;
        mat.roughness = 0.26;
      }

      /* =====================================================
         GOLD ACCENTS
      ===================================================== */

      else if (
        name.includes("gold") ||
        name.includes("accent") ||
        name.includes("trim")
      ) {
        mat.color = new THREE.Color("#c5a059");

        mat.metalness = 1;
        mat.roughness = 0.22;
      }

      /* =====================================================
         PLASTIC
      ===================================================== */

      else if (
        name.includes("plastic") ||
        name.includes("cover")
      ) {
        mat.color = new THREE.Color("#181818");

        mat.metalness = 0.05;
        mat.roughness = 0.82;
      }

      /* =====================================================
         FALLBACK
      ===================================================== */

      else {
        mat.color = new THREE.Color("#2a2a2a");

        mat.metalness = 0.08;
        mat.roughness = 0.75;
      }

      mat.needsUpdate = true;
    });
  }, [chair]);

  return (
    <group {...props}>
      {/* =====================================================
         CHAIR MODEL
      ===================================================== */}

      <primitive
        object={chair}
        position={modelPosition}
        scale={modelScale}
        rotation={[0, Math.PI * 0.15, 0]}
      />

      {/* =====================================================
         SOFT FLOOR SHADOW
      ===================================================== */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        receiveShadow
      >
        <circleGeometry args={[1.3, 64]} />

        <shadowMaterial
          transparent
          opacity={0.18}
        />
      </mesh>

      {/* =====================================================
         WARM AMBIENT LIGHT
      ===================================================== */}

      <pointLight
        position={[0, 3.8, 1.2]}
        intensity={0.3}
        distance={5}
        color="#ffe7c2"
      />

      {/* =====================================================
         SUBTLE EDGE LIGHT
      ===================================================== */}

      <pointLight
        position={[-1.5, 2.5, -1]}
        intensity={0.18}
        distance={4}
        color="#9fd3ff"
      />
    </group>
  );
}

useGLTF.preload(CHAIR_MODEL);