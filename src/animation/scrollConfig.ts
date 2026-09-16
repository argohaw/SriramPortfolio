// Scroll progress ranges per section [start, end] as 0–1 of total scroll
export const SECTION_RANGES = {
  hero:        [0.00, 0.12] as [number, number],
  about:       [0.12, 0.24] as [number, number],
  experience:  [0.24, 0.39] as [number, number],
  skills:      [0.39, 0.54] as [number, number],
  projects:    [0.54, 0.70] as [number, number],
  education:   [0.70, 0.81] as [number, number],
  activities:  [0.81, 0.90] as [number, number],
  contact:     [0.90, 1.00] as [number, number],
} as const;

export type SectionKey = keyof typeof SECTION_RANGES;

export const SECTIONS: SectionKey[] = [
  'hero', 'about', 'experience', 'skills',
  'projects', 'education', 'activities', 'contact',
];

/** Returns 0–1 progress within a section given global scroll 0–1 */
export function sectionProgress(global: number, key: SectionKey): number {
  const [start, end] = SECTION_RANGES[key];
  if (global <= start) return 0;
  if (global >= end) return 1;
  return (global - start) / (end - start);
}

/** Returns the active section key for a given global scroll */
export function activeSection(global: number): SectionKey {
  for (const key of [...SECTIONS].reverse()) {
    if (global >= SECTION_RANGES[key][0]) return key;
  }
  return 'hero';
}

// CyberCore target states per section
export interface CoreState {
  posX: number;
  posY: number;
  posZ: number;
  scale: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  outerRotSpeed: number;
  innerRotSpeed: number;
  emissiveIntensity: number;
  explode: number;       // 0 = assembled, 1 = fully exploded
  wireframe: number;     // 0 = physical, 1 = wireframe
  portalFlat: number;    // 0 = 3D, 1 = flat portal rings
}

export const CORE_STATES: Record<SectionKey, CoreState> = {
  hero: {
    posX: 0, posY: -0.02, posZ: 0,
    scale: 1.08,
    rotX: 0, rotY: 0, rotZ: 0,
    outerRotSpeed: 0.004, innerRotSpeed: 0.009,
    emissiveIntensity: 1.75,
    explode: 0, wireframe: 0, portalFlat: 0,
  },
  about: {
    posX: -2.5, posY: 0, posZ: 0,
    scale: 1.1,
    rotX: 0.12, rotY: -0.28, rotZ: 0.06,
    outerRotSpeed: 0.005, innerRotSpeed: 0.01,
    emissiveIntensity: 1.8,
    explode: 0.15, wireframe: 0, portalFlat: 0,
  },
  experience: {
    posX: 2.5, posY: 0, posZ: 0,
    scale: 0.95,
    rotX: Math.PI, rotY: 0.42, rotZ: -0.16,
    outerRotSpeed: 0.005, innerRotSpeed: 0.009,
    emissiveIntensity: 1.55,
    explode: 0, wireframe: 0, portalFlat: 0,
  },
  skills: {
    posX: 0, posY: 0, posZ: 0,
    scale: 1.05,
    rotX: 0.28, rotY: 0.08, rotZ: 0,
    outerRotSpeed: 0.002, innerRotSpeed: 0.004,
    emissiveIntensity: 2.0,
    explode: 1, wireframe: 0, portalFlat: 0,
  },
  projects: {
    posX: 0, posY: 0, posZ: 0,
    scale: 1,
    rotX: 0.08, rotY: 0.16, rotZ: 0,
    outerRotSpeed: 0.006, innerRotSpeed: 0.003,
    emissiveIntensity: 1.6,
    explode: 0, wireframe: 0, portalFlat: 1,
  },
  education: {
    posX: 2.2, posY: 0, posZ: 0,
    scale: 0.9,
    rotX: -0.18, rotY: -0.36, rotZ: 0.12,
    outerRotSpeed: 0.002, innerRotSpeed: 0.005,
    emissiveIntensity: 0.8,
    explode: 0, wireframe: 1, portalFlat: 0,
  },
  activities: {
    posX: -2.2, posY: 0, posZ: 0,
    scale: 0.95,
    rotX: 0.16, rotY: 0.32, rotZ: -0.08,
    outerRotSpeed: 0.004, innerRotSpeed: 0.006,
    emissiveIntensity: 1.5,
    explode: 0, wireframe: 0, portalFlat: 0,
  },
  contact: {
    posX: 2.5, posY: 0, posZ: 0,
    scale: 0.92,
    rotX: 0, rotY: -0.18, rotZ: 0,
    outerRotSpeed: 0.001, innerRotSpeed: 0.0015,
    emissiveIntensity: 0.35,
    explode: 0, wireframe: 0, portalFlat: 0,
  },
};

// Camera positions per section
export interface CameraState {
  x: number; y: number; z: number;
  lookX: number; lookY: number; lookZ: number;
}

export const CAMERA_STATES: Record<SectionKey, CameraState> = {
  hero:       { x: 0, y: 0, z: 7,  lookX: 0, lookY: 0, lookZ: 0 },
  about:      { x: 0, y: 0, z: 6,  lookX: 0, lookY: 0, lookZ: 0 },
  experience: { x: 0, y: 0, z: 7,  lookX: 0, lookY: 0, lookZ: 0 },
  skills:     { x: 0, y: 0, z: 9,  lookX: 0, lookY: 0, lookZ: 0 },
  projects:   { x: 0, y: 0, z: 7,  lookX: 0, lookY: 0, lookZ: 0 },
  education:  { x: 0, y: 0, z: 6.5,lookX: 0, lookY: 0, lookZ: 0 },
  activities: { x: 0, y: 0, z: 6.5,lookX: 0, lookY: 0, lookZ: 0 },
  contact:    { x: 0, y: 0, z: 6,  lookX: 0, lookY: 0, lookZ: 0 },
};

export const MOTION = {
  fast: 0.25,
  normal: 0.5,
  slow: 0.9,
  lerpFactor: 0.06,
};
