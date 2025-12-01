/**
 * SWR Configuration
 * Global configuration for data fetching and caching
 */

import { SWRConfiguration } from 'swr';

/**
 * Default SWR configuration for the finance app
 *
 * Key features:
 * - Cache deduplication: Prevents duplicate requests within 60 seconds
 * - No revalidation on focus: Prevents refetching when user returns to tab
 * - No revalidation on reconnect: Prevents refetching when internet reconnects
 * - Error retry: Retries failed requests with exponential backoff
 */
export const swrConfig: SWRConfiguration = {
  // Cache deduplication interval (1 minute)
  // If the same key is used within this time, SWR will use cached data
  dedupingInterval: 60000,

  // Don't revalidate when the user refocuses the tab
  // Finance data doesn't need to be that real-time
  revalidateOnFocus: false,

  // Don't revalidate when the user reconnects to the internet
  // We'll manually trigger refreshes when needed
  revalidateOnReconnect: false,

  // Revalidate on mount only if data is stale
  // This prevents unnecessary refetches on navigation
  revalidateIfStale: true,

  // Keep data fresh for 5 minutes before marking as stale
  // After this time, next mount will trigger revalidation
  focusThrottleInterval: 300000, // 5 minutes

  // Retry on error with exponential backoff
  errorRetryCount: 3,
  errorRetryInterval: 5000, // Start with 5 second delay

  // Don't suspend on error (show error UI instead of throwing)
  shouldRetryOnError: true,

  // Use default fetch behavior
  // Each hook will define its own fetcher function
  fetcher: undefined,
};

/**
 * Configuration for frequently changing data (like real-time balances)
 * More aggressive revalidation strategy
 */
export const realtimeSWRConfig: SWRConfiguration = {
  ...swrConfig,
  dedupingInterval: 5000, // 5 seconds
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  focusThrottleInterval: 5000, // 5 seconds
};

/**
 * Configuration for rarely changing data (like account list)
 * Very conservative revalidation strategy
 */
export const staticSWRConfig: SWRConfiguration = {
  ...swrConfig,
  dedupingInterval: 300000, // 5 minutes
  focusThrottleInterval: 600000, // 10 minutes
  revalidateIfStale: false, // Never auto-revalidate
};
