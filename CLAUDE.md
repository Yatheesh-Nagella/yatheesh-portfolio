# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 portfolio website with an integrated personal finance application (OneLibro). The project has three main applications served via subdomain routing:

1. **Main Portfolio** (`yatheeshnagella.com`) - Personal portfolio with blog posts
2. **Finance App** (`finance.yatheeshnagella.com`) - Personal finance tracker with Plaid integration
3. **Admin Dashboard** (`admin.yatheeshnagella.com`) - User management and invite system

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with Turbopack (http://localhost:3000)
- `npm run build` - Build production bundle with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality

### Testing Finance Subdomains Locally
To test subdomain routing locally, use:
- `http://finance.localhost:3000` - Finance app
- `http://admin.localhost:3000` - Admin dashboard
- `http://localhost:3000` - Main portfolio

## Architecture Overview

### Subdomain Routing
The application uses Next.js rewrites (configured in `next.config.ts`) to route subdomains to different app folders:
- `admin.yatheeshnagella.com` → `/app/admin/*`
- `finance.yatheeshnagella.com` → `/app/finance/*`
- Main domain → `/app/page.jsx` (portfolio)

### Technology Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript (with some legacy JSX files in portfolio)
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Banking Integration**: Plaid API (sandbox/development/production modes)
- **Authentication**: Supabase Auth with invite-code system
- **State Management**: React Context API (AuthContext for finance app)

### Database Schema (Supabase)

**Core Tables**:
- `users` - User profiles with invite tracking and admin flags
- `invite_codes` - Invite code system with usage limits and expiration
- `plaid_items` - Connected bank institutions (stores encrypted access tokens)
- `accounts` - User's bank accounts from Plaid
- `transactions` - Financial transactions synced from Plaid
- `budgets` - User-defined spending budgets by category

**Key Relationships**:
- Users can have multiple Plaid items (bank connections)
- Each Plaid item has multiple accounts
- Each account has multiple transactions
- All monetary amounts stored as cents (integers) for precision

### Authentication Flow

The finance app uses an **invite-only system**:

1. Admin creates invite codes via `/app/api/admin/create-invite/route.ts`
2. Users sign up with invite code at `/finance/login`
3. `AuthContext` manages authentication state globally
4. Protected routes use `ProtectedRoute` component or `useRequireAuth` hook
5. Invite codes have max uses and expiration dates

**Auth helpers** (in `lib/supabase.ts`):
- `getCurrentUser()` - Get authenticated user with profile
- `signIn(email, password)` - Email/password authentication
- `signUpWithInvite(email, password, name, inviteCode)` - Create account with invite
- `signOut()` - Clear session
- `isAdmin(userId)` - Check admin status

### Plaid Integration

The finance app integrates with Plaid for banking data:

**Link Flow**:
1. User initiates connection: `/finance` dashboard
2. Frontend requests link token: `POST /api/plaid/create-link-token`
3. `PlaidLink` component opens Plaid UI
4. After selection, exchange public token: `POST /api/plaid/exchange-token`
5. Backend stores encrypted access token in `plaid_items` table
6. Fetch accounts and store in `accounts` table

**Transaction Sync**:
- Endpoint: `POST /api/plaid/sync-transactions`
- Uses Plaid's transactions/sync API with cursor-based pagination
- Stores transactions in `transactions` table
- Updates account balances

**Plaid helpers** (in `lib/plaid.ts`):
- `createLinkToken(userId)` - Generate Plaid Link token
- `exchangePublicToken(publicToken)` - Get access token
- `getAccounts(accessToken)` - Fetch bank accounts
- `syncTransactions(accessToken, cursor)` - Sync new/updated transactions
- `getItem(accessToken)` - Get institution details
- Sandbox helpers for testing: `sandboxResetLogin()`, `sandboxFireWebhook()`

### Environment Variables

**Required** (see `.env` file):
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Plaid
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox|development|production

# Security
ENCRYPTION_KEY= (64 hex chars, generate with: openssl rand -hex 32)
```

**Type-safe access**: Use `env` object from `lib/env.ts`
```typescript
import { env } from '@/lib/env';
env.supabase.url
env.plaid.clientId
```

### Key Libraries and Utilities

**lib/supabase.ts** - Comprehensive Supabase helpers:
- Authentication functions
- User/account/transaction queries
- Budget management
- Currency formatting (`formatCurrency`, `dollarsToCents`, `centsToDollars`)
- Date formatting (`formatDate`, `formatRelativeTime`)

**lib/plaid.ts** - Plaid API wrapper:
- Link token creation
- Account/transaction fetching
- Webhook verification
- Sandbox testing utilities

**lib/env.ts** - Type-safe environment validation:
- Validates all required env vars on startup
- Throws helpful errors for missing/invalid values
- Feature flag system: `isFeatureEnabled()`

**lib/utils.ts** - Generic utilities (likely cn() for Tailwind classes)

**contexts/AuthContext.tsx** - Global auth state:
- Provides `useAuth()` hook
- Provides `useRequireAuth()` hook for protected pages
- Handles sign in/up/out with automatic redirects

### Component Organization

**Finance Components** (`components/finance/`):
- `PlaidLink.tsx` - Plaid Link button/modal
- `ProtectedRoute.tsx` - HOC for auth-protected pages
- `DashboardCard.tsx` - Reusable stat cards
- `SpendingChart.tsx` - Recharts visualization
- `RecentTransactions.tsx` - Transaction list
- `AccountCard.tsx` - Bank account display

**Portfolio Components** (`components/`):
- `KofiButton.jsx` - Ko-fi donation button
- `NewsletterSignup.jsx` - ConvertKit newsletter form

### API Routes

**Admin APIs** (`/app/api/admin/`):
- `POST /api/admin/create-invite` - Generate invite codes (admin only)
- `GET /api/admin/get-users` - List all users (admin only)

**Plaid APIs** (`/app/api/plaid/`):
- `POST /api/plaid/create-link-token` - Generate Plaid Link token
- `POST /api/plaid/exchange-token` - Exchange public token for access token
- `POST /api/plaid/sync-transactions` - Sync transactions from Plaid

**Portfolio API**:
- `POST /api/subscribe` - ConvertKit newsletter subscription

## Important Patterns and Conventions

### Type Safety
- All Supabase queries use typed Database schema from `types/supabase.ts`
- Custom types in `types/database.types.ts` match database structure
- Use type guards like `isValidUser()` for runtime validation

### Security Best Practices
- **Never expose** `SUPABASE_SERVICE_ROLE_KEY` or `PLAID_SECRET` to client
- Plaid access tokens are encrypted before storing (using `ENCRYPTION_KEY`)
- Admin-only routes should verify `isAdmin()` in API handlers
- Protected pages use `ProtectedRoute` component or `useRequireAuth` hook

### Currency Handling
Always store monetary values as cents (integers):
```typescript
import { dollarsToCents, centsToDollars, formatCurrency } from '@/lib/supabase';

// Store in DB
const amountInCents = dollarsToCents(19.99); // 1999

// Display to user
const formatted = formatCurrency(1999); // "$19.99"
```

### Error Handling Pattern
Functions return `{ data, error }` pattern:
```typescript
const { user, error } = await signIn(email, password);
if (error) {
  // Handle error
  return;
}
// Use user
```

### Path Aliases
Use `@/*` for imports:
```typescript
import { env } from '@/lib/env';
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/types/database.types';
```

## Working with Finance App

### Adding New Features
1. Check if user is authenticated: `const { user } = useAuth()`
2. Query data using helpers in `lib/supabase.ts`
3. For Plaid operations, use helpers in `lib/plaid.ts`
4. Create reusable components in `components/finance/`
5. Add new pages in `app/finance/`

### Database Queries
Prefer using helper functions from `lib/supabase.ts` over raw Supabase queries:
```typescript
// Good
import { getUserAccounts, getTotalBalance } from '@/lib/supabase';
const accounts = await getUserAccounts(userId);

// Avoid (unless helper doesn't exist)
const { data } = await supabase.from('accounts').select('*');
```

### Plaid Development
- Use `PLAID_ENV=sandbox` for development
- Sandbox credentials in `.env`: `PLAID_USER_NAME=user_good`, `PLAID_PWD=pass_good`
- Test different scenarios with sandbox helpers
- Remember to switch to production credentials before deploying

## Working with Portfolio

The main portfolio is primarily static with:
- **Main page**: `/app/page.jsx` - All sections in one file
- **Blog system**: `/app/blogs/` - Each post has its own folder with `page.jsx`
- **Blog index**: `/app/blogs/page.jsx` - Lists all blog posts
- **Analytics**: Google Analytics via `lib/analytics.jsx`

### Adding Blog Posts
1. Create folder: `app/blogs/your-slug/`
2. Add `page.jsx` with blog content
3. Optional: Add `metadata.js` for SEO
4. Update blog index at `app/blogs/page.jsx` to include new post

## Common Issues

### Build Failures
- Ensure all environment variables are set (check `lib/env.ts` validation)
- Verify TypeScript types match Supabase schema
- Check that all imports use correct path aliases

### Plaid Errors
- "Invalid access token" → Token may be expired, use update mode Link
- "Item not found" → Check `plaid_items` table for correct item_id
- In sandbox, use exact credentials: `user_good` / `pass_good`

### Supabase Errors
- "Row not found" → Check user is authenticated and owns the resource
- "Permission denied" → Verify RLS policies allow the operation
- Check service role key vs anon key usage (server vs client)

## Project-Specific Notes

### OneLibro Rebranding (Phase 6)
The current branch `feature/oneledger-phase6` is implementing the rebranding from OneLedger to OneLibro:
- Global text replacement (OneLedger → OneLibro)
- Logo and brand assets update
- Color scheme and typography updates
- Landing page and dashboard redesign

### Legacy Code
- Portfolio uses `.jsx` files (not TypeScript)
- Finance app uses `.tsx` (TypeScript)
- Gradually migrating portfolio to TypeScript is acceptable

### Deployment
- Built for Vercel deployment
- Uses Next.js 15 with Turbopack for faster builds
- Subdomain routing requires DNS configuration in production
