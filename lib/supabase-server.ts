/**
 * Server-side Supabase client for API routes
 * Can read session from cookies
 */

import { createServerClient } from '@supabase/ssr';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';
import type { User, Account } from '@/types/database.types';

/**
 * Create Supabase admin client with service role key
 * Bypasses RLS - use only for admin operations
 */
export function createServiceRoleClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

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

    // Use service role client for profile operations (bypasses RLS)
    const adminClient = createServiceRoleClient();

    // Get user profile from users table
    console.log('[getServerUser] Fetching profile for user:', authUser.id);
    const { data: profile, error: profileError } = await adminClient
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    console.log('[getServerUser] Profile:', profile ? 'Found' : 'null');
    console.log('[getServerUser] Profile error:', profileError?.message || 'none');

    if (profileError || !profile) {
      // Profile doesn't exist - create it with service role (bypasses RLS)
      console.log('[getServerUser] Creating missing profile for user:', authUser.id);

      const { data: newProfile, error: createError } = await adminClient
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email!,
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
        })
        .select()
        .single();

      if (createError) {
        console.error('[getServerUser] Failed to create profile:', createError.message);
        return null;
      }

      console.log('[getServerUser] Profile created successfully');
      return newProfile;
    }

    return profile;
  } catch (error) {
    console.error('[getServerUser] Error fetching server user:', error);
    return null;
  }
}

// ============================================
// CASH ACCOUNT MANAGEMENT
// ============================================

/**
 * Get or create a virtual Cash account for a user
 * Cash accounts are used for manual/cash transactions
 */
export async function getOrCreateCashAccount(
  userId: string,
  supabase?: SupabaseClient<Database>
): Promise<Account | null> {
  const client = supabase || createServiceRoleClient();

  try {
    // Check if cash account already exists
    const { data: existingAccount, error: fetchError } = await client
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('account_type', 'cash')
      .is('plaid_item_id', null)
      .single();

    if (existingAccount && !fetchError) {
      console.log('[getOrCreateCashAccount] Found existing cash account:', existingAccount.id);
      return existingAccount as Account;
    }

    // Create new cash account
    console.log('[getOrCreateCashAccount] Creating new cash account for user:', userId);
    const { data: newAccount, error: createError } = await client
      .from('accounts')
      .insert({
        user_id: userId,
        plaid_item_id: null,
        plaid_account_id: `cash_${userId}`, // Unique identifier for cash account
        account_name: 'Cash',
        account_type: 'cash',
        current_balance: 0,
        available_balance: 0,
        currency: 'USD',
        is_hidden: false,
      })
      .select()
      .single();

    if (createError) {
      console.error('[getOrCreateCashAccount] Failed to create cash account:', createError.message);
      return null;
    }

    console.log('[getOrCreateCashAccount] Cash account created:', newAccount.id);
    return newAccount as Account;
  } catch (error) {
    console.error('[getOrCreateCashAccount] Error:', error);
    return null;
  }
}

/**
 * Update cash account balance based on manual transactions
 * Call this after creating, updating, or deleting manual transactions
 */
export async function updateCashAccountBalance(
  userId: string,
  supabase?: SupabaseClient<Database>
): Promise<{ balance: number; error: string | null }> {
  const client = supabase || createServiceRoleClient();

  try {
    // Get the cash account
    const cashAccount = await getOrCreateCashAccount(userId, client);
    if (!cashAccount) {
      return { balance: 0, error: 'Failed to get cash account' };
    }

    // Calculate total from manual transactions linked to this cash account
    const { data: transactions, error: txError } = await client
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('account_id', cashAccount.id)
      .eq('is_hidden', false);

    if (txError) {
      console.error('[updateCashAccountBalance] Error fetching transactions:', txError.message);
      return { balance: 0, error: txError.message };
    }

    // Sum up all transaction amounts
    // Note: In Plaid convention, positive = expense (money out), negative = income (money in)
    // For cash account balance, we invert this: income adds to balance, expense subtracts
    const totalSpent = transactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;

    // Cash balance starts at 0 and decreases with expenses (positive amounts)
    // If you want to track "cash on hand", you'd need an initial balance feature
    // For now, we track net cash flow (negative balance = net spending)
    const newBalance = -totalSpent;

    // Update cash account balance
    const { error: updateError } = await client
      .from('accounts')
      .update({
        current_balance: newBalance,
        available_balance: newBalance,
      })
      .eq('id', cashAccount.id);

    if (updateError) {
      console.error('[updateCashAccountBalance] Error updating balance:', updateError.message);
      return { balance: 0, error: updateError.message };
    }

    console.log('[updateCashAccountBalance] Updated cash balance to:', newBalance);
    return { balance: newBalance, error: null };
  } catch (error) {
    console.error('[updateCashAccountBalance] Error:', error);
    return { balance: 0, error: 'Unknown error' };
  }
}

/**
 * Migrate existing manual transactions (with null account_id) to cash account
 * Run this once to fix historical data
 */
export async function migrateManualTransactionsToCashAccount(
  userId: string,
  supabase?: SupabaseClient<Database>
): Promise<{ migrated: number; error: string | null }> {
  const client = supabase || createServiceRoleClient();

  try {
    // Get or create cash account
    const cashAccount = await getOrCreateCashAccount(userId, client);
    if (!cashAccount) {
      return { migrated: 0, error: 'Failed to get cash account' };
    }

    // Find manual transactions without an account
    const { data: orphanedTx, error: fetchError } = await client
      .from('transactions')
      .select('id')
      .eq('user_id', userId)
      .eq('is_manual', true)
      .is('account_id', null);

    if (fetchError) {
      return { migrated: 0, error: fetchError.message };
    }

    if (!orphanedTx || orphanedTx.length === 0) {
      return { migrated: 0, error: null };
    }

    // Update them to use cash account
    const txIds = orphanedTx.map(tx => tx.id);
    const { error: updateError } = await client
      .from('transactions')
      .update({ account_id: cashAccount.id })
      .in('id', txIds);

    if (updateError) {
      return { migrated: 0, error: updateError.message };
    }

    // Recalculate cash account balance
    await updateCashAccountBalance(userId, client);

    console.log(`[migrateManualTransactions] Migrated ${txIds.length} transactions to cash account`);
    return { migrated: txIds.length, error: null };
  } catch (error) {
    console.error('[migrateManualTransactions] Error:', error);
    return { migrated: 0, error: 'Unknown error' };
  }
}
