'use client';

/**
 * Settings Page
 * User profile, account settings, and preferences
 * Mobile responsive
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getUserPlaidItems, supabase } from '@/lib/supabase';
import type { PlaidItem } from '@/lib/supabase';
import { formatDate, formatRelativeTime } from '@/lib/supabase';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Shield,
  CreditCard,
  LogOut,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [plaidItems, setPlaidItems] = useState<PlaidItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlinkingItemId, setUnlinkingItemId] = useState<string | null>(null);

  /**
   * Fetch Plaid connections
   */
  useEffect(() => {
    async function fetchData() {
      if (!user) {
        router.push('/finance/login');
        return;
      }

      try {
        setLoading(true);
        const items = await getUserPlaidItems(user.id);
        setPlaidItems(items);
      } catch (error) {
        console.error('Error fetching settings data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, router]);

  /**
   * Handle sign out
   */
  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      try {
        await signOut();
        router.push('/finance/login');
      } catch (error) {
        toast.error('Error signing out: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };

  /**
   * Handle unlink account
   */
  const handleUnlinkAccount = async (itemId: string, institutionName: string) => {
    if (!confirm(`Are you sure you want to unlink ${institutionName}? This will remove all associated accounts and transactions.`)) {
      return;
    }

    try {
      setUnlinkingItemId(itemId);

      // Get session token
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch('/api/plaid/unlink-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ itemId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to unlink account');
      }

      // Remove from local state
      setPlaidItems(items => items.filter(item => item.id !== itemId));
      toast.success('Account unlinked successfully!');
    } catch (error) {
      console.error('Error unlinking account:', error);
      toast.error('Error: ' + (error instanceof Error ? error.message : 'Failed to unlink account'));
    } finally {
      setUnlinkingItemId(null);
    }
  };

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/finance/dashboard')}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your account and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Profile Information
            </h2>

            <div className="space-y-4">
              {/* Full Name */}
              <div className="flex items-start justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-start">
                  <User className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Full Name
                    </p>
                    <p className="text-base text-gray-900 dark:text-white mt-1">
                      {user.full_name || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-base text-gray-900 dark:text-white mt-1">{user.email}</p>
                  </div>
                </div>
                {user.is_admin && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                    Admin
                  </span>
                )}
              </div>

              {/* Member Since */}
              <div className="flex items-start py-3 border-b border-gray-100 dark:border-gray-700">
                <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Member Since
                  </p>
                  <p className="text-base text-gray-900 dark:text-white mt-1">
                    {user.created_at ? formatDate(user.created_at) : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {user.created_at ? formatRelativeTime(user.created_at) : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Last Login */}
              {user.last_login_at && (
                <div className="flex items-start py-3">
                  <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Last Login
                    </p>
                    <p className="text-base text-gray-900 dark:text-white mt-1">
                      {formatDate(user.last_login_at)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {formatRelativeTime(user.last_login_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Invite Information */}
          {user.invite_code && (
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Invite Information
              </h2>

              <div className="space-y-4">
                {/* Invite Code */}
                <div className="flex items-start py-3 border-b border-gray-100 dark:border-gray-700">
                  <Shield className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Invite Code Used
                    </p>
                    <p className="text-base text-gray-900 dark:text-white mt-1 font-mono">
                      {user.invite_code}
                    </p>
                  </div>
                </div>

                {/* Invite Expiration */}
                {user.invite_expires_at && (
                  <div className="flex items-start py-3">
                    <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Invite Expiration
                      </p>
                      <p className="text-base text-gray-900 dark:text-white mt-1">
                        {formatDate(user.invite_expires_at)}
                      </p>
                      {new Date(user.invite_expires_at) < new Date() ? (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-0.5">Expired</p>
                      ) : (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-0.5">Active</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Connected Banks */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Connected Banks
            </h2>

            {plaidItems.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-300">No bank accounts connected</p>
                <button
                  onClick={() => router.push('/finance/dashboard')}
                  className="mt-4 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-medium text-sm"
                >
                  Connect a bank account
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {plaidItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center flex-1">
                      <CreditCard className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {item.institution_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Connected {item.created_at ? formatRelativeTime(item.created_at) : 'recently'}
                        </p>
                        {item.last_synced_at && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            Last synced {formatRelativeTime(item.last_synced_at)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status Badge and Actions */}
                    <div className="flex items-center gap-3">
                      {item.status === 'active' ? (
                        <span className="flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </span>
                      ) : item.status === 'error' ? (
                        <span className="flex items-center px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                          <XCircle className="w-3 h-3 mr-1" />
                          Error
                        </span>
                      ) : (
                        <span className="flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-medium">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {item.status}
                        </span>
                      )}

                      {/* Unlink Button */}
                      <button
                        onClick={() => handleUnlinkAccount(item.id, item.institution_name || 'this bank')}
                        disabled={unlinkingItemId === item.id}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Unlink account"
                      >
                        {unlinkingItemId === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Danger Zone */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-red-200 dark:border-red-900/50 p-6">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-6 flex items-center">
              <LogOut className="w-5 h-5 mr-2" />
              Account Actions
            </h2>

            <div className="space-y-4">
              {/* Sign Out */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Sign Out</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Sign out of your OneLibro account
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>

              {/* Account Info */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Account ID:</strong>{' '}
                  <span className="font-mono text-xs">{user.id}</span>
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 py-4">
            <p>OneLibro Phase 2 - Financial Management Platform</p>
            <p className="mt-1">
              Need help? Contact support or visit the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
