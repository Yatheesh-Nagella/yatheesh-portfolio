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
      checking: 'bg-[#10b981]/15 text-[#10b981]',
      savings: 'bg-[#10b981]/15 text-[#10b981]',
      credit: 'bg-purple-900/20 text-purple-400',
      loan: 'bg-red-900/20 text-red-400',
      cash: 'bg-[#10b981]/15 text-[#10b981]',
    };
    return colors[type?.toLowerCase() || ''] || 'bg-[#a3a3a3]/15 text-[#a3a3a3]';
  };

  const typeColor = getAccountTypeColor(account.account_type);

  return (
    <div className={`relative overflow-hidden rounded-xl border p-6 hover:border-[#10b981]/40 transition-all ${
      isCashAccount
        ? 'bg-[#e5e5e5]/5 backdrop-blur-sm border-[#10b981]/20'
        : 'bg-[#e5e5e5]/5 backdrop-blur-sm border-[#a3a3a3]/10'
    }`}>
      {/* Gradient Background */}
      <div className={`absolute inset-0 ${
        isCashAccount
          ? 'bg-gradient-to-br from-[#10b981]/10 to-transparent'
          : 'bg-gradient-to-br from-[#a3a3a3]/5 to-transparent'
      }`} />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
              isCashAccount ? 'bg-[#10b981]/15' : 'bg-[#10b981]/15'
            }`}>
              {isCashAccount ? (
                <Wallet className="w-6 h-6 text-[#10b981]" />
              ) : (
                <Building2 className="w-6 h-6 text-[#10b981]" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#e5e5e5]">
                {account.account_name || 'Unknown Account'}
              </h3>
              <p className="text-sm text-[#737373]">
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
          <p className="text-sm text-[#a3a3a3] mb-1">Current Balance</p>
          <p className="text-3xl font-bold text-[#e5e5e5]">
            {formatCurrency(account.current_balance || 0)}
          </p>

          {account.available_balance !== null &&
           account.available_balance !== account.current_balance && (
            <p className="text-sm text-[#737373] mt-1">
              Available: {formatCurrency(account.available_balance)}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between pt-4 border-t ${
          isCashAccount ? 'border-[#10b981]/20' : 'border-[#a3a3a3]/10'
        }`}>
          <div className="flex items-center text-xs text-[#737373]">
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
              className="text-sm text-[#10b981] hover:text-[#10b981]/80 font-medium disabled:text-[#737373] disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Syncing...' : 'Sync Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}