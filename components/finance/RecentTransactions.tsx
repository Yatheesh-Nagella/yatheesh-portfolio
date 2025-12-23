/* eslint-disable react/no-unescaped-entities */
'use client';

/**
 * RecentTransactions Component - OneLibro
 * Dark sophisticated theme with premium design
 * Displays a list of recent transactions
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
      'Food and Drink': { color: 'text-[#10b981]', emoji: '🍔' },
      'Shopping': { color: 'text-[#a3a3a3]', emoji: '🛍️' },
      'Transportation': { color: 'text-[#10b981]', emoji: '🚗' },
      'Healthcare': { color: 'text-red-400', emoji: '🏥' },
      'Entertainment': { color: 'text-[#a3a3a3]', emoji: '🎬' },
      'Bills': { color: 'text-[#e5e5e5]', emoji: '📄' },
      'Transfer': { color: 'text-[#10b981]', emoji: '💸' },
    };

    return categories[category || 'Other'] || { color: 'text-[#e5e5e5]', emoji: '💰' };
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <h3 className="text-xl font-bold text-[#e5e5e5] mb-6">Recent Transactions</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-[#e5e5e5]/5">
              <div className="w-10 h-10 bg-[#e5e5e5]/10 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-[#e5e5e5]/10 rounded w-1/3 mb-2 animate-pulse"></div>
                <div className="h-3 bg-[#e5e5e5]/10 rounded w-1/4 animate-pulse"></div>
              </div>
              <div className="h-4 bg-[#e5e5e5]/10 rounded w-16 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!transactions || transactions.length === 0) {
    return (
      <div>
        <h3 className="text-xl font-bold text-[#e5e5e5] mb-6">Recent Transactions</h3>
        <div className="text-center py-12 rounded-xl bg-[#e5e5e5]/5 border border-[#a3a3a3]/10">
          <div className="w-16 h-16 rounded-full bg-[#10b981]/15 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💳</span>
          </div>
          <p className="text-[#737373] text-sm mb-1">No transactions yet</p>
          <p className="text-[#737373]/70 text-xs">
            Transactions will appear here after connecting a bank account
          </p>
        </div>
      </div>
    );
  }

  const displayTransactions = transactions.slice(0, limit);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[#e5e5e5]">Recent Transactions</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="group inline-flex items-center gap-2 text-sm font-medium text-[#10b981] hover:text-[#10b981]/80 transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {displayTransactions.map((transaction) => {
          const categoryStyle = getCategoryStyle(transaction.category);
          const isNegative = transaction.amount > 0;

          return (
            <div
              key={transaction.id}
              className="flex items-center space-x-4 p-4 rounded-xl bg-[#e5e5e5]/5 hover:bg-[#e5e5e5]/10 border border-[#a3a3a3]/5 hover:border-[#a3a3a3]/20 transition-all group"
            >
              {/* Category Icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-[#e5e5e5]/10 group-hover:bg-[#e5e5e5]/15 flex items-center justify-center text-2xl transition-colors">
                  {categoryStyle.emoji}
                </div>
              </div>

              {/* Transaction Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#e5e5e5] truncate mb-1">
                  {transaction.merchant_name || 'Unknown'}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#a3a3a3]">
                  <span>{formatDate(transaction.transaction_date)}</span>
                  {transaction.is_pending && (
                    <span className="px-2 py-0.5 bg-yellow-900/20 text-yellow-400 rounded-md font-medium">
                      Pending
                    </span>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div className="flex-shrink-0">
                <p
                  className={`text-sm font-bold ${
                    isNegative ? 'text-red-400' : 'text-green-400'
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
        <div className="mt-6 text-center">
          <Link
            href="/finance/transactions"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#10b981] hover:text-[#10b981]/80 transition-colors group"
          >
            View all {transactions.length} transactions
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
          </Link>
        </div>
      )}
    </div>
  );
}
