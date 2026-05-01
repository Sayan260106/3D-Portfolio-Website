import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const SHELF_MODEL = '/models/book_shelf_draft.glb';
const SHELF_HEIGHT = 2;
const FLOOR_OFFSET = 0.02;

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */

/** Stable pseudo-random float [0,1) from a string seed */
function hashFloat(seed: string, salt = 0): number {
  let h = salt * 2654435761;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 2246822519);
    h ^= h >>> 13;
  }
  h = Math.imul(h ^ (h >>> 16), 2246822519);
  return ((h >>> 0) % 100000) / 100000;
}

function hashPick<T>(seed: string, salt: number, arr: T[]): T {
  return arr[Math.floor(hashFloat(seed, salt) * arr.length)];
}

/** Slightly vary a hex color by ±amount in L channel */
function varyColor(hex: string, seed: string, amount = 0.06): THREE.Color {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  hsl.l = THREE.MathUtils.clamp(
    hsl.l + (hashFloat(seed, 7) - 0.5) * 2 * amount,
    0.05,
    0.95
  );
  return c.setHSL(hsl.h, hsl.s, hsl.l);
}

/* ─────────────────────────────────────────────────────────────
   MATERIAL FACTORIES  (MeshPhysicalMaterial throughout)
───────────────────────────────────────────────────────────── */

/** Walnut / dark wood – clearcoat finish for a polished look */
function makeWoodMat(name: string): THREE.MeshPhysicalMaterial {
  const woodTones = ['#5c3a27', '#4a2e1e', '#6b4433', '#523325'];
  const base = hashPick(name, 1, woodTones);
  const mat = new THREE.MeshPhysicalMaterial({
    color: varyColor(base, name, 0.05),
    roughness: 0.70,
    metalness: 0.02,
    clearcoat: 0.35,
    clearcoatRoughness: 0.25,
    envMapIntensity: 0.55,
  });
  return mat;
}

/** Matte black metal – anodised aluminium look */
function makeMetalMat(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#1a1a1a'),
    roughness: 0.28,
    metalness: 0.92,
    reflectivity: 0.9,
    envMapIntensity: 0.8,
  });
}

const BOOK_PALETTE = [
  '#7b1c1c', // deep burgundy
  '#1b3758', // midnight navy
  '#2c5027', // forest green
  '#5a3c10', // toffee brown
  '#3a1f50', // aubergine
  '#1a4f4f', // teal
  '#8f3020', // terracotta
  '#334d5c', // slate blue
  '#6b3a2a', // sienna
  '#2d5016', // olive
  '#4a2060', // plum
  '#b04010', // rust
  '#1e3d59', // prussian blue
  '#5c4018', // caramel
  '#8b0000', // dark red
  '#c8a84b', // gold (cloth-bound)
  '#d7d0c4', // linen/beige
];

/** Cloth-covered hardback book spine */
function makeBookMat(name: string): THREE.MeshPhysicalMaterial {
  const base = hashPick(name, 3, BOOK_PALETTE);
  const isLinen = base === '#d7d0c4' || base === '#c8a84b';
  return new THREE.MeshPhysicalMaterial({
    color: varyColor(base, name, 0.08),
    roughness: isLinen ? 0.95 : 0.82,
    metalness: 0,
    sheen: isLinen ? 0.4 : 0.15,
    sheenRoughness: 0.8,
    sheenColor: new THREE.Color(isLinen ? '#c8b89a' : '#ffffff'),
    envMapIntensity: 0.25,
  });
}

/** Ceramic / matte pottery */
function makePotMat(name: string): THREE.MeshPhysicalMaterial {
  const ceramicTones = ['#d9d3c8', '#8d735d', '#2d2d2d', '#a09080', '#c0bdb5'];
  return new THREE.MeshPhysicalMaterial({
    color: varyColor(hashPick(name, 5, ceramicTones), name, 0.04),
    roughness: 0.88,
    metalness: 0,
    clearcoat: 0.12,
    clearcoatRoughness: 0.6,
    envMapIntensity: 0.4,
  });
}

/** Leaf / foliage – subsurface-ish via translucency */
function makePlantMat(name: string): THREE.MeshPhysicalMaterial {
  const greens = ['#4f9d43', '#2f6b34', '#76b852', '#3e7d32', '#5aad50'];
  return new THREE.MeshPhysicalMaterial({
    color: varyColor(hashPick(name, 6, greens), name, 0.06),
    roughness: 0.88,
    metalness: 0,
    side: THREE.DoubleSide,           // leaves seen from both sides
    envMapIntensity: 0.2,
  });
}

/** Brushed brass / gold artifact */
function makeArtifactMat(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#c9a84c'),
    roughness: 0.32,
    metalness: 0.85,
    reflectivity: 0.9,
    envMapIntensity: 0.9,
  });
}

