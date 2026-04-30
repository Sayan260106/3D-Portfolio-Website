import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const CARPET_MODEL = '/models/persian_carpet.glb';

const TARGET_WIDTH = 7;     // left-right size under desk
const FLOOR_CLEARANCE = 0.012; // slightly above floor

export default function Carpet(props: any) {
  const { scene } = useGLTF(CARPET_MODEL);

  const { carpet, modelPosition, modelScale } = useMemo(() => {
    const carpet = scene.clone(true);

    const bounds = new THREE.Box3().setFromObject(carpet);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    // scale by width for safer sizing
    const modelScale = TARGET_WIDTH / size.x;

    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      FLOOR_CLEARANCE - bounds.min.y * modelScale,
      -center.z * modelScale,
    ];

    return { carpet, modelPosition, modelScale };
  }, [scene]);

  useLayoutEffect(() => {
    carpet.traverse((object: any) => {
      if (!object.isMesh) return;

      object.castShadow = false;
      object.receiveShadow = true;

      object.geometry.computeVertexNormals();

      object.material = object.material.clone();

      const mat = object.material;
      const name = object.name.toLowerCase();

      mat.side = THREE.DoubleSide;
      mat.envMapIntensity = 0;
      mat.transparent = false;

      // fabric base
      if (
        name.includes('carpet') ||
        name.includes('rug') ||
        name.includes('fabric') ||
        name.includes('cloth') ||
        name.includes('base')
      ) {
        mat.color = new THREE.Color('#1a1410');
        mat.roughness = 1;
        mat.metalness = 0;
      }

      // gold details
      else if (
        name.includes('pattern') ||
        name.includes('border') ||
        name.includes('trim') ||
        name.includes('ornament')
      ) {
        mat.color = new THREE.Color('#c5a059');
        mat.roughness = 1;
        mat.metalness = 0;
      }

      // preserve original colored center details
      else {
        mat.roughness = 1;
        mat.metalness = 0;
      }

      mat.needsUpdate = true;
    });
  }, [carpet]);

  return (
    <group {...props}>
      <primitive
        object={carpet}
        position={modelPosition}
        rotation={[0, Math.PI / 2, 0]}
        scale={modelScale}
      />
    </group>
  );
}

useGLTF.preload(CARPET_MODEL);