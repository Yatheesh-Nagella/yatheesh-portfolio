'use client';

/**
 * Admin Email Templates Page
 * View and manage email templates
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  Search,
  Loader2,
  FileText,
  Mail,
  Calendar,
  TrendingUp,
  Eye,
  Send,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EmailTemplate {
  id: string;
  template_key: string;
  template_name: string;
  category: 'transactional' | 'marketing' | 'notification' | 'system';
  subject_template: string;
  template_type: 'react' | 'html';
  template_path: string | null;
  is_active: boolean | null;
  version: number | null;
  total_sent: number | null;
  last_used_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'transactional' | 'marketing' | 'notification' | 'system'>('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTemplates((data || []) as EmailTemplate[]);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  }

  async function toggleTemplateStatus(templateId: string, currentStatus: boolean | null) {
    try {
      setTogglingId(templateId);

      const { error } = await supabase
        .from('email_templates')
        .update({ is_active: !currentStatus })
        .eq('id', templateId);

      if (error) throw error;

      toast.success(`Template ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchTemplates();
    } catch (error) {
      console.error('Error toggling template:', error);
      toast.error('Failed to update template');
    } finally {
      setTogglingId(null);
    }
  }

  async function sendTestEmail(templateKey: string) {
    const email = prompt('Enter email address to send test to:');
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setTestingId(templateKey);

      // TODO: Call test email API
      toast.success(`Test email will be sent to ${email}`);
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email');
    } finally {
      setTestingId(null);
    }
  }

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.template_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.template_key.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Category badge
  function getCategoryBadge(category: string) {
    const styles = {
      transactional: 'bg-blue-100 text-blue-700',
      marketing: 'bg-purple-100 text-purple-700',
      notification: 'bg-yellow-100 text-yellow-700',
      system: 'bg-gray-100 text-gray-700',
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[category as keyof typeof styles] || styles.system}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Email Templates</h1>
            <p className="text-gray-400">Manage and monitor email templates</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/emails/logs"
              className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg transition-colors"
            >
              <FileText className="w-5 h-5" />
              View Logs
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#10b981]/10 rounded-lg">
                <Mail className="w-6 h-6 text-[#10b981]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Templates</p>
                <p className="text-2xl font-bold text-white">{templates.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Active</p>
                <p className="text-2xl font-bold text-white">
                  {templates.filter((t) => t.is_active).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Inactive</p>
                <p className="text-2xl font-bold text-white">
                  {templates.filter((t) => !t.is_active).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Sent</p>
                <p className="text-2xl font-bold text-white">
                  {templates.reduce((sum, t) => sum + (t.total_sent || 0), 0).toLocaleString()}
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
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981]"
              />
            </div>

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
              <option value="system">System</option>
            </select>
          </div>
        </div>

        {/* Templates Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#10b981] animate-spin" />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-lg p-12 text-center border border-[#2a2a2a]">
            <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
            <p className="text-gray-400">
              {searchQuery || categoryFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No email templates available'}
            </p>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#2a2a2a]">
            <table className="w-full">
              <thead className="bg-[#0f0f0f] border-b border-[#2a2a2a]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Template
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total Sent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Used
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-[#0f0f0f]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">{template.template_name}</p>
                        <p className="text-xs text-gray-400 mt-1">{template.template_key}</p>
                        <p className="text-xs text-gray-500 mt-1">{template.subject_template}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getCategoryBadge(template.category)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleTemplateStatus(template.id, template.is_active)}
                        disabled={togglingId === template.id}
                        className="flex items-center gap-2 transition-colors"
                      >
                        {togglingId === template.id ? (
                          <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                        ) : template.is_active ? (
                          <>
                            <ToggleRight className="w-5 h-5 text-green-500" />
                            <span className="text-sm text-green-500">Active</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-400">Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-300">
                        {(template.total_sent || 0).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-400">
                        {template.last_used_at
                          ? new Date(template.last_used_at).toLocaleDateString()
                          : 'Never'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/emails/templates/${template.id}`}
                          className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4 text-gray-400" />
                        </Link>
                        <button
                          onClick={() => sendTestEmail(template.template_key)}
                          disabled={testingId === template.template_key || !template.is_active}
                          className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors disabled:opacity-50"
                          title="Send test email"
                        >
                          {testingId === template.template_key ? (
                            <Loader2 className="w-4 h-4 text-[#10b981] animate-spin" />
                          ) : (
                            <Send className="w-4 h-4 text-[#10b981]" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
