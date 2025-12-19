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
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#10b981] mx-auto" />
          <p className="mt-4 text-[#a3a3a3]">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#e5e5e5]">
            Settings
          </h1>
          <p className="text-[#a3a3a3] mt-2">
            Manage your account and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Section */}
          <section className="relative overflow-hidden lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-transparent rounded-lg" />
            <div className="relative bg-[#e5e5e5]/5 backdrop-blur-sm border border-[#a3a3a3]/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#e5e5e5] mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-[#10b981]" />
                Profile Information
              </h2>

              <div className="space-y-4">
                {/* Full Name */}
                <div className="flex items-start justify-between py-3 border-b border-[#a3a3a3]/10">
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-[#737373] mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-[#a3a3a3]">
                        Full Name
                      </p>
                      <p className="text-base text-[#e5e5e5] mt-1">
                        {user.full_name || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start justify-between py-3 border-b border-[#a3a3a3]/10">
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-[#737373] mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-[#a3a3a3]">Email</p>
                      <p className="text-base text-[#e5e5e5] mt-1">{user.email}</p>
                    </div>
                  </div>
                  {user.is_admin && (
                    <span className="px-2 py-1 bg-[#10b981]/20 text-[#10b981] rounded-full text-xs font-medium">
                      Admin
                    </span>
                  )}
                </div>

                {/* Member Since */}
                <div className="flex items-start py-3 border-b border-[#a3a3a3]/10">
                  <Calendar className="w-5 h-5 text-[#737373] mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-[#a3a3a3]">
                      Member Since
                    </p>
                    <p className="text-base text-[#e5e5e5] mt-1">
                      {user.created_at ? formatDate(user.created_at) : 'N/A'}
                    </p>
                    <p className="text-sm text-[#737373] mt-0.5">
                      {user.created_at ? formatRelativeTime(user.created_at) : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Last Login */}
                {user.last_login_at && (
                  <div className="flex items-start py-3">
                    <Calendar className="w-5 h-5 text-[#737373] mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-[#a3a3a3]">
                        Last Login
                      </p>
                      <p className="text-base text-[#e5e5e5] mt-1">
                        {formatDate(user.last_login_at)}
                      </p>
                      <p className="text-sm text-[#737373] mt-0.5">
                        {formatRelativeTime(user.last_login_at)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Invite Information */}
          {user.invite_code && (
            <section className="relative overflow-hidden lg:col-span-1 flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-transparent rounded-lg" />
              <div className="relative bg-[#e5e5e5]/5 backdrop-blur-sm border border-[#a3a3a3]/10 rounded-lg p-6 flex-grow">
                <h2 className="text-xl font-semibold text-[#e5e5e5] mb-6 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-[#10b981]" />
                  Invite Information
                </h2>

                <div className="space-y-4">
                  {/* Invite Code */}
                  <div className="flex items-start py-3 border-b border-[#a3a3a3]/10">
                    <Shield className="w-5 h-5 text-[#737373] mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-[#a3a3a3]">
                        Invite Code Used
                      </p>
                      <p className="text-base text-[#e5e5e5] mt-1 font-mono">
                        {user.invite_code}
                      </p>
                    </div>
                  </div>

                  {/* Invite Expiration */}
                  {user.invite_expires_at && (
                    <div className="flex items-start py-3 border-b border-[#a3a3a3]/10">
                      <Calendar className="w-5 h-5 text-[#737373] mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-[#a3a3a3]">
                          Invite Expiration
                        </p>
                        <p className="text-base text-[#e5e5e5] mt-1">
                          {formatDate(user.invite_expires_at)}
                        </p>
                        {new Date(user.invite_expires_at) < new Date() ? (
                          <p className="text-sm text-red-400 mt-0.5">Expired</p>
                        ) : (
                          <p className="text-sm text-[#10b981] mt-0.5">Active</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Account Status */}
                  <div className="flex items-start py-3 pb-6">
                    <CheckCircle className="w-5 h-5 text-[#737373] mt-0.5 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#a3a3a3] mb-3">
                        Account Status
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1.5 bg-[#10b981]/20 text-[#10b981] rounded-full text-xs font-medium">
                          Active
                        </span>
                        {user.is_admin && (
                          <span className="px-3 py-1.5 bg-purple-900/30 text-purple-300 rounded-full text-xs font-medium">
                            Administrator
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#737373] mt-3 leading-relaxed">
                        Your account has full access to all OneLibro features and services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Connected Banks */}
          <section className={`relative overflow-hidden ${plaidItems.length <= 2 ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-transparent rounded-lg" />
            <div className="relative bg-[#e5e5e5]/5 backdrop-blur-sm border border-[#a3a3a3]/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#e5e5e5] mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-[#10b981]" />
                Connected Banks
                {plaidItems.length > 0 && (
                  <span className="ml-auto text-sm font-normal text-[#a3a3a3]">
                    {plaidItems.length} {plaidItems.length === 1 ? 'Bank' : 'Banks'}
                  </span>
                )}
              </h2>

              {plaidItems.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-[#737373] mx-auto mb-3" />
                  <p className="text-[#a3a3a3]">No bank accounts connected</p>
                  <button
                    onClick={() => router.push('/finance/dashboard')}
                    className="mt-4 text-[#10b981] hover:text-[#10b981]/80 font-medium text-sm transition-colors"
                  >
                    Connect a bank account
                  </button>
                </div>
              ) : (
                <div className={`grid gap-4 ${plaidItems.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                  {plaidItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-[#a3a3a3]/10 rounded-lg hover:bg-[#e5e5e5]/5 transition-colors gap-3"
                    >
                      <div className="flex items-start sm:items-center flex-1 gap-3">
                        <CreditCard className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5 sm:mt-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#e5e5e5] truncate">
                            {item.institution_name}
                          </p>
                          <p className="text-sm text-[#a3a3a3]">
                            Connected {item.created_at ? formatRelativeTime(item.created_at) : 'recently'}
                          </p>
                          {item.last_synced_at && (
                            <p className="text-xs text-[#737373] mt-0.5">
                              Last synced {formatRelativeTime(item.last_synced_at)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status Badge and Actions */}
                      <div className="flex items-center gap-3 justify-between sm:justify-end">
                        {item.status === 'active' ? (
                          <span className="flex items-center px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-xs font-medium">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </span>
                        ) : item.status === 'error' ? (
                          <span className="flex items-center px-3 py-1 bg-red-900/30 text-red-300 rounded-full text-xs font-medium">
                            <XCircle className="w-3 h-3 mr-1" />
                            Error
                          </span>
                        ) : (
                          <span className="flex items-center px-3 py-1 bg-yellow-900/30 text-yellow-300 rounded-full text-xs font-medium">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {item.status}
                          </span>
                        )}

                        {/* Unlink Button */}
                        <button
                          onClick={() => handleUnlinkAccount(item.id, item.institution_name || 'this bank')}
                          disabled={unlinkingItemId === item.id}
                          className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>
          </section>

          {/* Danger Zone */}
          <section className="relative overflow-hidden lg:col-span-2">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent rounded-lg" />
            <div className="relative bg-[#e5e5e5]/5 backdrop-blur-sm border border-red-900/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-400 mb-6 flex items-center">
                <LogOut className="w-5 h-5 mr-2" />
                Account Actions
              </h2>

              <div className="space-y-4">
                {/* Sign Out */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-[#a3a3a3]/10 rounded-lg gap-4">
                  <div>
                    <p className="font-semibold text-[#e5e5e5]">Sign Out</p>
                    <p className="text-sm text-[#a3a3a3] mt-1">
                      Sign out of your OneLibro account
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center whitespace-nowrap"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>

                {/* Account Info */}
                <div className="p-4 bg-[#0f0f0f] rounded-lg border border-[#a3a3a3]/10">
                  <p className="text-sm text-[#a3a3a3]">
                    <strong>Account ID:</strong>{' '}
                    <span className="font-mono text-xs break-all">{user.id}</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="lg:col-span-2 text-center py-6 border-t border-[#a3a3a3]/10">
            <p className="text-sm text-[#a3a3a3] font-medium">
              OneLibro - Financial Management Platform
            </p>
            <p className="text-xs text-[#737373] mt-2">
              Need assistance? Contact our support team for help.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
