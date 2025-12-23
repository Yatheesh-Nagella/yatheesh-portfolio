'use client';

import { useState } from 'react';
import { X, Mail, User, Loader2, CheckCircle2 } from 'lucide-react';

interface RequestInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestInviteModal({ isOpen, onClose }: RequestInviteModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/invite-requests/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      setSuccess(true);
      // Auto-close after 3 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEmail('');
        setName('');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md border border-[#2a2a2a]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Request Invite Code</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-[#10b981] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Request Submitted!</h3>
            <p className="text-gray-400">
              Check your email for confirmation. We&apos;ll send you an invite code shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-gray-400 mb-6">
              Enter your details and we&apos;ll send you an invite code to join OneLibro.
            </p>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#10b981]"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Name Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#10b981]"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Request Invite Code'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
