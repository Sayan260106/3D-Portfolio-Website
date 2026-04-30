import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const PLANT_MODEL = '/models/monstera_deliciosa_potted_mid-century_plant.glb';

const TARGET_HEIGHT = 2;      // final visible height
const FLOOR_OFFSET = 0.02;      // lift slightly above floor
const LEAF_BASE = new THREE.Color('#3f7f36');
const LEAF_DARK = new THREE.Color('#214f24');

function createLeafVeinTexture() {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createLinearGradient(0, 0, 256, 256);
  gradient.addColorStop(0, '#6f6f6f');
  gradient.addColorStop(0.5, '#8a8a8a');
  gradient.addColorStop(1, '#5e5e5e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#d7d7d7';
  ctx.lineCap = 'round';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(128, 10);
  ctx.bezierCurveTo(116, 70, 138, 150, 126, 246);
  ctx.stroke();

  ctx.strokeStyle = '#b9b9b9';
  ctx.lineWidth = 3;

  for (let y = 34; y < 232; y += 28) {
    const sway = Math.sin(y * 0.08) * 10;
    const length = 62 - Math.abs(128 - y) * 0.12;

    ctx.beginPath();
    ctx.moveTo(128 + sway * 0.15, y);
    ctx.quadraticCurveTo(102 + sway, y + 8, 128 - length, y + 24);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(128 + sway * 0.15, y);
    ctx.quadraticCurveTo(154 + sway, y + 8, 128 + length, y + 24);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;

  return texture;
}

function seededValue(input: string) {
  let hash = 2166136261;

  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0) / 4294967295;
}

export default function WallPlant(props: any) {
  const { scene } = useGLTF(PLANT_MODEL);
  const leafVeinTexture = useMemo(createLeafVeinTexture, []);

  const { plant, modelScale, modelPosition } = useMemo(() => {
    const plant = scene.clone(true);

    const bounds = new THREE.Box3().setFromObject(plant);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    const modelScale = TARGET_HEIGHT / size.y;

    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      FLOOR_OFFSET - bounds.min.y * modelScale,
      -center.z * modelScale,
    ];

    return { plant, modelScale, modelPosition };
  }, [scene]);

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
      mat.envMapIntensity = 0.15;

      // Leaves
      if (
        name.includes('leaf') ||
        name.includes('plant') ||
        name.includes('foliage') ||
        name.includes('monstera')
      ) {
        const variant = seededValue(`${object.uuid}-${object.name}`);
        const hsl = { h: 0, s: 0, l: 0 };
        LEAF_BASE.clone().lerp(LEAF_DARK, variant * 0.45).getHSL(hsl);

        mat.color = new THREE.Color().setHSL(
          hsl.h + (variant - 0.5) * 0.035,
          0.46 + variant * 0.12,
          0.28 + variant * 0.12
        );
        mat.roughness = 0.72;
        mat.metalness = 0;
        mat.envMapIntensity = 0.32;

        mat.emissive = new THREE.Color('#163315');
        mat.emissiveIntensity = 0.018;

        if (leafVeinTexture && object.geometry.attributes.uv) {
          mat.bumpMap = leafVeinTexture;
          mat.bumpScale = 0.018 + variant * 0.012;
        }

        if ('clearcoat' in mat) {
          mat.clearcoat = 0.18;
          mat.clearcoatRoughness = 0.76;
        }

        if ('sheen' in mat) {
          mat.sheen = 0.22;
          mat.sheenRoughness = 0.88;
          mat.sheenColor = new THREE.Color('#78ad52');
        }

        object.rotation.z += (variant - 0.5) * 0.045;
        object.rotation.x += (seededValue(`${object.name}-pitch`) - 0.5) * 0.03;
        object.scale.multiplyScalar(0.96 + variant * 0.08);
      }

      // Pot
      else if (
        name.includes('pot') ||
        name.includes('vase') ||
        name.includes('container')
      ) {
        mat.color = new THREE.Color('#8b5a3c');
        mat.roughness = 1;
        mat.metalness = 0.02;
      }

      // Stem / trunk
      else if (
        name.includes('stem') ||
        name.includes('trunk') ||
        name.includes('branch')
      ) {
        mat.color = new THREE.Color('#6d8e35');
        mat.roughness = 0.95;
        mat.metalness = 0;
      }

      // fallback
      else {
        mat.color = new THREE.Color('#1b5f06ff');
        mat.roughness = 0.9;
        mat.metalness = 0;
      }

      mat.needsUpdate = true;
    });
  }, [plant, leafVeinTexture]);

  return (
    <group {...props}>
      <primitive
        object={plant}
        position={modelPosition}
        rotation={[0, -Math.PI / 5.4, 0]}
        scale={modelScale}
      />

      {/* subtle premium plant spotlight bounce */}
      <pointLight
        position={[0, 1.2, 0.4]}
        intensity={0.22}
        distance={3}
        color="#c5a059"
      />
    </group>
  );
}

useGLTF.preload(PLANT_MODEL);
