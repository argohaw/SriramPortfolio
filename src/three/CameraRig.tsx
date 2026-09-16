import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_STATES, MOTION, type SectionKey } from '../animation/scrollConfig';

interface CameraRigProps {
  section: SectionKey;
  mouseX: number;
  mouseY: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const CameraRig: React.FC<CameraRigProps> = ({ section, mouseX, mouseY }) => {
  const { camera } = useThree();
  const posRef = useRef(new THREE.Vector3(0, 0, 7));

  useFrame(() => {
    const target = CAMERA_STATES[section];
    const f = MOTION.lerpFactor * 0.6;

    posRef.current.x = lerp(posRef.current.x, target.x + mouseX * 0.15, f);
    posRef.current.y = lerp(posRef.current.y, target.y + mouseY * 0.1, f);
    posRef.current.z = lerp(posRef.current.z, target.z, f);

    camera.position.copy(posRef.current);
    camera.lookAt(target.lookX, target.lookY, target.lookZ);
  });

  return null;
};

export default CameraRig;
