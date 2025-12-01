'use client';

/**
 * Finance SWR Provider
 * Wraps the finance app with SWR configuration for data caching
 */

import React from 'react';
import { SWRConfig } from 'swr';
import { swrConfig } from '@/lib/swr-config';

interface FinanceSWRProviderProps {
  children: React.ReactNode;
}

export default function FinanceSWRProvider({ children }: FinanceSWRProviderProps) {
  return (
    <SWRConfig value={swrConfig}>
      {children}
    </SWRConfig>
  );
}
