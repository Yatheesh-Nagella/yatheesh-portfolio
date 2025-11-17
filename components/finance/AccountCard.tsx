'use client';

/**
 * AccountCard Component
 * Displays a bank account with balance and details
 * 
 * Usage:
 * <AccountCard account={accountData} />
 */

import React from 'react';
import { Building2, Clock } from 'lucide-react';
import { formatCurrency, formatRelativeTime, type Account } from '@/lib/supabase';

interface AccountCardProps {
  account: Account;
  onSync?: (accountId: string) => void;
  loading?: boolean;
}

export default function AccountCard({ account, onSync, loading = false }: AccountCardProps) {
  // Get account type color
  const getAccountTypeColor = (type: string | null) => {
    const colors: Record<string, string> = {
      checking: 'bg-blue-100 text-blue-800',
      savings: 'bg-green-100 text-green-800',
      credit: 'bg-purple-100 text-purple-800',
      loan: 'bg-red-100 text-red-800',
    };
    return colors[type?.toLowerCase() || ''] || 'bg-gray-100 text-gray-800';
  };

  const typeColor = getAccountTypeColor(account.account_type);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {account.account_name || 'Unknown Account'}
            </h3>
            <p className="text-sm text-gray-500">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(account as any).plaid_items?.institution_name || 'Unknown Bank'}
            </p>
          </div>
        </div>

        {/* Account Type Badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColor}`}>
          {account.account_type || 'Unknown'}
        </span>
      </div>

      {/* Balance */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">Current Balance</p>
        <p className="text-3xl font-bold text-gray-900">
          {formatCurrency(account.current_balance || 0)}
        </p>
        
        {account.available_balance !== null && 
         account.available_balance !== account.current_balance && (
          <p className="text-sm text-gray-500 mt-1">
            Available: {formatCurrency(account.available_balance)}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          Updated {formatRelativeTime(account.created_at || new Date().toISOString())}
        </div>

        {onSync && (
          <button
            onClick={() => onSync(account.id)}
            disabled={loading}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400"
          >
            {loading ? 'Syncing...' : 'Sync Now'}
          </button>
        )}
      </div>
    </div>
  );
}