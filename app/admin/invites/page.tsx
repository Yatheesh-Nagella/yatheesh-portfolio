'use client';

/**
 * Admin Invite Codes Page
 * Manage invite codes for the platform
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  Plus,
  Search,
  Loader2,
  Copy,
  Check,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  Ticket,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface InviteCode {
  id: string;
  code: string;
  is_active: boolean | null;
  max_uses: number | null;
  used_count: number | null;
  expires_at: string;
  created_at: string | null;
  created_by: string | null;
  created_by_admin_id: string | null;
  creator?: {
    full_name: string | null;
    email: string;
  } | null;
  admin_creator?: {
    full_name: string | null;
    email: string;
  } | null;
}

const ITEMS_PER_PAGE = 10;

export default function InviteCodesPage() {
  const [invites, setInvites] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'exhausted'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInviteCodes();
  }, []);

  async function fetchInviteCodes() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('invite_codes')
        .select(`
          id,
          code,
          is_active,
          max_uses,
          used_count,
          expires_at,
          created_at,
          created_by,
          created_by_admin_id,
          creator:users!invite_codes_created_by_fkey(full_name, email),
          admin_creator:admin_users!invite_codes_created_by_admin_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setInvites((data || []) as unknown as InviteCode[]);
    } catch (error) {
      console.error('Error fetching invite codes:', error);
      toast.error('Failed to load invite codes');
    } finally {
      setLoading(false);
    }
  }

  // Get invite status
  function getInviteStatus(invite: InviteCode): 'active' | 'expired' | 'exhausted' | 'inactive' {
    if (!invite.is_active) return 'inactive';
    if (new Date(invite.expires_at) < new Date()) return 'expired';
    if (invite.max_uses && (invite.used_count || 0) >= invite.max_uses) return 'exhausted';
    return 'active';
  }

  // Filter invites
  const filteredInvites = invites.filter((invite) => {
    const matchesSearch =
      searchQuery === '' ||
      invite.code.toLowerCase().includes(searchQuery.toLowerCase());

    const status = getInviteStatus(invite);
    const matchesStatus =
      statusFilter === 'all' ||
      status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredInvites.length / ITEMS_PER_PAGE);
  const paginatedInvites = filteredInvites.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Copy code to clipboard
  async function copyCode(code: string, id: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Failed to copy code');
    }
  }

  // Toggle active status
  async function toggleActive(invite: InviteCode) {
    try {
      setTogglingId(invite.id);

      const token = localStorage.getItem('admin_token');
      if (!token) {
        toast.error('Session expired. Please login again.');
        return;
      }

      const response = await fetch(`/api/admin/invites/${invite.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          is_active: !invite.is_active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to update invite code');
        return;
      }

      setInvites((prev) =>
        prev.map((i) =>
          i.id === invite.id ? { ...i, is_active: !i.is_active } : i
        )
      );

      toast.success(`Invite code ${invite.is_active ? 'deactivated' : 'activated'}`);
    } catch (error) {
      console.error('Error toggling invite:', error);
      toast.error('Failed to update invite code');
    } finally {
      setTogglingId(null);
    }
  }

  // Delete invite code
  async function deleteInvite(id: string) {
    if (!confirm('Are you sure you want to delete this invite code?')) return;

    try {
      setDeletingId(id);

      const token = localStorage.getItem('admin_token');
      if (!token) {
        toast.error('Session expired. Please login again.');
        return;
      }

      const response = await fetch(`/api/admin/invites/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to delete invite code');
        return;
      }

      setInvites((prev) => prev.filter((i) => i.id !== id));
      toast.success('Invite code deleted');
    } catch (error) {
      console.error('Error deleting invite:', error);
      toast.error('Failed to delete invite code');
    } finally {
      setDeletingId(null);
    }
  }

  // Format date
  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  // Get status badge
  function getStatusBadge(status: string) {
    const styles = {
      active: 'bg-green-100 text-green-700',
      expired: 'bg-red-100 text-red-700',
      exhausted: 'bg-orange-100 text-orange-700',
      inactive: 'bg-gray-100 text-gray-700',
    };

    const labels = {
      active: 'Active',
      expired: 'Expired',
      exhausted: 'Exhausted',
      inactive: 'Inactive',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">Invite Codes</h1>
          <p className="text-gray-600 mt-1">Manage platform access codes</p>
        </div>
        <Link
          href="/admin/invites/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Code
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Codes</p>
          <p className="text-2xl font-bold text-gray-900">{invites.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {invites.filter((i) => getInviteStatus(i) === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Expired</p>
          <p className="text-2xl font-bold text-red-600">
            {invites.filter((i) => getInviteStatus(i) === 'expired').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Uses</p>
          <p className="text-2xl font-bold text-blue-600">
            {invites.reduce((sum, i) => sum + (i.used_count || 0), 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by code..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as typeof statusFilter);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="exhausted">Exhausted</option>
          </select>
        </div>
      </div>

      {/* Invite Codes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedInvites.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Ticket className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p>No invite codes found</p>
                    <Link
                      href="/admin/invites/create"
                      className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
                    >
                      Create your first invite code
                    </Link>
                  </td>
                </tr>
              ) : (
                paginatedInvites.map((invite) => {
                  const status = getInviteStatus(invite);

                  return (
                    <tr key={invite.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {invite.code}
                          </code>
                          <button
                            onClick={() => copyCode(invite.code, invite.id)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Copy code"
                          >
                            {copiedId === invite.id ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          {invite.used_count || 0} / {invite.max_uses || '∞'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(invite.expires_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {invite.created_at ? formatDate(invite.created_at) : 'N/A'}
                        {(invite.creator || invite.admin_creator) && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            by {invite.admin_creator
                              ? `${invite.admin_creator.full_name || invite.admin_creator.email} (Admin)`
                              : (invite.creator?.full_name || invite.creator?.email)}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => toggleActive(invite)}
                            disabled={togglingId === invite.id}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                            title={invite.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {togglingId === invite.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : invite.is_active ? (
                              <ToggleRight className="w-4 h-4 text-green-500" />
                            ) : (
                              <ToggleLeft className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteInvite(invite.id)}
                            disabled={deletingId === invite.id}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === invite.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredInvites.length)} of{' '}
              {filteredInvites.length} codes
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
    </div>
  );
}
