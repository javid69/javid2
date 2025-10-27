# Yashvi Studio Starter

An opinionated Next.js 14 App Router starter tailored for the "Yashvi" brand direction. It ships with a dark-first design system powered by Tailwind CSS tokens, rich motion primitives, and a curated creative tooling stack (Framer Motion, GSAP, and React Three Fiber) for building cinematic, interactive web experiences.

## ✨ Features

- **Next.js 14 + TypeScript** using the App Router, templates, and server-first data flow.
- **Design token system** expressed via CSS variables and exposed through Tailwind utilities for colors, typography, spacing, and radiuses.
- **Global theming** with Zustand-powered mode switching and a fully dark default aesthetic.
- **Motion + interaction stack** featuring Framer Motion, GSAP + ScrollTrigger registration, and a sample 3D scene with React Three Fiber and @react-three/postprocessing.
- **Developer experience** via strict ESLint (with Prettier), Tailwind plugins, lint-staged, and Husky pre-commit hooks.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18+ (Next.js 14 requires Node 18 or newer)
- npm 9+

### Installation

```bash
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Linting & Formatting

- `npm run lint` – run ESLint with the Next.js + TypeScript ruleset and Prettier enforcement.
- `npm run format` – check formatting across supported file types.
- `npm run format:write` – format files in place. (This is also handled automatically on commit via Husky + lint-staged.)

### Production Build

```bash
npm run build
npm start
```

## 🧱 Project Structure

```
app/                  # App Router entry points, root layout, templates, and pages
├─ layout.tsx         # Global providers, meta defaults, navigation, and footer
├─ template.tsx       # Client template controlling page transitions
├─ page.tsx           # Sample Yashvi-branded landing experience + token showcase
├─ providers.tsx      # Client-side providers (motion config, GSAP ScrollTrigger, theming)
├─ globals.css        # Tailwind layers, design tokens, and utility extensions
components/
├─ layout/            # Layout primitives (SiteHeader, SiteFooter)
├─ sections/          # Hero 3D scene built with React Three Fiber
lib/
├─ stores/            # Zustand stores (theme management)
```

## 🎨 Design Tokens & Tailwind

Design tokens live in `app/globals.css` and are exposed to Tailwind through `tailwind.config.ts`. Customize colors, typography scale, spacing, radiuses, and gradients by editing the CSS variables. The sample page demonstrates their application across sections, token cards, and interactive CTAs.

Tailwind plugins included:

- `@tailwindcss/forms`
- `@tailwindcss/typography`
- `@tailwindcss/aspect-ratio`
- `@tailwindcss/container-queries`

## 🔧 Tooling & Automation

- **ESLint** – Flat config extending the official Next.js rules with Prettier enforcement.
- **Prettier** – Shared configuration (`prettier.config.mjs`) with the Tailwind CSS plugin.
- **Husky + lint-staged** – Pre-commit hook runs ESLint and Prettier only on staged files.
- **TypeScript** – Strict mode enabled via `tsconfig.json`.

## 📚 Useful Scripts

| Script                 | Description                           |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Start the Next.js development server. |
| `npm run build`        | Create an optimized production build. |
| `npm run start`        | Serve the production build locally.   |
| `npm run lint`         | Run ESLint across the project.        |
| `npm run format`       | Check Prettier formatting.            |
| `npm run format:write` | Format supported files with Prettier. |

## 📬 Contact

Questions or feedback? Reach out at [hello@yashvi.studio](mailto:hello@yashvi.studio).
