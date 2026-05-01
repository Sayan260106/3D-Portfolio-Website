import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MUG_MODEL = '/models/nasa_mug.glb';
const MUG_HEIGHT   = 0.16;
const TABLE_CLEAR  = 0.012;

/* ─────────────────────────────────────────────────────────────────────────── */
/* Constants derived once                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
const COFFEE_Y_LOCAL   = 0.115;   // height inside mug (≈ 72 % full)
const COFFEE_RADIUS    = 0.0435;  // inner radius of the opening
const CREMA_WIDTH      = 0.008;   // annular ring around the coffee

const STEAM_COUNT      = 14;

/* ─────────────────────────────────────────────────────────────────────────── */
/* Steam particle system                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */
type ParticleState = {
  progress : number;
  speed    : number;
  ox       : number;  // spawn x offset
  oz       : number;  // spawn z offset
  phase    : number;  // curl phase
  freq     : number;  // curl frequency
  amp      : number;  // curl amplitude
  tilt     : number;  // slight lean angle
};

function randomParticle(): ParticleState {
  const r     = Math.random() * COFFEE_RADIUS * 0.55;
  const theta = Math.random() * Math.PI * 2;
  return {
    progress : Math.random(),
    speed    : 0.22 + Math.random() * 0.32,
    ox       : Math.cos(theta) * r,
    oz       : Math.sin(theta) * r,
    phase    : Math.random() * Math.PI * 2,
    freq     : 0.7 + Math.random() * 0.9,
    amp      : 0.005 + Math.random() * 0.012,
    tilt     : (Math.random() - 0.5) * 0.004,
  };
}

