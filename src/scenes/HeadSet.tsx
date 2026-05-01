import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const HEADSET_MODEL = '/models/gaming_headset.glb';
const HEADSET_HEIGHT = 0.42;
const TABLE_CLEARANCE = 0.012;

export default function Headset(props: any) {
  const { scene } = useGLTF(HEADSET_MODEL);

  const { headset, modelScale, modelPosition } = useMemo(() => {
    const headset = scene.clone(true);

    const bounds = new THREE.Box3().setFromObject(headset);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    const modelScale =
      size.y > 0 ? HEADSET_HEIGHT / size.y : 1;

    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      TABLE_CLEARANCE - bounds.min.y * modelScale,
      -center.z * modelScale,
    ];

    return { headset, modelScale, modelPosition };
  }, [scene]);

  useLayoutEffect(() => {
    headset.traverse((object: any) => {
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
      mat.envMapIntensity = 0.25;

      /* Ear cushions / soft pads */
      if (
        name.includes('pad') ||
        name.includes('foam') ||
        name.includes('cushion') ||
        name.includes('ear')
      ) {
        mat.color = new THREE.Color('#0d0d0d');
        mat.roughness = 1;
        mat.metalness = 0;
      }

      /* Headband leather */
      else if (
        name.includes('band') ||
        name.includes('headband') ||
        name.includes('strap')
      ) {
        mat.color = new THREE.Color('#151515');
        mat.roughness = 0.88;
        mat.metalness = 0.02;
      }

      /* Metal arms / frame */
      else if (
        name.includes('metal') ||
        name.includes('frame') ||
        name.includes('arm') ||
        name.includes('joint')
      ) {
        mat.color = new THREE.Color('#1f1f1f');
        mat.roughness = 0.34;
        mat.metalness = 0.92;
      }

      /* Premium gold accents */
      else if (
        name.includes('trim') ||
        name.includes('ring') ||
        name.includes('logo') ||
        name.includes('accent')
      ) {
        mat.color = new THREE.Color('#c5a059');
        mat.roughness = 0.22;
        mat.metalness = 1;
      }

      /* Mic boom */
      else if (
        name.includes('mic') ||
        name.includes('boom')
      ) {
        mat.color = new THREE.Color('#101010');
        mat.roughness = 0.72;
        mat.metalness = 0.15;
      }

      /* fallback */
      else {
        mat.color = new THREE.Color('#181818');
        mat.roughness = 0.72;
        mat.metalness = 0.08;
      }

      mat.needsUpdate = true;
    });
  }, [headset]);

  return (
    <group {...props}>
      <primitive
        object={headset}
        position={modelPosition}
        scale={modelScale}
        rotation={[0, Math.PI / 4, 0]}
      />

      {/* subtle premium glow */}
      <pointLight
        position={[0, 0.18, 0]}
        intensity={0.18}
        distance={1.5}
        color="#c5a059"
      />
    </group>
  );
}

useGLTF.preload(HEADSET_MODEL);