/** Fallback – neutral warm grey */
function makeFallbackMat(name: string, index: number): THREE.MeshPhysicalMaterial {
  const misc = ['#5c3a27', '#d7d0c4', '#222222', '#7d5c48', '#6e7d8d'];
  return new THREE.MeshPhysicalMaterial({
    color: varyColor(misc[index % misc.length], name, 0.04),
    roughness: 0.78,
    metalness: 0.05,
    envMapIntensity: 0.3,
  });
}

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export default function BookShelf(props: any) {
  const { scene } = useGLTF(SHELF_MODEL);

  const { shelf, modelScale, modelPosition } = useMemo(() => {
    const shelf = scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(shelf);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    bounds.getSize(size);
    bounds.getCenter(center);
    const modelScale = size.y > 0 ? SHELF_HEIGHT / size.y : 1;
    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      FLOOR_OFFSET - bounds.min.y * modelScale,
      -center.z * modelScale,
    ];
    return { shelf, modelScale, modelPosition };
  }, [scene]);

  useLayoutEffect(() => {
    let index = 0;

    shelf.traverse((object: any) => {
      if (!object.isMesh) return;
      index++;

      object.castShadow = true;
      object.receiveShadow = true;
      if (object.geometry) object.geometry.computeVertexNormals();

      const name: string = object.name.toLowerCase();
      let mat: THREE.MeshPhysicalMaterial;

      if (
        name.includes('shelf') || name.includes('frame') ||
        name.includes('body') || name.includes('cabinet') ||
        name.includes('door') || name.includes('wood') ||
        name.includes('panel') || name.includes('plank')
      ) {
        mat = makeWoodMat(name);
      } else if (
        name.includes('leg') || name.includes('handle') ||
        name.includes('metal') || name.includes('support') ||
        name.includes('stand') || name.includes('rod') ||
        name.includes('rail')
      ) {
        mat = makeMetalMat();
      } else if (
        name.includes('book') || name.includes('cover') ||
        name.includes('page') || name.includes('spine') ||
        name.includes('notebook')
      ) {
        mat = makeBookMat(name);
      } else if (
        name.includes('pot') || name.includes('vase') ||
        name.includes('jar') || name.includes('container') ||
        name.includes('ceramic')
      ) {
        mat = makePotMat(name);
      } else if (
        name.includes('leaf') || name.includes('plant') ||
        name.includes('foliage') || name.includes('stem') ||
        name.includes('flower') || name.includes('grass')
      ) {
        mat = makePlantMat(name);
      } else if (
        name.includes('artifact') || name.includes('decor') ||
        name.includes('statue') || name.includes('brass') ||
        name.includes('gold')
      ) {
        mat = makeArtifactMat();
      } else {
        mat = makeFallbackMat(name, index);
      }

      // Shared safety settings
      mat.side = name.includes('leaf') || name.includes('plant')
        ? THREE.DoubleSide
        : THREE.FrontSide;
      mat.transparent = false;
      mat.opacity = 1;
      mat.depthWrite = true;
      mat.depthTest = true;
      mat.needsUpdate = true;

      object.material = mat;
    });
  }, [shelf]);

  return (
    <group {...props}>
      <primitive
        object={shelf}
        position={modelPosition}
        scale={modelScale}
        rotation={[0, Math.PI / 8, 0]}
      />

      {/*
        ── LIGHTING RIG ──────────────────────────────────────────
        Three-point studio setup:
          1. Key  – warm angled from front-left, simulates room lamp
          2. Fill – cool from front-right, kills harsh shadows
          3. Rim  – cold from behind, separates shelf from wall
          4. Top  – narrow highlight on top shelf / plant
      */}

      {/* 1. Key light – warm amber, front-left */}
      <pointLight
        position={[-0.6, 1.6, 0.7]}
        intensity={0.55}
        distance={3.5}
        decay={2}
        color="#e8b86d"
      />

      {/* 2. Fill light – cool white, front-right */}
      <pointLight
        position={[0.7, 1.2, 0.6]}
        intensity={0.22}
        distance={3.0}
        decay={2}
        color="#d8eeff"
      />

      {/* 3. Rim / back light – cold blue, behind shelf */}
      <pointLight
        position={[0.1, 1.5, -0.8]}
        intensity={0.18}
        distance={2.5}
        decay={2}
        color="#a0c4ff"
      />

      {/* 4. Top spot – greenish to complement plant */}
      <pointLight
        position={[0.15, 2.2, 0.15]}
        intensity={0.16}
        distance={1.8}
        decay={2}
        color="#d4ffce"
      />

      {/* 5. Low bounce – warm, simulates floor-reflected light */}
      <pointLight
        position={[0, 0.1, 0.5]}
        intensity={0.10}
        distance={1.5}
        decay={2}
        color="#c8a060"
      />
    </group>
  );
}

useGLTF.preload(SHELF_MODEL);