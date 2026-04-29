import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const KEYBOARD_MODEL = '/models/custom_-_mechanical_keyboard.glb';

const DESK_CLEARANCE = 0.025;
const KEYBOARD_WIDTH = 2; // ✅ increased horizontal width

export default function Keyboard(props: any) {
  const { scene } = useGLTF(KEYBOARD_MODEL);

  const { keyboard, modelPosition, modelScale } = useMemo(() => {
    const keyboard = scene.clone(true);

    const bounds = new THREE.Box3().setFromObject(keyboard);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    const modelScale = KEYBOARD_WIDTH / size.x;

    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      DESK_CLEARANCE - bounds.min.y * modelScale,
      -center.z * modelScale,
    ];

    return { keyboard, modelPosition, modelScale };
  }, [scene]);

  useLayoutEffect(() => {
  keyboard.traverse((object: any) => {
    if (!object.isMesh) return;

    object.castShadow = true;
    object.receiveShadow = true;

    object.geometry.computeVertexNormals();
    object.material = object.material.clone();

    const mat = object.material;
    const name = object.name.toLowerCase();

    mat.side = THREE.DoubleSide;

    // ✅ MAIN FIX FOR HAZZY REFLECTIONS
    mat.toneMapped = true;
    mat.envMapIntensity = 0;
    mat.flatShading = false;

    // remove shiny bloom glare
    mat.metalness = 0;
    mat.clearcoat = 0;
    mat.clearcoatRoughness = 1;

    // ⌨️ Keyboard body
    if (
      name.includes('body') ||
      name.includes('case') ||
      name.includes('frame') ||
      name.includes('base')
    ) {
      mat.color = new THREE.Color('#181818');
      mat.roughness = 1; // full matte
      mat.metalness = 0;
    }

    // ⌨️ Keycaps (anti haze matte)
    else if (
      name.includes('key') ||
      name.includes('cap') ||
      name.includes('button') ||
      name.includes('space')
    ) {
      mat.color = new THREE.Color('#e8e8e8');
      mat.roughness = 1; // max matte
      mat.metalness = 0;
    }

    // 🔘 Knob / accents
    else if (
      name.includes('knob') ||
      name.includes('dial')
    ) {
      mat.color = new THREE.Color('#c5a059');
      mat.roughness = 0.45;
      mat.metalness = 0.35;
    }

    else {
      mat.roughness = 1;
      mat.metalness = 0;
    }

    mat.needsUpdate = true;
  });
}, [keyboard]);

  return (
    <group {...props}>
      <primitive
        object={keyboard}
        position={modelPosition}
        rotation={[0, 0, 0]}
        scale={modelScale}
      />
    </group>
  );
}

useGLTF.preload(KEYBOARD_MODEL);