/* eslint-disable react/no-unescaped-entities */
'use client';

/**
 * Finance Dashboard Page - OneLibro
 * Dark sophisticated theme with premium design
 * Displays balance, spending, and recent activity
 */

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAccounts, useTransactions } from '@/hooks';
import ProtectedRoute from '@/components/finance/ProtectedRoute';
import DashboardLayout from '@/components/finance/DashboardLayout';
import DashboardCard from '@/components/finance/DashboardCard';
import SpendingChart from '@/components/finance/SpendingChart';
import RecentTransactions from '@/components/finance/RecentTransactions';
import PlaidLink from '@/components/finance/PlaidLink';
import { DashboardSkeleton } from '@/components/finance/skeletons';
import {
  DollarSign,
  TrendingDown,
  Building2,
  AlertCircle,
  Target,
  TrendingUp,
  ArrowRight,
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

  /**
   * Calculate total balance across all accounts (memoized)
   */
  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, account) => {
      return sum + (account.current_balance || 0);
    }, 0);
  }, [accounts]);

  /**
   * Calculate monthly spending (memoized to prevent infinite re-renders)
   */
  const monthlySpending = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return transactions
      .filter((tx) => {
        const txDate = new Date(tx.transaction_date);
        return txDate >= thirtyDaysAgo && tx.amount > 0; // Positive amounts are expenses
      })
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  /**
   * Generate spending chart data for last 30 days (memoized)
   */
  const chartData = useMemo(() => {
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

    return data;
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
      <DashboardLayout onBankConnected={handleBankConnected}>
        <div className="max-w-7xl mx-auto">

          {/* Error State */}
          {error && (
            <div className="mb-6 bg-red-900/20 backdrop-blur-sm border border-red-800/50 rounded-xl p-5 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-red-300 mb-1">Error Loading Dashboard</h3>
                <p className="text-sm text-red-400/90">
                  Failed to load dashboard data. Please try again.
                </p>
                <button
                  onClick={() => {
                    refreshAccounts();
                    refreshTransactions();
                  }}
                  className="mt-3 px-4 py-2 bg-red-800/30 hover:bg-red-800/50 text-red-300 text-sm font-medium rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Loading State with Skeleton */}
          {loading && <DashboardSkeleton />}

          {/* Dashboard Content */}
          {!loading && (
            <>
              {/* Empty State - No Accounts */}
              {accounts.length === 0 && (
                <div className="relative overflow-hidden">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 via-transparent to-[#a3a3a3]/5 rounded-2xl" />

                  {/* Content */}
                  <div className="relative bg-[#e5e5e5]/5 backdrop-blur-sm border border-[#a3a3a3]/10 rounded-2xl p-12 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-[#10b981]/15 flex items-center justify-center mx-auto mb-6">
                      <Building2 className="w-10 h-10 text-[#10b981]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-bold text-[#e5e5e5] mb-3">
                      Welcome to OneLibro!
                    </h3>
                    <p className="text-[#a3a3a3] mb-8 max-w-md mx-auto leading-relaxed">
                      Connect your bank account to start tracking your finances.
                      Your data is secure and encrypted end-to-end.
                    </p>
                    <PlaidLink
                      onSuccess={handleBankConnected}
                      buttonText="Connect Your First Bank Account"
                      variant="primary"
                    />
                  </div>
                </div>
              )}

              {/* Dashboard with Data */}
              {accounts.length > 0 && (
                <div className="space-y-8">
                  {/* Stats Cards Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Balance Card */}
                    <div className="relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 to-transparent rounded-xl" />
                      <div className="relative bg-[#e5e5e5]/5 backdrop-blur-sm border border-[#a3a3a3]/10 hover:border-[#10b981]/40 rounded-xl p-6 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-[#10b981]/15 flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-[#10b981]" strokeWidth={2} />
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-medium text-[#a3a3a3] uppercase tracking-wider mb-1">
                              Total Balance
                            </div>
                            <div className="text-2xl lg:text-3xl font-bold text-[#e5e5e5]">
                              {formatCurrency(totalBalance)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-[#737373]">
                          <TrendingUp className="w-4 h-4 mr-1.5 text-[#10b981]" strokeWidth={2} />
                          Across all accounts
                        </div>
                      </div>
                    </div>

                    {/* Monthly Spending Card */}
                    <div className="relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 to-transparent rounded-xl" />
                      <div className="relative bg-[#e5e5e5]/5 backdrop-blur-sm border border-[#a3a3a3]/10 hover:border-[#10b981]/40 rounded-xl p-6 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-[#10b981]/15 flex items-center justify-center">
                            <TrendingDown className="w-6 h-6 text-[#10b981]" strokeWidth={2} />
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-medium text-[#a3a3a3] uppercase tracking-wider mb-1">
                              Monthly Spending
                            </div>
                            <div className="text-2xl lg:text-3xl font-bold text-[#e5e5e5]">
                              {formatCurrency(monthlySpending)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-[#737373]">
                          <TrendingDown className="w-4 h-4 mr-1.5 text-[#10b981]" strokeWidth={2} />
                          Last 30 days
                        </div>
                      </div>
                    </div>

                    {/* Connected Accounts Card */}
                    <div className="relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 to-transparent rounded-xl" />
                      <div className="relative bg-[#e5e5e5]/5 backdrop-blur-sm border border-[#a3a3a3]/10 hover:border-[#10b981]/40 rounded-xl p-6 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-[#10b981]/15 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-[#10b981]" strokeWidth={2} />
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-medium text-[#a3a3a3] uppercase tracking-wider mb-1">
                              Connected Accounts
                            </div>
                            <div className="text-2xl lg:text-3xl font-bold text-[#e5e5e5]">
                              {accounts.length}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-[#737373]">
                          {accounts.length} {accounts.length === 1 ? 'bank' : 'banks'} linked
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spending Chart */}
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-transparent rounded-xl" />
                    <div className="relative bg-[#e5e5e5]/5 backdrop-blur-sm border border-[#a3a3a3]/10 rounded-xl p-6">
                      <SpendingChart
                        data={chartData}
                        title="Spending Over Time (Last 30 Days)"
                        loading={false}
                      />
                    </div>
                  </div>

                  {/* Recent Transactions */}
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-transparent rounded-xl" />
                    <div className="relative bg-[#e5e5e5]/5 backdrop-blur-sm border border-[#a3a3a3]/10 rounded-xl p-6">
                      <RecentTransactions
                        transactions={transactions}
                        loading={false}
                        onViewAll={handleViewAllTransactions}
                        limit={10}
                      />
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 via-[#10b981]/5 to-transparent rounded-xl" />
                    <div className="relative bg-[#e5e5e5]/5 backdrop-blur-sm border border-[#10b981]/20 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-[#10b981]/20 flex items-center justify-center">
                          <ArrowRight className="w-5 h-5 text-[#10b981]" strokeWidth={2} />
                        </div>
                        <h3 className="text-xl font-bold text-[#e5e5e5]">
                          Quick Actions
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* View Accounts */}
                        <button
                          onClick={() => router.push('/finance/accounts')}
                          className="group relative overflow-hidden p-6 bg-[#0f0f0f] border border-[#a3a3a3]/10 hover:border-[#10b981] hover:bg-[#10b981]/5 rounded-xl transition-all text-left"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/0 to-transparent group-hover:from-[#10b981]/10 transition-all" />
                          <div className="relative">
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-12 h-12 rounded-xl bg-[#10b981]/15 group-hover:bg-[#10b981]/25 flex items-center justify-center transition-all">
                                <Building2 className="w-6 h-6 text-[#10b981]" strokeWidth={2} />
                              </div>
                              <ArrowRight className="w-5 h-5 text-[#a3a3a3] group-hover:text-[#10b981] group-hover:translate-x-1 transition-all" strokeWidth={2} />
                            </div>
                            <p className="font-semibold text-[#e5e5e5] mb-2 text-base">
                              View All Accounts
                            </p>
                            <p className="text-sm text-[#a3a3a3] leading-relaxed">
                              Manage your connected banks
                            </p>
                          </div>
                        </button>

                        {/* View Transactions */}
                        <button
                          onClick={() => router.push('/finance/transactions')}
                          className="group relative overflow-hidden p-6 bg-[#0f0f0f] border border-[#a3a3a3]/10 hover:border-[#10b981] hover:bg-[#10b981]/5 rounded-xl transition-all text-left"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/0 to-transparent group-hover:from-[#10b981]/10 transition-all" />
                          <div className="relative">
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-12 h-12 rounded-xl bg-[#10b981]/15 group-hover:bg-[#10b981]/25 flex items-center justify-center transition-all">
                                <TrendingDown className="w-6 h-6 text-[#10b981]" strokeWidth={2} />
                              </div>
                              <ArrowRight className="w-5 h-5 text-[#a3a3a3] group-hover:text-[#10b981] group-hover:translate-x-1 transition-all" strokeWidth={2} />
                            </div>
                            <p className="font-semibold text-[#e5e5e5] mb-2 text-base">
                              View All Transactions
                            </p>
                            <p className="text-sm text-[#a3a3a3] leading-relaxed">
                              Browse and filter transactions
                            </p>
                          </div>
                        </button>

                        {/* Manage Budgets */}
                        <button
                          onClick={() => router.push('/finance/budgets')}
                          className="group relative overflow-hidden p-6 bg-[#0f0f0f] border border-[#a3a3a3]/10 hover:border-[#10b981] hover:bg-[#10b981]/5 rounded-xl transition-all text-left"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/0 to-transparent group-hover:from-[#10b981]/10 transition-all" />
                          <div className="relative">
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-12 h-12 rounded-xl bg-[#10b981]/15 group-hover:bg-[#10b981]/25 flex items-center justify-center transition-all">
                                <Target className="w-6 h-6 text-[#10b981]" strokeWidth={2} />
                              </div>
                              <ArrowRight className="w-5 h-5 text-[#a3a3a3] group-hover:text-[#10b981] group-hover:translate-x-1 transition-all" strokeWidth={2} />
                            </div>
                            <p className="font-semibold text-[#e5e5e5] mb-2 text-base">
                              Manage Budgets
                            </p>
                            <p className="text-sm text-[#a3a3a3] leading-relaxed">
                              Set and track spending goals
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
