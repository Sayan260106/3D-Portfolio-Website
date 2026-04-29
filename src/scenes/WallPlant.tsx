import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const PLANT_MODEL = '/models/monstera_deliciosa_potted_mid-century_plant.glb';

export default function WallPlant(props: any) {
  const { scene } = useGLTF(PLANT_MODEL);
  const plant = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    plant.traverse((object: any) => {
      if (!object.isMesh) return;

      object.castShadow = true;
      object.receiveShadow = true;
      object.geometry.computeVertexNormals();

      object.material = object.material.clone();

      const mat = object.material;
      const name = object.name.toLowerCase();

      mat.side = THREE.DoubleSide;

      if (
        name.includes('leaf') ||
        name.includes('plant') ||
        name.includes('foliage') ||
        name.includes('monstera')
      ) {
        mat.color = new THREE.Color('#4f9d43');
        mat.roughness = 0.82;
        mat.metalness = 0;
        mat.envMapIntensity = 0.45;
        mat.emissive = new THREE.Color('#1d3b14');
        mat.emissiveIntensity = 0.035;
      } 
      else if (
        name.includes('pot') ||
        name.includes('vase') ||
        name.includes('container')
      ) {
        mat.color = new THREE.Color('#8b5a3c');
        mat.roughness = 0.92;
        mat.metalness = 0.02;
      } 
      else {
        mat.roughness = 0.85;
        mat.metalness = 0;
      }
    });
  }, [plant]);

  return (
    <primitive
      object={plant}
      rotation={[0, -Math.PI / 5.4, 0]}
      {...props}
    />
  );
}

useGLTF.preload(PLANT_MODEL);