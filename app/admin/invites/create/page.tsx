'use client';

/**
 * Create Invite Code Page
 * Form to generate new invite codes
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import {
  ArrowLeft,
  Loader2,
  Ticket,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Generate a random invite code
function generateCode(length = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar-looking chars
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function CreateInviteCodePage() {
  const router = useRouter();
  const { adminUser } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [code, setCode] = useState(generateCode());
  const [maxUses, setMaxUses] = useState<string>('10');
  const [expiresIn, setExpiresIn] = useState<string>('7'); // days

  // Regenerate code
  function regenerateCode() {
    setCode(generateCode());
  }

  // Copy code to clipboard
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy code');
    }
  }

  // Handle form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!adminUser) {
      toast.error('You must be logged in');
      return;
    }

    try {
      setLoading(true);

      // Calculate expiry date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn));

      // Get admin token from localStorage
      const token = localStorage.getItem('admin_token');

      if (!token) {
        toast.error('Session expired. Please login again.');
        router.push('/admin/login');
        return;
      }

      // Call API route to create invite code
      const response = await fetch('/api/admin/invites/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          code: code.toUpperCase(),
          max_uses: maxUses === '' ? null : parseInt(maxUses),
          expires_at: expiresAt.toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'This code already exists') {
          toast.error('This code already exists. Try generating a new one.');
          return;
        }
        toast.error(data.error || 'Failed to create invite code');
        return;
      }

      toast.success('Invite code created successfully');
      router.push('/admin/invites');
    } catch (error) {
      console.error('Error creating invite code:', error);
      toast.error('Failed to create invite code');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/invites"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Invite Codes
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create Invite Code</h1>
        <p className="text-gray-600 mt-1">Generate a new invite code for platform access</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invite Code
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg tracking-wider"
                  placeholder="INVITE123"
                  maxLength={20}
                  required
                />
              </div>
              <button
                type="button"
                onClick={regenerateCode}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
                title="Generate new code"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={copyCode}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
                title="Copy code"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="mt-1.5 text-sm text-gray-500">
              The code users will enter during registration
            </p>
          </div>

          {/* Max Uses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Uses
            </label>
            <input
              type="number"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Leave empty for unlimited"
              min="1"
            />
            <p className="mt-1.5 text-sm text-gray-500">
              Leave empty for unlimited uses
            </p>
          </div>

          {/* Expires In */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expires In
            </label>
            <select
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="1">1 day</option>
              <option value="3">3 days</option>
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="365">1 year</option>
            </select>
            <p className="mt-1.5 text-sm text-gray-500">
              The code will expire after this period
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">Summary</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>
              Code: <span className="font-mono font-medium">{code}</span>
            </li>
            <li>
              Uses: {maxUses === '' ? 'Unlimited' : `${maxUses} times`}
            </li>
            <li>
              Expires: {(() => {
                const date = new Date();
                date.setDate(date.getDate() + parseInt(expiresIn));
                return date.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                });
              })()}
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/invites"
            className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || !code}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Ticket className="w-5 h-5" />
                Create Code
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
