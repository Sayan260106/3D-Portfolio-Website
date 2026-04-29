import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Particles() {
  const points = useRef<THREE.Points>(null!);
  const count = 100; // Fewer particles for a subtle feel
  
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      spd[i] = 0.05 + Math.random() * 0.1;
    }
    return [pos, spd];
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const posAttr = points.current.geometry.attributes.position;
    
    for (let i = 0; i < count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);

      // Subtle slow movement
      posAttr.setX(i, x + Math.sin(time * 0.2 + i) * 0.002);
      posAttr.setY(i, y + Math.cos(time * 0.1 + i) * 0.002 + 0.001); // Slow upward drift
      posAttr.setZ(i, z + Math.sin(time * 0.15 + i) * 0.002);

      // Wrap around
      if (y > 5) posAttr.setY(i, -5);
    }
    posAttr.needsUpdate = true;
    
    // Very slow rotation
    points.current.rotation.y = time * 0.02;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.03} 
        color="#ffffff" 
        transparent 
        opacity={0.3} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
