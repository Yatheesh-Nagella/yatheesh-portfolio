'use client';

/**
 * Finance Layout Client Component
 * Wraps finance pages with ErrorBoundary for error handling
 * Must be a Client Component to use class-based ErrorBoundary
 */

import React from 'react';
import ErrorBoundary from './ErrorBoundary';

interface FinanceLayoutClientProps {
  children: React.ReactNode;
}

export default function FinanceLayoutClient({ children }: FinanceLayoutClientProps) {
  return (
    <ErrorBoundary
      fallbackTitle="Finance App Error"
      fallbackMessage="We encountered an error loading this page. Your data is safe. Please try refreshing or return to the dashboard."
    >
      <div className="min-h-screen bg-[#0f0f0f]">
        {/* Page Content with Error Boundary Protection */}
        {children}
      </div>
    </ErrorBoundary>
  );
}
