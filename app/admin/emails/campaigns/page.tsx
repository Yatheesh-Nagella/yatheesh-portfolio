'use client';

/**
 * Admin Email Campaigns Page
 * List and manage email marketing campaigns
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  Plus,
  Search,
  Loader2,
  Mail,
  Send,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  template_key: string;
  target_audience: any;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  scheduled_at: string | null;
  sent_at: string | null;
  total_recipients: number | null;
  total_sent: number | null;
  total_delivered: number | null;
  total_bounced: number | null;
  created_at: string | null;
  created_by_admin_id: string | null;
  creator?: {
    full_name: string | null;
    email: string;
  } | null;
  email_template?: {
    template_key: string;
    template_name: string;
    category: string;
  } | null;
}

const ITEMS_PER_PAGE = 10;

export default function EmailCampaignsPage() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'scheduled' | 'sent'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('email_campaigns')
        .select(`
          id,
          name,
          subject,
          template_key,
          target_audience,
          status,
          scheduled_at,
          sent_at,
          total_recipients,
          total_sent,
          total_delivered,
          total_bounced,
          created_at,
          created_by_admin_id,
          creator:admin_users!email_campaigns_created_by_admin_id_fkey(full_name, email),
          email_template:email_templates(template_key, template_name, category)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCampaigns((data || []) as unknown as EmailCampaign[]);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  }

  async function deleteCampaign(id: string) {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      setDeletingId(id);

      const { error } = await supabase
        .from('email_campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Campaign deleted successfully');
      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Failed to delete campaign');
    } finally {
      setDeletingId(null);
    }
  }

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Paginate
  const totalPages = Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE);
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Status badge
  function getStatusBadge(status: string) {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      scheduled: 'bg-blue-100 text-blue-700',
      sending: 'bg-yellow-100 text-yellow-700',
      sent: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };

    const icons = {
      draft: <Clock className="w-3 h-3" />,
      scheduled: <Calendar className="w-3 h-3" />,
      sending: <Loader2 className="w-3 h-3 animate-spin" />,
      sent: <CheckCircle2 className="w-3 h-3" />,
      cancelled: <XCircle className="w-3 h-3" />,
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.draft}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Email Campaigns</h1>
            <p className="text-gray-400">Create and manage marketing email campaigns</p>
          </div>
          <Link
            href="/admin/emails/campaigns/create"
            className="flex items-center gap-2 px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Campaign
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#10b981]/10 rounded-lg">
                <Mail className="w-6 h-6 text-[#10b981]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Campaigns</p>
                <p className="text-2xl font-bold text-white">{campaigns.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Send className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Sent</p>
                <p className="text-2xl font-bold text-white">
                  {campaigns.filter((c) => c.status === 'sent').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Scheduled</p>
                <p className="text-2xl font-bold text-white">
                  {campaigns.filter((c) => c.status === 'scheduled').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-500/10 rounded-lg">
                <Clock className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Drafts</p>
                <p className="text-2xl font-bold text-white">
                  {campaigns.filter((c) => c.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1a1a] rounded-lg p-4 mb-6 border border-[#2a2a2a]">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search campaigns..."
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
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="sent">Sent</option>
            </select>
          </div>
        </div>

        {/* Campaigns Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#10b981] animate-spin" />
          </div>
        ) : paginatedCampaigns.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-lg p-12 text-center border border-[#2a2a2a]">
            <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No campaigns found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first campaign'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link
                href="/admin/emails/campaigns/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Campaign
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#2a2a2a]">
            <table className="w-full">
              <thead className="bg-[#0f0f0f] border-b border-[#2a2a2a]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Recipients
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Sent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {paginatedCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-[#0f0f0f]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">{campaign.name}</p>
                        <p className="text-sm text-gray-400">{campaign.subject}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Template: {campaign.email_template?.template_name || campaign.template_key}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(campaign.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-300">
                        <Users className="w-4 h-4" />
                        {campaign.total_recipients || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {campaign.sent_at ? (
                        <div>
                          <p className="text-sm text-gray-300">
                            {campaign.total_sent || 0} / {campaign.total_recipients || 0}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(campaign.sent_at).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-400">
                        {campaign.created_at &&
                          new Date(campaign.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/emails/campaigns/${campaign.id}`}
                          className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4 text-gray-400" />
                        </Link>
                        {campaign.status === 'draft' && (
                          <button
                            onClick={() => deleteCampaign(campaign.id)}
                            disabled={deletingId === campaign.id}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete campaign"
                          >
                            {deletingId === campaign.id ? (
                              <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4 text-red-400" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredCampaigns.length)} of{' '}
              {filteredCampaigns.length} campaigns
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
      </div>
    </div>
  );
}
