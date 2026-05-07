import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const PLANT_MODEL = '/models/plant_pot_ivy-transformed.glb';

const PLANT_HEIGHT = 1.1;
const FLOOR_OFFSET = 0.01;

export default function IvyPlant(props: any) {
  const { scene } = useGLTF(PLANT_MODEL);

  /**
   * Clone the GLB so multiple plants can exist independently
   * without sharing materials / transforms.
   */
  const { plant, modelScale, modelPosition } = useMemo(() => {
    const plant = scene.clone(true);

    // Calculate model bounds
    const bounds = new THREE.Box3().setFromObject(plant);

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    /**
     * Normalize model height
     */
    const modelScale =
      size.y > 0 ? PLANT_HEIGHT / size.y : 1;

    /**
     * Center model and place on floor
     */
    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      FLOOR_OFFSET - bounds.min.y * modelScale,
      -center.z * modelScale,
    ];

    return {
      plant,
      modelScale,
      modelPosition,
    };
  }, [scene]);

  /**
   * Material refinement
   */
  useLayoutEffect(() => {
    plant.traverse((object: any) => {
      if (!object.isMesh) return;

      object.castShadow = true;
      object.receiveShadow = true;

      if (object.geometry) {
        object.geometry.computeVertexNormals();
      }

      /**
       * Clone material so editing one mesh
       * doesn't affect all meshes.
       */
      object.material = object.material.clone();

      const mat = object.material;
      const name = object.name.toLowerCase();

      // Important fixes
      mat.side = THREE.DoubleSide;
      mat.transparent = false;
      mat.opacity = 1;
      mat.depthWrite = true;
      mat.depthTest = true;

      /**
       * Ivy / Leaves
       */
      if (
        name.includes('leaf') ||
        name.includes('ivy') ||
        name.includes('plant') ||
        name.includes('foliage')
      ) {
        mat.color = new THREE.Color('#3f7d3a');

        // Matte realistic leaves
        mat.roughness = 0.82;
        mat.metalness = 0;

        // Small environment reflection
        mat.envMapIntensity = 0.2;

        // Tiny emissive tint so leaves don't die in dark areas
        mat.emissive = new THREE.Color('#10220d');
        mat.emissiveIntensity = 0.03;
      }

      /**
       * Pot / Vase
       */
      else if (
        name.includes('pot') ||
        name.includes('vase') ||
        name.includes('container')
      ) {
        mat.color = new THREE.Color('#8b5e3c');

        // Ceramic matte look
        mat.roughness = 0.92;
        mat.metalness = 0.03;

        mat.envMapIntensity = 0.12;
      }

      /**
       * Soil / Dirt
       */
      else if (
        name.includes('soil') ||
        name.includes('dirt')
      ) {
        mat.color = new THREE.Color('#2b1a12');

        mat.roughness = 1;
        mat.metalness = 0;
      }

      /**
       * Hanging ropes / wires
       */
      else if (
        name.includes('rope') ||
        name.includes('string') ||
        name.includes('wire')
      ) {
        mat.color = new THREE.Color('#c8b08c');

        mat.roughness = 0.95;
        mat.metalness = 0;
      }

      /**
       * Fallback material
       */
      else {
        mat.color = new THREE.Color('#2b1a1aff');

        mat.roughness = 0.85;
        mat.metalness = 0.05;
      }

      mat.needsUpdate = true;
    });
  }, [plant]);

  return (
    <group {...props}>
      <primitive
        object={plant}
        position={modelPosition}
        scale={modelScale}
        rotation={[0, Math.PI / 8, 0]}
      />

      {/* subtle warm accent light */}
      <pointLight
        position={[0, 1.2, 0.4]}
        intensity={0.12}
        distance={2.5}
        color="#c5a059"
      />

      {/* soft green fill */}
      <pointLight
        position={[0, 0.8, -0.5]}
        intensity={0.08}
        distance={2}
        color="#8fbf73"
      />
    </group>
  );
}

useGLTF.preload(PLANT_MODEL);