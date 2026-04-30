import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const SHOW_PIECE_MODEL = '/models/lord_krishna_playing_the_flute_at_csmvs.glb';
const SHOW_PIECE_HEIGHT = 1.6;
const DESK_CLEARANCE = 0.025;

function applyMaterialStyle(material: THREE.Material, objectName: string) {
  if (!(material instanceof THREE.MeshStandardMaterial)) return;

  material.side = THREE.DoubleSide;
  material.envMapIntensity = 0.55;

  // Default premium sculpture finish.
  material.color = new THREE.Color('#b58b45');
  material.roughness = 0.38;
  material.metalness = 0.72;

  if (
    objectName.includes('skin') ||
    objectName.includes('face') ||
    objectName.includes('hand') ||
    objectName.includes('body') ||
    objectName.includes('krishna')
  ) {
    material.color = new THREE.Color('#9c7440');
    material.roughness = 0.45;
    material.metalness = 0.55;
  }

  if (
    objectName.includes('crown') ||
    objectName.includes('ornament') ||
    objectName.includes('jewel') ||
    objectName.includes('gold') ||
    objectName.includes('flute') ||
    objectName.includes('necklace')
  ) {
    material.color = new THREE.Color('#d4af37');
    material.roughness = 0.18;
    material.metalness = 1;
  }

  if (
    objectName.includes('cloth') ||
    objectName.includes('robe') ||
    objectName.includes('dress') ||
    objectName.includes('fabric')
  ) {
    material.color = new THREE.Color('#6f1d1b');
    material.roughness = 0.8;
    material.metalness = 0.08;
  }

  if (
    objectName.includes('base') ||
    objectName.includes('stand') ||
    objectName.includes('pedestal') ||
    objectName.includes('rock')
  ) {
    material.color = new THREE.Color('#2a2a2a');
    material.roughness = 0.95;
    material.metalness = 0.05;
  }

  material.emissive = new THREE.Color('#2a1c08');
  material.emissiveIntensity = 0.02;
  material.needsUpdate = true;
}

export default function ShowPiece(props: any) {
  const { scene } = useGLTF(SHOW_PIECE_MODEL);

  const { showPiece, modelPosition, modelScale } = useMemo(() => {
    const showPiece = scene.clone(true);
    showPiece.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(showPiece);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    const maxDimension = Math.max(size.x, size.y, size.z);
    const modelScale =
      Number.isFinite(maxDimension) && maxDimension > 0
        ? SHOW_PIECE_HEIGHT / maxDimension
        : 1;

    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      DESK_CLEARANCE - bounds.min.y * modelScale,
      -center.z * modelScale,
    ];

    return { showPiece, modelPosition, modelScale };
  }, [scene]);

  useLayoutEffect(() => {
    showPiece.traverse((object: any) => {
      if (!object.isMesh) return;

      object.castShadow = true;
      object.receiveShadow = true;

      if (object.geometry) {
        object.geometry.computeVertexNormals();
      }

      if (!object.material) return;

      const name = object.name.toLowerCase();
      const materials: THREE.Material[] = (Array.isArray(object.material)
        ? object.material
        : [object.material]
      ).filter((material: any): material is THREE.Material => material instanceof THREE.Material);

      if (!materials.length) return;

      const clonedMaterials = materials.map((material) => material.clone());

      object.material = Array.isArray(object.material)
        ? clonedMaterials
        : clonedMaterials[0];

      clonedMaterials.forEach((material) => applyMaterialStyle(material, name));
    });
  }, [showPiece]);

  return (
    <group {...props}>
      <primitive
        object={showPiece}
        position={modelPosition}
        rotation={[0, -Math.PI / 6, 0]}
        scale={modelScale}
      />

      {/* Accent spotlight glow */}
      <pointLight
        position={[0, 1.2, 0.8]}
        intensity={0.45}
        distance={4}
        color="#d4af37"
      />
    </group>
  );
}

useGLTF.preload(SHOW_PIECE_MODEL);
