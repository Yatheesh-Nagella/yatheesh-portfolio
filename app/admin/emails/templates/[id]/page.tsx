/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

/**
 * Email Template Detail Page
 * View template details, stats, and send test emails
 */

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
  TrendingUp,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  FileText,
  Code,
} from 'lucide-react';
import toast from 'react-hot-toast';
import SendTestEmailModal from '@/components/admin/SendTestEmailModal';

interface EmailTemplate {
  id: string;
  template_key: string;
  template_name: string;
  category: 'transactional' | 'marketing' | 'notification' | 'system';
  subject_template: string;
  template_type: 'react' | 'html';
  template_path: string | null;
  html_content: string | null;
  variables: Record<string, any>;
  is_active: boolean | null;
  version: number | null;
  total_sent: number | null;
  last_used_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TemplateDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [template, setTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [testEmailModal, setTestEmailModal] = useState(false);

  useEffect(() => {
    fetchTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchTemplate() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setTemplate(data as EmailTemplate);
    } catch (error) {
      console.error('Error fetching template:', error);
      toast.error('Failed to load template');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#10b981] animate-spin" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-[#1a1a1a] rounded-lg p-12 text-center border border-[#2a2a2a]">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Template not found</h3>
            <p className="text-gray-400 mb-6">The template you&apos;re looking for doesn&apos;t exist.</p>
            <Link
              href="/admin/emails/templates"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Templates
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Category badge
  function getCategoryBadge(category: string) {
    const styles = {
      transactional: 'bg-blue-100 text-blue-700',
      marketing: 'bg-purple-100 text-purple-700',
      notification: 'bg-yellow-100 text-yellow-700',
      system: 'bg-gray-100 text-gray-700',
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          styles[category as keyof typeof styles] || styles.system
        }`}
      >
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/emails/templates"
              className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{template.template_name}</h1>
              <div className="flex items-center gap-3">
                <p className="text-gray-400">{template.template_key}</p>
                {getCategoryBadge(template.category)}
              </div>
            </div>
          </div>
          <button
            onClick={() => setTestEmailModal(true)}
            disabled={!template.is_active}
            className="flex items-center gap-2 px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            Send Test Email
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${template.is_active ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {template.is_active ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <p className="text-lg font-bold text-white">
                  {template.is_active ? 'Active' : 'Inactive'}
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
                <p className="text-lg font-bold text-white">
                  {(template.total_sent || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Clock className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Last Used</p>
                <p className="text-lg font-bold text-white">
                  {template.last_used_at
                    ? new Date(template.last_used_at).toLocaleDateString()
                    : 'Never'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <FileText className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Version</p>
                <p className="text-lg font-bold text-white">v{template.version || 1}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Template Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Subject Template */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-[#10b981]" />
              <h2 className="text-xl font-bold text-white">Subject Template</h2>
            </div>
            <div className="bg-[#0f0f0f] rounded-lg p-4 border border-[#2a2a2a]">
              <p className="text-gray-300 font-mono text-sm">{template.subject_template}</p>
            </div>
          </div>

          {/* Template Type */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-5 h-5 text-[#10b981]" />
              <h2 className="text-xl font-bold text-white">Template Type</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400 mb-1">Type</p>
                <p className="text-gray-300 font-medium">
                  {template.template_type === 'react' ? 'React Email Component' : 'HTML Template'}
                </p>
              </div>
              {template.template_path && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Component Path</p>
                  <p className="text-gray-300 font-mono text-sm">{template.template_path}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Variables */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a] mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-[#10b981]" />
            <h2 className="text-xl font-bold text-white">Template Variables</h2>
          </div>
          {template.variables && Object.keys(template.variables).length > 0 ? (
            <div className="bg-[#0f0f0f] rounded-lg p-4 border border-[#2a2a2a]">
              <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                {JSON.stringify(template.variables, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-gray-400">No variables defined</p>
          )}
        </div>

        {/* Metadata */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-[#10b981]" />
            <h2 className="text-xl font-bold text-white">Metadata</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Created</p>
              <p className="text-gray-300">
                {template.created_at
                  ? new Date(template.created_at).toLocaleString()
                  : 'Unknown'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Last Updated</p>
              <p className="text-gray-300">
                {template.updated_at
                  ? new Date(template.updated_at).toLocaleString()
                  : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Send Test Email Modal */}
      <SendTestEmailModal
        isOpen={testEmailModal}
        onClose={() => setTestEmailModal(false)}
        templateKey={template.template_key}
        templateName={template.template_name}
      />
    </div>
  );
}
