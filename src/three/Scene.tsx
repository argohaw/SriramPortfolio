import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import CyberCore from './CyberCore/CyberCore';
import CameraRig from './CameraRig';
import Chamber from './Chamber';
import Lighting from './Lighting';
import type { SectionKey } from '../animation/scrollConfig';

interface SceneProps {
  section: SectionKey;
  scrollProgress: number;
  mouseX: number;
  mouseY: number;
}

const Scene: React.FC<SceneProps> = ({ section, scrollProgress, mouseX, mouseY }) => (
  <Canvas
    dpr={[1, 1.5]}
    camera={{ position: [0, 0, 7], fov: 45, near: 0.1, far: 100 }}
    style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    aria-hidden="true"
    gl={{ antialias: true, alpha: true }}
  >
    <Suspense fallback={null}>
      <Lighting />
      <Chamber section={section} scrollProgress={scrollProgress} mouseX={mouseX} mouseY={mouseY} />
      <CameraRig section={section} mouseX={mouseX} mouseY={mouseY} />
      <CyberCore
        section={section}
        scrollProgress={scrollProgress}
        mouseX={mouseX}
        mouseY={mouseY}
      />
    </Suspense>
  </Canvas>
);

export default Scene;
