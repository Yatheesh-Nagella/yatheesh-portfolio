'use client';

/**
 * Accounts Page
 * Lists all connected bank accounts
 * Allows connecting new accounts
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/finance/ProtectedRoute';
import PlaidLink from '@/components/finance/PlaidLink';
import AccountCard from '@/components/finance/AccountCard';
import { getUserAccounts, supabase, type Account } from '@/lib/supabase';
import { Building2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccountsPage() {
  const { user } = useAuth();

  // State
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingAccountId, setSyncingAccountId] = useState<string | null>(null);

  /**
   * Fetch user accounts
   */
  async function fetchAccounts() {
    if (!user) return;

    try {
      setLoading(true);
      const userAccounts = await getUserAccounts(user.id);
      setAccounts(userAccounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  }

  // Fetch accounts on mount
  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /**
   * Handle bank connection success
   */
  function handleBankConnected() {
    fetchAccounts();
  }

  /**
   * Handle sync account transactions
   */
  async function handleSyncAccount(accountId: string) {
    try {
      setSyncingAccountId(accountId);

      // Find the account to get plaid_item_id
      const account = accounts.find((a) => a.id === accountId);
      if (!account) {
        toast.error('Account not found');
        return;
      }

      // Get plaid_item_id from the account (cash accounts don't have this)
      const plaidItemId = account.plaid_item_id;
      if (!plaidItemId) {
        toast.error('Unable to sync: this is a cash account');
        return;
      }

      // Get Supabase session token for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Authentication required');
        return;
      }

      // Call sync API with Bearer token authentication
      const response = await fetch('/api/plaid/sync-transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ itemId: plaidItemId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sync failed');
      }

      // Show success message
      const added = data.added || 0;
      const modified = data.modified || 0;
      const removed = data.removed || 0;

      if (added === 0 && modified === 0 && removed === 0) {
        toast.success('Account is up to date!');
      } else {
        toast.success(`Synced! Added: ${added}, Modified: ${modified}`);
      }

      // Refresh accounts to get updated balances
      fetchAccounts();
    } catch (error) {
      console.error('Error syncing account:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to sync transactions'
      );
    } finally {
      setSyncingAccountId(null);
    }
  }

  return (
    <ProtectedRoute>
      {/* Main Content */}
      <main className="min-h-screen bg-[#1a1a1a] px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#e5e5e5]">Accounts</h2>
          <p className="text-[#a3a3a3] mt-2">
            Manage your connected bank accounts
          </p>
        </div>
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#10b981] animate-spin" />
            </div>
          )}

          {/* Empty State */}
          {!loading && accounts.length === 0 && (
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 via-transparent to-[#a3a3a3]/5 rounded-xl" />
              <div className="relative bg-[#e5e5e5]/5 backdrop-blur-sm border border-[#a3a3a3]/10 rounded-xl p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#10b981]/15 flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-10 h-10 text-[#10b981]" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-[#e5e5e5] mb-3">
                  No Accounts Connected
                </h3>
                <p className="text-[#a3a3a3] mb-8 max-w-md mx-auto leading-relaxed">
                  Connect your bank account to start tracking your finances. Your data is secure and encrypted.
                </p>
                <PlaidLink
                  onSuccess={handleBankConnected}
                  buttonText="Connect Your First Account"
                  variant="primary"
                />
              </div>
            </div>
          )}

          {/* Accounts Grid */}
          {!loading && accounts.length > 0 && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-[#a3a3a3]">
                  {accounts.length} account{accounts.length !== 1 ? 's' : ''} connected
                </p>
                <PlaidLink
                  onSuccess={handleBankConnected}
                  buttonText="Connect Another Account"
                  variant="secondary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onSync={handleSyncAccount}
                    loading={syncingAccountId === account.id}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}