'use client';

/**
 * Budgets Page
 * View, create, and manage spending budgets
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getUserBudgets, getUserTransactions, formatCurrency } from '@/lib/supabase';
import type { Budget, Transaction } from '@/lib/supabase';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
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
  if (percentage >= 100) return { text: 'Over Budget', color: 'bg-red-100 text-red-800' };
  if (percentage >= 80) return { text: 'Almost There', color: 'bg-orange-100 text-orange-800' };
  if (percentage >= 50) return { text: 'On Track', color: 'bg-yellow-100 text-yellow-800' };
  return { text: 'Good', color: 'bg-green-100 text-green-800' };
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading budgets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/finance/dashboard')}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Budgets</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Track your spending against budget goals
              </p>
            </div>
            <button
              onClick={() => router.push('/finance/budgets/create')}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="hidden sm:inline">New Budget</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {budgets.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Target className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No budgets yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Create your first budget to start tracking your spending goals.
            </p>
            <button
              onClick={() => router.push('/finance/budgets/create')}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Create Budget
            </button>
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
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {budget.name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                          {status.text}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {budget.category} - {(budget.period || 'monthly').charAt(0).toUpperCase() + (budget.period || 'monthly').slice(1)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/finance/budgets/edit/${budget.id}`)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Edit budget"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        disabled={deletingId === budget.id}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
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
                      <span className="text-gray-600 dark:text-gray-300">
                        {formatCurrency(spent)} spent
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatCurrency(budget.amount)} budget
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getProgressColor(percentage)} transition-all duration-500`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
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
                    <div className={`flex items-center gap-2 text-sm ${percentage >= 100 ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
                      <AlertTriangle className="w-4 h-4" />
                      {percentage >= 100
                        ? 'You\'ve exceeded this budget!'
                        : 'You\'re approaching your budget limit'}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Daily Average</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(spent / new Date().getDate())}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Trend</p>
                      <p className="text-sm font-medium flex items-center justify-end gap-1">
                        <TrendingUp className={`w-4 h-4 ${percentage > 50 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`} />
                        {percentage > 50 ? 'High' : 'Low'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
          <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Budget Tips</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>- Set realistic budgets based on your spending history</li>
            <li>- Start with a few key categories like Food and Shopping</li>
            <li>- Review and adjust your budgets monthly</li>
            <li>- The 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
