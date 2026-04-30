import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MODEL_PATH = "/models/steampunk-style_clock.glb";
const CLOCK_DIAMETER = 1.7;

export const WALL_CLOCK_PLACEMENT = {
  position: [4.85, 6.5, -3.92] as [number, number, number],
  rotation: [0, 0, 0] as [number, number, number],
  scale: 1,
};

function styleClockMaterial(material: THREE.Material, objectName: string) {
  if (!(material instanceof THREE.MeshStandardMaterial)) return;

  const isGlass = objectName.includes("glass");

  material.side = THREE.DoubleSide;
  material.envMapIntensity = isGlass ? 0.55 : 0.45;

  if (isGlass) {
    material.transparent = true;
    material.opacity = 0.18;
    material.roughness = 0.04;
    material.metalness = 0;
  }

  material.needsUpdate = true;
}

/** Returns the local bounding-box diagonal of a mesh. */
function meshDiagonal(mesh: THREE.Mesh): number {
  mesh.geometry.computeBoundingBox();
  const bb = mesh.geometry.boundingBox!;
  return bb.min.distanceTo(bb.max);
}

/**
 * Fallback hand picker — when no mesh names match, guess hands by size.
 * Hands are typically the smaller / thinner meshes in a clock model.
 */
function pickHandsByGeometry(
  meshes: THREE.Mesh[]
): [THREE.Mesh | null, THREE.Mesh | null, THREE.Mesh | null] {
  const withDiag = meshes.map((m) => ({ mesh: m, diag: meshDiagonal(m) }));
  const maxDiag  = Math.max(...withDiag.map((d) => d.diag));

  const candidates = withDiag
    .filter((d) => d.diag < maxDiag * 0.75)  // skip large body/face parts
    .sort((a, b) => a.diag - b.diag);         // smallest first

  // Assign: second (thinnest), hour, minute (longest)
  const second = candidates[0]?.mesh ?? null;
  const hour   = candidates[1]?.mesh ?? null;
  const minute = candidates[2]?.mesh ?? null;

  return [hour, minute, second];
}

/** Creates a hand material that always renders on top of the clock face. */
function makeHandMaterial(
  color: string,
  emissive: string,
  emissiveIntensity: number,
  metalness: number,
  roughness: number
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(emissive),
    emissiveIntensity,
    metalness,
    roughness,
    depthTest: false,  // always draw on top regardless of depth buffer
    depthWrite: false,
  });
}

// Hour → warm gold | Minute → cool silver | Second → vivid red
const HAND_STYLES = [
  { color: "#f2c66d", emissive: "#8b5e1a", emissiveIntensity: 0.55, metalness: 1.0, roughness: 0.12 },
  { color: "#d0d8e8", emissive: "#4a5568", emissiveIntensity: 0.40, metalness: 0.9, roughness: 0.18 },
  { color: "#e53e3e", emissive: "#c53030", emissiveIntensity: 0.80, metalness: 0.5, roughness: 0.25 },
];

export default function SteampunkWallClock(props: any) {
  const hourHand   = useRef<THREE.Object3D | null>(null);
  const minuteHand = useRef<THREE.Object3D | null>(null);
  const secondHand = useRef<THREE.Object3D | null>(null);

  const { scene } = useGLTF(MODEL_PATH);

  const { clock, modelPosition, modelScale } = useMemo(() => {
    const clock = scene.clone(true);
    clock.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(clock);
    const size   = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    const diameter  = Math.max(size.x, size.y);
    const modelScale =
      Number.isFinite(diameter) && diameter > 0 ? CLOCK_DIAMETER / diameter : 1;

    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      -center.y * modelScale,
      -bounds.max.z * modelScale - 0.02,
    ];

    return { clock, modelPosition, modelScale };
  }, [scene]);

  useLayoutEffect(() => {
    const allMeshes: THREE.Mesh[] = [];

    clock.traverse((child: any) => {
      if (!child.isMesh) return;

      child.castShadow    = true;
      child.receiveShadow = true;

      const name = child.name.toLowerCase();
      if (child.geometry) child.geometry.computeVertexNormals();

      /* ── Primary: name-based detection ── */
      if (
        name.includes("hour") ||
        name.includes("small_hand") ||
        name.includes("short_hand") ||
        name.includes("pplane4")
      ) hourHand.current = child;

      if (
        name.includes("minute") ||
        name.includes("long_hand") ||
        name.includes("big_hand") ||
        name.includes("pplane1")
      ) minuteHand.current = child;

      if (name.includes("second") || name.includes("thin_hand"))
        secondHand.current = child;

      allMeshes.push(child as THREE.Mesh);

      /* Style non-hand materials */
      if (!child.material) return;
      const mats = Array.isArray(child.material)
        ? child.material.map((m: THREE.Material) => m.clone())
        : [child.material.clone()];
      child.material = Array.isArray(child.material) ? mats : mats[0];
      mats.forEach((m: THREE.Material<THREE.MaterialEventMap>) => styleClockMaterial(m, name));
    });

    /* ── Fallback: geometry heuristic if name detection found nothing ── */
    if (!hourHand.current && !minuteHand.current && !secondHand.current) {
      console.warn(
        "[SteampunkWallClock] No hands found by name — using geometry fallback."
      );
      const [h, m, s] = pickHandsByGeometry(allMeshes);
      hourHand.current   = h;
      minuteHand.current = m;
      secondHand.current = s;
    }

    /* ── Apply distinct materials + force hands to always be visible ── */
    const hands = [hourHand.current, minuteHand.current, secondHand.current];

    hands.forEach((hand, i) => {
      if (!hand) return;

      const { color, emissive, emissiveIntensity, metalness, roughness } =
        HAND_STYLES[i];

      (hand as any).material = makeHandMaterial(
        color, emissive, emissiveIntensity, metalness, roughness
      );

      hand.visible     = true;
      hand.renderOrder = 100 + i;       // stacked: hour=100, minute=101, second=102
      hand.position.z += 0.05 + i * 0.01; // push well in front of the clock face
    });
  }, [clock]);

  useFrame(() => {
    const now = new Date();
    const ms  = now.getMilliseconds();
    const sec = now.getSeconds() + ms / 1000;
    const min = now.getMinutes() + sec / 60;
    const hr  = (now.getHours() % 12) + min / 60;

    if (secondHand.current)
      secondHand.current.rotation.z = -(sec / 60) * Math.PI * 2;
    if (minuteHand.current)
      minuteHand.current.rotation.z = -(min / 60) * Math.PI * 2;
    if (hourHand.current)
      hourHand.current.rotation.z   = -(hr / 12) * Math.PI * 2;
  });

  return (
    <group {...props}>
      <primitive object={clock} position={modelPosition} scale={modelScale} />

      {/* Front warm light */}
      <pointLight intensity={1.3} distance={4} position={[0, 0, 0.4]} color="#f2c66d" />
      {/* Side fill */}
      <pointLight intensity={0.7} distance={3} position={[0.45, 0.2, 0.25]} color="#ffffff" />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);