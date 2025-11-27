/**
 * Finance App Layout
 * Wraps all finance pages with AuthProvider and FinanceThemeProvider
 * Provides consistent navigation for authenticated pages
 */

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { FinanceThemeProvider } from '@/contexts/FinanceThemeContext';
import { Toaster } from 'react-hot-toast';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OneLedger - Personal Finance',
  description: 'Manage your finances with OneLedger',
};

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <FinanceThemeProvider>
        {children}
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
      </FinanceThemeProvider>
    </AuthProvider>
  );
}