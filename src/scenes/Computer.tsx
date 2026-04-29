import React from 'react';

export default function Computer(props: any) {
  return (
    <group {...props}>
      {/* Main Chassis - Sleek Anodized Aluminum look */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.5]} />
        <meshStandardMaterial color="#0f0f0f" metalness={0.9} roughness={0.05} />
      </mesh>

      {/* Side Cooling Fins - Brushed Gold Accents */}
      <group position={[0.26, 0, 0]}>
        {[...Array(10)].map((_, i) => (
          <mesh key={i} position={[0, (i - 4.5) * 0.06, 0]}>
            <boxGeometry args={[0.01, 0.02, 0.4]} />
            <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
      </group>
      <group position={[-0.26, 0, 0]}>
        {[...Array(10)].map((_, i) => (
          <mesh key={i} position={[0, (i - 4.5) * 0.06, 0]}>
            <boxGeometry args={[0.01, 0.02, 0.4]} />
            <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
      </group>

      {/* Internal "Hardware" Glow - Minimalist and Classy */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.48, 0.78, 0.48]} />
        <meshStandardMaterial color="#000" emissive="#c5a059" emissiveIntensity={0.05} />
      </mesh>
      
      {/* Top Ventilation Mesh Grid */}
      <mesh position={[0, 0.41, 0]}>
        <boxGeometry args={[0.45, 0.01, 0.45]} />
        <meshStandardMaterial color="#000" roughness={1} />
      </mesh>

      {/* Front IO Detail - Single Soft Pulse */}
      <mesh position={[0, 0.35, 0.255]}>
        <boxGeometry args={[0.05, 0.005, 0.01]} />
        <meshStandardMaterial color="#c5a059" emissive="#c5a059" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}
