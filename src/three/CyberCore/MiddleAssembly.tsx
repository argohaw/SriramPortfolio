import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MiddleAssemblyProps {
  wireframe: number;
  explode: number;
  rotSpeed: number;
}

const spokeAngles = [0.18, 1.52, 2.78, 4.05, 5.25];
const finOffsets = [-0.24, -0.16, -0.08, 0, 0.08, 0.16, 0.24];

const MiddleAssembly: React.FC<MiddleAssemblyProps> = ({ wireframe, explode, rotSpeed }) => {
  const gyroARef = useRef<THREE.Mesh>(null);
  const gyroBRef = useRef<THREE.Mesh>(null);
  const processorRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);

  const materials = useMemo(() => {
    const blackTitanium = new THREE.MeshStandardMaterial({
      color: '#101012',
      metalness: 0.82,
      roughness: 0.32,
    });
    const graphite = new THREE.MeshStandardMaterial({
      color: '#19191d',
      metalness: 0.62,
      roughness: 0.5,
    });
    const gold = new THREE.MeshStandardMaterial({
      color: '#d6b25e',
      metalness: 0.88,
      roughness: 0.32,
    });
    const ivory = new THREE.MeshStandardMaterial({
      color: '#f4f0e6',
      metalness: 0.15,
      roughness: 0.58,
    });
    const wire = new THREE.MeshBasicMaterial({
      color: '#d6b25e',
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });

    return { blackTitanium, graphite, gold, ivory, wire };
  }, []);

  const primaryMat = wireframe > 0.5 ? materials.wire : materials.blackTitanium;
  const graphiteMat = wireframe > 0.5 ? materials.wire : materials.graphite;
  const goldMat = wireframe > 0.5 ? materials.wire : materials.gold;
  const ivoryMat = wireframe > 0.5 ? materials.wire : materials.ivory;

  useFrame((_, delta) => {
    if (gyroARef.current) gyroARef.current.rotation.y += rotSpeed * 0.92 * delta * 60;
    if (gyroBRef.current) gyroBRef.current.rotation.x -= rotSpeed * 0.72 * delta * 60;

    if (groupRef.current) {
      groupRef.current.position.y += (explode * -1.55 - groupRef.current.position.y) * 0.05;
      groupRef.current.position.x += (explode * 0.28 - groupRef.current.position.x) * 0.045;
    }

    if (processorRef.current) {
      processorRef.current.position.z += (explode * 0.42 - processorRef.current.position.z) * 0.05;
      processorRef.current.rotation.y += (explode * -0.24 - processorRef.current.rotation.y) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={gyroARef} rotation={[0.16, 0.08, -0.18]}>
        <torusGeometry args={[1.03, 0.035, 14, 72, Math.PI * 1.68]} />
        <primitive object={primaryMat} attach="material" />
      </mesh>

      <mesh ref={gyroBRef} rotation={[Math.PI / 2.35, 0.22, 0.32]}>
        <torusGeometry args={[0.86, 0.032, 14, 64, Math.PI * 1.42]} />
        <primitive object={graphiteMat} attach="material" />
      </mesh>

      {spokeAngles.map((angle, index) => (
        <group
          key={index}
          position={[Math.cos(angle) * 0.43, Math.sin(angle) * 0.43, 0]}
          rotation={[0, 0, angle + Math.PI / 2]}
        >
          <mesh>
            <cylinderGeometry args={[0.016, 0.024, 0.82, 8]} />
            <primitive object={goldMat} attach="material" />
          </mesh>
          <mesh position={[0, 0.43, 0]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <primitive object={goldMat} attach="material" />
          </mesh>
        </group>
      ))}

      <group ref={processorRef} position={[0.84, -0.12, 0.18]} rotation={[0.08, -0.18, -0.05]}>
        <mesh>
          <boxGeometry args={[0.48, 0.7, 0.16]} />
          <primitive object={graphiteMat} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.105]}>
          <boxGeometry args={[0.36, 0.52, 0.035]} />
          <primitive object={primaryMat} attach="material" />
        </mesh>
        {finOffsets.map((y) => (
          <mesh key={y} position={[-0.31, y, 0.03]}>
            <boxGeometry args={[0.18, 0.018, 0.18]} />
            <primitive object={goldMat} attach="material" />
          </mesh>
        ))}
        {[-0.18, 0, 0.18].map((x) => (
          <mesh key={x} position={[x, -0.42, 0.04]}>
            <boxGeometry args={[0.035, 0.16, 0.09]} />
            <primitive object={ivoryMat} attach="material" />
          </mesh>
        ))}
      </group>

      <group position={[-0.78, 0.34, -0.14]} rotation={[0.16, 0.24, 0.22]}>
        <mesh>
          <boxGeometry args={[0.18, 0.56, 0.13]} />
          <primitive object={graphiteMat} attach="material" />
        </mesh>
        <mesh position={[-0.24, 0, 0]}>
          <cylinderGeometry args={[0.048, 0.048, 0.5, 10]} />
          <primitive object={goldMat} attach="material" />
        </mesh>
      </group>

      <group position={[-0.32, -0.94, 0.08]} rotation={[0, 0, 0.08]}>
        <mesh>
          <boxGeometry args={[0.62, 0.08, 0.1]} />
          <primitive object={primaryMat} attach="material" />
        </mesh>
        <mesh position={[0.34, 0.1, 0]}>
          <boxGeometry args={[0.08, 0.2, 0.08]} />
          <primitive object={goldMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
};

export default MiddleAssembly;
