'use client';

/**
 * Admin System Logs Page
 * View activity logs aggregated from platform events
 */

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Search,
  Loader2,
  UserPlus,
  CreditCard,
  Ticket,
  RefreshCw,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Activity,
  Filter,
} from 'lucide-react';

interface ActivityLog {
  id: string;
  type: 'user_signup' | 'invite_used' | 'bank_connected' | 'transaction_sync';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

const ITEMS_PER_PAGE = 20;

export default function LogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    try {
      setLoading(true);

      // Fetch recent activity from multiple tables
      const [usersResult, invitesResult, plaidItemsResult] = await Promise.all([
        supabase
          .from('users')
          .select('id, email, full_name, created_at, invite_code')
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('invite_codes')
          .select('id, code, used_count, created_at')
          .gt('used_count', 0)
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('plaid_items')
          .select('id, institution_name, created_at, last_synced_at, user_id')
          .order('created_at', { ascending: false })
          .limit(50),
      ]);

      const activityLogs: ActivityLog[] = [];

      // User signups
      usersResult.data?.forEach((user) => {
        if (user.created_at) {
          activityLogs.push({
            id: `user-${user.id}`,
            type: 'user_signup',
            title: 'New User Signup',
            description: `${user.full_name || 'User'} (${user.email}) joined the platform`,
            timestamp: user.created_at,
            metadata: { userId: user.id, inviteCode: user.invite_code },
          });
        }
      });

      // Bank connections
      plaidItemsResult.data?.forEach((item) => {
        activityLogs.push({
          id: `plaid-${item.id}`,
          type: 'bank_connected',
          title: 'Bank Connected',
          description: `${item.institution_name || 'Bank'} account was linked`,
          timestamp: item.created_at || '',
          metadata: { plaidItemId: item.id, userId: item.user_id },
        });

        // Also add sync events if different from creation
        if (item.last_synced_at && item.last_synced_at !== item.created_at) {
          activityLogs.push({
            id: `sync-${item.id}`,
            type: 'transaction_sync',
            title: 'Transactions Synced',
            description: `${item.institution_name || 'Bank'} transactions were synced`,
            timestamp: item.last_synced_at,
            metadata: { plaidItemId: item.id },
          });
        }
      });

      // Sort by timestamp
      activityLogs.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setLogs(activityLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await fetchLogs();
    setRefreshing(false);
  }

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    if (typeFilter === 'all') return true;
    return log.type === typeFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Get icon for log type
  function getLogIcon(type: string) {
    switch (type) {
      case 'user_signup':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'invite_used':
        return <Ticket className="w-5 h-5 text-purple-500" />;
      case 'bank_connected':
        return <CreditCard className="w-5 h-5 text-blue-500" />;
      case 'transaction_sync':
        return <RefreshCw className="w-5 h-5 text-orange-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  }

  // Get badge color for log type
  function getTypeBadge(type: string) {
    const styles: Record<string, string> = {
      user_signup: 'bg-green-100 text-green-700',
      invite_used: 'bg-purple-100 text-purple-700',
      bank_connected: 'bg-blue-100 text-blue-700',
      transaction_sync: 'bg-orange-100 text-orange-700',
    };

    const labels: Record<string, string> = {
      user_signup: 'Signup',
      invite_used: 'Invite',
      bank_connected: 'Bank',
      transaction_sync: 'Sync',
    };

    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[type] || 'bg-gray-100 text-gray-700'}`}>
        {labels[type] || type}
      </span>
    );
  }

  // Format timestamp
  function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
          <p className="text-gray-600 mt-1">Track platform activity and events</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Events</p>
          <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">User Signups</p>
          <p className="text-2xl font-bold text-green-600">
            {logs.filter((l) => l.type === 'user_signup').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Bank Connections</p>
          <p className="text-2xl font-bold text-blue-600">
            {logs.filter((l) => l.type === 'bank_connected').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Syncs</p>
          <p className="text-2xl font-bold text-orange-600">
            {logs.filter((l) => l.type === 'transaction_sync').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Events</option>
            <option value="user_signup">User Signups</option>
            <option value="bank_connected">Bank Connections</option>
            <option value="transaction_sync">Transaction Syncs</option>
          </select>
          <span className="text-sm text-gray-500">
            {filteredLogs.length} events
          </span>
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {paginatedLogs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Activity className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>No activity logs found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {paginatedLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  {getLogIcon(log.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{log.title}</p>
                    {getTypeBadge(log.type)}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{log.description}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatTimestamp(log.timestamp)}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(log.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)} of{' '}
              {filteredLogs.length} events
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:text-gray-300 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:text-gray-300 disabled:hover:bg-transparent"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This page shows activity aggregated from platform events.
          A dedicated audit logging system can be added for more comprehensive tracking.
        </p>
      </div>
    </div>
  );
}
