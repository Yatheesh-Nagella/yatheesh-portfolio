'use client';

/**
 * Send Test Email Modal
 * Beautiful modal for sending test emails with dynamic form fields
 * Paste invite codes from /admin/invites for invite code emails
 */

import React, { useState } from 'react';
import { X, Mail, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SendTestEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateKey: string;
  templateName: string;
}

interface TemplateData {
  [key: string]: string | number;
}

export default function SendTestEmailModal({
  isOpen,
  onClose,
  templateKey,
  templateName,
}: SendTestEmailModalProps) {
  const [email, setEmail] = useState('');
  const [templateData, setTemplateData] = useState<TemplateData>({});
  const [sending, setSending] = useState(false);

  // Define template-specific fields
  const getTemplateFields = (key: string) => {
    switch (key) {
      case 'invite_code_email':
      case 'invite_code':
        return [
          { name: 'code', label: 'Invite Code (Create in /admin/invites)', type: 'text', placeholder: 'Paste invite code here' },
          { name: 'expires_at', label: 'Expires At', type: 'date', placeholder: '2025-02-01' },
          { name: 'recipient_name', label: 'Recipient Name', type: 'text', placeholder: 'John Doe' },
        ];
      case 'welcome_email':
        return [
          { name: 'user_name', label: 'User Name', type: 'text', placeholder: 'John Doe' },
        ];
      case 'budget_alert_email':
        return [
          { name: 'user_name', label: 'User Name', type: 'text', placeholder: 'John Doe' },
          { name: 'budget_name', label: 'Budget Name', type: 'text', placeholder: 'Groceries Budget' },
          { name: 'budget_category', label: 'Category', type: 'text', placeholder: 'Groceries' },
          { name: 'budget_amount', label: 'Budget Amount ($)', type: 'number', placeholder: '500' },
          { name: 'spent_amount', label: 'Spent Amount ($)', type: 'number', placeholder: '425' },
          { name: 'threshold_percentage', label: 'Threshold %', type: 'number', placeholder: '80' },
          { name: 'period', label: 'Period', type: 'select', options: ['weekly', 'monthly', 'yearly'] },
          { name: 'days_remaining', label: 'Days Remaining', type: 'number', placeholder: '15' },
        ];
      case 'password_reset_email':
        return [
          { name: 'user_name', label: 'User Name', type: 'text', placeholder: 'John Doe' },
          { name: 'reset_link', label: 'Reset Link', type: 'text', placeholder: 'https://app.com/reset?token=xyz' },
        ];
      case 'plaid_item_error':
        return [
          { name: 'user_name', label: 'User Name', type: 'text', placeholder: 'John Doe' },
          { name: 'institution_name', label: 'Bank Name', type: 'text', placeholder: 'Chase' },
          { name: 'consent_expiration_time', label: 'Expiration Date', type: 'date', placeholder: '2025-02-01' },
          { name: 'reconnect_link', label: 'Reconnect Link', type: 'text', placeholder: 'https://app.com/settings' },
        ];
      default:
        return [
          { name: 'user_name', label: 'User Name', type: 'text', placeholder: 'John Doe' },
        ];
    }
  };

  const fields = getTemplateFields(templateKey);

  async function handleSendTest() {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    // Validate required fields
    const missingFields = fields
      .filter((f) => !templateData[f.name])
      .map((f) => f.label);

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setSending(true);

      const response = await fetch('/api/admin/emails/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: localStorage.getItem('admin_token'),
          email,
          templateKey,
          templateData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Test email sent to ${email}!`);
        onClose();
        setEmail('');
        setTemplateData({});
      } else {
        toast.error(data.error || 'Failed to send test email');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email');
    } finally {
      setSending(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#10b981]/10 rounded-lg">
              <Mail className="w-5 h-5 text-[#10b981]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Send Test Email</h2>
              <p className="text-sm text-gray-400">{templateName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Recipient Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
              className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981]"
            />
          </div>

          {/* Dynamic Template Fields */}
          <div className="border-t border-[#2a2a2a] pt-4">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Template Data</h3>
            <div className="space-y-3">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    {field.label} *
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={templateData[field.name] || ''}
                      onChange={(e) =>
                        setTemplateData({ ...templateData, [field.name]: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#10b981]"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'date' ? (
                    <input
                      type="date"
                      value={templateData[field.name] || ''}
                      onChange={(e) =>
                        setTemplateData({ ...templateData, [field.name]: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#10b981]"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={templateData[field.name] || ''}
                      onChange={(e) =>
                        setTemplateData({
                          ...templateData,
                          [field.name]:
                            field.type === 'number' ? Number(e.target.value) : e.target.value,
                        })
                      }
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#10b981]"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#2a2a2a]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSendTest}
            disabled={sending}
            className="px-6 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Send Test Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
