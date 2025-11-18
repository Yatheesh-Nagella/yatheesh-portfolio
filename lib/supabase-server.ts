/**
 * Server-side Supabase client for API routes
 * Can read session from cookies
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';
import type { User } from '@/types/database.types';

/**
 * Create Supabase client for API routes (server-side)
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Get current authenticated user (server-side)
 * For use in API routes
 * Can read from Authorization header or cookies
 */
export async function getServerUser(authToken?: string): Promise<User | null> {
  try {
    const supabase = await createServerSupabaseClient();

    let authUser;
    let authError;

    if (authToken) {
      // Use provided token from Authorization header
      console.log('[getServerUser] Using token auth');
      const { data, error } = await supabase.auth.getUser(authToken);
      authUser = data.user;
      authError = error;
      console.log('[getServerUser] Auth user:', authUser ? authUser.id : 'null');
      console.log('[getServerUser] Auth error:', authError?.message || 'none');
    } else {
      // Try to get from cookies/session
      console.log('[getServerUser] Using cookie auth');
      const { data, error } = await supabase.auth.getUser();
      authUser = data.user;
      authError = error;
      console.log('[getServerUser] Auth user:', authUser ? authUser.id : 'null');
      console.log('[getServerUser] Auth error:', authError?.message || 'none');
    }

    if (authError || !authUser) {
      console.log('[getServerUser] No auth user, returning null');
      return null;
    }

    // Get user profile from users table
    console.log('[getServerUser] Fetching profile for user:', authUser.id);
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    console.log('[getServerUser] Profile:', profile ? 'Found' : 'null');
    console.log('[getServerUser] Profile error:', profileError?.message || 'none');

    if (profileError || !profile) {
      return null;
    }

    return profile;
  } catch (error) {
    console.error('[getServerUser] Error fetching server user:', error);
    return null;
  }
}
