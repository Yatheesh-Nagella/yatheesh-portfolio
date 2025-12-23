/**
 * useTransactions Hook
 * SWR-powered hook for fetching and caching user transactions
 * Provides automatic caching, revalidation, and pagination support
 */

import useSWR from 'swr';
import { getUserTransactions, type Transaction } from '@/lib/supabase';

interface UseTransactionsOptions {
  /**
   * Maximum number of transactions to fetch
   * Default: 50
   */
  limit?: number;

  /**
   * Start date for filtering transactions (ISO string)
   */
  startDate?: string;

  /**
   * End date for filtering transactions (ISO string)
   */
  endDate?: string;

  /**
   * Category filter for transactions
   */
  category?: string;

  /**
   * If false, the hook will not fetch data
   */
  enabled?: boolean;

  /**
   * How long to cache data before marking as stale (milliseconds)
   * Default: 30000 (30 seconds - transactions update frequently)
   */
  dedupingInterval?: number;
}

interface UseTransactionsReturn {
  transactions: Transaction[];
  isLoading: boolean;
  isError: boolean;
  error: Error | undefined;
  mutate: () => void;
  refresh: () => void;
}

/**
 * Fetch and cache user transactions with optional filters
 *
 * @param userId - The user's ID
 * @param options - Configuration and filter options
 * @returns Transaction data with loading/error states
 *
 * @example
 * ```tsx
 * const { transactions, isLoading, refresh } = useTransactions(user.id, {
 *   limit: 50,
 *   startDate: thirtyDaysAgo.toISOString(),
 * });
 *
 * if (isLoading) return <Skeleton />;
 *
 * return (
 *   <div>
 *     <TransactionList transactions={transactions} />
 *     <button onClick={refresh}>Refresh</button>
 *   </div>
 * );
 * ```
 */
export function useTransactions(
  userId: string | undefined,
  options: UseTransactionsOptions = {}
): UseTransactionsReturn {
  const {
    limit = 50,
    startDate,
    endDate,
    category,
    enabled = true,
    dedupingInterval = 30000, // 30 seconds (more frequent than accounts)
  } = options;

  // Create unique SWR key including all filter parameters
  // This ensures different filters create separate cache entries
  const key = enabled && userId
    ? ['transactions', userId, limit, startDate, endDate, category]
    : null;

  const { data, error, isLoading, mutate } = useSWR(
    key,
    async ([_, uid]: [string, string]) => {
      // Fetcher function with filters
      const transactions = await getUserTransactions(uid, {
        limit,
        startDate,
        endDate,
        category,
      });
      return transactions;
    },
    {
      dedupingInterval,
      revalidateOnFocus: false, // Don't refetch on every focus
      revalidateOnReconnect: true, // Do refetch on reconnect (transactions update)
      shouldRetryOnError: true,
      errorRetryCount: 3,
      keepPreviousData: true, // Smooth transitions when filters change
    }
  );

  return {
    transactions: data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
    refresh: () => mutate(),
  };
}
