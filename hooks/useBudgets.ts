/**
 * useBudgets Hook
 * SWR-powered hook for fetching and caching user budgets
 * Provides automatic caching, revalidation, and optimistic updates
 */

import useSWR from 'swr';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Budget = Database['public']['Tables']['budgets']['Row'];

interface UseBudgetsOptions {
  /**
   * If false, the hook will not fetch data
   */
  enabled?: boolean;

  /**
   * How long to cache data before marking as stale (milliseconds)
   * Default: 60000 (1 minute)
   */
  dedupingInterval?: number;
}

interface UseBudgetsReturn {
  budgets: Budget[];
  isLoading: boolean;
  isError: boolean;
  error: Error | undefined;
  mutate: () => void;
  refresh: () => void;
}

/**
 * Fetcher function for budgets
 * Separated for reusability and testing
 */
async function fetchBudgets(userId: string): Promise<Budget[]> {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching budgets:', error);
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Fetch and cache user budgets
 *
 * @param userId - The user's ID
 * @param options - Configuration options
 * @returns Budget data with loading/error states
 *
 * @example
 * ```tsx
 * const { budgets, isLoading, isError, refresh } = useBudgets(user.id);
 *
 * if (isLoading) return <Spinner />;
 * if (isError) return <ErrorMessage />;
 *
 * return (
 *   <div>
 *     <BudgetList budgets={budgets} />
 *     <button onClick={refresh}>Refresh</button>
 *   </div>
 * );
 * ```
 */
export function useBudgets(
  userId: string | undefined,
  options: UseBudgetsOptions = {}
): UseBudgetsReturn {
  const {
    enabled = true,
    dedupingInterval = 60000, // 1 minute
  } = options;

  // Create SWR key
  const key = enabled && userId ? ['budgets', userId] : null;

  const { data, error, isLoading, mutate } = useSWR(
    key,
    async ([_, uid]) => fetchBudgets(uid),
    {
      dedupingInterval,
      revalidateOnFocus: false, // Budgets don't change frequently
      revalidateOnReconnect: false,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      keepPreviousData: true,
    }
  );

  return {
    budgets: data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
    refresh: () => mutate(),
  };
}

/**
 * Export the fetcher for use in optimistic updates
 */
export { fetchBudgets };
