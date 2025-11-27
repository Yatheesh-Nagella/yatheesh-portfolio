# Copilot Instructions

This is a Next.js portfolio website for Yatheesh Nagella. Below are instructions for working with this repository.

## Project Overview

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Language**: JavaScript/TypeScript

## Project Structure

```
app/           - Main application pages and routes
  blogs/       - Blog posts (each subfolder is a blog post route)
  api/         - API routes
  layout.jsx   - Root layout
  page.jsx     - Main landing page
components/    - Reusable React components
lib/           - Utility functions and libraries
public/        - Static assets (images, PDFs, etc.)
```

## Development Commands

```bash
npm run dev    # Start development server with Turbopack
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint for code quality
```

## Coding Guidelines

### React Components

- Use functional components with hooks
- Use `'use client'` directive for client-side components that need interactivity
- Prefer Framer Motion for animations (`motion.div`, etc.)
- Follow the existing component patterns in `components/` and `app/`

### Styling

- Use Tailwind CSS utility classes for styling
- Follow the existing color scheme and design patterns
- Use glassmorphism effects with `backdrop-blur` where appropriate
- Maintain mobile-first responsive design

### File Naming

- React components: `PascalCase.jsx` (e.g., `KofiButton.jsx`)
- Pages: `page.jsx` in the appropriate route folder
- Utilities: `camelCase.js` or `camelCase.jsx`

### Blog Posts

To add a new blog post:
1. Create a new folder in `app/blogs/` with the post slug (e.g., `app/blogs/my-new-post/`)
2. Create a `page.jsx` file inside the folder
3. Update the blog listing in `app/blogs/page.jsx`

## Testing

- Test manually by running `npm run dev` and verifying changes
- Check responsiveness across mobile, tablet, and desktop
- Verify there are no console errors
- Test all links (internal and external)

## Deployment

The site is deployed to Vercel. Pushing to the main branch triggers automatic deployment.

## Additional Notes

- Keep performance in mind; target 90+ Lighthouse scores
- Use WebP format for images when possible
- Use `next/image` for optimized image loading
- Follow accessibility best practices
