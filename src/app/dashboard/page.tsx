'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import './dashboard.css';

// Wormhole Component
interface WormholeProps {
  position?: [number, number, number];
}

const Wormhole = ({ position = [0, 0, 0] }: WormholeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <torusKnotGeometry args={[1, 0.4, 128, 16]} />
        <meshStandardMaterial
          color="#00ffee"
          emissive="#00ffee"
          metalness={1}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
};

// GalaxyObject Component
interface GalaxyObjectProps {
  position?: [number, number, number];
  type?: 'star' | 'planet';
}

const GalaxyObject = ({ position = [0, 0, 0], type = 'star' }: GalaxyObjectProps) => {
  const [zooming, setZooming] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const scaleTarget = zooming ? new THREE.Vector3(2, 2, 2) : new THREE.Vector3(1, 1, 1);
      meshRef.current.scale.lerp(scaleTarget, 0.1);
    }
  });

  const handleClick = () => {
    setZooming(!zooming);
  };

  return (
    <Float speed={1} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position} onClick={handleClick}>
        {type === 'star' ? (
          <sphereGeometry args={[1, 32, 32]} />
        ) : (
          <torusKnotGeometry args={[1, 0.4, 128, 16]} />
        )}
        <meshStandardMaterial
          color={zooming ? "#ff0000" : "#00ffee"}
          emissive={zooming ? "#ff0000" : "#00ffee"}
          metalness={1}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
};

// Main Dashboard Component
const Dash = () => {
  const [scrolling, setScrolling] = useState(false);

  const handleScroll = () => {
    setScrolling(window.scrollY > 200);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="dashboard-container">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <Stars radius={200} depth={50} count={10000} factor={4} fade />
          <Wormhole position={[0, 0, -5]} />
          <GalaxyObject position={[5, 2, -10]} type="star" />
          <GalaxyObject position={[-5, -2, -20]} type="planet" />
          <GalaxyObject position={[0, -3, -30]} type="star" />
          <GalaxyObject position={[7, -1, -50]} type="planet" />
          <OrbitControls />
        </Suspense>
      </Canvas>
      <div className={`scrolling-overlay ${scrolling ? 'active' : ''}`}>
        <h1>Scroll down to explore the galaxy!</h1>
      </div>
    </div>
  );
};

export default Dash;
