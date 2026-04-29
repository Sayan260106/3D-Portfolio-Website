import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MOUSE_MODEL = '/models/mouse_a4tech_x-710bk.glb';

const DESK_CLEARANCE = 0.025;
const MOUSE_WIDTH = 0.4;

export default function Mouse(props: any) {
  const { scene } = useGLTF(MOUSE_MODEL);

  const { mouse, modelPosition, modelScale } = useMemo(() => {
    const mouse = scene.clone(true);

    const bounds = new THREE.Box3().setFromObject(mouse);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    const modelScale = MOUSE_WIDTH / size.x;
    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      DESK_CLEARANCE - bounds.min.y * modelScale,
      -center.z * modelScale,
    ];

    return { mouse, modelPosition, modelScale };
  }, [scene]);

  useLayoutEffect(() => {
    mouse.traverse((object: any) => {
      if (!object.isMesh) return;

      object.castShadow = true;
      object.receiveShadow = true;

      object.geometry.computeVertexNormals();
      object.material = object.material.clone();

      const mat = object.material;
      const name = object.name.toLowerCase();

      mat.side = THREE.DoubleSide;
      mat.envMapIntensity = 0.08;

      // 🖱 Main body matte black
      if (
        name.includes('body') ||
        name.includes('mouse') ||
        name.includes('shell') ||
        name.includes('base')
      ) {
        mat.color = new THREE.Color('#151515');
        mat.roughness = 0.92;
        mat.metalness = 0.05;
      }

      // 🖱 Buttons / click area
      else if (
        name.includes('button') ||
        name.includes('click') ||
        name.includes('top')
      ) {
        mat.color = new THREE.Color('#1f1f1f');
        mat.roughness = 0.75;
        mat.metalness = 0.08;
      }

      // 🎯 Scroll wheel / accents
      else if (
        name.includes('wheel') ||
        name.includes('scroll') ||
        name.includes('accent')
      ) {
        mat.color = new THREE.Color('#c5a059');
        mat.roughness = 0.35;
        mat.metalness = 0.85;
      }

      // fallback
      else {
        mat.color = new THREE.Color('#181818');
        mat.roughness = 0.9;
        mat.metalness = 0;
      }

      mat.needsUpdate = true;
    });
  }, [mouse]);

  return (
    <group {...props}>
      <primitive
        object={mouse}
        position={modelPosition}
        rotation={[0, -Math.PI / 8, 0]}
        scale={modelScale}
      />

      {/* subtle premium side glow */}
      <pointLight
        position={[-0.05, 0.03, 0]}
        color="#c5a059"
        intensity={0.12}
        distance={0.35}
        decay={2}
      />
    </group>
  );
}

useGLTF.preload(MOUSE_MODEL);
