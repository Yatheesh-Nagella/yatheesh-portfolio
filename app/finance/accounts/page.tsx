'use client';

/**
 * Accounts Page
 * Lists all connected bank accounts
 * Allows connecting new accounts
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/finance/ProtectedRoute';
import PlaidLink from '@/components/finance/PlaidLink';
import AccountCard from '@/components/finance/AccountCard';
import { getUserAccounts, type Account } from '@/lib/supabase';
import { Building2, Loader2, ArrowLeft } from 'lucide-react';

export default function AccountsPage() {
  const { user } = useAuth();
  const router = useRouter();

  // State
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/finance/dashboard')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
              </div>

              <PlaidLink
                onSuccess={handleBankConnected}
                buttonText="Connect Account"
                variant="primary"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          )}

          {/* Empty State */}
          {!loading && accounts.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Accounts Connected
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Connect your bank account to start tracking your finances. Your data is secure and encrypted.
              </p>
              <PlaidLink
                onSuccess={handleBankConnected}
                buttonText="Connect Your First Account"
                variant="primary"
              />
            </div>
          )}

          {/* Accounts Grid */}
          {!loading && accounts.length > 0 && (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  {accounts.length} account{accounts.length !== 1 ? 's' : ''} connected
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account) => (
                  <AccountCard key={account.id} account={account} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}