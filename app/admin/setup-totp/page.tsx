'use client';

/**
 * Admin TOTP Setup Page
 * Set up two-factor authentication
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import Image from 'next/image';
import { Shield, Key, Loader2, CheckCircle, AlertCircle, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SetupTOTPPage() {
  const router = useRouter();
  const { adminUser, refreshSession } = useAdminAuth();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'generate' | 'verify'>('generate');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check if TOTP is already enabled
  useEffect(() => {
    if (adminUser?.totp_enabled && adminUser?.totp_verified) {
      toast.success('TOTP is already enabled');
      router.push('/admin');
    }
  }, [adminUser, router]);

  async function handleGenerateTOTP() {
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        toast.error('Not authenticated');
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/auth/setup-totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setQrCodeDataUrl(data.qrCodeDataUrl);
      setSecret(data.secret);
      setStep('verify');
    } catch (error) {
      console.error('TOTP setup error:', error);
      toast.error('Failed to setup TOTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(true);

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        toast.error('Not authenticated');
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/auth/verify-totp-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, code }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        setCode('');
        return;
      }

      toast.success('TOTP enabled successfully!');
      await refreshSession();
      router.push('/admin');
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Verification failed');
    } finally {
      setVerifying(false);
    }
  }

  async function copySecret() {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      toast.success('Secret copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy secret');
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Enable Two-Factor Authentication</h1>
        <p className="text-gray-600 mt-2">
          Secure your admin account with TOTP 2FA
        </p>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        {step === 'generate' ? (
          <>
            {/* Introduction */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">What is 2FA?</h2>
              <p className="text-gray-600 mb-4">
                Two-factor authentication adds an extra layer of security to your account.
                You'll need both your password and a code from your authenticator app to log in.
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">Before you begin:</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Install an authenticator app (Google Authenticator, Authy, etc.)</li>
                <li>• Have your phone ready to scan the QR code</li>
                <li>• Save backup codes in a secure location</li>
              </ul>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerateTOTP}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Key className="w-5 h-5" />
                  Generate TOTP Secret
                </>
              )}
            </button>
          </>
        ) : (
          <>
            {/* QR Code */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Step 1: Scan QR Code</h2>
              <div className="flex justify-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                {qrCodeDataUrl && (
                  <Image
                    src={qrCodeDataUrl}
                    alt="TOTP QR Code"
                    width={200}
                    height={200}
                    className="rounded"
                  />
                )}
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Open your authenticator app and scan this QR code.
              </p>
            </div>

            {/* Manual entry */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Can't scan? Enter manually:</h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-gray-100 rounded border border-gray-200 font-mono text-sm">
                  {secret}
                </code>
                <button
                  onClick={copySecret}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded border border-gray-200"
                  title="Copy secret"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Verify code */}
            <form onSubmit={handleVerifyCode}>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Step 2: Verify Code</h2>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter the 6-digit code from your app
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={verifying || code.length !== 6}
                className="w-full mt-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Enable 2FA
                  </>
                )}
              </button>
            </form>

            {/* Warning */}
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-900">Important</h3>
                  <p className="text-sm text-amber-800 mt-1">
                    Save your backup codes in a secure location. You'll need them if you lose access to your authenticator app.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
