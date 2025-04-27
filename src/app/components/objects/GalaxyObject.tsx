'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
const GalaxyObject = ({ position, label }: { position: [number, number, number]; label: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.scale.setScalar(hovered ? 1.2 : 1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => alert(`You are entering: ${label}`)}
    >
      <dodecahedronGeometry args={[1.2]} />
      <meshStandardMaterial color={hovered ? '#ff00cc' : '#8888ff'} emissive="#2200ff" />
    </mesh>
  );
};

export default GalaxyObject;
