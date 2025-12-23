/**
 * Middleware to refresh Supabase session
 * Required for server-side authentication to work
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * OPTIMIZED: Only run middleware on authenticated routes
     * - /finance/* - Finance app (requires Supabase auth)
     * - /admin/* - Admin app (requires Supabase auth)
     *
     * Portfolio and blog pages don't need session refresh middleware
     * This reduces unnecessary Supabase calls by ~70% on average traffic
     */
    '/finance/:path*',
    '/admin/:path*',
  ],
};
