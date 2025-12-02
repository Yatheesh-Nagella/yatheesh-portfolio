'use client';

/**
 * Finance Layout Client Component
 * Wraps finance pages with ErrorBoundary for error handling
 * Must be a Client Component to use class-based ErrorBoundary
 */

import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import FinanceHeader from './FinanceHeader';

interface FinanceLayoutClientProps {
  children: React.ReactNode;
}

export default function FinanceLayoutClient({ children }: FinanceLayoutClientProps) {
  return (
    <ErrorBoundary
      fallbackTitle="Finance App Error"
      fallbackMessage="We encountered an error loading this page. Your data is safe. Please try refreshing or return to the dashboard."
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Persistent Header - stays mounted during navigation */}
        <FinanceHeader />

        {/* Page Content with Error Boundary Protection */}
        {children}
      </div>
    </ErrorBoundary>
  );
}
