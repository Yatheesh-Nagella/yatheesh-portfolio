/**
 * Finance App Layout
 * Wraps all finance pages with AuthProvider
 * Provides consistent navigation for authenticated pages
 */

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
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
      {children}
    </AuthProvider>
  );
}