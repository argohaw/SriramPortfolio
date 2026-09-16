import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { SectionKey } from '../../animation/scrollConfig';

interface EnergyCoreProps {
  emissiveIntensity: number;
  wireframe: number;
  section: SectionKey;
}

const clawAngles = [0, Math.PI / 3, (Math.PI * 2) / 3, Math.PI, (Math.PI * 4) / 3, (Math.PI * 5) / 3];
const vaneAngles = [Math.PI / 6, Math.PI / 2, (Math.PI * 5) / 6, (Math.PI * 7) / 6, (Math.PI * 3) / 2, (Math.PI * 11) / 6];
const particleCount = 150;

const EnergyCore: React.FC<EnergyCoreProps> = ({ emissiveIntensity, wireframe, section }) => {
  const anomalyRef = useRef<THREE.Mesh>(null);
  const innerShardRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const clawRef = useRef<THREE.Group>(null);
  const vaneRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const timeRef = useRef(0);
  const bootRef = useRef(0);
  const shutdownRef = useRef(0);

  const materials = useMemo(() => {
    const anomaly = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#7c3cff'),
      emissive: new THREE.Color('#7c3cff'),
      emissiveIntensity: 1,
      metalness: 0.08,
      roughness: 0.12,
      transparent: true,
      opacity: 0.92,
    });
    const innerShard = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#b9a2ff'),
      emissive: new THREE.Color('#9b6cff'),
      emissiveIntensity: 0.65,
      metalness: 0.1,
      roughness: 0.22,
      transparent: true,
      opacity: 0.62,
    });
    const glow = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#9b6cff'),
      emissive: new THREE.Color('#9b6cff'),
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const blackMetal = new THREE.MeshStandardMaterial({
      color: '#09090b',
      metalness: 0.9,
      roughness: 0.24,
    });
    const graphite = new THREE.MeshStandardMaterial({
      color: '#17171b',
      metalness: 0.74,
      roughness: 0.45,
    });
    const gold = new THREE.MeshStandardMaterial({
      color: '#d6b25e',
      metalness: 0.88,
      roughness: 0.32,
    });
    const wire = new THREE.MeshBasicMaterial({
      color: '#d6b25e',
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });

    return { anomaly, innerShard, glow, blackMetal, graphite, gold, wire };
  }, []);

  const particleData = useMemo(() => {
    const start = new Float32Array(particleCount * 3);
    const orbit = new Float32Array(particleCount * 3);
    const disperse = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const colorPurple = new THREE.Color('#9b6cff');
    const colorGold = new THREE.Color('#d6b25e');
    const colorIvory = new THREE.Color('#f4f0e6');

    for (let i = 0; i < particleCount; i += 1) {
      const i3 = i * 3;
      const seed = i * 12.9898;
      const angle = (i / particleCount) * Math.PI * 2 * 5.5;
      const band = (i % 9) / 9;
      const startRadius = 2.3 + (Math.sin(seed) * 0.5 + 0.5) * 2.6;
      const orbitRadius = 0.52 + (i % 17) * 0.018;
      const disperseRadius = 3.4 + (Math.cos(seed * 1.7) * 0.5 + 0.5) * 2.4;
      const zWave = Math.sin(seed * 0.37);

      start[i3] = Math.cos(angle) * startRadius;
      start[i3 + 1] = Math.sin(angle * 0.72) * (1.3 + band);
      start[i3 + 2] = zWave * 1.45;

      orbit[i3] = Math.cos(angle) * orbitRadius;
      orbit[i3 + 1] = Math.sin(angle) * orbitRadius * 0.72;
      orbit[i3 + 2] = Math.sin(angle * 1.7) * 0.28;

      disperse[i3] = Math.cos(angle + band) * disperseRadius;
      disperse[i3 + 1] = Math.sin(angle * 0.86) * (1.8 + band * 1.4);
      disperse[i3 + 2] = zWave * 2.2;

      const color = i % 8 === 0 ? colorGold : i % 11 === 0 ? colorIvory : colorPurple;
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const positions = new Float32Array(start);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.032,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { start, orbit, disperse, positions, geometry, material };
  }, []);

  const shellMat = wireframe > 0.5 ? materials.wire : materials.blackMetal;
  const graphiteMat = wireframe > 0.5 ? materials.wire : materials.graphite;
  const goldMat = wireframe > 0.5 ? materials.wire : materials.gold;

  useFrame((_, delta) => {
    timeRef.current += delta;
    const isContact = section === 'contact';
    bootRef.current = Math.min(1, bootRef.current + delta / 1.65);
    shutdownRef.current += ((isContact ? 1 : 0) - shutdownRef.current) * 0.035;
    const poweredPhase = bootRef.current * (1 - shutdownRef.current);
    const visualIntensity = emissiveIntensity * (0.12 + poweredPhase * 0.88);
    const power = THREE.MathUtils.clamp(visualIntensity / 2, 0, 1.35);
    const pulse = Math.sin(timeRef.current * (1.45 + power)) * (0.035 + power * 0.035) + 1;
    const clawOpen = 0.09 + power * 0.11;

    materials.anomaly.emissiveIntensity = visualIntensity * pulse;
    materials.anomaly.opacity = 0.32 + poweredPhase * 0.6;
    materials.innerShard.emissiveIntensity = visualIntensity * 0.42;
    materials.glow.opacity = wireframe > 0.5 ? 0 : (0.025 + power * 0.18) * (1 - shutdownRef.current * 0.65);

    if (anomalyRef.current) {
      anomalyRef.current.rotation.y += (0.012 + power * 0.01) * delta * 60;
      anomalyRef.current.rotation.z -= 0.006 * delta * 60;
      anomalyRef.current.scale.set(
        0.7 + poweredPhase * 0.38 + power * 0.08,
        0.58 + poweredPhase * 0.34 + Math.sin(timeRef.current * 1.9) * 0.04,
        0.74 + poweredPhase * 0.32,
      );
    }

    if (innerShardRef.current) {
      innerShardRef.current.rotation.x -= 0.018 * delta * 60;
      innerShardRef.current.rotation.y += 0.014 * delta * 60;
      innerShardRef.current.scale.setScalar(0.86 + power * 0.12);
    }

    if (pulseRef.current) {
      pulseRef.current.scale.setScalar((1.04 + power * 0.18) * pulse);
    }

    if (clawRef.current) {
      clawRef.current.rotation.z += 0.004 * delta * 60;
      clawRef.current.children.forEach((child, index) => {
        child.position.z = Math.sin(timeRef.current * 1.1 + index) * 0.018;
        child.scale.setScalar(1 + clawOpen * 0.22);
      });
    }

    if (vaneRef.current) {
      vaneRef.current.rotation.z -= 0.006 * delta * 60;
    }

    if (lightRef.current) {
      lightRef.current.intensity = visualIntensity * 1.85 * pulse;
    }

    if (particlesRef.current) {
      const positions = particleData.positions;
      const bootEase = 1 - Math.pow(1 - bootRef.current, 3);
      const disperseEase = shutdownRef.current * shutdownRef.current * (3 - 2 * shutdownRef.current);
      const activeOrbit = bootEase * (1 - disperseEase);

      for (let i = 0; i < particleCount; i += 1) {
        const i3 = i * 3;
        const angle = timeRef.current * (0.18 + (i % 13) * 0.006) + i * 0.62;
        const float = Math.sin(timeRef.current * 0.55 + i) * 0.045;
        const orbitX = particleData.orbit[i3] + Math.cos(angle) * (0.08 + (i % 5) * 0.008);
        const orbitY = particleData.orbit[i3 + 1] + Math.sin(angle * 1.12) * 0.06 + float;
        const orbitZ = particleData.orbit[i3 + 2] + Math.sin(angle * 0.83) * 0.09;
        const bootX = THREE.MathUtils.lerp(particleData.start[i3], orbitX, bootEase);
        const bootY = THREE.MathUtils.lerp(particleData.start[i3 + 1], orbitY, bootEase);
        const bootZ = THREE.MathUtils.lerp(particleData.start[i3 + 2], orbitZ, bootEase);

        positions[i3] = THREE.MathUtils.lerp(bootX, particleData.disperse[i3] + Math.cos(angle) * 0.22, disperseEase);
        positions[i3 + 1] = THREE.MathUtils.lerp(bootY, particleData.disperse[i3 + 1] + Math.sin(angle * 0.7) * 0.16, disperseEase);
        positions[i3 + 2] = THREE.MathUtils.lerp(bootZ, particleData.disperse[i3 + 2] + Math.sin(angle) * 0.18, disperseEase);
      }

      const positionAttribute = particleData.geometry.getAttribute('position');
      positionAttribute.needsUpdate = true;
      particleData.material.opacity = wireframe > 0.5 ? 0.22 : 0.24 + activeOrbit * 0.64 + disperseEase * 0.26;
      particleData.material.size = 0.018 + poweredPhase * 0.02 + disperseEase * 0.008;
    }
  });

  return (
    <group>
      <points ref={particlesRef} geometry={particleData.geometry} material={particleData.material} />

      <mesh scale={[1, 0.86, 1.18]}>
        <dodecahedronGeometry args={[0.44, 0]} />
        <primitive object={shellMat} attach="material" />
      </mesh>

      <group ref={clawRef}>
        {clawAngles.map((angle, index) => (
          <group key={index} rotation={[0, 0, angle]} position={[Math.cos(angle) * 0.47, Math.sin(angle) * 0.47, 0]}>
            <mesh rotation={[0, 0, angle + Math.PI / 2]}>
              <boxGeometry args={[0.12, 0.34, 0.09]} />
              <primitive object={graphiteMat} attach="material" />
            </mesh>
            <mesh position={[Math.cos(angle) * 0.08, Math.sin(angle) * 0.08, 0.055]} rotation={[0, 0, angle]}>
              <boxGeometry args={[0.16, 0.032, 0.04]} />
              <primitive object={goldMat} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      <group ref={vaneRef}>
        {vaneAngles.map((angle, index) => (
          <mesh
            key={index}
            position={[Math.cos(angle) * 0.68, Math.sin(angle) * 0.68, index % 2 === 0 ? 0.05 : -0.05]}
            rotation={[0.18, 0.22, angle]}
          >
            <boxGeometry args={[0.08, 0.34, 0.035]} />
            <primitive object={index % 2 === 0 ? goldMat : graphiteMat} attach="material" />
          </mesh>
        ))}
      </group>

      <mesh ref={anomalyRef}>
        <icosahedronGeometry args={[0.29, 2]} />
        <primitive object={materials.anomaly} attach="material" />
      </mesh>

      <mesh ref={innerShardRef} rotation={[0.7, 0.25, 0.4]}>
        <octahedronGeometry args={[0.2, 1]} />
        <primitive object={materials.innerShard} attach="material" />
      </mesh>

      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.43, 24, 24]} />
        <primitive object={materials.glow} attach="material" />
      </mesh>

      <mesh rotation={[Math.PI / 4, 0.1, 0]}>
        <torusGeometry args={[0.54, 0.018, 10, 56]} />
        <primitive object={goldMat} attach="material" />
      </mesh>

      <mesh rotation={[-Math.PI / 3, 0.22, Math.PI / 5]}>
        <torusGeometry args={[0.38, 0.012, 8, 42, Math.PI * 1.55]} />
        <primitive object={graphiteMat} attach="material" />
      </mesh>

      <pointLight
        ref={lightRef}
        color="#7c3cff"
        intensity={emissiveIntensity * 1.5}
        distance={7}
        decay={2}
      />
    </group>
  );
};

export default EnergyCore;
