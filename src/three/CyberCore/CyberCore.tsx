import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import OuterFrame from './OuterFrame';
import MiddleAssembly from './MiddleAssembly';
import EnergyCore from './EnergyCore';
import { CORE_STATES, MOTION, type SectionKey } from '../../animation/scrollConfig';

interface CyberCoreProps {
  section: SectionKey;
  scrollProgress: number;
  mouseX: number;
  mouseY: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const CyberCore: React.FC<CyberCoreProps> = ({ section, scrollProgress, mouseX, mouseY }) => {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const stateRef = useRef({
    posX: CORE_STATES.hero.posX,
    posY: 0,
    posZ: 0,
    scale: 1,
    rotX: CORE_STATES.hero.rotX,
    rotY: CORE_STATES.hero.rotY,
    rotZ: CORE_STATES.hero.rotZ,
    emissiveIntensity: 1.2,
    explode: 0,
    wireframe: 0,
    portalFlat: 0,
    outerRotSpeed: 0.003,
    innerRotSpeed: 0.007,
    floatTime: 0,
  });

  useFrame((_, delta) => {
    const target = CORE_STATES[section];
    const s = stateRef.current;
    const f = MOTION.lerpFactor;
    const isMobile = viewport.width < 6;
    const positionFactor = isMobile ? 0.34 : 1;
    const scaleFactor = isMobile ? 0.72 : 1;

    s.posX = lerp(s.posX, target.posX * positionFactor, f);
    s.posY = lerp(s.posY, target.posY + (isMobile ? -0.9 : 0), f);
    s.posZ = lerp(s.posZ, target.posZ + (isMobile ? -0.8 : 0), f);
    s.scale = lerp(s.scale, target.scale * scaleFactor, f);
    s.rotX = lerp(s.rotX, target.rotX, f * 0.7);
    s.rotY = lerp(s.rotY, target.rotY, f * 0.7);
    s.rotZ = lerp(s.rotZ, target.rotZ, f * 0.7);

    const homePowerUp = section === 'hero' ? Math.min(1, s.floatTime / 1.4) : 1;
    const powerTarget = target.emissiveIntensity * (section === 'hero' ? 0.28 + homePowerUp * 0.72 : 1);
    s.emissiveIntensity = lerp(s.emissiveIntensity, powerTarget, f);
    s.explode = lerp(s.explode, target.explode, f * 0.7);
    s.wireframe = lerp(s.wireframe, target.wireframe, f * 0.5);
    s.portalFlat = lerp(s.portalFlat, target.portalFlat, f * 0.6);
    s.outerRotSpeed = lerp(s.outerRotSpeed, target.outerRotSpeed, f);
    s.innerRotSpeed = lerp(s.innerRotSpeed, target.innerRotSpeed, f);

    s.floatTime += delta;
    const floatY = Math.sin(s.floatTime * 0.8) * 0.06;

    if (groupRef.current) {
      groupRef.current.position.x = lerp(groupRef.current.position.x, s.posX + mouseX * (isMobile ? 0.02 : 0.08), 0.04);
      groupRef.current.position.y = lerp(groupRef.current.position.y, s.posY + floatY + mouseY * (isMobile ? 0.015 : 0.05), 0.04);
      groupRef.current.position.z = s.posZ;
      groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, s.rotX, 0.045);
      groupRef.current.rotation.y = lerp(groupRef.current.rotation.y, s.rotY, 0.045);
      groupRef.current.rotation.z = lerp(groupRef.current.rotation.z, s.rotZ, 0.045);
      groupRef.current.scale.setScalar(lerp(groupRef.current.scale.x, s.scale, f));
    }

    void scrollProgress; // used by parent for camera
  });

  const s = stateRef.current;

  return (
    <group ref={groupRef}>
      <OuterFrame
        wireframe={s.wireframe}
        explode={s.explode}
        portalFlat={s.portalFlat}
        rotSpeed={s.outerRotSpeed}
      />
      <MiddleAssembly
        wireframe={s.wireframe}
        explode={s.explode}
        rotSpeed={s.innerRotSpeed}
      />
      <EnergyCore
        emissiveIntensity={s.emissiveIntensity}
        wireframe={s.wireframe}
        section={section}
      />
    </group>
  );
};

export default CyberCore;


