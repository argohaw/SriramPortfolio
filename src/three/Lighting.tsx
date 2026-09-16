import React from 'react';

const Lighting: React.FC = () => (
  <>
    {/* Ambient — very dark */}
    <ambientLight intensity={0.15} color="#0d0d10" />

    {/* Key light — soft warm from upper left */}
    <directionalLight
      position={[-4, 5, 4]}
      intensity={1.2}
      color="#f4f0e6"
      castShadow={false}
    />

    {/* Rim light — gold from right */}
    <directionalLight
      position={[5, 1, -3]}
      intensity={0.6}
      color="#d6b25e"
    />

    {/* Fill — subtle purple from below */}
    <pointLight
      position={[0, -4, 2]}
      intensity={0.8}
      color="#7c3cff"
      distance={10}
      decay={2}
    />

    {/* Back light — cool ivory */}
    <directionalLight
      position={[0, -2, -5]}
      intensity={0.3}
      color="#f4f0e6"
    />
  </>
);

export default Lighting;
