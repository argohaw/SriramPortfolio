# Sriramasivam Thirumalaivasan — Portfolio

A responsive personal portfolio built with React and Vite. Its cyberpunk-inspired interface presents a booting handheld device on the home screen, animated city scenes, and a shared circuit-board transition into and out of the contact screen.

**Live site:** [argohaw.github.io/SriramPortfolio](https://argohaw.github.io/SriramPortfolio/)

## Features

- Responsive layout with a desktop navigation bar and mobile menu
- Animated device boot sequence, typewriter role text, and scroll-driven device transitions
- About, experience, skills, projects, education, achievements, and contact sections
- Experience details in accessible modal dialogs and horizontally animated project cards
- Resume downloads for India, Germany, the Netherlands, and the UK
- Contact form powered by EmailJS when configured
- Reduced-motion support and keyboard-accessible navigation and controls

## Tech stack

| Area | Technology |
|---|---|
| UI | React 19, JavaScript (ES modules) |
| Build | Vite 8 |
| Styling | Tailwind CSS 4, custom CSS |
| Animation | Framer Motion |
| Icons | React Icons |
| Contact form | EmailJS |
| Hosting | GitHub Pages |

## Getting started

### Requirements

- Node.js 22.13 or newer (the GitHub Actions workflows use Node 22)
- npm

### Install dependencies

```bash
npm ci
```

### Start the development server

```bash
npm run dev
```

With the configured GitHub Pages base path, open [http://localhost:5173/SriramPortfolio/](http://localhost:5173/SriramPortfolio/).

### Build and preview

```bash
npm run build
npm run preview
```

The production bundle is written to `dist/`.

## Contact form configuration

The contact form requires an EmailJS service, template, and public key. Copy `.env.example` to `.env` and set:

```dotenv
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Restart the development server after changing environment variables. Without these values, the form displays a notice to contact Sriram directly instead of attempting to send.

## Resume files

Resume PDFs are stored in `public/resumes/` and their paths and download names are configured in `src/data/resumes.js`.

| Region | File |
|---|---|
| India — Full-stack | `Sriramasivam_FS_Resume.pdf` |
| India — Backend | `Sriramasivam_B_Resume.pdf` |
| Germany | `CV_Sriramasivam_Thirumalaivasan.pdf` |
| Netherlands | `Sriramasivam_Thirumalaivasan_CV.pdf` |
| UK | `Sriramasivam CV.pdf` |

Public assets referenced from JavaScript should use `asset()` from `src/lib/asset.js`. It prefixes asset URLs with Vite's configured base path so they work on GitHub Pages.

## Project structure

```text
.
├── .github/workflows/       # GitHub Pages deployment and release workflows
├── public/
│   ├── resumes/             # Downloadable CVs
│   └── ...                  # Profile, company logos, and favicon
├── src/
│   ├── components/
│   │   ├── home/            # Device, city, circuit board, boot screen, and logo
│   │   ├── layout/          # Header, footer, and section layout
│   │   ├── sections/        # Portfolio content sections
│   │   └── ui/              # Shared buttons, cards, menus, and dialogs
│   ├── data/                # Profile, navigation, and section content
│   ├── hooks/               # Navigation, device transitions, and animation hooks
│   ├── lib/                 # Public asset URLs and shared device-stage state
│   ├── App.jsx              # Site composition
│   ├── index.css            # Tailwind theme, utilities, and global styles
│   └── main.jsx             # React entry point
├── index.html
├── package.json
└── vite.config.js
```

## Page sections

| Section | Anchor |
|---|---|
| Home | `#home` |
| About | `#about` |
| Experience | `#experience` |
| Skills | `#skills` |
| Projects | `#projects` |
| Education | `#education` |
| Achievements | `#achievements` |
| Contact | `#contact` |

## Deployment

Vite's `base` is set to `/SriramPortfolio/` in `vite.config.js` for the GitHub Pages project site. The workflow in `.github/workflows/main.yml` installs dependencies and builds on pushes and pull requests to `main`; pushes to `main` also publish `dist/` to the `gh-pages` branch. `.github/workflows/release.yml` builds and attaches `dist.zip` to releases created from `v*` tags.

## License

This is a personal portfolio and is not licensed for reuse. The content, design, project details, and resume assets belong to Sriramasivam Thirumalaivasan.
