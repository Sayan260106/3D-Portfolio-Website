import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const STAND_MODEL = '/models/support_casque.glb';
const STAND_HEIGHT = 0.42;
const TABLE_CLEARANCE = 0.012;

export default function HeadsetStand(props: any) {
  const { scene } = useGLTF(STAND_MODEL);

  const { stand, modelScale, modelPosition } = useMemo(() => {
    const stand = scene.clone(true);

    const bounds = new THREE.Box3().setFromObject(stand);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    const modelScale =
      size.y > 0 ? STAND_HEIGHT / size.y : 1;

    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      TABLE_CLEARANCE - bounds.min.y * modelScale,
      -center.z * modelScale,
    ];

    return { stand, modelScale, modelPosition };
  }, [scene]);

  useLayoutEffect(() => {
    stand.traverse((object: any) => {
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
      mat.envMapIntensity = 0.35;

      /* Wooden Kashmir carved sections */
      if (
        name.includes('wood') ||
        name.includes('carved') ||
        name.includes('body') ||
        name.includes('stand') ||
        name.includes('base')
      ) {
        mat.color = new THREE.Color('#5a3825');
        mat.roughness = 0.82;
        mat.metalness = 0.02;
      }

      /* Dark walnut polish areas */
      else if (
        name.includes('walnut') ||
        name.includes('panel') ||
        name.includes('frame')
      ) {
        mat.color = new THREE.Color('#2c1a10');
        mat.roughness = 0.58;
        mat.metalness = 0.04;
      }

      /* Brass / gold decorative accents */
      else if (
        name.includes('gold') ||
        name.includes('brass') ||
        name.includes('trim') ||
        name.includes('ring') ||
        name.includes('detail')
      ) {
        mat.color = new THREE.Color('#c5a059');
        mat.roughness = 0.24;
        mat.metalness = 0.95;
      }

      /* Velvet / top rest padding */
      else if (
        name.includes('pad') ||
        name.includes('cloth') ||
        name.includes('top')
      ) {
        mat.color = new THREE.Color('#111111');
        mat.roughness = 1;
        mat.metalness = 0;
      }

      /* fallback */
      else {
        mat.color = new THREE.Color('#4a2d1d');
        mat.roughness = 0.72;
        mat.metalness = 0.05;
      }

      mat.needsUpdate = true;
    });
  }, [stand]);

  return (
    <group {...props}>
      <primitive
        object={stand}
        position={modelPosition}
        scale={modelScale}
        rotation={[0, Math.PI / 5, 0]}
      />

      {/* subtle luxury accent glow */}
      <pointLight
        position={[0, 0.2, 0]}
        intensity={0.14}
        distance={1.2}
        color="#c5a059"
      />
    </group>
  );
}

useGLTF.preload(STAND_MODEL);