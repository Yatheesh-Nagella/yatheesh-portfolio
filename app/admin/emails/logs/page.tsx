'use client';

/**
 * Admin Email Logs Page
 * View email delivery logs with filters and search
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  Search,
  Loader2,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  Download,
  Filter,
  Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EmailLog {
  id: string;
  user_id: string | null;
  recipient_email: string;
  template_key: string | null;
  subject: string;
  category: 'transactional' | 'marketing' | 'notification' | 'system';
  resend_email_id: string | null;
  status: 'pending' | 'sent' | 'delivered' | 'bounced' | 'failed' | 'complained' | null;
  error_message: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  bounced_at: string | null;
  created_at: string | null;
}

const ITEMS_PER_PAGE = 20;

export default function EmailLogsPage() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'delivered' | 'bounced' | 'failed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'transactional' | 'marketing' | 'notification'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    try {
      setLoading(true);

      let query = supabase
        .from('email_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000); // Fetch last 1000 logs

      const { data, error } = await query;

      if (error) throw error;

      setLogs((data || []) as EmailLog[]);
    } catch (error) {
      console.error('Error fetching email logs:', error);
      toast.error('Failed to load email logs');
    } finally {
      setLoading(false);
    }
  }

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.recipient_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.template_key && log.template_key.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;

    let matchesDate = true;
    if (dateFrom && log.created_at) {
      matchesDate = matchesDate && new Date(log.created_at) >= new Date(dateFrom);
    }
    if (dateTo && log.created_at) {
      matchesDate = matchesDate && new Date(log.created_at) <= new Date(dateTo + 'T23:59:59');
    }

    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
  });

  // Paginate
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Calculate stats
  const stats = {
    total: logs.length,
    sent: logs.filter((l) => l.status === 'sent' || l.status === 'delivered').length,
    delivered: logs.filter((l) => l.status === 'delivered').length,
    bounced: logs.filter((l) => l.status === 'bounced').length,
    failed: logs.filter((l) => l.status === 'failed').length,
    deliveryRate: logs.length > 0
      ? ((logs.filter((l) => l.status === 'delivered').length / logs.length) * 100).toFixed(1)
      : '0',
  };

  // Status badge
  function getStatusBadge(status: string | null) {
    const config = {
      pending: { bg: 'bg-gray-100', text: 'text-gray-700', icon: <Clock className="w-3 h-3" /> },
      sent: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Mail className="w-3 h-3" /> },
      delivered: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle2 className="w-3 h-3" /> },
      bounced: { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle className="w-3 h-3" /> },
      failed: { bg: 'bg-red-100', text: 'text-red-700', icon: <AlertCircle className="w-3 h-3" /> },
      complained: { bg: 'bg-orange-100', text: 'text-orange-700', icon: <AlertCircle className="w-3 h-3" /> },
    };

    const { bg, text, icon } = config[status as keyof typeof config] || config.pending;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
        {icon}
        {status || 'pending'}
      </span>
    );
  }

  // Export to CSV
  function exportToCSV() {
    const headers = ['Date', 'Recipient', 'Subject', 'Template', 'Category', 'Status', 'Error'];
    const rows = filteredLogs.map((log) => [
      log.created_at ? new Date(log.created_at).toLocaleString() : '',
      log.recipient_email,
      log.subject,
      log.template_key || '',
      log.category,
      log.status || 'pending',
      log.error_message || '',
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Logs exported to CSV');
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Email Logs</h1>
            <p className="text-gray-400">Monitor email delivery and engagement</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
            <Link
              href="/admin/emails/templates"
              className="flex items-center gap-2 px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg transition-colors"
            >
              <Mail className="w-5 h-5" />
              Templates
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#10b981]/10 rounded-lg">
                <Mail className="w-6 h-6 text-[#10b981]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Emails</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Delivered</p>
                <p className="text-2xl font-bold text-white">{stats.delivered}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Bounced</p>
                <p className="text-2xl font-bold text-white">{stats.bounced}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Failed</p>
                <p className="text-2xl font-bold text-white">{stats.failed}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Delivery Rate</p>
                <p className="text-2xl font-bold text-white">{stats.deliveryRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1a1a] rounded-lg p-4 mb-6 border border-[#2a2a2a]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search recipient, subject, or template..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981]"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#10b981]"
            >
              <option value="all">All Statuses</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="bounced">Bounced</option>
              <option value="failed">Failed</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#10b981]"
            >
              <option value="all">All Categories</option>
              <option value="transactional">Transactional</option>
              <option value="marketing">Marketing</option>
              <option value="notification">Notification</option>
            </select>

            {/* Date Range */}
            <div className="flex gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white text-sm focus:outline-none focus:border-[#10b981]"
                placeholder="From"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white text-sm focus:outline-none focus:border-[#10b981]"
                placeholder="To"
              />
            </div>
          </div>
        </div>

        {/* Logs Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#10b981] animate-spin" />
          </div>
        ) : paginatedLogs.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-lg p-12 text-center border border-[#2a2a2a]">
            <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No logs found</h3>
            <p className="text-gray-400">
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || dateFrom || dateTo
                ? 'Try adjusting your filters'
                : 'No emails have been sent yet'}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#2a2a2a]">
              <table className="w-full">
                <thead className="bg-[#0f0f0f] border-b border-[#2a2a2a]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Template
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]">
                  {paginatedLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#0f0f0f]/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-300">
                          {log.created_at && new Date(log.created_at).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-white">{log.recipient_email}</p>
                        <p className="text-xs text-gray-500">{log.category}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-white max-w-xs truncate">{log.subject}</p>
                        {log.error_message && (
                          <p className="text-xs text-red-400 mt-1 max-w-xs truncate" title={log.error_message}>
                            {log.error_message}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-400">{log.template_key || '—'}</p>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(log.status)}
                        {log.delivered_at && (
                          <p className="text-xs text-gray-500 mt-1">
                            Delivered {new Date(log.delivered_at).toLocaleString()}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)} of{' '}
                  {filteredLogs.length} logs
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm disabled:opacity-50 hover:bg-[#2a2a2a] transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm disabled:opacity-50 hover:bg-[#2a2a2a] transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