function SteamSystem({ origin }: { origin: [number, number, number] }) {
  const particles = useRef<ParticleState[]>(
    Array.from({ length: STEAM_COUNT }, randomParticle)
  );
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    particles.current.forEach((p, i) => {
      p.progress += delta * p.speed;

      if (p.progress >= 1) {
        const fresh = randomParticle();
        fresh.progress = 0;
        particles.current[i] = fresh;
        return;
      }

      const mesh = meshRefs.current[i];
      if (!mesh) return;

      const g = p.progress; // 0 → 1

      /* Position: rises 0.11 m above the coffee surface with a gentle curl */
      const y  = origin[1] + 0.004 + g * 0.11;
      const cx = Math.sin(t * p.freq + p.phase) * p.amp * (1 + g * 2);
      const cz = Math.cos(t * p.freq * 0.7 + p.phase) * p.amp * (1 + g * 1.4);
      const x  = origin[0] + p.ox + cx + p.tilt * g * 8;
      const z  = origin[2] + p.oz + cz;

      mesh.position.set(x, y, z);

      /* Scale: wispy puff that grows as it rises */
      const s = 0.014 + g * 0.052;
      mesh.scale.set(s, s * 1.55, s);

      /* Billboard toward camera */
      mesh.lookAt(state.camera.position);

      /* Opacity: quick fade-in → hold → slow fade-out */
      const mat = mesh.material as THREE.MeshBasicMaterial;
      if (g < 0.18) {
        mat.opacity = (g / 0.18) * 0.32;
      } else if (g < 0.65) {
        mat.opacity = 0.32;
      } else {
        mat.opacity = ((1 - g) / 0.35) * 0.32;
      }
    });
  });

  return (
    <>
      {Array.from({ length: STEAM_COUNT }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
        >
          {/* Slightly elongated plane for a vapour-puff silhouette */}
          <planeGeometry args={[1, 1.35, 1, 1]} />
          <meshBasicMaterial
            color="#d8e4ee"
            transparent
            opacity={0}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Mug                                                                          */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function Mug(props: any) {
  const { scene } = useGLTF(MUG_MODEL);

  const { mug, modelScale, modelPosition } = useMemo(() => {
    const mug    = scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(mug);
    const size   = new THREE.Vector3();
    const center = new THREE.Vector3();
    bounds.getSize(size);
    bounds.getCenter(center);

    const modelScale                       = size.y > 0 ? MUG_HEIGHT / size.y : 1;
    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      TABLE_CLEAR - bounds.min.y * modelScale,
      -center.z * modelScale,
    ];

    return { mug, modelScale, modelPosition };
  }, [scene]);

  useLayoutEffect(() => {
    mug.traverse((object: any) => {
      if (!object.isMesh) return;
      object.castShadow    = true;
      object.receiveShadow = true;
      if (object.geometry) object.geometry.computeVertexNormals();

      object.material = object.material.clone();
      const mat  = object.material;
      const name = (object.name as string).toLowerCase();

      mat.side            = THREE.FrontSide;
      mat.transparent     = false;
      mat.opacity         = 1;
      mat.depthWrite      = true;
      mat.depthTest       = true;
      mat.envMapIntensity = 0.55;

      if (name.includes('body') || name.includes('cup') || name.includes('mug') || name.includes('ceramic')) {
        mat.color     = new THREE.Color('#f5f5f5');
        mat.roughness = 0.18;
        mat.metalness = 0;
      } else if (name.includes('handle')) {
        mat.color     = new THREE.Color('#efefef');
        mat.roughness = 0.2;
      } else if (name.includes('logo') || name.includes('text') || name.includes('decal')) {
        mat.color            = new THREE.Color('#1e4fa3');
        mat.roughness        = 0.35;
        mat.emissive         = new THREE.Color('#10264f');
        mat.emissiveIntensity = 0.02;
      } else {
        mat.color     = new THREE.Color('#f0f0f0');
        mat.roughness = 0.25;
      }
      mat.needsUpdate = true;
    });
  }, [mug]);

  /* World-space coffee surface Y */
  const coffeeWorldY = modelPosition[1] + COFFEE_Y_LOCAL;
  const cx           = modelPosition[0];
  const cz           = modelPosition[2];

  return (
    <group {...props}>
      {/* ── Mug model ──────────────────────────────────────────────── */}
      <primitive
        object={mug}
        position={modelPosition}
        scale={modelScale}
        rotation={[0, -Math.PI / 4, 0]}
      />

      {/* ── Coffee liquid body (thin disc capping the fill) ───────── */}
      <mesh
        position={[cx, coffeeWorldY, cz]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[COFFEE_RADIUS, 48]} />
        <meshStandardMaterial
          color="#1c0f08"
          roughness={0.12}
          metalness={0.04}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* ── Crema / meniscus ring ─────────────────────────────────── */}
      {/* Outer crema band – warm tan foam around the edge */}
      <mesh
        position={[cx, coffeeWorldY + 0.0005, cz]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[COFFEE_RADIUS - CREMA_WIDTH, COFFEE_RADIUS, 48]} />
        <meshStandardMaterial
          color="#6b3d1e"
          roughness={0.92}
          metalness={0}
        />
      </mesh>

      {/* Inner crema highlight – lighter ring just inside the foam */}
      <mesh
        position={[cx, coffeeWorldY + 0.001, cz]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry
          args={[
            COFFEE_RADIUS - CREMA_WIDTH * 2.2,
            COFFEE_RADIUS - CREMA_WIDTH * 0.9,
            48,
          ]}
        />
        <meshStandardMaterial
          color="#9c5c28"
          roughness={0.95}
          metalness={0}
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* ── Steam particle system ─────────────────────────────────── */}
      <SteamSystem origin={[cx, coffeeWorldY, cz]} />

      {/* ── Warm ambient glow rising from coffee ──────────────────── */}
      <pointLight
        position={[cx, coffeeWorldY + 0.06, cz]}
        intensity={0.06}
        distance={0.6}
        color="#ffcf9e"
      />
    </group>
  );
}

useGLTF.preload(MUG_MODEL);