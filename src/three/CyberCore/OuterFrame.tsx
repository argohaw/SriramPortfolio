import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OuterFrameProps {
  wireframe: number;
  explode: number;
  portalFlat: number;
  rotSpeed: number;
}

const railSpecs = [
  { position: [-1.9, 0.46, 0.12], rotation: [0, 0, -0.12], length: 1.22 },
  { position: [-1.72, -0.58, -0.08], rotation: [0, 0, 0.18], length: 0.96 },
  { position: [1.68, 0.72, -0.1], rotation: [0, 0, 0.28], length: 1.18 },
  { position: [1.94, -0.28, 0.16], rotation: [0, 0, -0.2], length: 0.92 },
] as const;

const bracketSpecs = [
  { position: [-1.36, 1.02, 0.1], rotation: [0.2, 0.16, -0.55] },
  { position: [-1.6, -0.96, -0.04], rotation: [-0.15, -0.12, 0.62] },
  { position: [1.38, 1.16, -0.14], rotation: [0.14, -0.2, 0.48] },
  { position: [1.66, -0.84, 0.12], rotation: [-0.18, 0.18, -0.5] },
] as const;

const fastenerAngles = [-0.85, -0.48, 0.18, 0.74, 1.35, 2.46, 3.2, 4.1, 5.35];

