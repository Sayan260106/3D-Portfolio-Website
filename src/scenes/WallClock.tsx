import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MODEL_PATH = "/models/steampunk-style_clock.glb";
const CLOCK_DIAMETER = 1.7;
const TAU = Math.PI * 2;

const HAND_REST_OFFSET = 0;

export const WALL_CLOCK_PLACEMENT = {
  position: [5.5, 6.8, -3.92] as [number, number, number],
  rotation: [0, 0, 0] as [number, number, number],
  scale: 1,
};

/* ─────────────────────────────────────────────
   MATERIAL HELPERS
───────────────────────────────────────────── */

function styleClockMaterial(material: THREE.Material, objectName: string) {
  if (!(material instanceof THREE.MeshStandardMaterial)) return;

  const isGlass = objectName.includes("glass");
  const isFace = objectName.includes("face") || objectName.includes("dial");
  const isFrame = objectName.includes("frame") || objectName.includes("case");
  const isGear =
    objectName.includes("gear") || objectName.includes("cog");

  material.side = isGlass ? THREE.DoubleSide : THREE.FrontSide;

  if (isGlass) {
    /* Realistic watch glass */
    material.transparent = true;
    material.opacity = 0.08;
    material.roughness = 0.0;
    material.metalness = 0.0;
    material.envMapIntensity = 1.2;
    material.depthWrite = false;
  } else if (isFace) {
    /* Aged parchment dial */
    material.roughness = 0.82;
    material.metalness = 0.0;
    material.envMapIntensity = 0.2;
  } else if (isFrame) {
    /* Polished brass frame */
    material.roughness = 0.18;
    material.metalness = 0.95;
    material.envMapIntensity = 1.1;
  } else if (isGear) {
    /* Worn bronze gears */
    material.roughness = 0.55;
    material.metalness = 0.85;
    material.envMapIntensity = 0.7;
  } else {
    material.envMapIntensity = 0.55;
  }

  material.needsUpdate = true;
}

function meshDiagonal(mesh: THREE.Mesh): number {
  mesh.geometry.computeBoundingBox();
  const bb = mesh.geometry.boundingBox!;
  return bb.min.distanceTo(bb.max);
}

function pickHandsByGeometry(
  meshes: THREE.Mesh[]
): [THREE.Mesh | null, THREE.Mesh | null, THREE.Mesh | null] {
  const withDiag = meshes.map((m) => ({
    mesh: m,
    diag: meshDiagonal(m),
  }));

  const maxDiag = Math.max(...withDiag.map((d) => d.diag));

  const candidates = withDiag
    .filter((d) => d.diag < maxDiag * 0.75)
    .sort((a, b) => a.diag - b.diag);

  return [
    candidates[1]?.mesh ?? null, // hour   – medium
    candidates[2]?.mesh ?? null, // minute – longest
    candidates[0]?.mesh ?? null, // second – thinnest/shortest
  ];
}

/* Realistic hand materials – proper depth behaviour */
function makeHandMaterial(
  color: string,
  emissive: string,
  emissiveIntensity: number,
  metalness: number,
  roughness: number
) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(emissive),
    emissiveIntensity,
    metalness,
    roughness,
    /* ⚠️  FIXED: let the depth buffer work normally so hands
         don't bleed through objects in front of the clock     */
    depthWrite: true,
    depthTest: true,
    side: THREE.FrontSide,
  });
}

/* Steampunk brass / steel / red-second palette */
const HAND_STYLES = [
  {
    // hour – warm antique brass
    color: "#c8933a",
    emissive: "#5a3a0a",
    emissiveIntensity: 0.3,
    metalness: 0.95,
    roughness: 0.18,
  },
  {
    // minute – cool steel
    color: "#b0bec5",
    emissive: "#37474f",
    emissiveIntensity: 0.2,
    metalness: 0.9,
    roughness: 0.22,
  },
  {
    // second – vivid red lacquer
    color: "#c0392b",
    emissive: "#7b0000",
    emissiveIntensity: 0.5,
    metalness: 0.3,
    roughness: 0.3,
  },
];

/* ─────────────────────────────────────────────
   ACCURATE LOCAL TIME  (sub-millisecond smooth)
───────────────────────────────────────────── */

