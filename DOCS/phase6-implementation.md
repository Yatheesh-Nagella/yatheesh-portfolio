# Phase 6 Implementation Guide
## OneLibro Rebranding & UI Redesign

---

## 📋 Overview

**Phase 6 Goals:**
1. ✅ Rebrand from "OneLedger" → "OneLibro"
2. ✅ Redesign all pages with modern UI
3. ✅ Improve accessibility (WCAG 2.1 AA compliance)
4. ✅ Update all branding assets (logos, colors, typography)

**Timeline:** ~22.5 hours | **18 atomic commits**

---

## 📊 Task Breakdown

### Phase 6.1: Rebranding Foundation (6 tasks - 2.5 hours)
### Phase 6.2: Core Page Redesigns (5 tasks - 11.5 hours)
### Phase 6.3: Authentication & Settings (3 tasks - 4.5 hours)
### Phase 6.4: Accessibility & Polish (4 tasks - 4 hours)

---

# PHASE 6.1: REBRANDING FOUNDATION

## 6.1.1 - Global Text Replacement ⏱️ 15 mins

**Goal:** Replace all "OneLedger" references with "OneLibro"

**Files to Update:**
- `package.json` (name, description)
- `README.md`
- `DOCS/*.md`
- `app/finance/page.tsx` (landing page)
- `app/finance/login/page.tsx`
- `components/finance/FinanceHeader.tsx`
- `contexts/AuthContext.tsx` (comments)
- All page titles and metadata

**Search & Replace:**
```bash
# Case-sensitive replacements:
OneLedger → OneLibro
oneledger → oneLibro
ONELEDGER → ONELIBRO
one-ledger → one-libro
```

**Testing Checklist:**
- [ ] Global search for "OneLedger" returns 0 results
- [ ] No console errors
- [ ] Build succeeds (`npm run build`)
- [ ] Dev server runs without errors

**Commit Message:**
```
rebrand: Replace OneLedger with OneLibro across entire codebase

- Updated all text references in code
- Updated documentation
- Updated package.json metadata
- Updated page titles and descriptions

Part of Phase 6.1.1 - Rebranding
```

---

## 6.1.2 - Logo & Brand Assets ⏱️ 30 mins

**Goal:** Update logos, favicons, and brand assets

**Tasks:**
1. Add new OneLibro logo files to `public/`
2. Update `favicon.ico`
3. Add app icons for PWA (if applicable)
4. Update `og:image` for social sharing
5. Remove old OneLedger assets

**New Files Structure:**
```
public/
  ├── oneLibro-logo.svg           # Main logo
  ├── oneLibro-icon.png           # Icon/favicon source
  ├── favicon.ico                 # Updated favicon
  ├── og-image.png                # Social sharing image
  └── assets/
      ├── logo-variants/
      │   ├── logo-icon-only.svg
      │   └── logo-full.svg
      └── old/                    # Archive old assets
```

**Update Logo References:**

```typescript
// components/finance/FinanceHeader.tsx
import Image from 'next/image';

export default function FinanceHeader() {
  return (
    <header>
      <Image
        src="/oneLibro-logo.svg"
        alt="OneLibro Logo"
        width={150}
        height={40}
        priority
      />
    </header>
  );
}
```

**Favicon Update:**
```html
<!-- app/layout.tsx metadata -->
export const metadata = {
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}
```

**Testing Checklist:**
- [ ] Logo displays correctly in header
- [ ] Favicon shows in browser tab
- [ ] Logo is crisp on retina displays
- [ ] Social sharing image shows correctly
- [ ] Logo scales properly on mobile devices

**Commit Message:**
```
rebrand: Add OneLibro logos and update brand assets

- Added new logo files (SVG + PNG formats)
- Updated favicon and app icons
- Updated social sharing images
- Archived old OneLedger assets

Part of Phase 6.1.2 - Brand Assets
```

---

## 6.1.3 - Color Scheme Update ⏱️ 45 mins

**Goal:** Update brand colors throughout the application

