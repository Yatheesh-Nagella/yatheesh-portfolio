'use client';

/**
 * Admin System Logs Page
 * View activity logs aggregated from platform events
 */

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Loader2,
  UserPlus,
  RefreshCw,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Activity,
  Filter,
  Trash2,
} from 'lucide-react';

interface ActivityLog {
  id: string;
  admin_user_id: string;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  admin_user?: {
    email: string;
    full_name: string | null;
  } | null;
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

      // Fetch admin audit logs (table exists but types need regeneration)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('admin_audit_logs')
        .select(`
          *,
          admin_user:admin_users!admin_audit_logs_admin_user_id_fkey(email, full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching logs:', error);
        setLogs([]);
        return;
      }

      setLogs((data || []) as unknown as ActivityLog[]);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLogs([]);
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
    return log.action === typeFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Get icon for log action
  function getLogIcon(action: string) {
    switch (action) {
      case 'login':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'totp_enabled':
        return <Activity className="w-5 h-5 text-blue-500" />;
      case 'user_deleted':
        return <Trash2 className="w-5 h-5 text-red-500" />;
      case 'logout':
        return <Activity className="w-5 h-5 text-gray-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  }

  // Get badge color for log action
  function getActionBadge(action: string) {
    const styles: Record<string, string> = {
      login: 'bg-green-100 text-green-700',
      logout: 'bg-gray-100 text-gray-700',
      totp_enabled: 'bg-blue-100 text-blue-700',
      totp_disabled: 'bg-orange-100 text-orange-700',
      user_deleted: 'bg-red-100 text-red-700',
      invite_created: 'bg-purple-100 text-purple-700',
    };

    const labels: Record<string, string> = {
      login: 'Login',
      logout: 'Logout',
      totp_enabled: 'TOTP Enabled',
      totp_disabled: 'TOTP Disabled',
      user_deleted: 'User Deleted',
      invite_created: 'Invite Created',
    };

    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[action] || 'bg-gray-100 text-gray-700'}`}>
        {labels[action] || action}
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Logs</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Track platform activity and events</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Events</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{logs.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">Logins</p>
          <p className="text-2xl font-bold text-green-600">
            {logs.filter((l) => l.action === 'login').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">TOTP Events</p>
          <p className="text-2xl font-bold text-blue-600">
            {logs.filter((l) => l.action === 'totp_enabled' || l.action === 'totp_disabled').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">User Deletions</p>
          <p className="text-2xl font-bold text-red-600">
            {logs.filter((l) => l.action === 'user_deleted').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Events</option>
            <option value="login">Logins</option>
            <option value="logout">Logouts</option>
            <option value="totp_enabled">TOTP Enabled</option>
            <option value="totp_disabled">TOTP Disabled</option>
            <option value="user_deleted">User Deletions</option>
            <option value="invite_created">Invite Created</option>
          </select>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredLogs.length} events
          </span>
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {paginatedLogs.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <Activity className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p>No activity logs found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {paginatedLogs.map((log) => {
              const adminName = log.admin_user?.full_name || log.admin_user?.email || 'Unknown Admin';
              const actionText = log.action.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

              return (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getLogIcon(log.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-white">{adminName}</p>
                      {getActionBadge(log.action)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                      {actionText}
                      {log.resource_type && ` on ${log.resource_type}`}
                      {log.ip_address && ` from ${log.ip_address}`}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {formatTimestamp(log.created_at)}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {new Date(log.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)} of{' '}
              {filteredLogs.length} events
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:text-gray-300 dark:disabled:text-gray-600 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:text-gray-300 dark:disabled:text-gray-600 disabled:hover:bg-transparent"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-400">
          <strong>Note:</strong> This page shows activity aggregated from platform events.
          A dedicated audit logging system can be added for more comprehensive tracking.
        </p>
      </div>
    </div>
  );
}
