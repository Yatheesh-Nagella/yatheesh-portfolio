'use client';

/**
 * Admin Settings Page
 * Platform configuration and information
 */

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAdminTheme } from '@/contexts/AdminThemeContext';
import {
  Loader2,
  Server,
  Database,
  Shield,
  Clock,
  Globe,
  CheckCircle,
  ExternalLink,
  Moon,
  Sun,
} from 'lucide-react';

interface PlatformStats {
  totalUsers: number;
  totalAccounts: number;
  totalTransactions: number;
  totalInviteCodes: number;
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useAdminTheme();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      setLoading(true);

      const [usersResult, accountsResult, transactionsResult, invitesResult] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('accounts').select('id', { count: 'exact', head: true }),
        supabase.from('transactions').select('id', { count: 'exact', head: true }),
        supabase.from('invite_codes').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        totalUsers: usersResult.count || 0,
        totalAccounts: accountsResult.count || 0,
        totalTransactions: transactionsResult.count || 0,
        totalInviteCodes: invitesResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Platform configuration and information</p>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Platform Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Platform Information</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">Platform Name</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white">OneLedger</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">Environment</span>
            </div>
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded text-sm font-medium">
              {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">Server Time</span>
            </div>
            <span className="font-mono text-gray-900 dark:text-white">
              {new Date().toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Database Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Database Statistics</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalUsers || 0}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Accounts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalAccounts || 0}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalTransactions?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Invite Codes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalInviteCodes || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500 dark:text-green-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Service Status</h2>
          </div>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700 dark:text-gray-300">Supabase Database</span>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Connected</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700 dark:text-gray-300">Plaid Integration</span>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Active</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700 dark:text-gray-300">Authentication</span>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Links</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-green-500 dark:text-green-400" />
                <span className="font-medium text-gray-900 dark:text-white">Supabase Dashboard</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </a>
            <a
              href="https://dashboard.plaid.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <span className="font-medium text-gray-900 dark:text-white">Plaid Dashboard</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </a>
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-900 dark:text-gray-300" />
                <span className="font-medium text-gray-900 dark:text-white">Vercel Dashboard</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                <span className="font-medium text-gray-900 dark:text-white">GitHub Repository</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </a>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-900/50">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>Note:</strong> Additional settings like email configuration, notification preferences,
          and security settings will be added in future updates.
        </p>
      </div>
    </div>
  );
}
