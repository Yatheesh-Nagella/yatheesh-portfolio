'use client';

/**
 * Add Transaction Page
 * Form to create manual transactions
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/contexts/AuthContext';
import TransactionForm from '@/components/finance/TransactionForm';
import { ArrowLeft, Loader2, PlusCircle } from 'lucide-react';

export default function AddTransactionPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth();

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect handled by useRequireAuth if no user
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/finance/transactions')}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Transactions
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <PlusCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Add Transaction
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manually track cash or other transactions
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <TransactionForm />
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
          <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
            When to add manual transactions?
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>- Cash payments not tracked by your bank</li>
            <li>- Venmo/PayPal transfers</li>
            <li>- Reimbursements or refunds</li>
            <li>- Side income or freelance payments</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
