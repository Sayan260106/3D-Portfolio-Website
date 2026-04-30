import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const CPU_MODEL = '/models/gaming_cpu.glb';

const DESK_CLEARANCE = 0.025;
const CPU_WIDTH = 2;

export default function Computer(props: any) {
  const { scene } = useGLTF(CPU_MODEL);

  const { computer, modelPosition, modelScale } = useMemo(() => {
    const computer = scene.clone(true);

    const bounds = new THREE.Box3().setFromObject(computer);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    const modelScale = CPU_WIDTH / size.x;

    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      DESK_CLEARANCE - bounds.min.y * modelScale,
      -center.z * modelScale,
    ];

    return { computer, modelPosition, modelScale };
  }, [scene]);

  useLayoutEffect(() => {
    computer.traverse((object: any) => {
      if (!object.isMesh) return;

      object.castShadow = true;
      object.receiveShadow = true;

      object.geometry.computeVertexNormals();
      object.material = object.material.clone();

      const mat = object.material;
      const name = object.name.toLowerCase();

      mat.side = THREE.DoubleSide;
      mat.envMapIntensity = 0.12;

      // 🖥️ Main chassis
      if (
        name.includes('body') ||
        name.includes('case') ||
        name.includes('tower') ||
        name.includes('chassis') ||
        name.includes('pc')
      ) {
        mat.color = new THREE.Color('#111111');
        mat.roughness = 0.78;
        mat.metalness = 0.18;
      }

      // ✨ Tempered glass / side panel
      else if (
        name.includes('glass') ||
        name.includes('panel') ||
        name.includes('window')
      ) {
        mat.color = new THREE.Color('#0a0a0a');
        mat.transparent = true;
        mat.opacity = 0.42;
        mat.roughness = 0.08;
        mat.metalness = 0;
      }

      // 🪙 Gold trims / metal parts
      else if (
        name.includes('trim') ||
        name.includes('frame') ||
        name.includes('metal') ||
        name.includes('accent')
      ) {
        mat.color = new THREE.Color('#c5a059');
        mat.roughness = 0.32;
        mat.metalness = 0.88;
      }

      // 🌬️ Fans / RGB internals
      else if (
        name.includes('fan') ||
        name.includes('led') ||
        name.includes('light') ||
        name.includes('rgb')
      ) {
        mat.color = new THREE.Color('#c5a059');
        mat.emissive = new THREE.Color('#c5a059');
        mat.emissiveIntensity = 0.35;
        mat.roughness = 0.25;
        mat.metalness = 0.15;
      }

      // fallback
      else {
        mat.color = new THREE.Color('#151515');
        mat.roughness = 0.88;
        mat.metalness = 0.08;
      }

      mat.needsUpdate = true;
    });
  }, [computer]);

  return (
    <group {...props}>
      <primitive
        object={computer}
        position={modelPosition}
        rotation={[0, Math.PI / 7, 0]}
        scale={modelScale}
      />

      {/* Soft internal premium glow */}
      <pointLight
        position={[0, 0.38, 0.12]}
        color="#c5a059"
        intensity={0.28}
        distance={1.3}
        decay={2}
      />
    </group>
  );
}

useGLTF.preload(CPU_MODEL);