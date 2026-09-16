import * as THREE from 'three';

// Shared PBR materials for CyberCore

export const obsidianMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#0d0d10'),
  metalness: 0.85,
  roughness: 0.25,
});

export const goldMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#d6b25e'),
  metalness: 0.9,
  roughness: 0.3,
});

export const goldDimMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#c9a44c'),
  metalness: 0.85,
  roughness: 0.4,
});

export const coreMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#7c3cff'),
  emissive: new THREE.Color('#7c3cff'),
  emissiveIntensity: 1.2,
  metalness: 0.1,
  roughness: 0.2,
  transparent: true,
  opacity: 0.92,
});

export const wireframeMat = new THREE.MeshBasicMaterial({
  color: new THREE.Color('#d6b25e'),
  wireframe: true,
  transparent: true,
  opacity: 0.6,
});

export const ivoryMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#f4f0e6'),
  metalness: 0.1,
  roughness: 0.6,
});
