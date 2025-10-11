# YATHEESH_PORTFOLIO — Project file structure

A Markdown tree of the repository with short, one-line descriptions for each file and folder.

```
YATHEESH_PORTFOLIO/
├─ .gitignore                 # Git ignore rules
├─ README.md                  # Project introduction and usage notes
├─ package.json               # npm metadata and scripts (dev/build/start/lint)
├─ package-lock.json          # npm lockfile with exact versions
├─ tsconfig.json              # TypeScript configuration
├─ next.config.ts             # Next.js configuration (TypeScript)
├─ postcss.config.mjs         # PostCSS/Tailwind configuration
├─ eslint.config.mjs          # ESLint configuration
|
├─ app/                       # Next.js App Router files
│  ├─ layout.jsx              # Root layout component (wraps pages; global head/meta)
│  ├─ page.jsx                # Home page component
│  ├─ globals.css             # Global styles (Tailwind/base CSS)
│  └─ favicon.ico             # Favicon
|
├─ lib/                       # Small utilities and helpers
│  └─ analytics.jsx           # Analytics helper utilities
|
└─ public/                    # Static assets served at /
   ├─ file.svg                # Static SVG asset
   ├─ globe.svg               # Static SVG asset
   ├─ next.svg                # Next.js logo asset
   ├─ vercel.svg              # Vercel logo asset
   └─ window.svg              # Static SVG asset
```

Notes
- Next.js version: specified in `package.json` (Next 15). React version: 19.
- Scripts of interest in `package.json`:
  - `npm run dev` — start the dev server (uses `next dev --turbopack`).
  - `npm run build` — production build (`next build --turbopack`).
  - `npm run start` — start production server (`next start`).
- Files are currently `.jsx`; the repo includes `tsconfig.json` and a `next.config.ts`. If you want I can convert `.jsx` files to `.tsx` and add types.
