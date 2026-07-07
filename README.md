# Sriramasivam Thirumalaivasan — Personal Portfolio

A modern, Apple-inspired personal portfolio website built with React 19, TypeScript, and Vite. Features fluid animations, glass morphism UI, an interactive 3D project gallery, and a fully responsive layout.

**Live Site:** [argohaw.github.io/SriramPortfolio/](https://argohaw.github.io/SriramPortfolio/)

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| 3D / WebGL | Three.js, React Three Fiber, OGL |
| Animation | GSAP 3, Lenis |
| Icons | React Icons |
| Deployment | GitHub Actions → GitHub Pages |

---

## Project Structure

```
src/
├── assets/                  # Static assets (images, resume PDF, logos)
├── components/
│   ├── css/                 # Component-scoped stylesheets
│   │   ├── Homepage.css
│   │   ├── Resume.css
│   │   └── Services.css
│   ├── reactbits/           # Third-party inspired interactive components
│   │   ├── CardNav.tsx      # Animated hamburger navbar
│   │   ├── CircularGallery.tsx  # WebGL-powered infinite carousel
│   │   ├── LiquidEther.tsx  # Fluid background simulation
│   │   └── ScrollStack.tsx  # Scroll-driven stacking cards
│   ├── Homepage.tsx         # Hero section — two-pane layout with typewriter
│   ├── Resume.tsx           # Tabbed resume — About, Experience, Education, Skills
│   ├── WorkProjects.tsx     # Circular gallery of personal projects
│   ├── Services.tsx         # Services/offerings section
│   ├── Contact.tsx          # Contact form
│   ├── Footer.tsx           # Fixed footer with social links
│   ├── Navbar.tsx           # Top navigation bar
│   └── SkillCard.tsx        # Flip card for individual skills
├── App.tsx                  # Root component, scroll container, layout
├── App.css                  # Global styles, scroll snap configuration
├── main.tsx                 # React entry point
└── vite-env.d.ts            # Asset type declarations
```

---

## Features

- **Liquid background** — real-time fluid simulation reacting to mouse movement
- **Glass morphism UI** — consistent frosted glass aesthetic across all sections
- **Smooth scroll snapping** — page-by-page scroll with `scroll-snap-type: y proximity`
- **Homepage hero** — two-pane layout with typewriter role switcher and personal photo
- **Tabbed resume** — About Me, Work Experience (horizontal timeline), Education, Skills
- **Circular project gallery** — WebGL infinite carousel with auto-scroll, pauses on hover
- **Skill cards** — flip animation revealing skill name on hover
- **Animated navbar** — GSAP-powered expanding card nav with smooth section scrolling
- **Resume download** — "Let's Connect" button triggers PDF download via Vite asset import
- **Fully responsive** — breakpoints at 1024px and 768px across all sections

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/sriramasivam/SriramPortfolio.git
cd SriramPortfolio
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173/SriramPortfolio/`

### Build

```bash
npm run build
```

Output goes to `dist/`. The build runs TypeScript compilation followed by Vite bundling with manual chunk splitting for `react`, `three`, `gsap`, `lenis`, and `react-icons`.

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Deployment

The site is deployed automatically to GitHub Pages via GitHub Actions on every push to `main`.

**Workflow:** `.github/workflows/main.yml`

```
push to main
  → checkout
  → setup Node 18
  → npm ci
  → npm run build
  → deploy dist/ to gh-pages branch
```

The Vite config sets `base: '/SriramPortfolio/'` to match the GitHub Pages subdirectory URL.

---

## Design System

| Token | Value |
|---|---|
| Primary accent | `#a78bfa` (purple) |
| Secondary accent | `#06b6d4` (cyan) |
| Glass background | `rgba(255, 255, 255, 0.1)` |
| Glass blur | `backdrop-filter: blur(16px)` |
| Glass border | `1px solid rgba(255, 255, 255, 0.15)` |
| Glass shadow | `0 8px 32px rgba(0, 0, 0, 0.25)` |
| Font | Inter (all weights), Pacifico (hello greeting) |

---

## Sections

| Section | Route Anchor | Description |
|---|---|---|
| Home | `#home` | Hero with photo, name, typewriter role |
| Experience | `#experience` | Tabbed resume — About, Work, Education, Skills |
| Projects | `#projects` | WebGL circular gallery of personal projects |
| Services | `#services` | Scroll-stacked service offering cards |
| Contact | `#contact` | Contact form |

---

## License

This project is personal and not licensed for reuse. All content, design, and project details belong to Sriramasivam Thirumalaivasan.
