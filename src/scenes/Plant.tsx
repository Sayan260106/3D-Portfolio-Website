import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const PLANT_MODEL = '/models/banana_plant_with_pot.glb';

export default function Plant(props: any) {
  const { scene } = useGLTF(PLANT_MODEL);

  const plant = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    plant.traverse((object: any) => {
      if (!object.isMesh) return;

      object.castShadow = true;
      object.receiveShadow = true;

      object.geometry.computeVertexNormals();

      // clone material
      object.material = object.material.clone();

      const mat = object.material;
      const name = object.name.toLowerCase();

      // Better renderer response
      mat.side = THREE.DoubleSide;

      // 🌿 REALISTIC LEAVES
      if (
        name.includes('leaf') ||
        name.includes('banana') ||
        name.includes('foliage') ||
        name.includes('plant')
      ) {
        mat.color = new THREE.Color('#4f9d43');
        mat.roughness = 0.82;
        mat.metalness = 0;
        mat.envMapIntensity = 0.45;

        // subtle subsurface fake
        mat.emissive = new THREE.Color('#1d3b14');
        mat.emissiveIntensity = 0.035;

        // random slight tone variation
        const hueShift = (Math.random() - 0.5) * 0.04;
        const hsl = { h: 0, s: 0, l: 0 };
        mat.color.getHSL(hsl);
        mat.color.setHSL(hsl.h + hueShift, 0.45, 0.42);

        // slight wind-ready natural tilt
        object.rotation.z += (Math.random() - 0.5) * 0.03;
        object.rotation.x += (Math.random() - 0.5) * 0.02;
      }

      // 🪴 CERAMIC / TERRACOTTA POT
      else if (
        name.includes('pot') ||
        name.includes('vase') ||
        name.includes('container')
      ) {
        mat.color = new THREE.Color('#8b5a3c');
        mat.roughness = 0.92;
        mat.metalness = 0.02;
        mat.envMapIntensity = 0.18;
      }

      // 🌱 STEM / TRUNK
      else if (
        name.includes('stem') ||
        name.includes('trunk')
      ) {
        mat.color = new THREE.Color('#6d8e35');
        mat.roughness = 0.95;
        mat.metalness = 0;
      }

      // fallback natural material
      else {
        mat.roughness = 0.85;
        mat.metalness = 0;
      }
    });
  }, [plant]);

  return (
    <group {...props}>
      <primitive
        object={plant}
        position={[0, -0.08, 0]}
        rotation={[0, -Math.PI / 5.4, 0]}
        scale={0.70}
      />
    </group>
  );
}

useGLTF.preload(PLANT_MODEL);