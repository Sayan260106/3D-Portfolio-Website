import React, { JSX, useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MODEL_PATH = "/models/steampunk-style_clock-transformed.glb";

const CLOCK_DIAMETER = 1.7;
const TAU = Math.PI * 2;

const HAND_LAYER_OFFSET = 0.002;

export const WALL_CLOCK_PLACEMENT = {
  position: [5.5, 6.8, -3.92] as [number, number, number],
  rotation: [0, 0, 0] as [number, number, number],
  scale: 1,
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

function isStandardMaterial(
  material: THREE.Material
): material is THREE.MeshStandardMaterial {
  return material instanceof THREE.MeshStandardMaterial;
}

function styleClockMaterial(
  material: THREE.Material,
  objectName: string
) {
  if (!isStandardMaterial(material)) return;

  const name = objectName.toLowerCase();

  const isGlass =
    name.includes("glass") ||
    name.includes("crystal");

  const isFace =
    name.includes("face") ||
    name.includes("dial");

  const isFrame =
    name.includes("frame") ||
    name.includes("case") ||
    name.includes("body");

  const isGear =
    name.includes("gear") ||
    name.includes("cog");

  material.side = isGlass
    ? THREE.DoubleSide
    : THREE.FrontSide;

  if (isGlass) {
    material.transparent = true;
    material.opacity = 0.08;
    material.roughness = 0;
    material.metalness = 0;
    material.envMapIntensity = 1.3;
    material.depthWrite = false;
  } else if (isFace) {
    material.roughness = 0.82;
    material.metalness = 0.02;
    material.envMapIntensity = 0.25;
  } else if (isFrame) {
    material.roughness = 0.16;
    material.metalness = 0.96;
    material.envMapIntensity = 1.2;
  } else if (isGear) {
    material.roughness = 0.5;
    material.metalness = 0.88;
    material.envMapIntensity = 0.8;
  } else {
    material.envMapIntensity = 0.6;
  }

  material.needsUpdate = true;
}

function createHandMaterial({
  color,
  emissive,
  emissiveIntensity,
  metalness,
  roughness,
}: {
  color: string;
  emissive: string;
  emissiveIntensity: number;
  metalness: number;
  roughness: number;
}) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive,
    emissiveIntensity,
    metalness,
    roughness,
    depthWrite: true,
    depthTest: true,
    side: THREE.FrontSide,
  });
}

function meshDiagonal(mesh: THREE.Mesh) {
  mesh.geometry.computeBoundingBox();

  const box = mesh.geometry.boundingBox;

  if (!box) return 0;

  return box.min.distanceTo(box.max);
}

function pickHandsByGeometry(meshes: THREE.Mesh[]) {
  const candidates = meshes
    .map((mesh) => ({
      mesh,
      diagonal: meshDiagonal(mesh),
    }))
    .sort((a, b) => a.diagonal - b.diagonal);

  if (candidates.length < 3) {
    return {
      hour: null,
      minute: null,
      second: null,
    };
  }

  return {
    second: candidates[0].mesh,
    hour: candidates[1].mesh,
    minute: candidates[2].mesh,
  };
}

function getClockAngles() {
  const now = new Date();

  const milliseconds = now.getMilliseconds();

  const seconds =
    now.getSeconds() + milliseconds / 1000;

  const minutes =
    now.getMinutes() + seconds / 60;

  const hours =
    (now.getHours() % 12) + minutes / 60;

  return {
    second: -(seconds / 60) * TAU,
    minute: -(minutes / 60) * TAU,
    hour: -(hours / 12) * TAU,
  };
}

/* ─────────────────────────────────────────────
   HAND MATERIALS
───────────────────────────────────────────── */

const HAND_MATERIALS = {
  hour: {
    color: "#c8933a",
    emissive: "#5a3a0a",
    emissiveIntensity: 0.28,
    metalness: 0.95,
    roughness: 0.18,
  },

  minute: {
    color: "#b0bec5",
    emissive: "#37474f",
    emissiveIntensity: 0.18,
    metalness: 0.92,
    roughness: 0.22,
  },

  second: {
    color: "#c0392b",
    emissive: "#7b0000",
    emissiveIntensity: 0.42,
    metalness: 0.35,
    roughness: 0.3,
  },
};

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

