import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const SPEAKER_MODEL = '/models/krk_classic_5_studio_monitor_speaker.glb';

const DESK_CLEARANCE = 0.02;
const SPEAKER_HEIGHT = 0.65;

export default function Speaker(props: any) {
  const { scene } = useGLTF(SPEAKER_MODEL);

  const { speaker, modelPosition, modelScale } = useMemo(() => {
    const speaker = scene.clone(true);

    const bounds = new THREE.Box3().setFromObject(speaker);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    const modelScale = SPEAKER_HEIGHT / size.y;

    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      DESK_CLEARANCE - bounds.min.y * modelScale,
      -center.z * modelScale,
    ];

    return { speaker, modelPosition, modelScale };
  }, [scene]);

  useLayoutEffect(() => {
    speaker.traverse((object: any) => {
      if (!object.isMesh) return;

      object.castShadow = true;
      object.receiveShadow = true;

      object.geometry.computeVertexNormals();
      object.material = object.material.clone();

      const mat = object.material;
      const name = object.name.toLowerCase();

      mat.side = THREE.DoubleSide;
      mat.envMapIntensity = 0.08;

      if (
        name.includes('body') ||
        name.includes('cabinet') ||
        name.includes('speaker') ||
        name.includes('box') ||
        name.includes('monitor')
      ) {
        mat.color = new THREE.Color('#111111');
        mat.roughness = 0.92;
        mat.metalness = 0.03;
      } else if (
        name.includes('woofer') ||
        name.includes('cone') ||
        name.includes('driver')
      ) {
        mat.color = new THREE.Color('#d8b332');
        mat.roughness = 0.55;
        mat.metalness = 0.02;
      } else if (
        name.includes('tweeter') ||
        name.includes('grille') ||
        name.includes('mesh')
      ) {
        mat.color = new THREE.Color('#050505');
        mat.roughness = 1;
        mat.metalness = 0;
      } else if (
        name.includes('ring') ||
        name.includes('trim') ||
        name.includes('frame')
      ) {
        mat.color = new THREE.Color('#c5a059');
        mat.roughness = 0.35;
        mat.metalness = 0.8;
      } else {
        mat.color = new THREE.Color('#151515');
        mat.roughness = 0.9;
        mat.metalness = 0.02;
      }

      mat.needsUpdate = true;
    });
  }, [speaker]);

  return (
    <group {...props}>
      <primitive
        object={speaker}
        position={modelPosition}
        rotation={[0, 0, 0]}   // ✅ fixed direction
        scale={modelScale}
      />

      <pointLight
        position={[0, 0.1, 0.12]}
        color="#c5a059"
        intensity={0.08}
        distance={0.45}
        decay={2}
      />
    </group>
  );
}

useGLTF.preload(SPEAKER_MODEL);