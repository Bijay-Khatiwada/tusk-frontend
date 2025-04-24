'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { Stars, OrbitControls, Float, Html } from '@react-three/drei';
import './dashboard.css';

const logs = [
  "🧬 Booting NeuroThread Hypervisor...",
  "🌠 Calibrating wormhole trajectory...",
  "🪐 Syncing with planetary grid...",
  "☕ Brewing dark matter espresso...",
  "🧠 Deploying sentient to-do list AI...",
];

const Dashboard = () => {
  const [visibleLog, setVisibleLog] = useState('');
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLog(logs[logIndex % logs.length]);
      setLogIndex((i) => i + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [logIndex]);

  return (
    <main className="galactic-dashboard">
      <Canvas>
        <Suspense fallback={null}>
          <Stars radius={200} depth={50} count={10000} factor={4} fade />
          <OrbitControls enableZoom={false} autoRotate />
          <Float speed={2} rotationIntensity={2}>
            <mesh>
              <torusKnotGeometry args={[2, 0.5, 150, 20]} />
              <meshStandardMaterial color="#00ffee" wireframe />
            </mesh>
          </Float>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} />
        </Suspense>
      </Canvas>

      <div className="overlay">
        <h1 className="typewriter">🚀 Welcome, Commander Bijay</h1>
        <p className="ai-log">{visibleLog}</p>
      </div>
    </main>
  );
};

export default Dashboard;
