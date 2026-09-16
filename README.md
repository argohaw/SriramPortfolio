# Sriramasivam Thirumalaivasan - Portfolio V2

A cinematic personal portfolio built with React, TypeScript, Vite, Three.js, and React Three Fiber.

The site presents Sriramasivam's engineering experience through a persistent 3D "CyberCore" scene: a futuristic computational core inside a dark mechanical chamber. The core powers up on the home screen, stays active through the portfolio journey, coordinates with section transitions, and powers down on contact.

**Live Site:** [argohaw.github.io/SriramPortfolio/](https://argohaw.github.io/SriramPortfolio/)

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| 3D / WebGL | Three.js, React Three Fiber |
| Animation / Scroll | GSAP, Lenis, custom scroll-state mapping |
| Icons | React Icons |
| Styling | CSS modules by feature, global design tokens |
| Deployment | GitHub Pages via GitHub Actions |

---

## Current Experience

- Persistent React Three Fiber canvas behind the full site
- Futuristic CyberCore model with asymmetric rings, containment claws, mechanical vanes, processor details, and energy particles
- Scroll-driven section states for core position, scale, rotation, explosion, portal alignment, wireframe mode, and power level
- Computational chamber background with aperture machinery, vertical architecture, fog, foreground struts, and reflection glow
- Home layout with content on the left, CyberCore centered, and a technical readout panel on the right
- Experience section rotates the CyberCore upside down
- Home power-up sequence with particles converging into the core
- Contact power-down sequence with particles dispersing into space
- Responsive layout for desktop, tablet, and mobile
- Resume download menu with country-specific CV options

---

## Resume Downloads

The Resume control opens a hover/focus menu:

| Region | File |
|---|---|
| India - Fullstack | `src/assets/Sriram_Fullstack_Resume.pdf` |
| India - Backend | `src/assets/Sriramasivam_Resume.pdf` |
| Germany | `src/assets/CV_Sriramasivam_Thirumalaivasan.pdf` |
| Netherlands | `src/assets/Sriramasivam_Thirumalaivasan_CV.pdf` |

India opens a second-level submenu for Fullstack and Backend. Germany and Netherlands download directly.

---

## Project Structure

```text
src/
|-- animation/
|   `-- scrollConfig.ts          # Section ranges, camera states, CyberCore states
|-- assets/                      # Images, logos, and resume/CV PDFs
|-- components/
|   |-- navigation/              # Navigation-related components, if split out later
|   `-- sections/                # Section component workspace
|-- data/
|   |-- activities.ts
|   |-- education.ts
|   |-- experience.ts
|   |-- projects.ts
|   `-- skills.ts
|-- hooks/
|   `-- useScrollProgress.ts     # Scroll progress and active-section logic
|-- styles/
|   |-- global.css
|   `-- tokens.css
|-- three/
|   |-- CameraRig.tsx
|   |-- Chamber.tsx              # Futuristic computational chamber
|   |-- Lighting.tsx
|   |-- Scene.tsx                # Persistent R3F canvas
|   `-- CyberCore/
|       |-- CyberCore.tsx
|       |-- EnergyCore.tsx       # Energy anomaly and particle power sequence
|       |-- MiddleAssembly.tsx
|       |-- OuterFrame.tsx
|       `-- materials.ts
|-- App.tsx                      # Root layout, sections, resume menu
|-- App.css                      # Main layout and responsive styling
`-- main.tsx                     # React entry point
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Local URL:

```text
http://localhost:5173/SriramPortfolio/
```

### Build

```bash
npm run build
```

The build runs TypeScript compilation and then creates the production bundle in `dist/`.

### Preview

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Deployment

The Vite config uses:

```ts
base: '/SriramPortfolio/'
```

This matches the GitHub Pages subdirectory deployment.

GitHub Actions workflow files live in:

```text
.github/workflows/
```

---

## Design Direction

The current V2 direction is a dark, premium, computational engineering interface:

| Token | Value |
|---|---|
| Black | `#050505` |
| Ivory | `#F4F0E6` |
| Gold | `#D6B25E` |
| Nitro Purple | `#7C3CFF` |
| Neon status accent | `#B6FF39` |

The visual system avoids generic sci-fi decoration in favor of mechanical layering, restrained motion, dark chamber depth, and scroll-driven cinematic transitions.

---

## Sections

| Section | Anchor | Purpose |
|---|---|---|
| Home | `#hero` | Intro, centered CyberCore, power-up sequence |
| About | `#about` | Profile and engineering positioning |
| Experience | `#experience` | Work history and timeline |
| Skills | `#skills` | Exploded engineering stack |
| Projects | `#projects` | Project showcase and controls |
| Education | `#education` | Degree, coursework, academic details |
| Research | `#activities` | Research and professional activities |
| Contact | `#contact` | Contact form, social links, power-down sequence |

---

## License

This project is personal and not licensed for reuse. All content, design, project details, and resume assets belong to Sriramasivam Thirumalaivasan.