**Proposed OneLibro Color Palette:**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // Main brand color
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },

        // Accent Colors
        accent: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#8b5cf6',  // Purple accent
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },

        // Success/Error/Warning
        success: {
          500: '#10b981',
          600: '#059669',
        },
        error: {
          500: '#ef4444',
          600: '#dc2626',
        },
        warning: {
          500: '#f59e0b',
          600: '#d97706',
        },
      },
    },
  },
}
```

**CSS Variables Update:**

```css
/* app/globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 199 89% 48%;         /* #0ea5e9 */
    --primary-foreground: 0 0% 100%;
    --accent: 258 90% 66%;          /* #8b5cf6 */
    --accent-foreground: 0 0% 100%;

    /* Borders & Inputs */
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 199 89% 48%;
  }
}
```

**Component Updates:**

```typescript
// Update button variants
<button className="bg-primary-500 hover:bg-primary-600 text-white">
  Primary Action
</button>

<button className="bg-accent-500 hover:bg-accent-600 text-white">
  Accent Action
</button>
```

**Testing Checklist:**
- [ ] Visual inspection of all pages
- [ ] Contrast ratios meet WCAG AA (4.5:1 for text)
- [ ] Hover states are visible
- [ ] Focus states are clear
- [ ] Colors are consistent across all components

**Commit Message:**
```
rebrand: Update color scheme to OneLibro brand palette

- Updated Tailwind color definitions with new palette
- Updated CSS variables for light theme
- Applied new colors across all components
- Maintained WCAG AA contrast ratios (4.5:1+)
- Updated button and link hover states

Part of Phase 6.1.3 - Color Scheme
```

---

## 6.1.4 - Typography Updates ⏱️ 30 mins

**Goal:** Update fonts and typography system

**Typography System:**

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'sans-serif'], // For headings
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Base sizes with line heights
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.05em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
    },
  },
}
```

**Font Loading:**

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

**Typography Components:**

```typescript
// Example usage
<h1 className="text-4xl font-bold text-gray-900">
  Welcome to OneLibro
</h1>

<h2 className="text-3xl font-semibold text-gray-800">
  Manage Your Finances
</h2>

<p className="text-base text-gray-600 leading-relaxed">
  Body text with improved readability
</p>
```

**Testing Checklist:**
- [ ] Text is readable at all sizes
- [ ] Proper heading hierarchy (h1 > h2 > h3 > h4)
- [ ] Fonts load correctly (no FOUT/FOIT)
- [ ] Line heights are comfortable
- [ ] Letter spacing is appropriate

**Commit Message:**
```
rebrand: Update typography system with improved hierarchy

- Updated font sizes and line heights for readability
- Improved heading hierarchy (h1-h6)
- Added Inter font family via next/font
- Enhanced letter spacing for small text
- Consistent typography across all pages

Part of Phase 6.1.4 - Typography
```

---

## 6.1.5 - Metadata & SEO ⏱️ 20 mins

**Goal:** Update all SEO metadata for OneLibro

**Root Layout Metadata:**

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'OneLibro - Personal Finance Management',
    template: '%s | OneLibro',
  },
  description: 'An inclusive and accessible financial ecosystem for everyone. Track expenses, manage budgets, and achieve your financial goals.',
  keywords: ['finance', 'budgeting', 'expense tracking', 'personal finance', 'money management'],
  authors: [{ name: 'OneLibro Team' }],
  creator: 'OneLibro',
  publisher: 'OneLibro',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://finance.yatheeshnagella.com',
    siteName: 'OneLibro',
    title: 'OneLibro - Personal Finance Management',
    description: 'An inclusive and accessible financial ecosystem for everyone',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OneLibro - Personal Finance Management',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'OneLibro - Personal Finance Management',
    description: 'An inclusive and accessible financial ecosystem for everyone',
    images: ['/og-image.png'],
    creator: '@onelibro',
  },

  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  // Manifest
  manifest: '/manifest.json',
}
```

**Finance Layout Metadata:**

```typescript
// app/finance/layout.tsx
export const metadata: Metadata = {
  title: 'Finance Dashboard',
  description: 'Manage your finances with OneLibro',
}
```

**Page-Specific Metadata:**

```typescript
// app/finance/dashboard/page.tsx
export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View your financial overview and insights',
}