const OuterFrame: React.FC<OuterFrameProps> = ({ wireframe, explode, portalFlat, rotSpeed }) => {
  const groupRef = useRef<THREE.Group>(null);
  const upperArcRef = useRef<THREE.Mesh>(null);
  const lowerArcRef = useRef<THREE.Mesh>(null);
  const sideAssemblyRef = useRef<THREE.Group>(null);
  const phaseRef = useRef({
    groupY: 0,
    upperZ: -0.54,
    lowerZ: 2.38,
  });

  const materials = useMemo(() => {
    const physical = new THREE.MeshStandardMaterial({
      color: '#0b0b0d',
      metalness: 0.88,
      roughness: 0.24,
    });
    const graphite = new THREE.MeshStandardMaterial({
      color: '#151518',
      metalness: 0.78,
      roughness: 0.42,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: '#d6b25e',
      metalness: 0.9,
      roughness: 0.3,
    });
    const ceramic = new THREE.MeshStandardMaterial({
      color: '#1d1d20',
      metalness: 0.35,
      roughness: 0.55,
    });
    const wire = new THREE.MeshBasicMaterial({
      color: '#d6b25e',
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });

    return { physical, graphite, accent, ceramic, wire };
  }, []);

  const shellMat = wireframe > 0.5 ? materials.wire : materials.physical;
  const darkDetailMat = wireframe > 0.5 ? materials.wire : materials.graphite;
  const accentMat = wireframe > 0.5 ? materials.wire : materials.accent;
  const ceramicMat = wireframe > 0.5 ? materials.wire : materials.ceramic;

  useFrame((_, delta) => {
    const phase = phaseRef.current;
    phase.groupY += rotSpeed * 0.48 * delta * 60;
    phase.upperZ += rotSpeed * 0.18 * delta * 60;
    phase.lowerZ -= rotSpeed * 0.14 * delta * 60;

    if (groupRef.current) {
      groupRef.current.rotation.y += (phase.groupY - groupRef.current.rotation.y) * 0.045;
      groupRef.current.position.y += (explode * 1.55 - groupRef.current.position.y) * 0.05;
      groupRef.current.position.x += (explode * -0.28 - groupRef.current.position.x) * 0.04;
    }

    if (upperArcRef.current) {
      const targetX = 0.1 + portalFlat * (Math.PI / 2 - 0.1);
      const targetY = -0.16 + portalFlat * 0.16;
      const targetZ = phase.upperZ + portalFlat * 0.42;
      upperArcRef.current.rotation.x += (targetX - upperArcRef.current.rotation.x) * 0.04;
      upperArcRef.current.rotation.y += (targetY - upperArcRef.current.rotation.y) * 0.04;
      upperArcRef.current.rotation.z += (targetZ - upperArcRef.current.rotation.z) * 0.04;
    }

    if (lowerArcRef.current) {
      const targetX = 0.26 + portalFlat * (Math.PI / 2 - 0.26);
      const targetY = 0.3 + portalFlat * -0.3;
      const targetZ = phase.lowerZ - portalFlat * 0.34;
      lowerArcRef.current.rotation.x += (targetX - lowerArcRef.current.rotation.x) * 0.04;
      lowerArcRef.current.rotation.y += (targetY - lowerArcRef.current.rotation.y) * 0.04;
      lowerArcRef.current.rotation.z += (targetZ - lowerArcRef.current.rotation.z) * 0.04;
    }

    if (sideAssemblyRef.current) {
      sideAssemblyRef.current.position.x += (explode * 0.55 - sideAssemblyRef.current.position.x) * 0.05;
      sideAssemblyRef.current.rotation.z += ((portalFlat * -0.24) - sideAssemblyRef.current.rotation.z) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={upperArcRef} rotation={[0.1, -0.16, -0.54]}>
        <torusGeometry args={[1.56, 0.05, 14, 96, Math.PI * 1.35]} />
        <primitive object={shellMat} attach="material" />
      </mesh>

      <mesh ref={lowerArcRef} rotation={[0.26, 0.3, 2.38]} position={[0.08, -0.08, -0.03]}>
        <torusGeometry args={[1.36, 0.036, 12, 72, Math.PI * 0.92]} />
        <primitive object={darkDetailMat} attach="material" />
      </mesh>

      <group ref={sideAssemblyRef}>
        {railSpecs.map((rail, index) => (
          <group
            key={index}
            position={rail.position}
            rotation={rail.rotation}
          >
            <mesh>
              <boxGeometry args={[rail.length, 0.055, 0.07]} />
              <primitive object={darkDetailMat} attach="material" />
            </mesh>
            <mesh position={[0, 0.065, 0]}>
              <boxGeometry args={[rail.length * 0.82, 0.018, 0.082]} />
              <primitive object={accentMat} attach="material" />
            </mesh>
          </group>
        ))}

        <group position={[1.9, 0.48, 0.04]} rotation={[0.04, -0.22, 0.15]}>
          <mesh>
            <boxGeometry args={[0.52, 0.82, 0.2]} />
            <primitive object={ceramicMat} attach="material" />
          </mesh>
          {[-0.28, -0.14, 0, 0.14, 0.28].map((y) => (
            <mesh key={y} position={[0.34, y, 0]}>
              <boxGeometry args={[0.08, 0.035, 0.28]} />
              <primitive object={darkDetailMat} attach="material" />
            </mesh>
          ))}
          <mesh position={[-0.31, 0.28, 0.02]}>
            <boxGeometry args={[0.06, 0.18, 0.23]} />
            <primitive object={accentMat} attach="material" />
          </mesh>
        </group>

        <group position={[-1.92, -0.08, -0.02]} rotation={[0, 0.18, -0.12]}>
          <mesh>
            <boxGeometry args={[0.38, 0.58, 0.26]} />
            <primitive object={darkDetailMat} attach="material" />
          </mesh>
          <mesh position={[-0.08, -0.41, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.3, 12]} />
            <primitive object={accentMat} attach="material" />
          </mesh>
        </group>
      </group>

      {bracketSpecs.map((bracket, index) => (
        <group key={index} position={bracket.position} rotation={bracket.rotation}>
          <mesh>
            <boxGeometry args={[0.42, 0.075, 0.075]} />
            <primitive object={darkDetailMat} attach="material" />
          </mesh>
          <mesh position={[0.21, 0, 0]}>
            <boxGeometry args={[0.06, 0.22, 0.08]} />
            <primitive object={accentMat} attach="material" />
          </mesh>
        </group>
      ))}

      <group position={[0.2, -1.62, 0.04]} rotation={[0, 0.12, -0.03]}>
        <mesh>
          <boxGeometry args={[0.92, 0.12, 0.16]} />
          <primitive object={darkDetailMat} attach="material" />
        </mesh>
        <mesh position={[0.44, -0.18, 0]}>
          <boxGeometry args={[0.12, 0.3, 0.12]} />
          <primitive object={accentMat} attach="material" />
        </mesh>
      </group>

      {fastenerAngles.map((angle, index) => (
        <mesh
          key={index}
          position={[Math.cos(angle) * 1.47, Math.sin(angle) * 1.47, 0.06]}
          rotation={[Math.PI / 2, 0, angle]}
        >
          <cylinderGeometry args={[0.032, 0.032, 0.032, 10]} />
          <primitive object={accentMat} attach="material" />
        </mesh>
      ))}
    </group>
  );
};

export default OuterFrame;
