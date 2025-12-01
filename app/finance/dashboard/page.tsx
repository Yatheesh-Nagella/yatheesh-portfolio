'use client';

/**
 * Finance Dashboard Page
 * Main landing page showing financial overview
 * Displays balance, spending, and recent activity
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAccounts, useTransactions } from '@/hooks';
import ProtectedRoute from '@/components/finance/ProtectedRoute';
import DashboardCard from '@/components/finance/DashboardCard';
import SpendingChart from '@/components/finance/SpendingChart';
import RecentTransactions from '@/components/finance/RecentTransactions';
import PlaidLink from '@/components/finance/PlaidLink';
import {
  DollarSign,
  TrendingDown,
  Building2,
  Loader2,
  AlertCircle,
  Target,
} from 'lucide-react';
import { formatCurrency } from '@/lib/supabase';

export default function FinanceDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  // Calculate date range for transactions (last 30 days)
  const thirtyDaysAgo = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  }, []);

  // SWR Hooks - automatic caching, revalidation, and error handling!
  const {
    accounts,
    isLoading: accountsLoading,
    isError: accountsError,
    refresh: refreshAccounts,
  } = useAccounts(user?.id);

  const {
    transactions,
    isLoading: transactionsLoading,
    isError: transactionsError,
    refresh: refreshTransactions,
  } = useTransactions(user?.id, {
    startDate: thirtyDaysAgo,
    limit: 50,
  });

  // Combined loading and error states
  const loading = accountsLoading || transactionsLoading;
  const error = accountsError || transactionsError;

  // State for computed data
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [chartData, setChartData] = useState<{ date: string; amount: number }[]>([]);

  /**
   * Calculate total balance across all accounts (memoized)
   */
  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, account) => {
      return sum + (account.current_balance || 0);
    }, 0);
  }, [accounts]);

  /**
   * Calculate monthly spending and chart data (client-side only to avoid hydration issues)
   */
  useEffect(() => {
    // Calculate monthly spending (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const spending = transactions
      .filter((tx) => {
        const txDate = new Date(tx.transaction_date);
        return txDate >= thirtyDaysAgo && tx.amount > 0; // Positive amounts are expenses
      })
      .reduce((sum, tx) => sum + tx.amount, 0);

    setMonthlySpending(spending);

    // Generate spending chart data (last 30 days)
    const days = 30;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      // Calculate spending for this day
      const daySpending = transactions
        .filter((tx) => {
          const txDate = new Date(tx.transaction_date);
          return (
            txDate.toDateString() === date.toDateString() && tx.amount > 0
          );
        })
        .reduce((sum, tx) => sum + tx.amount, 0);

      data.push({
        date: dateStr,
        amount: daySpending,
      });
    }

    setChartData(data);
  }, [transactions]);

  /**
   * Handle successful bank connection
   * Refresh both accounts and transactions data
   */
  function handleBankConnected() {
    refreshAccounts();
    refreshTransactions();
  }

  /**
   * Navigate to transactions page
   */
  function handleViewAllTransactions() {
    router.push('/finance/transactions');
  }

  return (
    <ProtectedRoute>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error State */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error</h3>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  Failed to load dashboard data. Please refresh the page.
                </p>
                <button
                  onClick={() => {
                    refreshAccounts();
                    refreshTransactions();
                  }}
                  className="mt-2 text-sm text-red-800 dark:text-red-300 underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          )}

          {/* Dashboard Content */}
          {!loading && (
            <>
              {/* Empty State - No Accounts */}
              {accounts.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                  <Building2 className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Welcome to OneLedger!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                    Connect your bank account to start tracking your finances.
                    Your data is secure and encrypted.
                  </p>
                  <PlaidLink
                    onSuccess={handleBankConnected}
                    buttonText="Connect Your First Bank Account"
                    variant="primary"
                  />
                </div>
              )}

              {/* Dashboard with Data */}
              {accounts.length > 0 && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Balance */}
                    <DashboardCard
                      title="Total Balance"
                      value={formatCurrency(totalBalance)}
                      icon={<DollarSign className="w-6 h-6" />}
                      subtitle="Across all accounts"
                      variant="default"
                    />

                    {/* Monthly Spending */}
                    <DashboardCard
                      title="Monthly Spending"
                      value={formatCurrency(monthlySpending)}
                      icon={<TrendingDown className="w-6 h-6" />}
                      subtitle="Last 30 days"
                      variant="warning"
                    />

                    {/* Connected Accounts */}
                    <DashboardCard
                      title="Connected Accounts"
                      value={accounts.length}
                      icon={<Building2 className="w-6 h-6" />}
                      subtitle={`${accounts.length} ${
                        accounts.length === 1 ? 'bank' : 'banks'
                      } linked`}
                      variant="success"
                    />
                  </div>

                  {/* Spending Chart */}
                  <SpendingChart
                    data={chartData}
                    title="Spending Over Time (Last 30 Days)"
                    loading={false}
                  />

                  {/* Recent Transactions */}
                  <RecentTransactions
                    transactions={transactions}
                    loading={false}
                    onViewAll={handleViewAllTransactions}
                    limit={10}
                  />

                  {/* Quick Actions */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => router.push('/finance/accounts')}
                        className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                      >
                        <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                        <p className="font-medium text-gray-900 dark:text-white">
                          View All Accounts
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          Manage your connected banks
                        </p>
                      </button>

                      <button
                        onClick={() => router.push('/finance/transactions')}
                        className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                      >
                        <TrendingDown className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
                        <p className="font-medium text-gray-900 dark:text-white">
                          View All Transactions
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          Browse and filter transactions
                        </p>
                      </button>

                      <button
                        onClick={() => router.push('/finance/budgets')}
                        className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                      >
                        <Target className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
                        <p className="font-medium text-gray-900 dark:text-white">
                          Manage Budgets
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          Set and track spending goals
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
      </main>
    </ProtectedRoute>
  );
}
