'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Float } from '@react-three/drei';
import './dash.css';

const getRandomColor = () => {
  return new THREE.Color(Math.random(), Math.random(), Math.random());
};

interface GalaxyObjectProps {
  position: [number, number, number];
  id: number;
  type: 'star' | 'planet' | 'wormhole';
  isActive: boolean;
  onClick: (id: number) => void;
}

const GalaxyObject = ({ position, id, type, isActive, onClick }: GalaxyObjectProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [color] = useState<THREE.Color>(getRandomColor());

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.01;
      const target = isActive ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(...position);
      meshRef.current.position.lerp(target, 0.05);
    }
  });

  const handleClick = () => onClick(id);

  const geometry =
    type === 'star'
      ? <sphereGeometry args={[1, 32, 32]} />
      : type === 'planet'
      ? <sphereGeometry args={[2, 32, 32]} />
      : <torusKnotGeometry args={[1, 0.4, 128, 16]} />;

  return (
    <Float speed={1.5} rotationIntensity={2.5} floatIntensity={isActive ? 2 : 1}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        scale={isActive ? 2 : 1}
        castShadow
        receiveShadow
      >
        {geometry}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          wireframe={true}
        />
      </mesh>
    </Float>
  );
};

// 🆕 Denser Moving Stars
const MovingStars = () => {
  const starCount = 1000; // Increase from 300 to 1000 for density
  const starRef = useRef<any[]>([]);

  useFrame(() => {
    starRef.current.forEach((star, index) => {
      if (star) {
        star.position.z += 2 + Math.random() * 2; // Faster pace, some randomness
        if (star.position.z > 100) {
          star.position.z = -200;
          star.position.x = Math.random() * 400 - 200;
          star.position.y = Math.random() * 400 - 200;
        }
      }
    });
  });

  return (
    <group>
      {Array.from({ length: starCount }).map((_, index) => {
        const x = Math.random() * 400 - 200;
        const y = Math.random() * 400 - 200;
        const z = Math.random() * -200;
        const size = Math.random() * 0.5 + 0.1;
        return (
          <mesh
            key={index}
            ref={(el) => (starRef.current[index] = el)}
            position={[x, y, z]}
          >
            <sphereGeometry args={[size, 6, 6]} />
            <meshStandardMaterial
              color={new THREE.Color(0.8 + Math.random() * 0.2, 0.8, 1)}
              emissive={new THREE.Color(0.5, 0.5, 1)}
              emissiveIntensity={Math.random() * 2}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const Dash = () => {
  const [activeId, setActiveId] = useState<number | null>(null);

  const generatePositions = (count: number): [number, number, number][] => {
    const positions: [number, number, number][] = [];
    const radius = 30;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      positions.push([x * radius, y * radius, z * radius]);
    }
    return positions;
  };

  const objects = [
    ...generatePositions(3).map((pos, i) => ({
      id: i,
      position: pos as [number, number, number],
      type: 'star' as const
    })),
    ...generatePositions(3).map((pos, i) => ({
      id: i + 3,
      position: pos as [number, number, number],
      type: 'planet' as const
    })),
    {
      id: 999,
      position: [0, 0, -10] as [number, number, number],
      type: 'wormhole' as const
    }
  ];

  return (
    <div className="dashboard-container">
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[20, 20, 20]} />
        <Suspense fallback={null}>
          <MovingStars />
          <OrbitControls enableZoom enablePan />
          {objects.map((obj) => (
            <GalaxyObject
              key={obj.id}
              id={obj.id}
              position={obj.position}
              type={obj.type}
              isActive={activeId === obj.id}
              onClick={setActiveId}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Dash;
