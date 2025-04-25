'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Float } from '@react-three/drei';
import './dash.css';

// Generate random color for each object
const getRandomColor = () => {
  return new THREE.Color(Math.random(), Math.random(), Math.random());
};

// GalaxyObject Component
interface GalaxyObjectProps {
  position: [number, number, number];
  id: number;
  type: 'star' | 'planet' | 'wormhole';
  isActive: boolean;
  onClick: (id: number) => void;
}

const GalaxyObject = ({ position, id, type, isActive, onClick }: GalaxyObjectProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [color, setColor] = useState<THREE.Color>(getRandomColor());

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.01;
      const target = isActive ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(...position);
      meshRef.current.position.lerp(target, 0.05);
    }
  });

  const handleClick = () => {
    onClick(id);
  };

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
          emissiveIntensity={1} // Adjust intensity for glowing effect
          wireframe={true}
        />
      </mesh>
    </Float>
  );
};

// Fast Moving Stars Effect
const MovingStars = () => {
  const [speed] = useState(5); // Speed of background stars
  const starRef = useRef<any[]>([]);

  useFrame(() => {
    // Simulate stars moving
    starRef.current.forEach((star, index) => {
      star.position.z += speed * (Math.random() + 0.1); // Speed up z-axis for stars to move "closer"
      if (star.position.z > 100) {
        star.position.z = -100; // Reset stars that go too far to the "back"
      }
    });
  });

  return (
    <group>
      {[...Array(300)].map((_, index) => {
        const x = Math.random() * 200 - 100;
        const y = Math.random() * 200 - 100;
        const z = Math.random() * 200 - 100;
        return (
          <mesh key={index} ref={(el) => (starRef.current[index] = el)} position={[x, y, z]}>
            <sphereGeometry args={[0.2, 6, 6]} />
            <meshStandardMaterial color={new THREE.Color(Math.random(), Math.random(), Math.random())} />
          </mesh>
        );
      })}
    </group>
  );
};

// Main Dashboard Component
const Dash = () => {
  const [activeId, setActiveId] = useState<number | null>(null);

  // Generate positions for objects
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

  // Create objects with variety
  const objects = [
    ...generatePositions(3).map((pos, i) => ({
      id: i,
      position: pos as [number, number, number],
      type: 'star' as 'star' | 'planet' | 'wormhole'
    })),
    ...generatePositions(3).map((pos, i) => ({
      id: i + 3,
      position: pos as [number, number, number],
      type: 'planet' as 'star' | 'planet' | 'wormhole'
    })),
    {
      id: 999,
      position: [0, 0, -10] as [number, number, number],
      type: 'wormhole' as 'star' | 'planet' | 'wormhole'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[20, 20, 20]} />
          
          {/* Background Moving Stars */}
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

      <div className="scrolling-overlay">
        <h1>Click any object to focus and explore in 3D</h1>
      </div>
    </div>
  );
};

export default Dash;