// app/finance/accounts/page.tsx
export const metadata: Metadata = {
  title: 'Accounts',
  description: 'Manage your connected bank accounts',
}

// app/finance/transactions/page.tsx
export const metadata: Metadata = {
  title: 'Transactions',
  description: 'View and manage your transactions',
}

// app/finance/budgets/page.tsx
export const metadata: Metadata = {
  title: 'Budgets',
  description: 'Track your spending against budgets',
}
```

**Testing Checklist:**
- [ ] Check with [OpenGraph.xyz](https://www.opengraph.xyz/)
- [ ] Verify Google search preview
- [ ] Test Twitter card with [Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Verify LinkedIn preview
- [ ] Check meta tags in browser DevTools

**Commit Message:**
```
rebrand: Update SEO metadata and social sharing tags

- Updated page titles and descriptions for OneLibro
- Updated OpenGraph tags for social sharing
- Updated Twitter card metadata
- Added structured metadata for all pages
- Updated social sharing images

Part of Phase 6.1.5 - Metadata & SEO
```

---

## 6.1.6 - Documentation Update ⏱️ 15 mins

**Goal:** Update all documentation references

**Files to Update:**

1. **README.md**
```markdown
# OneLibro

An inclusive and accessible financial ecosystem for everyone.

## About

OneLibro (formerly OneLedger) is a personal finance management application...

[Rest of README with updated references]
```

2. **CLAUDE.md**
```markdown
# CLAUDE.md

## Project Overview

This is a Next.js 15 portfolio website with an integrated personal finance application (OneLibro)...

[Update all references throughout]
```

3. **package.json**
```json
{
  "name": "yatheesh-portfolio-oneLibro",
  "version": "0.1.0",
  "description": "Portfolio website with OneLibro finance app",
  "keywords": ["nextjs", "finance", "oneLibro", "personal-finance"]
}
```

4. **DOCS Files**
- Update `DOCS/phase1.md` through `DOCS/phase5.md`
- Update `DOCS/phase6.md`
- Update any architecture diagrams
- Update API documentation

**Testing Checklist:**
- [ ] All links work correctly
- [ ] No broken references
- [ ] Documentation is accurate
- [ ] Code examples use "OneLibro"

**Commit Message:**
```
docs: Update documentation for OneLibro rebrand

- Updated README.md with new branding
- Updated CLAUDE.md project instructions
- Updated all DOCS/*.md files
- Updated package.json metadata
- Updated inline code comments

Part of Phase 6.1.6 - Documentation
```

---

# PHASE 6.2: CORE PAGE REDESIGNS

## 6.2.1 - Landing Page Redesign ⏱️ 2 hours

**Goal:** Implement new landing page design from screenshots

**New Components to Create:**

```
components/finance/landing/
  ├── Hero.tsx               # Hero section
  ├── Features.tsx           # Feature showcase
  ├── HowItWorks.tsx        # Step-by-step guide
  ├── Testimonials.tsx      # Social proof
  ├── CTA.tsx               # Call-to-action
  └── LandingFooter.tsx     # Footer
```

**Hero Component:**

```typescript
// components/finance/landing/Hero.tsx
'use client';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900">
              Manage Your Finances with{' '}
              <span className="text-primary-500">OneLibro</span>
            </h1>

            <p className="text-xl text-gray-600">
              An inclusive and accessible financial ecosystem for everyone.
              Track expenses, set budgets, and achieve your financial goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                Get Started Free
              </button>

              <button className="border-2 border-primary-500 text-primary-500 hover:bg-primary-50 px-8 py-4 rounded-lg font-semibold transition-all">
                Learn More
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Bank-level security
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free forever
              </div>
            </div>
          </div>

          {/* Right Column - Visual/Image */}
          <div className="relative">
            {/* Dashboard Preview Image/Illustration */}
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              {/* Placeholder for dashboard preview */}
              <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Features Component:**

