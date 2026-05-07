import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const CAR_MODEL = '/models/2022_cavallo_daytona_sp3-transformed.glb';

const CAR_HEIGHT = 1.1;
const FLOOR_OFFSET = 0.01;

export default function SuperCar(props: any) {
  const { scene } = useGLTF(CAR_MODEL);

  /**
   * Clone model and normalize scale
   */
  const { car, modelScale, modelPosition } = useMemo(() => {
    const car = scene.clone(true);

    const bounds = new THREE.Box3().setFromObject(car);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    const modelScale =
      size.y > 0 ? CAR_HEIGHT / size.y : 1;

    /**
     * Centers the model and places wheels correctly on floor
     */
    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      FLOOR_OFFSET - bounds.min.y * modelScale,
      -center.z * modelScale,
    ];

    return { car, modelScale, modelPosition };
  }, [scene]);

  /**
   * Material refinement
   */
  useLayoutEffect(() => {
    car.traverse((object: any) => {
      if (!object.isMesh) return;

      object.castShadow = true;
      object.receiveShadow = true;

      if (object.geometry) {
        object.geometry.computeVertexNormals();
      }

      /**
       * Clone materials so edits don't affect original GLTF cache
       */
      object.material = object.material.clone();

      const mat = object.material;
      const name = object.name.toLowerCase();

      mat.side = THREE.FrontSide;
      mat.transparent = false;
      mat.opacity = 1;
      mat.depthWrite = true;
      mat.depthTest = true;

      /**
       * Better reflections
       */
      mat.envMapIntensity = 1.25;

      /* =========================================================
         MAIN CAR BODY
      ========================================================= */
      if (
        name.includes('body') ||
        name.includes('paint') ||
        name.includes('car') ||
        name.includes('door') ||
        name.includes('hood') ||
        name.includes('bonnet') ||
        name.includes('panel')
      ) {
        /**
         * Premium Ferrari-inspired metallic red
         */
        mat.color = new THREE.Color('#7a0000');

        mat.metalness = 0.72;
        mat.roughness = 0.22;

        /**
         * Clearcoat for automotive realism
         */
        if ('clearcoat' in mat) {
          mat.clearcoat = 1;
          mat.clearcoatRoughness = 0.08;
        }
      }

      /* =========================================================
         CARBON FIBER / DARK TRIMS
      ========================================================= */
      else if (
        name.includes('carbon') ||
        name.includes('trim') ||
        name.includes('splitter') ||
        name.includes('diffuser') ||
        name.includes('side_skirt')
      ) {
        mat.color = new THREE.Color('#111111');
        mat.metalness = 0.55;
        mat.roughness = 0.45;
      }

      /* =========================================================
         RIMS / ALLOYS
      ========================================================= */
      else if (
        name.includes('rim') ||
        name.includes('alloy') ||
        name.includes('wheel_metal')
      ) {
        mat.color = new THREE.Color('#8d8d8d');
        mat.metalness = 1;
        mat.roughness = 0.24;
      }

      /* =========================================================
         TIRES
      ========================================================= */
      else if (
        name.includes('tire') ||
        name.includes('tyre') ||
        name.includes('rubber') ||
        name.includes('wheel')
      ) {
        mat.color = new THREE.Color('#080808');
        mat.metalness = 0;
        mat.roughness = 0.96;
      }

      /* =========================================================
         GLASS
      ========================================================= */
      else if (
        name.includes('glass') ||
        name.includes('window') ||
        name.includes('windshield')
      ) {
        mat.color = new THREE.Color('#0d1117');

        mat.transparent = true;
        mat.opacity = 0.42;

        mat.metalness = 0.15;
        mat.roughness = 0.02;

        if ('transmission' in mat) {
          mat.transmission = 0.82;
          mat.ior = 1.45;
          mat.thickness = 0.2;
        }
      }

      /* =========================================================
         LIGHTS
      ========================================================= */
      else if (
        name.includes('light') ||
        name.includes('lamp') ||
        name.includes('headlight')
      ) {
        mat.color = new THREE.Color('#fff8d6');

        mat.emissive = new THREE.Color('#fff2aa');
        mat.emissiveIntensity = 0.3;

        mat.metalness = 0.35;
        mat.roughness = 0.1;
      }

      /* =========================================================
         BRAKES
      ========================================================= */
      else if (
        name.includes('brake') ||
        name.includes('caliper')
      ) {
        mat.color = new THREE.Color('#c5a059');

        mat.metalness = 0.95;
        mat.roughness = 0.25;
      }

      /* =========================================================
         INTERIOR
      ========================================================= */
      else if (
        name.includes('seat') ||
        name.includes('interior') ||
        name.includes('dashboard') ||
        name.includes('steering')
      ) {
        mat.color = new THREE.Color('#151515');

        mat.metalness = 0.08;
        mat.roughness = 0.82;
      }

      /* =========================================================
         EXHAUST / METALS
      ========================================================= */
      else if (
        name.includes('metal') ||
        name.includes('exhaust') ||
        name.includes('pipe')
      ) {
        mat.color = new THREE.Color('#777777');

        mat.metalness = 1;
        mat.roughness = 0.28;
      }

      /* =========================================================
         FALLBACK
      ========================================================= */
    //   else {
    //     mat.color = new THREE.Color('#2a2a2a');
    //     mat.metalness = 0.25;
    //     mat.roughness = 0.7;
    //   }

      mat.needsUpdate = true;
    });
  }, [car]);

  return (
    <group {...props}>
      <primitive
        object={car}
        position={modelPosition}
        scale={modelScale}
        rotation={[0, Math.PI, 0]}
      />

      {/* =========================================================
         CINEMATIC ACCENT LIGHTING
      ========================================================= */}

      {/* Warm showroom highlight */}
      <pointLight
        position={[0, 1.5, 1]}
        intensity={0.9}
        distance={5}
        color="#ffd6a5"
      />

      {/* Cool side reflection */}
      <pointLight
        position={[-2, 1, -1]}
        intensity={0.45}
        distance={4}
        color="#dbeafe"
      />

      {/* Underglow reflection */}
      <pointLight
        position={[0, 0.2, 0]}
        intensity={0.2}
        distance={2}
        color="#7a0000"
      />
    </group>
  );
}

useGLTF.preload(CAR_MODEL);