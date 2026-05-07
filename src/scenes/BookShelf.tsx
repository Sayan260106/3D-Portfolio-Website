import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/* ===========================================================
   MODEL SETTINGS
=========================================================== */

const SHELF_MODEL = '/models/bookcase-transformed.glb';
const SHELF_HEIGHT = 2;
const FLOOR_OFFSET = 0.02;

/* ===========================================================
   BOOKCASE COMPONENT
=========================================================== */

export default function BookCase(props: any) {
  const { scene } = useGLTF(SHELF_MODEL);

  /* ===========================================================
     CLONE + SCALE + CENTER MODEL
  =========================================================== */
  const { shelf, modelScale, modelPosition } = useMemo(() => {
    const shelf = scene.clone(true);

    const bounds = new THREE.Box3().setFromObject(shelf);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    // Scale model to desired height
    const modelScale =
      size.y > 0 ? SHELF_HEIGHT / size.y : 1;

    // Center model and place on floor
    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      FLOOR_OFFSET - bounds.min.y * modelScale,
      -center.z * modelScale,
    ];

    return {
      shelf,
      modelScale,
      modelPosition,
    };
  }, [scene]);

  /* ===========================================================
     MATERIAL REFINEMENT
  =========================================================== */
  useLayoutEffect(() => {
    let meshIndex = 0;

    shelf.traverse((object: any) => {
      if (!object.isMesh) return;

      meshIndex++;

      object.castShadow = true;
      object.receiveShadow = true;

      if (object.geometry) {
        object.geometry.computeVertexNormals();
      }

      /* -------------------------------------------------------
         Clone materials to avoid modifying original GLTF
      ------------------------------------------------------- */
      object.material = object.material.clone();

      const mat = object.material;
      const name = object.name.toLowerCase();

      /* -------------------------------------------------------
         Base settings
      ------------------------------------------------------- */
      mat.side = THREE.FrontSide;
      mat.transparent = false;
      mat.opacity = 1;
      mat.depthWrite = true;
      mat.depthTest = true;
      mat.envMapIntensity = 0.35;

      /* =======================================================
         WOODEN STRUCTURE
      ======================================================= */
      if (
        name.includes('wood') ||
        name.includes('body') ||
        name.includes('cabinet') ||
        name.includes('frame') ||
        name.includes('shelf') ||
        name.includes('panel') ||
        name.includes('door')
      ) {
        mat.color = new THREE.Color('#5b3a29'); // walnut wood
        mat.roughness = 0.82;
        mat.metalness = 0.03;
      }

      /* =======================================================
         DARK METAL PARTS
      ======================================================= */
      else if (
        name.includes('metal') ||
        name.includes('handle') ||
        name.includes('support') ||
        name.includes('leg') ||
        name.includes('stand')
      ) {
        mat.color = new THREE.Color('#1c1c1c');
        mat.roughness = 0.38;
        mat.metalness = 0.88;
      }

      /* =======================================================
         BOOKS
      ======================================================= */
      else if (
        name.includes('book') ||
        name.includes('books') ||
        name.includes('page') ||
        name.includes('cover')
      ) {
        const bookPalette = [
          '#8b1e1e',
          '#1f3a5f',
          '#355e3b',
          '#6d4c1d',
          '#4d2c5a',
          '#202020',
          '#d8d1c4',
          '#b08d57',
        ];

        mat.color = new THREE.Color(
          bookPalette[meshIndex % bookPalette.length]
        );

        mat.roughness = 0.9;
        mat.metalness = 0;
      }

      /* =======================================================
         PLANTS / LEAVES
      ======================================================= */
      else if (
        name.includes('plant') ||
        name.includes('leaf') ||
        name.includes('foliage') ||
        name.includes('flower')
      ) {
        const greens = [
          '#4f9d43',
          '#2f6b34',
          '#76b852',
          '#3f7d20',
        ];

        mat.color = new THREE.Color(
          greens[meshIndex % greens.length]
        );

        mat.roughness = 0.88;
        mat.metalness = 0;
      }

      /* =======================================================
         VASE / POT / CERAMIC
      ======================================================= */
      else if (
        name.includes('pot') ||
        name.includes('vase') ||
        name.includes('jar') ||
        name.includes('container')
      ) {
        const pottery = [
          '#d8d2c7',
          '#8c735d',
          '#2f2f2f',
          '#a8a8a8',
        ];

        mat.color = new THREE.Color(
          pottery[meshIndex % pottery.length]
        );

        mat.roughness = 0.95;
        mat.metalness = 0.02;
      }

      /* =======================================================
         GOLD DECOR ACCENTS
      ======================================================= */
      else if (
        name.includes('decor') ||
        name.includes('artifact') ||
        name.includes('statue') ||
        name.includes('gold')
      ) {
        mat.color = new THREE.Color('#c5a059');
        mat.roughness = 0.28;
        mat.metalness = 0.82;
      }

      /* =======================================================
         GLASS PARTS
      ======================================================= */
      else if (
        name.includes('glass')
      ) {
        mat.color = new THREE.Color('#dce6f2');
        mat.transparent = true;
        mat.opacity = 0.2;
        mat.roughness = 0.02;
        mat.metalness = 0;
      }

      /* =======================================================
         FALLBACK MATERIAL
      ======================================================= */
      else {
        const misc = [
          '#5c3a27',
          '#222222',
          '#d7d0c5',
          '#6b7280',
        ];

        mat.color = new THREE.Color(
          misc[meshIndex % misc.length]
        );

        mat.roughness = 0.78;
        mat.metalness = 0.06;
      }

      mat.needsUpdate = true;
    });
  }, [shelf]);

  /* ===========================================================
     RENDER
  =========================================================== */
  return (
    <group {...props}>
      <primitive
        object={shelf}
        position={modelPosition}
        scale={modelScale}
        rotation={[0, Math.PI / 8, 0]}
      />

      {/* Warm premium light */}
      <pointLight
        position={[0, 1.5, 0.5]}
        intensity={0.32}
        distance={3}
        color="#c5a059"
      />

      {/* Cool ambient fill */}
      <pointLight
        position={[0, 1.8, -0.8]}
        intensity={0.15}
        distance={3}
        color="#ffffff"
      />

      {/* Soft top plant highlight */}
      <pointLight
        position={[0.1, 2.2, 0.1]}
        intensity={0.12}
        distance={2}
        color="#dfffcf"
      />
    </group>
  );
}

useGLTF.preload(SHELF_MODEL);