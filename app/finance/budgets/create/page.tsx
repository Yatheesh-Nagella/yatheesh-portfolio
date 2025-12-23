'use client';

/**
 * Create Budget Page
 * Form to create a new spending budget
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/finance/ProtectedRoute';
import DashboardLayout from '@/components/finance/DashboardLayout';
import BudgetForm from '@/components/finance/BudgetForm';
import { ArrowLeft } from 'lucide-react';

export default function CreateBudgetPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/finance/budgets')}
              className="flex items-center text-[#a3a3a3] hover:text-[#e5e5e5] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Budgets
            </button>
          </div>

        {/* Form Card */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-transparent rounded-xl" />
          <div className="relative bg-[#e5e5e5]/5 backdrop-blur-sm border border-[#a3a3a3]/10 rounded-xl p-6 sm:p-8">
            <BudgetForm />
          </div>
        </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-[#10b981]/10 rounded-lg border border-[#10b981]/30 backdrop-blur-sm">
            <h3 className="font-medium text-[#10b981] mb-2">
              How budgets work
            </h3>
            <ul className="text-sm text-[#a3a3a3] space-y-1">
              <li>- Your spending is tracked automatically from linked accounts</li>
              <li>- Get alerts when you reach 80% of your budget</li>
              <li>- Budgets reset based on your chosen period</li>
              <li>- View progress on your dashboard at a glance</li>
            </ul>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
