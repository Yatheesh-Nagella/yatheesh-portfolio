'use client';

/**
 * Edit Budget Page
 * Form to edit an existing budget
 */

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/finance/ProtectedRoute';
import DashboardLayout from '@/components/finance/DashboardLayout';
import { supabase } from '@/lib/supabase';
import BudgetForm from '@/components/finance/BudgetForm';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Budget } from '@/types/database.types';

export default function EditBudgetPage() {
  const router = useRouter();
  const params = useParams();
  const budgetId = params.id as string;
  const { user } = useAuth();

  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch budget data
  useEffect(() => {
    async function fetchBudget() {
      if (!user || !budgetId) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('budgets')
          .select('*')
          .eq('id', budgetId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching budget:', error);
          toast.error('Budget not found');
          router.push('/finance/budgets');
          return;
        }

        setBudget(data);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load budget');
        router.push('/finance/budgets');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchBudget();
    }
  }, [user, budgetId, router]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#10b981] mx-auto" />
                <p className="mt-4 text-[#a3a3a3]">Loading budget...</p>
              </div>
            </div>
          )}

          {/* Budget Form */}
          {!loading && budget && (
            <>
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
                  <BudgetForm
                    initialData={{
                      id: budget.id,
                      name: budget.name,
                      category: budget.category,
                      amount: budget.amount,
                      period: budget.period || 'monthly',
                    }}
                    isEditing={true}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
