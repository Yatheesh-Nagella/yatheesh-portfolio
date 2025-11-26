'use client';

/**
 * RecentTransactions Component
 * Displays a list of recent transactions
 * 
 * Usage:
 * <RecentTransactions
 *   transactions={recentTransactions}
 *   onViewAll={() => router.push('/finance/transactions')}
 * />
 */

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/supabase';
import type { Transaction } from '@/types/database.types';

interface RecentTransactionsProps {
  transactions: Transaction[];
  loading?: boolean;
  onViewAll?: () => void;
  limit?: number;
}

export default function RecentTransactions({
  transactions,
  loading = false,
  onViewAll,
  limit = 5,
}: RecentTransactionsProps) {
  // Get category icon/color
  const getCategoryStyle = (category: string | null) => {
    const categories: Record<string, { color: string; emoji: string }> = {
      'Food and Drink': { color: 'text-orange-600', emoji: '🍔' },
      'Shopping': { color: 'text-purple-600', emoji: '🛍️' },
      'Transportation': { color: 'text-blue-600', emoji: '🚗' },
      'Healthcare': { color: 'text-red-600', emoji: '🏥' },
      'Entertainment': { color: 'text-pink-600', emoji: '🎬' },
      'Bills': { color: 'text-yellow-600', emoji: '📄' },
      'Transfer': { color: 'text-green-600', emoji: '💸' },
    };

    return categories[category || 'Other'] || { color: 'text-gray-600', emoji: '💰' };
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No transactions yet</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            Transactions will appear here after connecting a bank account
          </p>
        </div>
      </div>
    );
  }

  const displayTransactions = transactions.slice(0, limit);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center"
          >
            View all
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        {displayTransactions.map((transaction) => {
          const categoryStyle = getCategoryStyle(transaction.category);
          const isNegative = transaction.amount > 0;

          return (
            <div
              key={transaction.id}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {/* Category Icon */}
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl`}>
                  {categoryStyle.emoji}
                </div>
              </div>

              {/* Transaction Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {transaction.merchant_name || 'Unknown'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(transaction.transaction_date)}
                  {transaction.is_pending && (
                    <span className="ml-2 text-yellow-600 dark:text-yellow-400 font-medium">Pending</span>
                  )}
                </p>
              </div>

              {/* Amount */}
              <div className="flex-shrink-0">
                <p
                  className={`text-sm font-semibold ${
                    isNegative ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                  }`}
                >
                  {isNegative ? '-' : '+'}
                  {formatCurrency(Math.abs(transaction.amount))}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Link (Alternative) */}
      {transactions.length > limit && !onViewAll && (
        <div className="mt-4 text-center">
          <Link
            href="/finance/transactions"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            View all {transactions.length} transactions →
          </Link>
        </div>
      )}
    </div>
  );
}