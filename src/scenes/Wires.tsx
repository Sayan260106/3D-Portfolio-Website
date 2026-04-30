import React, { useMemo } from 'react';
import * as THREE from 'three';

type CableProps = {
  start: THREE.Vector3;
  mid: THREE.Vector3[];
  end: THREE.Vector3;
  radius?: number;
  color?: string;
};

function Cable({
  start,
  mid,
  end,
  radius = 0.007,
  color = '#101010',
}: CableProps) {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [start, ...mid, end],
      false,
      'catmullrom',
      0.15
    );
  }, [start, mid, end]);

  return (
    <group>
      <mesh castShadow receiveShadow>
        <tubeGeometry args={[curve, 48, radius, 12, false]} />
        <meshStandardMaterial
          color={color}
          roughness={0.96}
          metalness={0.02}
        />
      </mesh>

      {/* connector tip */}
      <mesh position={[end.x, end.y, end.z]} castShadow>
        <cylinderGeometry args={[radius * 1.1, radius * 1.1, 0.03, 10]} />
        <meshStandardMaterial
          color="#1c1c1c"
          roughness={0.5}
          metalness={0.25}
        />
      </mesh>
    </group>
  );
}

export default function Wires(props: any) {
  /**
   * CPU: position=[-2.6, -0.2, -0.1], rotation=[0, -2, 0]
   *
   * Three.js Y-rotation matrix for θ = -2 rad:
   *   cos(-2) = -0.416,  sin(-2) = -0.909
   *
   *   Local +Z in world = (sin θ, 0, cos θ) = (-0.909, 0, -0.416)
   *     → This is the CPU's "front" (power button faces back-left wall)
   *   Local -Z in world = ( 0.909, 0,  0.416)
   *     → CPU's physical back faces front-right (toward user/desk front)
   *   Local +X in world = (cos θ, 0, -sin θ) = (-0.416, 0, 0.909)
   *
   * Back IO-shield panel offset (half-depth ≈ 0.22 along local +Z direction):
   *   [-2.6 + (-0.909)*0.22,  -0.2,  -0.1 + (-0.416)*0.22]
   *   ≈ [-2.800, -0.2, -0.191]
   *
   * Ports spread along back-panel local X axis: world (-0.416, 0, 0.909)
   *   port(dx, dy) = [-2.800 + dx*(-0.416),  -0.2 + dy,  -0.191 + dx*0.909]
   *
   * Left Speaker:  [-2.3, 0,  0.2]
   * Right Speaker: [ 2.3, 0,  0.2]
   * Monitor hub:   [ 0.0, 1.12, -1.12]
   */

  const monitorHub = new THREE.Vector3(0, 1.12, -1.12);
  const trayY = 0.03;
  const trayZ = -1.18;

  // Back-panel port helper
  // dx = offset along panel width (local X), dy = height above CPU origin
  const port = (dx: number, dy: number) =>
    new THREE.Vector3(
      -2.800 + dx * (-0.416),
      -0.2 + dy,
      -0.191 + dx * 0.909
    );

  // IO-shield ports at realistic positions
  const powerPort        = port( 0.06, 0.10); // ATX power, lower section
  const hdmiPort         = port( 0.02, 0.20); // HDMI
  const displayPortPort  = port(-0.03, 0.28); // DisplayPort
  const usb1Port         = port( 0.04, 0.38); // USB-A
  const usb2Port         = port(-0.01, 0.46); // USB-A #2
  const ethernetPort     = port( 0.08, 0.24); // RJ-45

  // Cables converge to a single drop point on the desk just behind the CPU
  const cpuDropDesk = new THREE.Vector3(-2.68, trayY, -0.50);

  return (
    <group {...props}>
      {/* ================================================================ */}
      {/* CPU – DENSE CABLE BUNDLE (6 cables)                               */}
      {/* Emerge from correct IO-shield, droop to desk, run along tray      */}
      {/* ================================================================ */}

      {/* 1. ATX mains power – thick cable, terminates at PDU */}
      <Cable
        radius={0.013}
        color="#111111"
        start={powerPort}
        mid={[
          new THREE.Vector3(-2.80, 0.04, -0.28),
          new THREE.Vector3(-2.74, trayY, -0.44),
          new THREE.Vector3(-2.36, trayY, trayZ),
          new THREE.Vector3(-0.50, trayY, trayZ),
        ]}
        end={new THREE.Vector3(-0.38, trayY - 0.01, trayZ - 0.06)}
      />

      {/* 2. HDMI → monitor hub */}
      <Cable
        radius={0.011}
        color="#0c0c0c"
        start={hdmiPort}
        mid={[
          new THREE.Vector3(-2.80, 0.12, -0.29),
          cpuDropDesk,
          new THREE.Vector3(-2.34, trayY, trayZ),
          new THREE.Vector3(-0.65, trayY, trayZ),
          new THREE.Vector3(-0.20, 0.58, -1.12),
        ]}
        end={monitorHub}
      />

      {/* 3. DisplayPort → monitor hub (offset from HDMI) */}
      <Cable
        radius={0.010}
        color="#141414"
        start={displayPortPort}
        mid={[
          new THREE.Vector3(-2.81, 0.18, -0.28),
          new THREE.Vector3(-2.71, trayY, -0.54),
          new THREE.Vector3(-2.32, trayY, trayZ),
          new THREE.Vector3(-0.80, trayY, trayZ),
          new THREE.Vector3(-0.08, 0.68, -1.10),
        ]}
        end={new THREE.Vector3(-0.04, 1.02, -1.11)}
      />

      {/* 4. USB-A cable */}
      <Cable
        radius={0.007}
        color="#181818"
        start={usb1Port}
        mid={[
          new THREE.Vector3(-2.80, 0.24, -0.29),
          cpuDropDesk,
          new THREE.Vector3(-2.36, trayY, trayZ),
          new THREE.Vector3(-1.05, trayY, trayZ),
          new THREE.Vector3(-0.10, 0.72, -1.09),
        ]}
        end={new THREE.Vector3(-0.06, 1.00, -1.10)}
      />

      {/* 5. USB-B cable – subtly different routing */}
      <Cable
        radius={0.007}
        color="#1a1a1a"
        start={usb2Port}
        mid={[
          new THREE.Vector3(-2.82, 0.32, -0.27),
          new THREE.Vector3(-2.70, trayY + 0.01, -0.56),
          new THREE.Vector3(-2.30, trayY + 0.01, trayZ),
          new THREE.Vector3(-0.95, trayY + 0.005, trayZ),
          new THREE.Vector3(-0.14, 0.74, -1.09),
        ]}
        end={new THREE.Vector3(-0.08, 1.04, -1.10)}
      />

      {/* 6. Ethernet – runs to wall switch / patch panel */}
      <Cable
        radius={0.006}
        color="#202020"
        start={ethernetPort}
        mid={[
          new THREE.Vector3(-2.79, 0.14, -0.27),
          new THREE.Vector3(-2.76, trayY, -0.46),
          new THREE.Vector3(-2.50, trayY, trayZ),
          new THREE.Vector3(-1.40, trayY, trayZ),
        ]}
        end={new THREE.Vector3(-1.35, trayY - 0.01, trayZ - 0.06)}
      />

      {/* ================================================================ */}
      {/* LEFT SPEAKER – single audio cable                                 */}
      {/* ================================================================ */}
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

      {/* ================================================================ */}
      {/* RIGHT SPEAKER – single audio cable (symmetric)                   */}
      {/* ================================================================ */}
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

      {/* ================================================================ */}
      {/* CABLE MANAGEMENT TRAY                                             */}
      {/* ================================================================ */}
      <mesh position={[0, trayY - 0.01, trayZ]} receiveShadow>
        <boxGeometry args={[4.8, 0.035, 0.12]} />
        <meshStandardMaterial color="#050505" roughness={1} metalness={0} />
      </mesh>

      {/* Left clip – bunches CPU cables together on the tray */}
      <mesh position={[-2.2, trayY + 0.015, trayZ]}>
        <boxGeometry args={[0.18, 0.05, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} />
      </mesh>

      {/* Center clip */}
      <mesh position={[-1.0, trayY + 0.015, trayZ]}>
        <boxGeometry args={[0.14, 0.05, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} />
      </mesh>

      {/* Right clip */}
      <mesh position={[2.2, trayY + 0.015, trayZ]}>
        <boxGeometry args={[0.14, 0.05, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} />
      </mesh>
    </group>
  );
}