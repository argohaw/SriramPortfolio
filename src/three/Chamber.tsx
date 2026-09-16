import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CORE_STATES, type SectionKey } from '../animation/scrollConfig';

interface ChamberProps {
  section: SectionKey;
  scrollProgress: number;
  mouseX: number;
  mouseY: number;
}

const columnX = [-5.8, -4.1, -2.7, 2.9, 4.4, 6.1];
const ribAngles = [-0.95, -0.54, -0.18, 0.26, 0.62, 1.05, 2.42, 2.84, 3.26, 3.72];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const Chamber: React.FC<ChamberProps> = ({ section, scrollProgress, mouseX, mouseY }) => {
  const apertureRef = useRef<THREE.Group>(null);
  const columnsRef = useRef<THREE.Group>(null);
  const foregroundRef = useRef<THREE.Group>(null);
  const reflectionRef = useRef<THREE.Mesh>(null);
  const stateRef = useRef({
    apertureX: 0.8,
    apertureY: 0.05,
    apertureZ: -5.8,
    apertureScale: 2.65,
    apertureRotation: -0.16,
    columnsX: 0,
    columnsY: 0,
    foregroundX: 0,
    foregroundY: 0,
  });

  const materials = useMemo(() => {
    const structure = new THREE.MeshStandardMaterial({
      color: '#08080a',
      metalness: 0.78,
      roughness: 0.42,
      transparent: true,
      opacity: 0.68,
    });
    const goldEdge = new THREE.MeshStandardMaterial({
      color: '#d6b25e',
      metalness: 0.86,
      roughness: 0.34,
      transparent: true,
      opacity: 0.42,
    });
    const purpleLine = new THREE.MeshBasicMaterial({
      color: '#7c3cff',
      transparent: true,
      opacity: 0.24,
    });
    const reflection = new THREE.MeshBasicMaterial({
      color: '#7c3cff',
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    return { structure, goldEdge, purpleLine, reflection };
  }, []);

  useFrame((_, delta) => {
    const coreState = CORE_STATES[section];
    const s = stateRef.current;
    const portalInfluence = coreState.portalFlat;
    const explodeInfluence = coreState.explode;
    const wireInfluence = coreState.wireframe;
    const targetRotation = -0.18 + scrollProgress * 0.86 + portalInfluence * 0.22 - wireInfluence * 0.08;
    const targetX = coreState.posX * 0.18 + portalInfluence * -0.12;
    const targetY = -0.04 + explodeInfluence * 0.12;
    const targetZ = -5.8 + portalInfluence * 0.7 + wireInfluence * 0.25;
    const targetScale = 2.62 + portalInfluence * 0.52 + explodeInfluence * 0.2 - wireInfluence * 0.16;

    s.apertureX = lerp(s.apertureX, targetX, 0.035);
    s.apertureY = lerp(s.apertureY, targetY, 0.035);
    s.apertureZ = lerp(s.apertureZ, targetZ, 0.035);
    s.apertureScale = lerp(s.apertureScale, targetScale, 0.035);
    s.apertureRotation = lerp(s.apertureRotation, targetRotation, 0.025);
    s.columnsX = lerp(s.columnsX, coreState.posX * 0.04 + mouseX * -0.08, 0.025);
    s.columnsY = lerp(s.columnsY, mouseY * -0.04 + wireInfluence * 0.08, 0.025);
    s.foregroundX = lerp(s.foregroundX, mouseX * 0.22 - coreState.posX * 0.035, 0.035);
    s.foregroundY = lerp(s.foregroundY, mouseY * 0.12, 0.035);

    if (apertureRef.current) {
      apertureRef.current.position.set(s.apertureX, s.apertureY, s.apertureZ);
      apertureRef.current.scale.setScalar(s.apertureScale);
      apertureRef.current.rotation.z = s.apertureRotation;
      apertureRef.current.rotation.x += ((mouseY * 0.018) - apertureRef.current.rotation.x) * 0.03;
      apertureRef.current.rotation.y += ((mouseX * -0.026) - apertureRef.current.rotation.y) * 0.03;
    }

    if (columnsRef.current) {
      columnsRef.current.position.x = s.columnsX;
      columnsRef.current.position.y = s.columnsY;
    }

    if (foregroundRef.current) {
      foregroundRef.current.position.x = s.foregroundX;
      foregroundRef.current.position.y = s.foregroundY;
    }

    if (reflectionRef.current) {
      reflectionRef.current.rotation.z += delta * 0.035;
      const opacity = section === 'contact' ? 0.06 : 0.1 + portalInfluence * 0.05 + explodeInfluence * 0.03;
      (reflectionRef.current.material as THREE.MeshBasicMaterial).opacity +=
        (opacity - (reflectionRef.current.material as THREE.MeshBasicMaterial).opacity) * 0.04;
    }
  });

  return (
    <group>
      <fog attach="fog" args={['#050505', 8, 22]} />

      <group ref={apertureRef} position={[0.8, 0.05, -5.8]} scale={[2.65, 2.65, 2.65]}>
        <mesh rotation={[0.18, 0.05, 0.28]}>
          <torusGeometry args={[1.82, 0.035, 10, 96, Math.PI * 1.42]} />
          <primitive object={materials.structure} attach="material" />
        </mesh>
        <mesh rotation={[0.14, -0.12, 2.56]}>
          <torusGeometry args={[1.55, 0.018, 8, 72, Math.PI * 0.94]} />
          <primitive object={materials.goldEdge} attach="material" />
        </mesh>

        {ribAngles.map((angle, index) => (
          <group key={index} rotation={[0, 0, angle]}>
            <mesh position={[1.46, 0, 0]}>
              <boxGeometry args={[0.64, 0.025, 0.04]} />
              <primitive object={index % 3 === 0 ? materials.goldEdge : materials.structure} attach="material" />
            </mesh>
            <mesh position={[1.8, 0, 0.01]}>
              <boxGeometry args={[0.08, 0.16, 0.05]} />
              <primitive object={materials.structure} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      <group ref={columnsRef} position={[0, 0, -7.2]}>
        {columnX.map((x, index) => (
          <group key={x} position={[x, index % 2 === 0 ? 0.3 : -0.25, 0]}>
            <mesh>
              <boxGeometry args={[0.08, 8.8, 0.08]} />
              <primitive object={materials.structure} attach="material" />
            </mesh>
            <mesh position={[0.16, 0, 0]}>
              <boxGeometry args={[0.018, 7.2, 0.035]} />
              <primitive object={materials.purpleLine} attach="material" />
            </mesh>
            {[-2.6, -0.8, 1.1, 2.9].map((y) => (
              <mesh key={y} position={[0, y, 0.02]}>
                <boxGeometry args={[0.42, 0.025, 0.05]} />
                <primitive object={materials.goldEdge} attach="material" />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      <group ref={foregroundRef} position={[0, 0, -1.8]}>
        <mesh position={[-3.85, 1.85, 0]} rotation={[0.16, 0.28, -0.64]}>
          <boxGeometry args={[2.2, 0.045, 0.08]} />
          <primitive object={materials.structure} attach="material" />
        </mesh>
        <mesh position={[3.65, -1.55, -0.2]} rotation={[0.1, -0.3, -0.34]}>
          <boxGeometry args={[1.7, 0.04, 0.08]} />
          <primitive object={materials.goldEdge} attach="material" />
        </mesh>
      </group>

      <mesh ref={reflectionRef} position={[0, -2.05, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.9, 64]} />
        <primitive object={materials.reflection} attach="material" />
      </mesh>
    </group>
  );
};

export default Chamber;