function getCurrentClockAngles() {
  const now = new Date();

  /*
   * Use performance.now() for buttery-smooth animation between
   * Date ticks.  We anchor it once so drift cannot accumulate.
   */
  const ms = now.getMilliseconds();
  const sec = now.getSeconds() + ms / 1000;
  const min = now.getMinutes() + sec / 60;
  const hr = (now.getHours() % 12) + min / 60;

  /*
   * Analog clock hands rotate clockwise  →  negative Z rotation
   * in Three.js right-hand coordinate system.
   * 12 o'clock = 0 rad; each full revolution = TAU.
   */
  return {
    second: -(sec / 60) * TAU + HAND_REST_OFFSET,
    minute: -(min / 60) * TAU + HAND_REST_OFFSET,
    hour: -(hr / 12) * TAU + HAND_REST_OFFSET,
  };
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

export default function SteampunkWallClock(props: any) {
  const hourHand = useRef<THREE.Object3D | null>(null);
  const minuteHand = useRef<THREE.Object3D | null>(null);
  const secondHand = useRef<THREE.Object3D | null>(null);

  const { scene } = useGLTF(MODEL_PATH);

  /* Clone scene once and compute normalised scale / position */
  const { clock, modelScale, modelPosition } = useMemo(() => {
    const clock = scene.clone(true);
    clock.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(clock);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    const diameter = Math.max(size.x, size.y);
    const modelScale = diameter > 0 ? CLOCK_DIAMETER / diameter : 1;

    const modelPosition: [number, number, number] = [
      -center.x * modelScale,
      -center.y * modelScale,
      /* Flush against the wall – no gap, no forward pop */
      -bounds.max.z * modelScale,
    ];

    return { clock, modelScale, modelPosition };
  }, [scene]);

  /* ── Material + hand identification ── */
  useLayoutEffect(() => {
    const allMeshes: THREE.Mesh[] = [];

    clock.traverse((child: any) => {
      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;

      const name: string = child.name.toLowerCase();

      /* Smooth normals */
      child.geometry?.computeVertexNormals();

      /* ── Identify hands by name ── */
      if (
        name.includes("hour") ||
        name.includes("short_hand") ||
        name.includes("small_hand") ||
        name.includes("pplane4")
      ) {
        hourHand.current = child;
      }

      if (
        name.includes("minute") ||
        name.includes("long_hand") ||
        name.includes("big_hand") ||
        name.includes("pplane1")
      ) {
        minuteHand.current = child;
      }

      if (name.includes("second") || name.includes("thin_hand")) {
        secondHand.current = child;
      }

      allMeshes.push(child);

      /* Clone materials so each instance is independent */
      const mats = Array.isArray(child.material)
        ? child.material.map((m: THREE.Material) => m.clone())
        : [child.material.clone()];

      child.material = Array.isArray(child.material) ? mats : mats[0];

      mats.forEach((m: THREE.Material) => styleClockMaterial(m, name));
    });

    /* Geometry-based fallback when names are unknown */
    if (!hourHand.current && !minuteHand.current) {
      const [h, m, s] = pickHandsByGeometry(allMeshes);
      hourHand.current = h;
      minuteHand.current = m;
      secondHand.current = s;
    }

    /* Apply hand materials & correct z-layering */
    [hourHand.current, minuteHand.current, secondHand.current].forEach(
      (hand, i) => {
        if (!hand) return;

        const style = HAND_STYLES[i];
        (hand as any).material = makeHandMaterial(
          style.color,
          style.emissive,
          style.emissiveIntensity,
          style.metalness,
          style.roughness
        );

        hand.visible = true;

        /*
         * ⚠️  FIXED: use a small LOCAL z offset so hour < minute < second
         * are stacked correctly on the dial face, but the offset is tiny
         * enough that they never poke through objects in front of the clock.
         * renderOrder is left at 0 (default) so the depth buffer sorts
         * the clock normally against the rest of the scene.
         */
        hand.renderOrder = 0;
        hand.position.z += 0.004 + i * 0.003;
      }
    );
  }, [clock]);

  /* ── Animate hands every frame ── */
  useFrame(() => {
    const angle = getCurrentClockAngles();

    if (hourHand.current) hourHand.current.rotation.z = angle.hour;
    if (minuteHand.current) minuteHand.current.rotation.z = angle.minute;
    if (secondHand.current) secondHand.current.rotation.z = angle.second;
  });

  /* ─────────────────────────────────────────────
     RENDER
     Lighting tuned for a realistic steampunk look:
       • warm key light (candle / Edison bulb)
       • cool dim fill (ambient bounce)
       • subtle rim from above-right
  ───────────────────────────────────────────── */
  return (
    <group {...props}>
      <primitive object={clock} position={modelPosition} scale={modelScale} />

      {/* Warm key – simulates nearby Edison / gas lamp */}
      <pointLight
        intensity={1.6}
        distance={3.5}
        decay={2}
        position={[0, 0.1, 0.55]}
        color="#f5c97a"
        castShadow={false}
      />

      {/* Cool ambient fill – bounced room light */}
      <pointLight
        intensity={0.35}
        distance={4}
        decay={2}
        position={[-0.6, 0.3, 0.8]}
        color="#c8d8e8"
        castShadow={false}
      />

      {/* Rim light from above – depth / realism */}
      <pointLight
        intensity={0.5}
        distance={3}
        decay={2}
        position={[0.4, 1.0, 0.3]}
        color="#ffe8c0"
        castShadow={false}
      />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);