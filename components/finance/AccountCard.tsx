'use client';

/**
 * AccountCard Component
 * Displays a bank account with balance and details
 * Supports both Plaid-connected accounts and virtual cash accounts
 *
 * Usage:
 * <AccountCard account={accountData} />
 */

import React from 'react';
import { Building2, Clock, Wallet, Banknote } from 'lucide-react';
import { formatCurrency, formatRelativeTime, type Account } from '@/lib/supabase';

interface AccountCardProps {
  account: Account;
  onSync?: (accountId: string) => void;
  loading?: boolean;
}

export default function AccountCard({ account, onSync, loading = false }: AccountCardProps) {
  // Check if this is a cash/manual account
  const isCashAccount = account.account_type === 'cash' || account.plaid_item_id === null;

  // Get account type color
  const getAccountTypeColor = (type: string | null) => {
    const colors: Record<string, string> = {
      checking: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400',
      savings: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400',
      credit: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400',
      loan: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400',
      cash: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400',
    };
    return colors[type?.toLowerCase() || ''] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
  };

  const typeColor = getAccountTypeColor(account.account_type);

  return (
    <div className={`rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow ${
      isCashAccount
        ? 'bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-gray-800 border-emerald-200 dark:border-emerald-700'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
            isCashAccount ? 'bg-emerald-100 dark:bg-emerald-900/20' : 'bg-blue-50 dark:bg-blue-900/20'
          }`}>
            {isCashAccount ? (
              <Wallet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {account.account_name || 'Unknown Account'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isCashAccount
                ? 'Manual Transactions'
                : (account.plaid_items?.institution_name || 'Unknown Bank')}
            </p>
          </div>
        </div>

        {/* Account Type Badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColor}`}>
          {isCashAccount ? 'Cash' : (account.account_type || 'Unknown')}
        </span>
      </div>

      {/* Balance */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Balance</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(account.current_balance || 0)}
        </p>

        {account.available_balance !== null &&
         account.available_balance !== account.current_balance && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Available: {formatCurrency(account.available_balance)}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className={`flex items-center justify-between pt-4 border-t ${
        isCashAccount ? 'border-emerald-200 dark:border-emerald-700' : 'border-gray-200 dark:border-gray-700'
      }`}>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          {isCashAccount ? (
            <>
              <Banknote className="w-4 h-4 mr-1" />
              Balance updates with transactions
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 mr-1" />
              Last synced {formatRelativeTime(account.plaid_items?.last_synced_at || account.created_at || new Date().toISOString())}
            </>
          )}
        </div>

        {/* Only show sync button for Plaid accounts */}
        {!isCashAccount && onSync && (
          <button
            onClick={() => onSync(account.id)}
            disabled={loading}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium disabled:text-gray-400 dark:disabled:text-gray-500"
          >
            {loading ? 'Syncing...' : 'Sync Now'}
          </button>
        )}
      </div>
    </div>
  );
}