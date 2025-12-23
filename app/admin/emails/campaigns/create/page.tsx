/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

/**
 * Create Email Campaign Page
 * Campaign builder with template selection and audience targeting
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  Loader2,
  Users,
  Calendar,
  Mail,
  Send,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface EmailTemplate {
  id: string;
  template_key: string;
  template_name: string;
  category: string;
  is_active: boolean | null;
}

export default function CreateCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [recipientCount, setRecipientCount] = useState<number>(0);
  const [countingRecipients, setCountingRecipients] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [templateKey, setTemplateKey] = useState('');
  const [activeOnly, setActiveOnly] = useState(true);
  const [signupAfter, setSignupAfter] = useState('');
  const [signupBefore, setSignupBefore] = useState('');
  const [testEmail, setTestEmail] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    // Recalculate recipient count when audience filters change
    calculateRecipientCount();
  }, [activeOnly, signupAfter, signupBefore]);

  async function fetchTemplates() {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('id, template_key, template_name, category, is_active')
        .eq('is_active', true)
        .order('template_name');

      if (error) throw error;

      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    }
  }

  async function calculateRecipientCount() {
    try {
      setCountingRecipients(true);

      let query = supabase
        .from('users')
        .select('id', { count: 'exact', head: true });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      if (signupAfter) {
        query = query.gte('created_at', signupAfter);
      }

      if (signupBefore) {
        query = query.lte('created_at', signupBefore);
      }

      const { count, error } = await query;

      if (error) throw error;

      setRecipientCount(count || 0);
    } catch (error) {
      console.error('Error counting recipients:', error);
    } finally {
      setCountingRecipients(false);
    }
  }

  async function sendTestEmail() {
    if (!templateKey) {
      toast.error('Please select a template first');
      return;
    }

    if (!testEmail || !testEmail.includes('@')) {
      toast.error('Please enter a valid test email address');
      return;
    }

    if (!subject) {
      toast.error('Please enter a subject line');
      return;
    }

    try {
      setLoading(true);

      // TODO: Implement test email sending
      // For now, just show a success message
      toast.success(`Test email will be sent to ${testEmail}`);
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email');
    } finally {
      setLoading(false);
    }
  }

  async function createCampaign(sendNow: boolean = false) {
    // Validation
    if (!name.trim()) {
      toast.error('Please enter a campaign name');
      return;
    }

    if (!subject.trim()) {
      toast.error('Please enter a subject line');
      return;
    }

    if (!templateKey) {
      toast.error('Please select a template');
      return;
    }

    if (recipientCount === 0) {
      toast.error('No recipients match the selected audience filters');
      return;
    }

    if (sendNow && !confirm(`This will send ${recipientCount} emails immediately. Continue?`)) {
      return;
    }

    try {
      setLoading(true);

      const targetAudience: any = {
        active_only: activeOnly,
      };

      if (signupAfter) {
        targetAudience.signup_after = signupAfter;
      }

      if (signupBefore) {
        targetAudience.signup_before = signupBefore;
      }

      const { data, error } = await supabase
        .from('email_campaigns')
        .insert({
          name: name.trim(),
          subject: subject.trim(),
          template_key: templateKey,
          target_audience: targetAudience,
          status: sendNow ? 'sending' : 'draft',
          total_recipients: recipientCount,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success(sendNow ? 'Campaign created and sending!' : 'Campaign created as draft');

      // If sending now, trigger the send
      if (sendNow && data) {
        // TODO: Trigger campaign send API
        // For now, just redirect to the campaign page
      }

      router.push(`/admin/emails/campaigns/${data.id}`);
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/emails/campaigns"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Campaigns
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create Email Campaign</h1>
          <p className="text-gray-400">Send marketing emails to targeted users</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Campaign Details */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <h2 className="text-xl font-semibold text-white mb-4">Campaign Details</h2>

            <div className="space-y-4">
              {/* Campaign Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Beta Invite Campaign - January 2025"
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981]"
                />
              </div>

              {/* Subject Line */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., You're invited to join OneLibro!"
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981]"
                />
              </div>

              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Template
                </label>
                <select
                  value={templateKey}
                  onChange={(e) => setTemplateKey(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#10b981]"
                >
                  <option value="">Select a template...</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.template_key}>
                      {template.template_name} ({template.category})
                    </option>
                  ))}
                </select>
                {templates.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    No active templates found. Please create a template first.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Target Audience */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <h2 className="text-xl font-semibold text-white mb-4">Target Audience</h2>

            <div className="space-y-4">
              {/* Active Users Only */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="activeOnly"
                  checked={activeOnly}
                  onChange={(e) => setActiveOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-[#2a2a2a] bg-[#0f0f0f] text-[#10b981] focus:ring-[#10b981]"
                />
                <label htmlFor="activeOnly" className="text-sm text-gray-300">
                  Active users only
                </label>
              </div>

              {/* Signup Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Signed up after
                  </label>
                  <input
                    type="date"
                    value={signupAfter}
                    onChange={(e) => setSignupAfter(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#10b981]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Signed up before
                  </label>
                  <input
                    type="date"
                    value={signupBefore}
                    onChange={(e) => setSignupBefore(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#10b981]"
                  />
                </div>
              </div>

              {/* Recipient Count */}
              <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#10b981]" />
                    <span className="text-sm font-medium text-gray-300">
                      Target Recipients
                    </span>
                  </div>
                  {countingRecipients ? (
                    <Loader2 className="w-5 h-5 text-[#10b981] animate-spin" />
                  ) : (
                    <span className="text-2xl font-bold text-white">{recipientCount}</span>
                  )}
                </div>
                {recipientCount === 0 && !countingRecipients && (
                  <div className="flex items-start gap-2 mt-3 text-yellow-500">
                    <AlertCircle className="w-4 h-4 mt-0.5" />
                    <p className="text-sm">
                      No users match your filters. Adjust your audience targeting.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Test Email */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <h2 className="text-xl font-semibold text-white mb-4">Test Email</h2>
            <p className="text-sm text-gray-400 mb-4">
              Send a test email to verify your content before sending to all recipients.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="flex-1 px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981]"
              />
              <button
                onClick={sendTestEmail}
                disabled={loading || !testEmail || !templateKey}
                className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Send Test
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4 bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <div>
              <p className="text-sm text-gray-400">
                This will send emails to <span className="font-semibold text-white">{recipientCount}</span> recipients
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => createCampaign(false)}
                disabled={loading || recipientCount === 0}
                className="px-6 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Save as Draft'
                )}
              </button>
              <button
                onClick={() => createCampaign(true)}
                disabled={loading || recipientCount === 0}
                className="px-6 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
