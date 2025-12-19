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
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#10b981] mx-auto" />
          <p className="mt-4 text-[#a3a3a3]">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect handled by useRequireAuth if no user
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/finance/transactions')}
            className="flex items-center text-[#a3a3a3] hover:text-[#e5e5e5] mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Transactions
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#10b981]/20 rounded-full flex items-center justify-center">
              <PlusCircle className="w-6 h-6 text-[#10b981]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#e5e5e5]">
                Add Transaction
              </h1>
              <p className="text-[#a3a3a3] mt-1">
                Manually track cash or other transactions
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-transparent rounded-xl" />
          <div className="relative bg-[#e5e5e5]/5 backdrop-blur-sm border border-[#a3a3a3]/10 rounded-xl p-6 sm:p-8">
            <TransactionForm />
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-[#10b981]/10 rounded-lg border border-[#10b981]/30 backdrop-blur-sm">
          <h3 className="font-medium text-[#10b981] mb-2">
            When to add manual transactions?
          </h3>
          <ul className="text-sm text-[#a3a3a3] space-y-1">
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
