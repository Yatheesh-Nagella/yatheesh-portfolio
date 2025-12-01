/**
 * useAccounts Hook
 * SWR-powered hook for fetching and caching user accounts
 * Provides automatic caching, revalidation, and error handling
 */

import useSWR from 'swr';
import { getUserAccounts, type Account } from '@/lib/supabase';

interface UseAccountsOptions {
  /**
   * If false, the hook will not fetch data
   * Useful for conditional fetching
   */
  enabled?: boolean;

  /**
   * How long to cache data before marking as stale (milliseconds)
   * Default: 60000 (1 minute)
   */
  dedupingInterval?: number;

  /**
   * Whether to revalidate when user refocuses the window
   * Default: false (accounts don't change frequently)
   */
  revalidateOnFocus?: boolean;
}

interface UseAccountsReturn {
  accounts: Account[];
  isLoading: boolean;
  isError: boolean;
  error: Error | undefined;
  mutate: () => void;
  refresh: () => void;
}

/**
 * Fetch and cache user accounts
 *
 * @param userId - The user's ID
 * @param options - Configuration options
 * @returns Account data with loading/error states
 *
 * @example
 * ```tsx
 * const { accounts, isLoading, isError, refresh } = useAccounts(user.id);
 *
 * if (isLoading) return <Spinner />;
 * if (isError) return <Error />;
 *
 * return <AccountList accounts={accounts} onRefresh={refresh} />;
 * ```
 */
export function useAccounts(
  userId: string | undefined,
  options: UseAccountsOptions = {}
): UseAccountsReturn {
  const {
    enabled = true,
    dedupingInterval = 60000, // 1 minute
    revalidateOnFocus = false,
  } = options;

  // Create SWR key - null disables the hook
  const key = enabled && userId ? ['accounts', userId] : null;

  const { data, error, isLoading, mutate } = useSWR(
    key,
    async ([_, uid]) => {
      // Fetcher function
      const accounts = await getUserAccounts(uid);
      return accounts;
    },
    {
      dedupingInterval,
      revalidateOnFocus,
      revalidateOnReconnect: false, // Accounts don't change on reconnect
      shouldRetryOnError: true,
      errorRetryCount: 3,
      // Keep previous data while revalidating
      keepPreviousData: true,
    }
  );

  return {
    accounts: data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
    // Convenient alias for manual refresh
    refresh: () => mutate(),
  };
}
