'use client';

/**
 * Admin Dashboard
 * Overview of platform metrics and recent activity
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  Users,
  Ticket,
  CreditCard,
  TrendingUp,
  ArrowRight,
  Loader2,
  UserPlus,
  Activity,
} from 'lucide-react';

interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalInviteCodes: number;
  activeInviteCodes: number;
  totalAccounts: number;
  totalTransactions: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
}

interface RecentUser {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string | null;
}

interface RecentInvite {
  id: string;
  code: string;
  used_count: number | null;
  max_uses: number | null;
  expires_at: string;
  is_active: boolean | null;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentInvites, setRecentInvites] = useState<RecentInvite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);

      // Fetch all metrics in parallel
      const [
        usersResult,
        invitesResult,
        accountsResult,
        transactionsResult,
      ] = await Promise.all([
        supabase.from('users').select('id, email, full_name, created_at, last_login_at'),
        supabase.from('invite_codes').select('*'),
        supabase.from('accounts').select('id'),
        supabase.from('transactions').select('id'),
      ]);

      const users = usersResult.data || [];
      const invites = invitesResult.data || [];
      const accounts = accountsResult.data || [];
      const transactions = transactionsResult.data || [];

      // Calculate date thresholds
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Calculate metrics
      const activeUsers = users.filter(
        (u) => u.last_login_at && new Date(u.last_login_at) > thirtyDaysAgo
      ).length;

      const newUsersThisWeek = users.filter(
        (u) => u.created_at && new Date(u.created_at) > weekAgo
      ).length;

      const newUsersThisMonth = users.filter(
        (u) => u.created_at && new Date(u.created_at) > monthAgo
      ).length;

      const activeInviteCodes = invites.filter(
        (i) => i.is_active && new Date(i.expires_at) > now
      ).length;

      setMetrics({
        totalUsers: users.length,
        activeUsers,
        totalInviteCodes: invites.length,
        activeInviteCodes,
        totalAccounts: accounts.length,
        totalTransactions: transactions.length,
        newUsersThisWeek,
        newUsersThisMonth,
      });

      // Get recent users (last 5)
      const sortedUsers = [...users]
        .filter((u) => u.created_at)
        .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
        .slice(0, 5);
      setRecentUsers(sortedUsers);

      // Get recent invites (last 5)
      const sortedInvites = [...invites]
        .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
        .slice(0, 5);
      setRecentInvites(sortedInvites);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  // Format relative time
  function formatRelativeTime(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Platform overview and metrics</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {metrics?.totalUsers || 0}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{metrics?.newUsersThisWeek || 0} this week
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Users</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {metrics?.activeUsers || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last 30 days</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Active Invite Codes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Invites</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {metrics?.activeInviteCodes || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                of {metrics?.totalInviteCodes || 0} total
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <Ticket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Transactions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {metrics?.totalTransactions?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {metrics?.totalAccounts || 0} accounts
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Users</h2>
            <Link
              href="/admin/users"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentUsers.length === 0 ? (
              <p className="p-6 text-gray-500 dark:text-gray-400 text-center">No users yet</p>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.full_name || 'No name'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400 dark:text-gray-500">
                    {user.created_at ? formatRelativeTime(user.created_at) : 'N/A'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Invite Codes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Invites</h2>
            <Link
              href="/admin/invites"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentInvites.length === 0 ? (
              <p className="p-6 text-gray-500 dark:text-gray-400 text-center">No invite codes yet</p>
            ) : (
              recentInvites.map((invite) => {
                const isExpired = new Date(invite.expires_at) < new Date();
                const isExhausted = (invite.used_count || 0) >= (invite.max_uses || Infinity);
                const status = !invite.is_active
                  ? 'Inactive'
                  : isExpired
                  ? 'Expired'
                  : isExhausted
                  ? 'Exhausted'
                  : 'Active';
                const statusColor =
                  status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : status === 'Expired'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700';

                return (
                  <div key={invite.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-mono font-medium text-gray-900 dark:text-white">{invite.code}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {invite.used_count || 0} / {invite.max_uses || '∞'} uses
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                      {status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/invites/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Ticket className="w-4 h-4" />
            Create Invite Code
          </Link>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Users className="w-4 h-4" />
            Manage Users
          </Link>
          <Link
            href="/admin/logs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            View Logs
          </Link>
        </div>
      </div>
    </div>
  );
}
