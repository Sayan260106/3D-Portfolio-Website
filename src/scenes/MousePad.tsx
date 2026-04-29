import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MOUSEPAD_MODEL = '/models/silver_crest_gaming_mousepad.glb';

const PAD_WIDTH = 0.95;
const DESK_CLEARANCE = 0.014;

export default function MousePad(props: any) {
  const { scene } = useGLTF(MOUSEPAD_MODEL);

  const { mousePad, modelPosition, modelScale } = useMemo(() => {
    const mousePad = scene.clone(true);

    const bounds = new THREE.Box3().setFromObject(mousePad);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    const modelScale = PAD_WIDTH / size.x;

    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      DESK_CLEARANCE - bounds.min.y * modelScale,
      -center.z * modelScale,
    ];

    return { mousePad, modelPosition, modelScale };
  }, [scene]);

  useLayoutEffect(() => {
    mousePad.traverse((object: any) => {
      if (!object.isMesh) return;

      object.castShadow = false;
      object.receiveShadow = true;

      object.geometry.computeVertexNormals();
      object.material = object.material.clone();

      const mat = object.material;
      const name = object.name.toLowerCase();

      mat.side = THREE.DoubleSide;
      mat.envMapIntensity = 0;

      // 🖤 Main fabric/rubber surface
      if (
        name.includes('pad') ||
        name.includes('surface') ||
        name.includes('mat') ||
        name.includes('top')
      ) {
        mat.color = new THREE.Color('#242424');
        mat.roughness = 1;
        mat.metalness = 0;
      }

      // ✨ Border / stitched edge
      else if (
        name.includes('edge') ||
        name.includes('trim') ||
        name.includes('border')
      ) {
        mat.color = new THREE.Color('#c5a059');
        mat.roughness = 0.65;
        mat.metalness = 0.2;
      }

      // 🪙 Logo / branding
      else if (
        name.includes('logo') ||
        name.includes('text') ||
        name.includes('brand')
      ) {
        mat.color = new THREE.Color('#c5a059');
        mat.roughness = 0.3;
        mat.metalness = 0.6;
        mat.emissive = new THREE.Color('#3b2a08');
        mat.emissiveIntensity = 0.05;
      }

      // fallback
      else {
        mat.color = new THREE.Color('#202020');
        mat.roughness = 1;
        mat.metalness = 0;
      }

      mat.needsUpdate = true;
    });
  }, [mousePad]);

  return (
    <group {...props}>
      <primitive
        object={mousePad}
        position={modelPosition}
        rotation={[0, 0, 0]}
        scale={modelScale}
      />
    </group>
  );
}

useGLTF.preload(MOUSEPAD_MODEL);
