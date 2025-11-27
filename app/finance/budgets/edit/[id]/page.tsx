'use client';

/**
 * Edit Budget Page
 * Form to edit an existing budget
 */

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useRequireAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import BudgetForm from '@/components/finance/BudgetForm';
import { ArrowLeft, Loader2, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Budget } from '@/types/database.types';

export default function EditBudgetPage() {
  const router = useRouter();
  const params = useParams();
  const budgetId = params.id as string;
  const { user, loading: authLoading } = useRequireAuth();

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

  // Show loading while checking auth or fetching budget
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading budget...</p>
        </div>
      </div>
    );
  }

  // Redirect handled by useRequireAuth if no user
  if (!user || !budget) return null;

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
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Edit Budget
              </h1>
              <p className="text-gray-600 mt-1">
                Update your budget settings
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
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
    </div>
  );
}
