# OneLedger Documentation

Welcome to the OneLedger documentation! OneLedger is a personal finance tracking application with Plaid integration, built on Next.js 15.

## 📚 Documentation Index

### Getting Started
- **[Getting Started Guide](GETTING_STARTED.md)** - Quick start, installation, and first-time setup
- **[Development Workflow](DEVELOPMENT_WORKFLOW.md)** - Day-to-day development practices
- **[Deployment Guide](DEPLOY.md)** - Production deployment instructions

### Architecture & Design
- **[Architecture Overview](ARCHITECTURE.md)** - System architecture, tech stack, and design patterns
- **[Database Schema](DATABASE_SCHEMA.md)** - Complete database documentation with ERD
- **[Authentication Guide](AUTHENTICATION.md)** - User and admin authentication flows

### Integration & APIs
- **[Plaid Integration Guide](PLAID_SANDBOX_GUIDE.md)** - Plaid setup, sandbox testing, and production
- **[API Reference](API_REFERENCE.md)** - Complete API endpoint documentation
- **[Helper Libraries](HELPER_LIBRARIES.md)** - Documentation for lib/ utilities

### Guides & References
- **[Security Best Practices](SECURITY.md)** - Encryption, authentication, and data protection
- **[Troubleshooting Guide](TROUBLESHOOTING.md)** - Common issues and solutions
- **[Performance Guide](PERFORMANCE_DIAGNOSTICS.md)** - Optimization strategies
- **[Mobile Responsive Guide](MOBILE_RESPONSIVE_GUIDE.md)** - Mobile-first design patterns

### Development Phases
- **[Phase 1](phase1.md)** - Initial setup and core features
- **[Phase 2](phase2.md)** - Enhanced functionality
- **[Phase 3](phase3.md)** - Advanced features
- **[Phase 4](phase4.md)** - Optimization and refinement
- **[Phase 5](phase5.md)** - Final polish and production readiness

### Additional Resources
- **[Project Development Notes](PROJECT_DEVELOPMENT.md)** - Development history and decisions
- **[Copilot Review Fixes](COPILOT_REVIEW_FIXES.md)** - Code quality improvements

## 🚀 Quick Links

### For New Developers
1. Read [Getting Started Guide](GETTING_STARTED.md)
2. Review [Architecture Overview](ARCHITECTURE.md)
3. Check [Development Workflow](DEVELOPMENT_WORKFLOW.md)
4. Set up [Plaid Sandbox](PLAID_SANDBOX_GUIDE.md)

### For API Integration
1. [API Reference](API_REFERENCE.md) - All endpoints
2. [Authentication Guide](AUTHENTICATION.md) - Auth tokens
3. [Helper Libraries](HELPER_LIBRARIES.md) - Utility functions

### For Production Deployment
1. [Deployment Guide](DEPLOY.md)
2. [Security Best Practices](SECURITY.md)
3. [Performance Guide](PERFORMANCE_DIAGNOSTICS.md)

## 🏗️ Project Overview

**OneLedger** is a Next.js 15 application with three main subdomains:

1. **Main Portfolio** (`yatheeshnagella.com`) - Personal portfolio
2. **Finance App** (`finance.yatheeshnagella.com`) - Personal finance tracker
3. **Admin Dashboard** (`admin.yatheeshnagella.com`) - User management

### Tech Stack
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Banking**: Plaid API
- **Styling**: Tailwind CSS v4
- **Authentication**: Supabase Auth + Custom Admin Auth with 2FA

### Key Features
- 🏦 Bank account integration via Plaid
- 💰 Automatic transaction syncing
- 📊 Budget tracking and analytics
- 🔐 Invite-only user system
- 👨‍💼 Admin dashboard with TOTP 2FA
- 📱 Mobile-responsive design
- ⚡ Optimized performance with SWR caching

## 🛠️ Core Technologies

### Frontend
- **React 19.1.0** - UI library
- **Next.js 15.5.4** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **SWR** - Data fetching and caching
- **Recharts** - Data visualization

### Backend
- **Supabase** - Database, authentication, and real-time
- **Plaid** - Banking data aggregation
- **Next.js API Routes** - Serverless functions

### Security
- **bcryptjs** - Password hashing
- **otplib** - TOTP 2FA implementation
- **crypto** - AES-256-CBC encryption

## 📂 Repository Structure

```
yatheesh-portfolio/
├── app/                    # Next.js App Router pages
│   ├── finance/           # Finance app pages
│   ├── admin/             # Admin dashboard pages
│   ├── blogs/             # Blog posts
│   └── api/               # API routes
├── components/            # React components
│   └── finance/          # Finance-specific components
├── contexts/             # React Context providers
├── lib/                  # Utility libraries
│   ├── supabase.ts      # Supabase helpers
│   ├── plaid.ts         # Plaid integration
│   ├── admin-auth.ts    # Admin authentication
│   └── env.ts           # Environment validation
├── types/               # TypeScript type definitions
├── public/              # Static assets
├── DOCS/                # Documentation (you are here!)
└── supabase/            # Database migrations and schema
```

## 🤝 Contributing

1. Read the [Development Workflow](DEVELOPMENT_WORKFLOW.md)
2. Check [Architecture Overview](ARCHITECTURE.md) for design patterns
3. Follow TypeScript conventions
4. Write tests for new features
5. Update documentation as needed

## 📞 Support

- **Issues**: GitHub Issues
- **Questions**: Check [Troubleshooting Guide](TROUBLESHOOTING.md)
- **Security**: See [Security Best Practices](SECURITY.md)

## 📄 License

[Your License Here]

---

**Last Updated**: December 2025
**Version**: 1.0.0 (Phase 5 Complete)
