'use client';

/**
 * Admin Settings Page
 * Platform configuration and information
 */

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Loader2,
  Server,
  Database,
  Shield,
  Clock,
  Globe,
  CheckCircle,
  XCircle,
  ExternalLink,
} from 'lucide-react';

interface PlatformStats {
  totalUsers: number;
  totalAccounts: number;
  totalTransactions: number;
  totalInviteCodes: number;
}

export default function SettingsPage() {
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Platform configuration and information</p>
      </div>

      {/* Platform Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Platform Information</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Platform Name</span>
            </div>
            <span className="font-medium text-gray-900">OneLedger</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Environment</span>
            </div>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-medium">
              {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Server Time</span>
            </div>
            <span className="font-mono text-gray-900">
              {new Date().toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Database Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">Database Statistics</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Accounts</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalAccounts || 0}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalTransactions?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Invite Codes</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalInviteCodes || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-semibold text-gray-900">Service Status</h2>
          </div>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">Supabase Database</span>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Connected</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">Plaid Integration</span>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Active</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">Authentication</span>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Links</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-green-500" />
                <span className="font-medium text-gray-900">Supabase Dashboard</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
            <a
              href="https://dashboard.plaid.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-900">Plaid Dashboard</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-900" />
                <span className="font-medium text-gray-900">Vercel Dashboard</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-500" />
                <span className="font-medium text-gray-900">GitHub Repository</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> Additional settings like email configuration, notification preferences,
          and security settings will be added in future updates.
        </p>
      </div>
    </div>
  );
}
