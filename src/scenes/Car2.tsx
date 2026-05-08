import React, { useLayoutEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const CAR_MODEL = "/models/aston_martin_f1_amr23_2023.glb";

const CAR_HEIGHT = 1.1;
const FLOOR_OFFSET = 0.01;

export default function AstonMartinAMR23(props: any) {
  const { scene } = useGLTF(CAR_MODEL);

  /* =========================================================
     AUTO SCALE + CENTER
  ========================================================= */

  const { car, modelScale, modelPosition } = useMemo(() => {
    const car = scene.clone(true);

    const bounds = new THREE.Box3().setFromObject(car);

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    const modelScale =
      size.y > 0 ? CAR_HEIGHT / size.y : 1;

    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      FLOOR_OFFSET - bounds.min.y * modelScale,
      -center.z * modelScale,
    ];

    return {
      car,
      modelScale,
      modelPosition,
    };
  }, [scene]);

  /* =========================================================
     REALISTIC MATERIALS
  ========================================================= */

  useLayoutEffect(() => {
    car.traverse((object: any) => {
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

      mat.envMapIntensity = 1.8;

      /* =====================================================
         ASTON MARTIN GREEN BODY
      ===================================================== */

      if (
        name.includes("body") ||
        name.includes("chassis") ||
        name.includes("shell") ||
        name.includes("carpaint")
      ) {
        mat.color = new THREE.Color("#005c43");

        mat.metalness = 0.92;
        mat.roughness = 0.16;

        mat.clearcoat = 1;
        mat.clearcoatRoughness = 0.05;
      }

      /* =====================================================
         CARBON FIBER
      ===================================================== */

      else if (
        name.includes("carbon") ||
        name.includes("wing") ||
        name.includes("aero") ||
        name.includes("splitter") ||
        name.includes("diffuser")
      ) {
        mat.color = new THREE.Color("#111111");

        mat.metalness = 0.45;
        mat.roughness = 0.48;
      }

      /* =====================================================
         TIRES
      ===================================================== */

      else if (
        name.includes("tire") ||
        name.includes("tyre") ||
        name.includes("rubber")
      ) {
        mat.color = new THREE.Color("#090909");

        mat.metalness = 0;
        mat.roughness = 0.95;
      }

      /* =====================================================
         RIMS
      ===================================================== */

      else if (
        name.includes("rim") ||
        name.includes("wheel") ||
        name.includes("alloy")
      ) {
        mat.color = new THREE.Color("#1f1f1f");

        mat.metalness = 1;
        mat.roughness = 0.28;
      }

      /* =====================================================
         GLASS / VISOR
      ===================================================== */

      else if (
        name.includes("glass") ||
        name.includes("visor") ||
        name.includes("windshield")
      ) {
        mat.color = new THREE.Color("#0f172a");

        mat.transparent = true;
        mat.opacity = 0.2;

        mat.metalness = 0;
        mat.roughness = 0.02;

        if ("transmission" in mat) {
          (mat as any).transmission = 1;
          (mat as any).ior = 1.45;
          (mat as any).thickness = 0.04;
        }
      }

      /* =====================================================
         METAL PARTS
      ===================================================== */

      else if (
        name.includes("metal") ||
        name.includes("suspension") ||
        name.includes("pipe") ||
        name.includes("engine")
      ) {
        mat.color = new THREE.Color("#7b7b7b");

        mat.metalness = 1;
        mat.roughness = 0.32;
      }

      /* =====================================================
         LED / LIGHTS
      ===================================================== */

      else if (
        name.includes("light") ||
        name.includes("led")
      ) {
        mat.color = new THREE.Color("#ff2d55");

        mat.emissive = new THREE.Color("#ff2d55");
        mat.emissiveIntensity = 3;

        mat.metalness = 0.2;
        mat.roughness = 0.18;
      }

      /* =====================================================
         LOGO / GOLD DETAILS
      ===================================================== */

      else if (
        name.includes("logo") ||
        name.includes("badge") ||
        name.includes("gold")
      ) {
        mat.color = new THREE.Color("#c5a059");

        mat.metalness = 1;
        mat.roughness = 0.2;
      }

      /* =====================================================
         FALLBACK
      ===================================================== */

      else {
        mat.color = new THREE.Color("#161616");

        mat.metalness = 0.25;
        mat.roughness = 0.65;
      }

      mat.needsUpdate = true;
    });
  }, [car]);

  return (
    <group {...props}>
      {/* =====================================================
         CAR MODEL
      ===================================================== */}

      <primitive
        object={car}
        position={modelPosition}
        scale={modelScale}
        rotation={[0, Math.PI * 0.22, 0]}
      />

      {/* =====================================================
         UNDERGLOW
      ===================================================== */}

      <pointLight
        position={[0, 0.15, 0]}
        intensity={0.4}
        distance={3}
        color="#00ffbf"
      />

      {/* =====================================================
         FRONT LIGHT
      ===================================================== */}

      <spotLight
        position={[2.5, 2.8, 2]}
        angle={0.45}
        penumbra={1}
        intensity={2}
        castShadow
        distance={10}
        color="#ffffff"
      />

      {/* =====================================================
         REAR RIM LIGHT
      ===================================================== */}

      <pointLight
        position={[-2, 1.5, -2]}
        intensity={0.5}
        distance={5}
        color="#8ec5ff"
      />

      {/* =====================================================
         FLOOR SHADOW
      ===================================================== */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.005, 0]}
        receiveShadow
      >
        <circleGeometry args={[2.2, 64]} />

        <shadowMaterial
          transparent
          opacity={0.24}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload(CAR_MODEL);