/**
 * Middleware to handle subdomain routing and refresh Supabase session
 * Required for server-side authentication to work
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;

  // Handle subdomain routing
  // Check for admin subdomain
  if (hostname.startsWith('admin.')) {
    // Rewrite to /admin/* path
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // Check for finance subdomain
  if (hostname.startsWith('finance.')) {
    // Rewrite to /finance/* path
    if (!url.pathname.startsWith('/finance')) {
      url.pathname = `/finance${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // Refresh Supabase session for authenticated routes
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

  // Refresh session if expired - only for finance and admin routes
  if (url.pathname.startsWith('/finance') || url.pathname.startsWith('/admin')) {
    await supabase.auth.getUser();
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Run middleware on all routes to handle subdomain routing
     * Then refresh Supabase session only on authenticated routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
