'use client';

import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll, Stars } from '@react-three/drei';
import GalaxyObject from './objects/GalaxyObject';
import Wormhole from './objects/Wormhole';

const GalaxyExperience = () => {
  return (
    <Canvas className="galaxy-canvas">
      <Stars radius={100} depth={50} count={5000} factor={4} fade />
      <ambientLight intensity={0.5} />
      <ScrollControls pages={5}>
        <Scroll>
          <Wormhole position={[0, 0, 0]} />
          <GalaxyObject position={[0, -4, 0]} label="Nebula" />
          <GalaxyObject position={[2, -8, 0]} label="Black Hole" />
          <GalaxyObject position={[-2, -12, 0]} label="Alien Signal" />
          <GalaxyObject position={[0, -16, 0]} label="Quantum Cluster" />
        </Scroll>
      </ScrollControls>
    </Canvas>
  );
};

export default GalaxyExperience;
