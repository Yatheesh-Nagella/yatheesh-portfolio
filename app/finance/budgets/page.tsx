'use client';

/**
 * Budgets Page
 * View, create, and manage spending budgets
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/finance/ProtectedRoute';
import DashboardLayout from '@/components/finance/DashboardLayout';
import { useRouter } from 'next/navigation';
import { getUserBudgets, getUserTransactions, formatCurrency } from '@/lib/supabase';
import type { Budget, Transaction } from '@/lib/supabase';
import toast from 'react-hot-toast';
import {
  Loader2,
  PlusCircle,
  Target,
  TrendingUp,
  AlertTriangle,
  Trash2,
  Edit2,
} from 'lucide-react';

/**
 * Get period start date based on budget period
 */
function getPeriodStartDate(period: string): Date {
  const now = new Date();
  switch (period) {
    case 'weekly':
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      return new Date(now.setDate(diff));
    case 'monthly':
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case 'yearly':
      return new Date(now.getFullYear(), 0, 1);
    default:
      return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}

/**
 * Calculate spent amount for a budget
 */
function calculateSpent(budget: Budget, transactions: Transaction[]): number {
  const periodStart = getPeriodStartDate(budget.period || 'monthly');

  return transactions
    .filter((tx) => {
      const txDate = new Date(tx.transaction_date);
      const categoryMatch = tx.category?.toLowerCase().includes(budget.category.toLowerCase()) ||
                           budget.category.toLowerCase().includes(tx.category?.toLowerCase() || '');
      return (
        categoryMatch &&
        txDate >= periodStart &&
        tx.amount > 0 // Only expenses (positive amounts)
      );
    })
    .reduce((sum, tx) => sum + tx.amount, 0);
}

/**
 * Get progress bar color based on percentage
 */
function getProgressColor(percentage: number): string {
  if (percentage >= 100) return 'bg-red-500';
  if (percentage >= 80) return 'bg-orange-500';
  if (percentage >= 50) return 'bg-yellow-500';
  return 'bg-green-500';
}

/**
 * Get status badge for budget
 */
function getBudgetStatus(percentage: number): { text: string; color: string } {
  if (percentage >= 100) return { text: 'Over Budget', color: 'bg-red-900/30 text-red-300' };
  if (percentage >= 80) return { text: 'Almost There', color: 'bg-orange-900/30 text-orange-300' };
  if (percentage >= 50) return { text: 'On Track', color: 'bg-yellow-900/30 text-yellow-300' };
  return { text: 'Good', color: 'bg-green-900/30 text-green-300' };
}

export default function BudgetsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /**
   * Fetch budgets and transactions
   */
  useEffect(() => {
    async function fetchData() {
      if (!user) {
        router.push('/finance/login');
        return;
      }

      try {
        setLoading(true);

        // Fetch budgets and transactions in parallel
        const [budgetsData, transactionsData] = await Promise.all([
          getUserBudgets(user.id),
          getUserTransactions(user.id, { limit: 1000 }),
        ]);

        setBudgets(budgetsData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching budgets:', error);
        toast.error('Failed to load budgets');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, router]);

  /**
   * Delete a budget
   */
  async function handleDelete(budgetId: string) {
    if (!confirm('Are you sure you want to delete this budget?')) return;

    setDeletingId(budgetId);
    try {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase
        .from('budgets')
        .update({ is_active: false })
        .eq('id', budgetId);

      if (error) throw error;

      setBudgets(budgets.filter((b) => b.id !== budgetId));
      toast.success('Budget deleted');
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Failed to delete budget');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#10b981] mx-auto" />
                <p className="mt-4 text-[#a3a3a3]">Loading budgets...</p>
              </div>
            </div>
          )}

          {/* Budgets Content */}
          {!loading && (
            <>
              {/* Header */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
                  <button
                    onClick={() => router.push('/finance/budgets/create')}
                    className="flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#10b981]/90 text-[#1a1a1a] px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>New Budget</span>
                  </button>
                </div>
              </div>

              {/* Empty State */}
              {budgets.length === 0 ? (
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 via-transparent to-[#a3a3a3]/5 rounded-xl" />
            <div className="relative bg-[#e5e5e5]/5 backdrop-blur-sm border border-[#a3a3a3]/10 rounded-xl p-12 text-center">
              <div className="w-20 h-20 rounded-2xl bg-[#10b981]/15 flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-[#10b981]" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-[#e5e5e5] mb-3">
                No budgets yet
              </h2>
              <p className="text-[#a3a3a3] mb-8 max-w-md mx-auto">
                Create your first budget to start tracking your spending goals.
              </p>
              <button
                onClick={() => router.push('/finance/budgets/create')}
                className="bg-[#10b981] hover:bg-[#10b981]/90 text-[#1a1a1a] px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                Create Budget
              </button>
            </div>
          </div>
        ) : (
          /* Budget Cards */
          <div className="space-y-4">
            {budgets.map((budget) => {
              const spent = calculateSpent(budget, transactions);
              const percentage = Math.round((spent / budget.amount) * 100);
              const remaining = budget.amount - spent;
              const status = getBudgetStatus(percentage);

              return (
                <div
                  key={budget.id}
                  className="relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-transparent rounded-xl" />
                  <div className="relative bg-[#e5e5e5]/5 backdrop-blur-sm border border-[#a3a3a3]/10 rounded-xl p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-[#e5e5e5]">
                            {budget.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            {status.text}
                          </span>
                        </div>
                        <p className="text-sm text-[#737373] mt-1">
                          {budget.category} - {(budget.period || 'monthly').charAt(0).toUpperCase() + (budget.period || 'monthly').slice(1)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/finance/budgets/edit/${budget.id}`)}
                          className="p-2 text-[#737373] hover:text-[#10b981] transition-colors"
                          title="Edit budget"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(budget.id)}
                          disabled={deletingId === budget.id}
                          className="p-2 text-[#737373] hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Delete budget"
                        >
                          {deletingId === budget.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-[#a3a3a3]">
                          {formatCurrency(spent)} spent
                        </span>
                        <span className="text-[#e5e5e5] font-medium">
                          {formatCurrency(budget.amount)} budget
                        </span>
                      </div>
                      <div className="w-full h-3 bg-[#0f0f0f] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(percentage)} transition-all duration-500`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-[#737373] mt-1">
                        <span>{percentage}% used</span>
                        <span>
                          {remaining >= 0
                            ? `${formatCurrency(remaining)} remaining`
                            : `${formatCurrency(Math.abs(remaining))} over budget`}
                        </span>
                      </div>
                    </div>

                    {/* Warning if over 80% */}
                    {percentage >= 80 && (
                      <div className={`flex items-center gap-2 text-sm ${percentage >= 100 ? 'text-red-400' : 'text-orange-400'}`}>
                        <AlertTriangle className="w-4 h-4" />
                        {percentage >= 100
                          ? 'You\'ve exceeded this budget!'
                          : 'You\'re approaching your budget limit'}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#a3a3a3]/10">
                      <div>
                        <p className="text-xs text-[#737373]">Daily Average</p>
                        <p className="text-sm font-medium text-[#e5e5e5]">
                          {formatCurrency(spent / new Date().getDate())}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#737373]">Trend</p>
                        <p className="text-sm font-medium flex items-center justify-end gap-1 text-[#e5e5e5]">
                          <TrendingUp className={`w-4 h-4 ${percentage > 50 ? 'text-red-400' : 'text-green-400'}`} />
                          {percentage > 50 ? 'High' : 'Low'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

              {/* Help Text */}
              <div className="mt-8 p-4 bg-[#10b981]/10 rounded-lg border border-[#10b981]/30 backdrop-blur-sm">
                <h3 className="font-medium text-[#10b981] mb-2">Budget Tips</h3>
                <ul className="text-sm text-[#a3a3a3] space-y-1">
                  <li>- Set realistic budgets based on your spending history</li>
                  <li>- Start with a few key categories like Food and Shopping</li>
                  <li>- Review and adjust your budgets monthly</li>
                  <li>- The 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
