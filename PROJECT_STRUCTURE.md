# PROJECT_STRUCTURE — yatheesh-portfolio

A full Markdown tree of the repository (excluded: node_modules, .git, __pycache__, venv, build, dist, .env)

```
portfolio/                              # ONE repo for everything
│
├── app/                                 # Next.js App Router source
│   │
│   ├── page.jsx                         # Your portfolio (stays same)
│   │
│   ├── finance/                         # OneLibro Finance App
│   │   ├── layout.jsx                   # Auth guard
│   │   ├── page.jsx                     # Dashboard
│   │   ├── login/page.jsx               # Login
│   │   ├── accounts/page.jsx            # Bank accounts
│   │   ├── transactions/page.jsx        # Transaction list
│   │   └── settings/page.jsx            # User settings
│   │
│   ├── admin/                           # Admin Dashboard
│   │   ├── layout.jsx                   # Admin guard
│   │   ├── page.jsx                     # Metrics overview
│   │   ├── users/page.jsx               # User management
│   │   ├── invites/page.jsx             # Invite generator
│   │   └── logs/page.jsx                # System logs
│   │
│   ├── blogs/                           # Blog posts directory
│   │   ├── build-pong-game/
│   │   │   ├── metadata.js              # SEO metadata
│   │   │   └── page.jsx                 # Blog post page
│   │   ├── evolution-of-trust/
│   │   │   └── page.jsx                 # Blog post page
│   │   ├── interactive-mouse-effects/
│   │   │   ├── metadata.js              # SEO metadata
│   │   │   └── page.jsx                 # Blog post page
│   │   └── page.jsx                     # Blog index/listing page
│   │
│   ├── api/                             # Backend API routes
│   │   ├── subscribe/
│   │   │   └── route.js                 # Newsletter subscription endpoint
│   │   ├── plaid/
│   │   │   ├── create-link-token/route.js    # Create Plaid link token
│   │   │   ├── exchange-token/route.js       # Exchange public token for access token
│   │   │   └── sync-transactions/route.js    # Sync transactions from Plaid
│   │   └── admin/
│   │       ├── create-invite/route.js        # Generate admin invite codes
│   │       └── get-users/route.js            # Fetch user list for admin
│   │
│   ├── layout.jsx                       # Root layout (wraps all pages, metadata, fonts, analytics)
│   ├── globals.css                      # Global CSS styles (Tailwind directives, custom styles)
│   └── icon.png                         # Favicon/website icon
│
├── components/                          # Reusable React components
│   ├── finance/                         # Finance UI components
│   │   ├── AccountCard.jsx              # Bank account display card
│   │   ├── TransactionItem.jsx         # Individual transaction row
│   │   ├── BalanceWidget.jsx           # Balance display widget
│   │   └── PlaidLinkButton.jsx         # Plaid Link integration button
│   │
│   ├── admin/                           # Admin UI components
│   │   ├── UserTable.jsx                # User management table
│   │   ├── InviteGenerator.jsx          # Invite code generator form
│   │   ├── MetricsCard.jsx              # Dashboard metrics card
│   │   └── LogViewer.jsx                # System logs viewer
│   │
│   ├── KofiButton.jsx                   # Ko-fi donation/support button component
│   └── NewsletterSignup.jsx             # Newsletter subscription form component
│
├── lib/                                 # Utility libraries and helper functions
│   ├── supabase.js                      # Supabase database helpers (client, auth, queries)
│   ├── plaid.js                         # Plaid API client wrapper
│   ├── analytics.jsx                    # Google Analytics event tracking utilities
│   └── utils.js                         # General utility functions
│
├── public/                              # Static assets served at root URL
│   ├── file.svg                         # SVG icon for file/document
│   ├── globe.svg                        # SVG icon for globe/world
│   ├── marathon.png                     # Marathon achievement image
│   ├── next.svg                         # Next.js logo SVG
│   ├── profile.png                      # Profile picture/avatar image
│   ├── vercel.svg                       # Vercel logo SVG
│   ├── window.svg                       # SVG icon for window
│   └── YN_Resume.pdf                    # Resume/CV PDF (downloadable)
│
├── .env.local                           # Environment variables (secret keys, API keys - NOT in git)
├── .gitignore                           # Files and patterns Git should ignore
├── DEPLOY.md                            # Deployment instructions and documentation
├── eslint.config.mjs                    # ESLint configuration (code quality and linting rules)
├── next-env.d.ts                        # Next.js TypeScript environment type definitions (auto-generated)
├── next.config.ts                       # Next.js configuration (routes, subdomains, build settings)
├── package-lock.json                    # npm lockfile (exact dependency versions for reproducible installs)
├── package.json                         # Project manifest (dependencies, scripts, project metadata)
├── postcss.config.mjs                   # PostCSS configuration (CSS processing, Tailwind CSS integration)
├── PROJECT_STRUCTURE.md                 # Project structure documentation (this file)
├── README.md                            # Main project documentation
└── tsconfig.json                        # TypeScript configuration (compiler options, paths, etc.)
```

## Folder Descriptions

### `app/`
Contains the Next.js App Router React components and global styling. The main sections are:
- **Root pages**: Portfolio homepage (`page.jsx`) and blog system
- **Finance app** (`/finance`): OneLibro Finance application with authentication, dashboard, accounts, transactions, and settings
- **Admin dashboard** (`/admin`): Admin interface for user management, invites, metrics, and system logs
- **API routes** (`/api`): Backend endpoints for newsletter subscriptions, Plaid integration, and admin operations

### `components/`
Reusable React components organized by feature:
- **finance/**: UI components for the finance app (account cards, transaction items, Plaid integration)
- **admin/**: UI components for the admin dashboard (user tables, invite generator, metrics cards)
- **Root components**: Shared components like newsletter signup and Ko-fi button

### `lib/`
Utility libraries and helper functions:
- **supabase.js**: Database client, authentication helpers, and query utilities
- **plaid.js**: Plaid API client wrapper for bank account linking
- **analytics.jsx**: Google Analytics event tracking wrappers
- **utils.js**: General utility functions used across the application

### `public/`
Static files accessible at the root URL (images, icons, PDFs). Useful for assets referenced in the app UI.

### Config Files
Configuration files at the repo root set up the dev environment, build, linting, TypeScript options, and Next.js routing/subdomain configuration.

### Environment Variables
- **`.env.local`**: Contains secret keys, API keys, and environment-specific configuration (NOT committed to git)

---

**Note**: This is a monorepo structure containing the portfolio website, finance application, and admin dashboard all in one Next.js project with route-based organization.
