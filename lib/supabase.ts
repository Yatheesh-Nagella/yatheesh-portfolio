// lib/supabase.ts
/**
 * Supabase client and helper functions
 * All functions are fully typed for type safety
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import type {
  User,
  Account,
  Transaction,
  Budget,
  PlaidItem,
} from '@/types/database.types';
import crypto from 'crypto';

// Re-export types for convenience
export type { User, Account, Transaction, Budget, PlaidItem };

// Create typed Supabase client
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ============================================
// ENCRYPTION UTILITIES
// ============================================

/**
 * Decrypt Plaid access token
 * Using AES-256-CBC decryption
 */
export function decryptAccessToken(encryptedToken: string): string {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

  // Split IV and encrypted data
  const parts = encryptedToken.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// ============================================
// AUTHENTICATION
// ============================================

/**
 * Get current authenticated user with profile
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      return null;
    }
    
    // Get user profile from users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();
    
    if (profileError || !profile) {
      return null;
    }
    
    return profile;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(
  email: string, 
  password: string
): Promise<{ user: User | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return { user: null, error: error.message };
    }

    // Update last login time (ignore errors if user doesn't exist in users table yet)
    try {
      await supabase
        .from('users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', data.user.id);
    } catch {
      // Ignore errors - user profile might not exist yet
    }

    // Get full profile
    const user = await getCurrentUser();
    return { user, error: null };
    
  } catch (error) {
    return { 
      user: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Sign up with invite code
 */
export async function signUpWithInvite(
  email: string,
  password: string,
  fullName: string,
  inviteCode: string
): Promise<{ user: User | null; error: string | null }> {
  try {
    // Verify invite code
    const { data: invite, error: inviteError } = await supabase
      .from('invite_codes')
      .select('*')
      .eq('code', inviteCode)
      .eq('is_active', true)
      .single();
    
    if (inviteError || !invite) {
      return { user: null, error: 'Invalid invite code' };
    }
    
    // Check expiration
    if (new Date(invite.expires_at) < new Date()) {
      return { user: null, error: 'Invite code has expired' };
    }
    
    // Check usage limit
    const currentUsedCount = invite.used_count ?? 0;
    const maxUses = invite.max_uses ?? 1;
    if (currentUsedCount >= maxUses) {
      return { user: null, error: 'Invite code has been fully used' };
    }
    
    // Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    
    if (error || !data.user) {
      return { user: null, error: error?.message || 'Signup failed' };
    }
    
    // Update invite code usage
    const newUsedCount = currentUsedCount + 1;
    await supabase
      .from('invite_codes')
      .update({ 
        used_count: newUsedCount,
        is_active: newUsedCount < maxUses
      })
      .eq('id', invite.id);
    
    // Update user profile with invite info (trigger already created the user)
    await supabase
      .from('users')
      .update({
        invite_code: inviteCode,
        invited_by: invite.created_by,
        invite_expires_at: invite.expires_at
      })
      .eq('id', data.user.id);

    const user = await getCurrentUser();
    return { user, error: null };
    
  } catch (error) {
    return { 
      user: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { error: error.message };
    }
    
    return { error: null };
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Check if user is admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userId)
      .single();
    
    return data?.is_admin ?? false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// ============================================
// ACCOUNTS
// ============================================

/**
 * Get user's bank accounts with Plaid item info
 * Includes both Plaid-connected accounts and virtual cash account
 */
export async function getUserAccounts(userId: string): Promise<Account[]> {
  try {
    // First get Plaid-connected accounts with institution info
    const { data: plaidAccounts, error: plaidError } = await supabase
      .from('accounts')
      .select(`
        *,
        plaid_items (
          institution_name,
          status,
          last_synced_at
        )
      `)
      .eq('user_id', userId)
      .eq('is_hidden', false)
      .not('plaid_item_id', 'is', null)
      .order('created_at', { ascending: false });

    if (plaidError) {
      console.error('Error fetching Plaid accounts:', plaidError);
    }

    // Then get cash/manual accounts (no plaid_item_id)
    const { data: cashAccounts, error: cashError } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_hidden', false)
      .is('plaid_item_id', null)
      .order('created_at', { ascending: false });

    if (cashError) {
      console.error('Error fetching cash accounts:', cashError);
    }

    // Combine both types, with cash accounts first
    const allAccounts = [
      ...(cashAccounts || []),
      ...(plaidAccounts || []),
    ] as Account[];

    return allAccounts;
  } catch (error) {
    console.error('Error in getUserAccounts:', error);
    return [];
  }
}

/**
 * Get total balance across all accounts
 */
export async function getTotalBalance(userId: string): Promise<number> {
  try {
    const accounts = await getUserAccounts(userId);
    
    return accounts.reduce((total, account) => {
      return total + (account.current_balance ?? 0);
    }, 0);
  } catch (error) {
    console.error('Error calculating total balance:', error);
    return 0;
  }
}

// ============================================
// TRANSACTIONS
// ============================================

/**
 * Get user's transactions with pagination
 */
export async function getUserTransactions(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
    category?: string;
  } = {}
): Promise<Transaction[]> {
  try {
    const { 
      limit = 100, 
      offset = 0,
      startDate,
      endDate,
      category 
    } = options;
    
    let query = supabase
      .from('transactions')
      .select(`
        *,
        accounts (
          account_name,
          account_type
        )
      `)
      .eq('user_id', userId)
      .eq('is_hidden', false)
      .order('transaction_date', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Apply filters
    if (startDate) {
      query = query.gte('transaction_date', startDate);
    }
    
    if (endDate) {
      query = query.lte('transaction_date', endDate);
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
    
    return data as Transaction[];
  } catch (error) {
    console.error('Error in getUserTransactions:', error);
    return [];
  }
}

/**
 * Get spending by category for a date range
 */
export async function getSpendingByCategory(
  userId: string,
  startDate: string,
  endDate: string
): Promise<Record<string, number>> {
  try {
    const transactions = await getUserTransactions(userId, {
      startDate,
      endDate,
    });
    
    const spending: Record<string, number> = {};
    
    transactions.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      spending[category] = (spending[category] || 0) + transaction.amount;
    });
    
    return spending;
  } catch (error) {
    console.error('Error calculating spending by category:', error);
    return {};
  }
}

/**
 * Get total spending for a date range
 */
export async function getTotalSpending(
  userId: string,
  startDate: string,
  endDate: string
): Promise<number> {
  try {
    const transactions = await getUserTransactions(userId, {
      startDate,
      endDate,
    });
    
    return transactions.reduce((total, transaction) => {
      return total + transaction.amount;
    }, 0);
  } catch (error) {
    console.error('Error calculating total spending:', error);
    return 0;
  }
}

// ============================================
// BUDGETS
// ============================================

/**
 * Get user's active budgets
 */
export async function getUserBudgets(userId: string): Promise<Budget[]> {
  try {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching budgets:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error in getUserBudgets:', error);
    return [];
  }
}

/**
 * Create a new budget
 */
export async function createBudget(
  userId: string,
  name: string,
  category: string,
  amount: number,
  period: 'weekly' | 'monthly' | 'yearly'
): Promise<{ budget: Budget | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('budgets')
      .insert({
        user_id: userId,
        name,
        category,
        amount,
        period,
      })
      .select()
      .single();
    
    if (error) {
      return { budget: null, error: error.message };
    }
    
    return { budget: data, error: null };
  } catch (error) {
    return { 
      budget: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Update budget spent amount
 */
export async function updateBudgetSpending(
  budgetId: string,
  spentAmount: number
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('budgets')
      .update({ spent_amount: spentAmount })
      .eq('id', budgetId);
    
    if (error) {
      return { error: error.message };
    }
    
    return { error: null };
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// ============================================
// PLAID ITEMS
// ============================================

/**
 * Get user's Plaid items (bank connections)
 */
export async function getUserPlaidItems(userId: string): Promise<PlaidItem[]> {
  try {
    const { data, error } = await supabase
      .from('plaid_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching Plaid items:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error in getUserPlaidItems:', error);
    return [];
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format cents to dollars
 */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format date to relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}

/**
 * Convert dollars to cents (safe for database storage)
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Convert cents to dollars
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}

/**
 * Type guard to check if user session is valid
 */
export function isValidUser(user: unknown): user is User {
  return (
    typeof user === 'object' &&
    user !== null &&
    'id' in user &&
    'email' in user
  );
}