export default function SteampunkWallClock(
  props: JSX.IntrinsicElements["group"]
) {
  const hourHand = useRef<THREE.Object3D | null>(null);
  const minuteHand = useRef<THREE.Object3D | null>(null);
  const secondHand = useRef<THREE.Object3D | null>(null);

  const { scene } = useGLTF(MODEL_PATH);

  const { clock, modelScale, modelPosition } = useMemo(() => {
    const clonedScene = scene.clone(true);

    clonedScene.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(clonedScene);

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    const diameter = Math.max(size.x, size.y);

    const scale =
      diameter > 0
        ? CLOCK_DIAMETER / diameter
        : 1;

    const position: [number, number, number] = [
      -center.x * scale,
      -center.y * scale,
      -bounds.max.z * scale,
    ];

    return {
      clock: clonedScene,
      modelScale: scale,
      modelPosition: position,
    };
  }, [scene]);

  /* ─────────────────────────────────────────────
     MATERIALS + HAND DETECTION
  ───────────────────────────────────────────── */

  useLayoutEffect(() => {
    const allMeshes: THREE.Mesh[] = [];

    clock.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      allMeshes.push(child);

      child.castShadow = true;
      child.receiveShadow = true;

      child.geometry.computeVertexNormals();

      const name = child.name.toLowerCase();

      /* Detect hands by names */

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

      if (
        name.includes("second") ||
        name.includes("thin_hand")
      ) {
        secondHand.current = child;
      }

      /* Clone materials */

      const materials = Array.isArray(child.material)
        ? child.material.map((m) => m.clone())
        : [child.material.clone()];

      child.material = Array.isArray(child.material)
        ? materials
        : materials[0];

      materials.forEach((material) =>
        styleClockMaterial(material, name)
      );
    });

    /* Fallback geometry detection */

    if (
      !hourHand.current ||
      !minuteHand.current
    ) {
      const detected = pickHandsByGeometry(allMeshes);

      hourHand.current =
        hourHand.current || detected.hour;

      minuteHand.current =
        minuteHand.current || detected.minute;

      secondHand.current =
        secondHand.current || detected.second;
    }

    /* Apply custom materials */

    const handConfigs = [
      {
        ref: hourHand.current,
        material: HAND_MATERIALS.hour,
        z: HAND_LAYER_OFFSET,
      },
      {
        ref: minuteHand.current,
        material: HAND_MATERIALS.minute,
        z: HAND_LAYER_OFFSET * 2,
      },
      {
        ref: secondHand.current,
        material: HAND_MATERIALS.second,
        z: HAND_LAYER_OFFSET * 3,
      },
    ];

    handConfigs.forEach(({ ref, material, z }) => {
      if (!ref) return;

      const mesh = ref as THREE.Mesh;

      mesh.material = createHandMaterial(material);

      mesh.renderOrder = 1;

      mesh.position.z += z;
    });
  }, [clock]);

  /* ─────────────────────────────────────────────
     ANIMATION
  ───────────────────────────────────────────── */

  useFrame(() => {
    const angles = getClockAngles();

    if (hourHand.current) {
      hourHand.current.rotation.z = angles.hour;
    }

    if (minuteHand.current) {
      minuteHand.current.rotation.z = angles.minute;
    }

    if (secondHand.current) {
      secondHand.current.rotation.z = angles.second;
    }
  });

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */

  return (
    <group {...props}>
      <primitive
        object={clock}
        position={modelPosition}
        scale={modelScale}
      />

      {/* Warm key light */}
      <pointLight
        position={[0, 0.1, 0.55]}
        intensity={1.6}
        distance={3.5}
        decay={2}
        color="#f5c97a"
      />

      {/* Ambient cool fill */}
      <pointLight
        position={[-0.6, 0.3, 0.8]}
        intensity={0.35}
        distance={4}
        decay={2}
        color="#c8d8e8"
      />

      {/* Rim light */}
      <pointLight
        position={[0.4, 1, 0.3]}
        intensity={0.5}
        distance={3}
        decay={2}
        color="#ffe8c0"
      />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);