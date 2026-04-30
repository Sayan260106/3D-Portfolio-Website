import React, { useMemo } from 'react';
import * as THREE from 'three';

type CableProps = {
  start: THREE.Vector3;
  mid: THREE.Vector3[];
  end: THREE.Vector3;
  radius?: number;
  color?: string;
};

function Cable({ start, mid, end, radius = 0.007, color = '#101010' }: CableProps) {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([start, ...mid, end], false, 'catmullrom', 0.2);
  }, [start, mid, end]);

  return (
    <group>
      <mesh castShadow receiveShadow>
        <tubeGeometry args={[curve, 64, radius, 12, false]} />
        <meshStandardMaterial color={color} roughness={0.96} metalness={0.02} />
      </mesh>
      <mesh position={[end.x, end.y, end.z]} castShadow>
        <cylinderGeometry args={[radius * 1.1, radius * 1.1, 0.03, 10]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.5} metalness={0.25} />
      </mesh>
    </group>
  );
}

export default function Wires(props: any) {
  
  const port = (dx: number, dy: number) =>
    new THREE.Vector3(
      -3.08 + dx * (-0.4161),
      -0.2 + dy,
      -0.68 + dx * 0.9093,
    );

  // Stage 1: exits perpendicular to the panel face
  const stub = (dx: number, dy: number, dist = 0.20) => {
    const p = port(dx, dy);
    return new THREE.Vector3(
      p.x + (-0.9093) * dist,
      p.y,
      p.z + (-0.4161) * dist,
    );
  };

  // Stage 2: gravity sag — same XZ as stub but drops below desk level
  //          This gives the catenary belly before the cable hits the floor.
  const sag = (dx: number, dy: number, dist = 0.20) => {
    const s = stub(dx, dy, dist);
    return new THREE.Vector3(
      s.x,
      -0.22,   // dips below desk surface → creates the droop arc
      s.z,
    );
  };

  const monitorHub = new THREE.Vector3(0, 1.12, -1.12);
  const trayY = 0.03;
  const trayZ = -1.18;

  // Stage 3: all cables converge here at desk level behind the CPU
  const DROP       = new THREE.Vector3(-3.14, trayY, -0.82);
  const TRAY_ENTRY = new THREE.Vector3(-2.72, trayY, trayZ);

  return (
    <group {...props}>
      {/* ================================================================
          CPU – DENSE BUNDLE  (6 cables)
          port → stub → sag → drop → tray → destination
          ================================================================ */}

      {/* 1. ATX mains power */}
      <Cable
        radius={0.013}
        color="#111111"
        start={port(0.06, 0.08)}
        mid={[
          stub(0.06, 0.08),
          sag(0.06, 0.08),
          DROP,
          TRAY_ENTRY,
          new THREE.Vector3(-0.55, trayY, trayZ),
        ]}
        end={new THREE.Vector3(-0.42, trayY - 0.01, trayZ - 0.06)}
      />

      {/* 2. HDMI → monitor hub */}
      <Cable
        radius={0.011}
        color="#0c0c0c"
        start={port(0.02, 0.18)}
        mid={[
          stub(0.02, 0.18),
          sag(0.02, 0.18),
          DROP,
          TRAY_ENTRY,
          new THREE.Vector3(-0.65, trayY, trayZ),
          new THREE.Vector3(-0.20, 0.58, -1.12),
        ]}
        end={monitorHub}
      />

      {/* 3. DisplayPort → monitor hub */}
      <Cable
        radius={0.010}
        color="#141414"
        start={port(-0.02, 0.26)}
        mid={[
          stub(-0.02, 0.26),
          sag(-0.02, 0.26),
          new THREE.Vector3(-3.16, trayY, -0.84),
          new THREE.Vector3(-2.74, trayY, trayZ),
          new THREE.Vector3(-0.82, trayY, trayZ),
          new THREE.Vector3(-0.08, 0.68, -1.10),
        ]}
        end={new THREE.Vector3(-0.04, 1.02, -1.11)}
      />

      {/* 4. USB-A */}
      <Cable
        radius={0.007}
        color="#181818"
        start={port(0.04, 0.36)}
        mid={[
          stub(0.04, 0.36),
          sag(0.04, 0.36),
          DROP,
          TRAY_ENTRY,
          new THREE.Vector3(-1.05, trayY, trayZ),
          new THREE.Vector3(-0.10, 0.72, -1.09),
        ]}
        end={new THREE.Vector3(-0.06, 1.00, -1.10)}
      />

      {/* 5. USB-A #2 */}
      <Cable
        radius={0.007}
        color="#1a1a1a"
        start={port(-0.01, 0.44)}
        mid={[
          stub(-0.01, 0.44),
          sag(-0.01, 0.44),
          new THREE.Vector3(-3.18, trayY, -0.80),
          new THREE.Vector3(-2.70, trayY + 0.01, trayZ),
          new THREE.Vector3(-0.96, trayY + 0.01, trayZ),
          new THREE.Vector3(-0.14, 0.74, -1.09),
        ]}
        end={new THREE.Vector3(-0.08, 1.04, -1.10)}
      />

      {/* 6. Ethernet */}
      <Cable
        radius={0.006}
        color="#202020"
        start={port(0.08, 0.22)}
        mid={[
          stub(0.08, 0.22),
          sag(0.08, 0.22),
          new THREE.Vector3(-3.12, trayY, -0.84),
          new THREE.Vector3(-2.76, trayY, trayZ),
          new THREE.Vector3(-1.40, trayY, trayZ),
        ]}
        end={new THREE.Vector3(-1.36, trayY - 0.01, trayZ - 0.06)}
      />

      {/* ================================================================
          LEFT SPEAKER – single audio cable
          ================================================================ */}
      <Cable
        radius={0.0065}
        color="#0f0f0f"
        start={new THREE.Vector3(-2.30, 0.06, 0.12)}
        mid={[
          new THREE.Vector3(-2.28, trayY, -0.30),
          new THREE.Vector3(-2.06, trayY, trayZ),
          new THREE.Vector3(-0.90, trayY, trayZ),
          new THREE.Vector3(-0.16, 0.78, -1.10),
        ]}
        end={new THREE.Vector3(-0.10, 1.06, -1.11)}
      />

      {/* ================================================================
          RIGHT SPEAKER – single audio cable (symmetric)
          ================================================================ */}
      <Cable
        radius={0.0065}
        color="#0f0f0f"
        start={new THREE.Vector3(2.30, 0.06, 0.12)}
        mid={[
          new THREE.Vector3(2.28, trayY, -0.30),
          new THREE.Vector3(2.06, trayY, trayZ),
          new THREE.Vector3(0.90, trayY, trayZ),
          new THREE.Vector3(0.16, 0.78, -1.10),
        ]}
        end={new THREE.Vector3(0.10, 1.06, -1.11)}
      />

      {/* ================================================================
          CABLE MANAGEMENT TRAY
          ================================================================ */}
      <mesh position={[0, trayY - 0.01, trayZ]} receiveShadow>
        <boxGeometry args={[4.8, 0.035, 0.12]} />
        <meshStandardMaterial color="#050505" roughness={1} metalness={0} />
      </mesh>

      <mesh position={[-2.4, trayY + 0.015, trayZ]}>
        <boxGeometry args={[0.18, 0.05, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} />
      </mesh>
      <mesh position={[-1.0, trayY + 0.015, trayZ]}>
        <boxGeometry args={[0.14, 0.05, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} />
      </mesh>
      <mesh position={[2.2, trayY + 0.015, trayZ]}>
        <boxGeometry args={[0.14, 0.05, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} />
      </mesh>
    </group>
  );
}