```typescript
// components/finance/landing/Features.tsx
import {
  CreditCard,
  PieChart,
  Shield,
  Smartphone,
  Zap,
  TrendingUp
} from 'lucide-react';

const features = [
  {
    icon: CreditCard,
    title: 'Connect Your Accounts',
    description: 'Securely link your bank accounts with Plaid integration',
  },
  {
    icon: PieChart,
    title: 'Budget Tracking',
    description: 'Set budgets and track spending across categories',
  },
  {
    icon: Shield,
    title: 'Bank-Level Security',
    description: 'Your data is encrypted and protected with industry standards',
  },
  {
    icon: Smartphone,
    title: 'Mobile Responsive',
    description: 'Access your finances from any device, anywhere',
  },
  {
    icon: Zap,
    title: 'Real-Time Sync',
    description: 'Automatic transaction syncing from your accounts',
  },
  {
    icon: TrendingUp,
    title: 'Financial Insights',
    description: 'Get insights into your spending patterns and trends',
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Manage Your Money
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features designed for simplicity and ease of use
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-gray-200 hover:border-primary-500 transition-all hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-500" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>

              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Update Landing Page:**

```typescript
// app/finance/page.tsx
import Hero from '@/components/finance/landing/Hero';
import Features from '@/components/finance/landing/Features';
import HowItWorks from '@/components/finance/landing/HowItWorks';
import Testimonials from '@/components/finance/landing/Testimonials';
import CTA from '@/components/finance/landing/CTA';
import LandingFooter from '@/components/finance/landing/LandingFooter';

export default function FinanceLandingPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <LandingFooter />
    </main>
  );
}
```

**Testing Checklist:**
- [ ] Mobile responsiveness (320px, 375px, 428px)
- [ ] Tablet view (768px, 1024px)
- [ ] Desktop view (1280px, 1920px)
- [ ] Lighthouse score > 90
- [ ] Smooth scroll animations work
- [ ] All CTAs are clickable
- [ ] Links work correctly

**Commit Message:**
```
feat(phase-6.2.1): Redesign landing page with modern UI

- New hero section with gradient background
- Feature showcase with animated icons (Lucide)
- How It Works section with step-by-step guide
- Testimonials section with social proof
- Improved CTA placement and design
- Mobile-first responsive design
- Accessibility improvements (ARIA labels, semantic HTML)

Performance: Lighthouse score 95+
UX: Smooth animations with framer-motion
```

---

## 6.2.2 - Dashboard Redesign ⏱️ 3 hours

**Goal:** Modernize dashboard with better data visualization

**Updated Components:**

```typescript
// app/finance/dashboard/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAccounts } from '@/hooks/useAccounts';
import { useTransactions } from '@/hooks/useTransactions';
import ProtectedRoute from '@/components/finance/ProtectedRoute';
import QuickActions from '@/components/finance/dashboard/QuickActions';
import AccountSummary from '@/components/finance/dashboard/AccountSummary';
import SpendingChart from '@/components/finance/SpendingChart';
import RecentTransactions from '@/components/finance/RecentTransactions';
import BudgetProgress from '@/components/finance/dashboard/BudgetProgress';
import { DashboardSkeleton } from '@/components/finance/skeletons';

