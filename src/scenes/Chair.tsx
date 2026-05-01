import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const CHAIR_MODEL = '/models/gaming_chair.glb';
const CHAIR_HEIGHT = 4.5;
const FLOOR_CLEARANCE = 0.015;

/* ─── Material helpers ──────────────────────────────────────────── */

function copyMaps(
  src: THREE.MeshStandardMaterial,
  dst: THREE.MeshPhysicalMaterial,
) {
  const maps = [
    'map', 'normalMap', 'roughnessMap', 'metalnessMap',
    'aoMap', 'emissiveMap', 'displacementMap',
  ] as const;

  for (const key of maps) {
    const tex = src[key as keyof typeof src] as THREE.Texture | null;
    if (tex) {
      if (key === 'map' || key === 'emissiveMap') {
        tex.colorSpace = THREE.SRGBColorSpace;
      }
      (dst as any)[key] = tex;
    }
  }

  if (src.normalMap) {
    dst.normalScale = src.normalScale?.clone() ?? new THREE.Vector2(1, 1);
  }
}

function baseFlags(
  mat: THREE.MeshPhysicalMaterial,
  side: THREE.Side = THREE.FrontSide,
) {
  mat.transparent = false;
  mat.opacity     = 1;
  mat.alphaTest   = 0;
  mat.depthWrite  = true;
  mat.depthTest   = true;
  mat.side        = side;           // <-- caller decides per-surface
  mat.needsUpdate = true;
}

/* ─── Surface recipes ───────────────────────────────────────────── */

/** Deep matte leather — DoubleSide so thin shell panels never vanish */
function applyLeather(
  mat: THREE.MeshPhysicalMaterial,
  hasTexture: boolean,
) {
  mat.color              = new THREE.Color('#0d0d0d');
  mat.roughness          = hasTexture ? 0.78 : 0.82;
  mat.metalness          = 0;
  mat.clearcoat          = 0.18;
  mat.clearcoatRoughness = 0.55;
  mat.sheen              = 0.12;
  mat.sheenRoughness     = 0.7;
  mat.sheenColor         = new THREE.Color('#2a1f0e');
  mat.envMapIntensity    = 0.12;
  // KEY FIX: double-sided so the hollow backrest shell is fully opaque
  mat.side               = THREE.DoubleSide;
}

/** Brushed / satin metal */
function applyMetal(mat: THREE.MeshPhysicalMaterial, hasTexture: boolean) {
  mat.color              = new THREE.Color('#1a1a1a');
  mat.roughness          = hasTexture ? 0.38 : 0.42;
  mat.metalness          = 0.88;
  mat.reflectivity       = 0.85;
  mat.anisotropy         = 0.6;
  mat.anisotropyRotation = Math.PI / 4;
  mat.envMapIntensity    = 0.55;
  mat.side               = THREE.FrontSide;
}

/** Gold / champagne accent trim */
function applyAccent(mat: THREE.MeshPhysicalMaterial) {
  mat.color              = new THREE.Color('#b8943f');
  mat.roughness          = 0.28;
  mat.metalness          = 0.92;
  mat.reflectivity       = 1;
  mat.clearcoat          = 0.35;
  mat.clearcoatRoughness = 0.2;
  mat.envMapIntensity    = 0.75;
  mat.side               = THREE.FrontSide;
}

/** Rubber caster wheels */
function applyRubber(mat: THREE.MeshPhysicalMaterial) {
  mat.color           = new THREE.Color('#080808');
  mat.roughness       = 0.95;
  mat.metalness       = 0;
  mat.envMapIntensity = 0.02;
  mat.side            = THREE.DoubleSide; // caster spokes also thin
}

/** Plastic shell panels */
function applyPlastic(mat: THREE.MeshPhysicalMaterial) {
  mat.color              = new THREE.Color('#111111');
  mat.roughness          = 0.62;
  mat.metalness          = 0;
  mat.clearcoat          = 0.45;
  mat.clearcoatRoughness = 0.38;
  mat.envMapIntensity    = 0.22;
  mat.side               = THREE.DoubleSide; // panels are also thin shells
}

/* ─── Component ─────────────────────────────────────────────────── */

export default function Chair(props: any) {
  const { scene } = useGLTF(CHAIR_MODEL);

  const { chair, modelScale, modelPosition } = useMemo(() => {
    const chair  = scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(chair);
    const size   = new THREE.Vector3();
    const center = new THREE.Vector3();
    bounds.getSize(size);
    bounds.getCenter(center);

    const modelScale = CHAIR_HEIGHT / size.y;
    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      FLOOR_CLEARANCE - bounds.min.y * modelScale,
      -center.z * modelScale,
    ];
    return { chair, modelScale, modelPosition };
  }, [scene]);

  useLayoutEffect(() => {
    chair.traverse((object: any) => {
      if (!object.isMesh) return;

      object.castShadow    = true;
      object.receiveShadow = true;

      // Re-compute normals so DoubleSide lighting is correct on both faces
      object.geometry.computeVertexNormals();

      // Ensure UV2 for AO maps
      if (
        !object.geometry.attributes.uv2 &&
        object.geometry.attributes.uv
      ) {
        object.geometry.setAttribute(
          'uv2',
          object.geometry.attributes.uv,
        );
      }

      const src  = object.material as THREE.MeshStandardMaterial;
      const mat  = new THREE.MeshPhysicalMaterial();
      const name = object.name.toLowerCase();

      copyMaps(src, mat);
      // Set solid defaults before recipe overrides side
      baseFlags(mat, THREE.DoubleSide);

      const hasTexture = !!src.map;

      /* ── Surface classification ── */
      const isLeather =
        name.includes('seat')    || name.includes('back')    ||
        name.includes('cushion') || name.includes('leather') ||
        name.includes('fabric')  || name.includes('pad')     ||
        name.includes('headrest')|| name.includes('lumbar')  ||
        name.includes('chair');

      const isMetal =
        name.includes('metal')   || name.includes('arm')     ||
        name.includes('frame')   || name.includes('stand')   ||
        name.includes('base')    || name.includes('leg')     ||
        name.includes('support') || name.includes('cylinder');

      const isAccent =
        name.includes('trim')    || name.includes('accent')  ||
        name.includes('logo')    || name.includes('stitch')  ||
        name.includes('piping')  || name.includes('badge');

      const isWheel =
        name.includes('wheel')   || name.includes('caster')  ||
        name.includes('roller');

      const isPlastic =
        name.includes('shell')   || name.includes('panel')   ||
        name.includes('plastic') || name.includes('cover')   ||
        name.includes('housing');

      if      (isAccent)  applyAccent(mat);
      else if (isWheel)   applyRubber(mat);
      else if (isMetal)   applyMetal(mat, hasTexture);
      else if (isPlastic) applyPlastic(mat);
      else if (isLeather) applyLeather(mat, hasTexture);
      else                applyLeather(mat, hasTexture);

      // Prevent Z-fighting on thin overlapping shells
      object.renderOrder = isLeather || isPlastic ? 1 : 0;

      object.material = mat;
    });
  }, [chair]);

  return (
    <group {...props}>
      <primitive
        object={chair}
        position={modelPosition}
        scale={modelScale}
        rotation={[0, Math.PI, 0]}
      />
      <pointLight
        position={[0, 0.3, 0]}
        intensity={0.06}
        distance={1.4}
        decay={2}
        color="#c5a059"
      />
    </group>
  );
}

useGLTF.preload(CHAIR_MODEL);