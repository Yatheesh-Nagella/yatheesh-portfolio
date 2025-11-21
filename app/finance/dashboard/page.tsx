'use client';

/**
 * Finance Dashboard Page
 * Main landing page showing financial overview
 * Displays balance, spending, and recent activity
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/finance/ProtectedRoute';
import DashboardCard from '@/components/finance/DashboardCard';
import SpendingChart from '@/components/finance/SpendingChart';
import RecentTransactions from '@/components/finance/RecentTransactions';
import PlaidLink from '@/components/finance/PlaidLink';
import {
  getUserAccounts,
  getUserTransactions,
  type Account,
  type Transaction,
} from '@/lib/supabase';
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
  const { user, signOut } = useAuth();
  const router = useRouter();

  // State
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [chartData, setChartData] = useState<{ date: string; amount: number }[]>([]);

  /**
   * Calculate total balance across all accounts
   */
  const totalBalance = accounts.reduce((sum, account) => {
    return sum + (account.current_balance || 0);
  }, 0);

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
   * Fetch dashboard data
   */
  async function fetchDashboardData() {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch accounts
      const userAccounts = await getUserAccounts(user.id);
      setAccounts(userAccounts);

      // Fetch transactions (last 90 days for better data)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const userTransactions = await getUserTransactions(user.id, {
        startDate: ninetyDaysAgo.toISOString().split('T')[0],
        limit: 500,
      });
      setTransactions(userTransactions);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /**
   * Handle successful bank connection
   */
  function handleBankConnected() {
    fetchDashboardData();
  }

  /**
   * Navigate to transactions page
   */
  function handleViewAllTransactions() {
    router.push('/finance/transactions');
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  OneLedger Finance
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.full_name || 'User'}
                </p>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={() => router.push('/finance/dashboard')}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => router.push('/finance/accounts')}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Accounts
                </button>
                <button
                  onClick={() => router.push('/finance/transactions')}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Transactions
                </button>
                <button
                  onClick={() => router.push('/finance/budgets')}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Budgets
                </button>
                <button
                  onClick={() => router.push('/finance/settings')}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Settings
                </button>
                <PlaidLink
                  onSuccess={handleBankConnected}
                  buttonText="Connect"
                  variant="primary"
                />
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to sign out?')) {
                      signOut();
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Sign Out
                </button>
              </div>

              {/* Mobile Navigation */}
              <div className="flex md:hidden items-center space-x-2">
                <PlaidLink
                  onSuccess={handleBankConnected}
                  buttonText="+"
                  variant="primary"
                />
                <button
                  onClick={() => router.push('/finance/settings')}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error State */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Welcome to OneLedger!
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
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
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => router.push('/finance/accounts')}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <Building2 className="w-6 h-6 text-blue-600 mb-2" />
                        <p className="font-medium text-gray-900">
                          View All Accounts
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Manage your connected banks
                        </p>
                      </button>

                      <button
                        onClick={() => router.push('/finance/transactions')}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <TrendingDown className="w-6 h-6 text-purple-600 mb-2" />
                        <p className="font-medium text-gray-900">
                          View All Transactions
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Browse and filter transactions
                        </p>
                      </button>

                      <button
                        onClick={() => router.push('/finance/budgets')}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <Target className="w-6 h-6 text-green-600 mb-2" />
                        <p className="font-medium text-gray-900">
                          Manage Budgets
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
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
      </div>
    </ProtectedRoute>
  );
}