export default function DashboardPage() {
  const { user } = useAuth();
  const { accounts, isLoading: accountsLoading } = useAccounts();
  const { transactions, isLoading: transactionsLoading } = useTransactions({
    limit: 10,
  });

  if (accountsLoading || transactionsLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.full_name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's your financial overview
          </p>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Account Summary & Chart */}
          <div className="lg:col-span-2 space-y-6">
            <AccountSummary accounts={accounts} />
            <SpendingChart transactions={transactions} />
            <BudgetProgress />
          </div>

          {/* Right Column - Recent Activity */}
          <div className="space-y-6">
            <RecentTransactions transactions={transactions} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

**New Components:**

```typescript
// components/finance/dashboard/QuickActions.tsx
import { Plus, ArrowUpRight, Repeat, PieChart } from 'lucide-react';
import Link from 'next/link';

export default function QuickActions() {
  const actions = [
    {
      icon: Plus,
      label: 'Add Transaction',
      href: '/finance/transactions?action=add',
      color: 'bg-primary-500 hover:bg-primary-600',
    },
    {
      icon: ArrowUpRight,
      label: 'Connect Account',
      href: '/finance/accounts?action=connect',
      color: 'bg-accent-500 hover:bg-accent-600',
    },
    {
      icon: PieChart,
      label: 'View Budgets',
      href: '/finance/budgets',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      icon: Repeat,
      label: 'Sync All',
      onClick: () => {/* Sync logic */},
      color: 'bg-gray-500 hover:bg-gray-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => {
        const Component = action.href ? Link : 'button';

        return (
          <Component
            key={index}
            href={action.href || '#'}
            onClick={action.onClick}
            className={`${action.color} text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center gap-3`}
          >
            <action.icon className="w-8 h-8" />
            <span className="font-semibold text-sm text-center">
              {action.label}
            </span>
          </Component>
        );
      })}
    </div>
  );
}
```

```typescript
// components/finance/dashboard/AccountSummary.tsx
import { formatCurrency } from '@/lib/supabase';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function AccountSummary({ accounts }) {
  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.current_balance || 0), 0);
  const cashAccounts = accounts.filter(a => !a.plaid_item_id);
  const linkedAccounts = accounts.filter(a => a.plaid_item_id);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Account Summary
      </h2>

      {/* Total Balance - Large Display */}
      <div className="mb-6 p-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl text-white">
        <p className="text-sm opacity-90 mb-2">Total Balance</p>
        <p className="text-4xl font-bold">{formatCurrency(totalBalance)}</p>

        {/* Month-over-month change (placeholder) */}
        <div className="flex items-center gap-2 mt-4 text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>+5.2% from last month</span>
        </div>
      </div>

      {/* Account Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">
            Linked Accounts
          </p>
          <p className="text-2xl font-semibold text-gray-900">
            {linkedAccounts.length}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">
            Cash Accounts
          </p>
          <p className="text-2xl font-semibold text-gray-900">
            {cashAccounts.length}
          </p>
        </div>
      </div>
    </div>
  );
}
```

**Testing Checklist:**
- [ ] Data loads correctly
- [ ] Charts render properly
- [ ] Quick actions work
- [ ] Responsive on all devices
- [ ] Loading states show
- [ ] Empty states display correctly

**Commit Message:**
```
feat(phase-6.2.2): Redesign dashboard with enhanced visualization

- Modernized card layouts with gradients and shadows
- Improved chart designs with Recharts
- Added quick action buttons for common tasks
- New account summary component with total balance
- Budget progress indicators
- Mobile-responsive grid layout
- Better loading states with skeletons

Accessibility: Added ARIA labels for all statistics
Performance: Reduced layout shift with skeleton loaders
UX: Clearer visual hierarchy and call-to-actions
```

---

## Testing & Commit Checklist Template

**For Each Task:**
```
Before Commit:
□ Feature implemented completely
□ Code follows TypeScript best practices
□ No console errors
□ Build succeeds (npm run build)
□ Responsive on mobile/tablet/desktop
□ Accessibility checked (keyboard nav, screen reader)
□ Performance acceptable (no lag)

Git Workflow:
1. git status (verify changes)
2. git add .
3. git commit -m "[message from guide]"
4. npm run build (final check)
5. git push origin feature/oneledger-phase6
```

---

## Success Criteria for Phase 6

**Before marking Phase 6 complete:**
- [ ] All 18 tasks completed
- [ ] All "OneLedger" → "OneLibro" replacements done
- [ ] New logos displayed correctly
- [ ] All pages redesigned per plan
- [ ] Lighthouse accessibility score > 95
- [ ] Zero axe DevTools violations
- [ ] Keyboard navigation works throughout
- [ ] Screen reader tested (NVDA/VoiceOver)
- [ ] Mobile responsive on all pages (320px+)
- [ ] Build compiles with no errors
- [ ] All commits pushed to branch

---

## Notes

- **Screenshots**: Refer to `DOCS/phase6.md` for UI reference images
- **Flexibility**: Adjust designs based on actual screenshots
- **Commit Often**: Each task = 1 commit for easy rollback
- **Test Continuously**: Don't wait until the end
- **Ask Questions**: Clarify before implementing if uncertain

---

**Created:** December 2025
**Phase:** 6.0 - OneLibro Rebranding & UI Redesign
**Status:** Ready for Implementation
