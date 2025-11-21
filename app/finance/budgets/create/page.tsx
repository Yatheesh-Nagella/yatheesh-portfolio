'use client';

/**
 * Create Budget Page
 * Form to create a new spending budget
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/contexts/AuthContext';
import BudgetForm from '@/components/finance/BudgetForm';
import { ArrowLeft, Loader2, Target } from 'lucide-react';

export default function CreateBudgetPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth();

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect handled by useRequireAuth if no user
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/finance/budgets')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Budgets
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Create Budget
              </h1>
              <p className="text-gray-600 mt-1">
                Set spending limits to reach your financial goals
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <BudgetForm />
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
          <h3 className="font-medium text-green-900 mb-2">
            How budgets work
          </h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>- Your spending is tracked automatically from linked accounts</li>
            <li>- Get alerts when you reach 80% of your budget</li>
            <li>- Budgets reset based on your chosen period</li>
            <li>- View progress on your dashboard at a glance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
