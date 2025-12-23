/**
 * Finance App Layout
 * Wraps all finance pages with AuthProvider and FinanceThemeProvider
 * Provides consistent navigation and persistent header
 * Includes SWR configuration for data caching
 */

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { FinanceThemeProvider } from '@/contexts/FinanceThemeContext';
import FinanceLayoutClient from '@/components/finance/FinanceLayoutClient';
import FinanceSWRProvider from '@/components/finance/FinanceSWRProvider';
import { Toaster } from 'react-hot-toast';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OneLibro - Personal Finance',
  description: 'Manage your finances with OneLibro',
};

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <FinanceThemeProvider>
        {/* SWR Provider for data caching */}
        <FinanceSWRProvider>
          {/* Error Boundary wraps all finance pages */}
          <FinanceLayoutClient>
            {children}
          </FinanceLayoutClient>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </FinanceSWRProvider>
      </FinanceThemeProvider>
    </AuthProvider>
  );
}