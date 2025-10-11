# PROJECT_STRUCTURE — yatheesh-portfolio

A full Markdown tree of the repository (excluded: node_modules, .git, __pycache__, venv, build, dist, .env)

```
yatheesh-portfolio/
├─ .gitignore                  # Files and patterns Git should ignore
├─ README.md                   # Project README and notes
├─ DEPLOY.md                   # Deployment notes / instructions
├─ package.json                # npm metadata and scripts (dev/build/start/lint)
├─ package-lock.json           # npm lockfile with exact versions
├─ tsconfig.json               # TypeScript config (project uses JS with TS checks enabled)
├─ next.config.ts              # Next.js configuration (TypeScript)
├─ postcss.config.mjs          # PostCSS / Tailwind configuration
├─ eslint.config.mjs           # ESLint configuration
|
├─ app/                        # Next.js App Router source
│  ├─ layout.jsx               # Root layout; injects Google Analytics via next/script
│  ├─ page.jsx                 # Main client page (Portfolio) — framer-motion heavy
│  ├─ globals.css              # Tailwind + global styles
│  ├─ favicon.ico              # Favicon
│  └─ blogs/
│     ├─ page.jsx              # Blogs index page
│     └─ evolution-of-trust/
│        └─ page.jsx           # Blog post: Evolution of Trust
|
├─ lib/                        # Small utilities and helpers
│  └─ analytics.jsx            # gtag wrappers: pageview, event, trackers
|
└─ public/                     # Static assets served at the root
   ├─ profile.png              # Profile image
   ├─ marathon.png             # Marathon image used in projects grid
   ├─ next.svg                 # Next.js logo
   ├─ vercel.svg               # Vercel logo
   ├─ globe.svg                # Globe icon SVG
   ├─ file.svg                 # File icon SVG
   └─ window.svg               # Window icon SVG
```

Folder descriptions
- app/: Contains the Next.js App Router React components and global styling. `page.jsx` is a client component with many animations and interactive behavior.
- lib/: Small helper modules such as analytics wrappers that call `window.gtag` safely.
- public/: Static files accessible at the root (images, icons). Useful for images referenced in the app UI.
- Config files at the repo root (`package.json`, `tsconfig.json`, `postcss.config.mjs`, etc.) set up the dev environment, build, linting, and TypeScript options.

If you'd like this saved under a different filename or want me to add per-file export summaries, I can do that next.
