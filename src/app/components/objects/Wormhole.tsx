'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type WormholeProps = {
  position?: [number, number, number];
};

const Wormhole = ({ position = [0, 0, 0] }: WormholeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[1, 0.4, 16, 100]} />
      <meshStandardMaterial
        color="#00ffee"
        emissive="#00ffee"
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
};

export default Wormhole;
