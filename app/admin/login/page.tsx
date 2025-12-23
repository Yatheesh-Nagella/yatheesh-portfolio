'use client';

/**
 * Admin Login Page
 * Separate authentication with TOTP 2FA
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Shield, Mail, Lock, Key, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn, verifyTOTP } = useAdminAuth();

  const [step, setStep] = useState<'credentials' | 'totp'>('credentials');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Email & Password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2: TOTP
  const [userId, setUserId] = useState<string>('');
  const [totpCode, setTotpCode] = useState('');

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { requiresTOTP, userId: returnedUserId, error: signInError } = await signIn(email, password);

      if (signInError) {
        setError(signInError);
        return;
      }

      if (requiresTOTP && returnedUserId) {
        // Proceed to TOTP step
        setUserId(returnedUserId);
        setStep('totp');
        toast.success('Please enter your 2FA code');
      } else {
        // No TOTP - logged in
        toast.success('Logged in successfully');
        router.push('/admin');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleTOTPSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { success, error: verifyError } = await verifyTOTP(userId, totpCode);

      if (verifyError || !success) {
        setError(verifyError || 'Invalid code');
        setTotpCode('');
        return;
      }

      toast.success('Logged in successfully');
      router.push('/admin');
    } catch (error) {
      console.error('TOTP verification error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleBackToCredentials() {
    setStep('credentials');
    setUserId('');
    setTotpCode('');
    setError(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-gray-400 mt-2">
            {step === 'credentials' ? 'Sign in to continue' : 'Enter your 2FA code'}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="admin@example.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleTOTPSubmit} className="space-y-6">
              {/* TOTP Code */}
              <div>
                <label htmlFor="totp" className="block text-sm font-medium text-gray-700 mb-2">
                  Authentication Code
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="totp"
                    type="text"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                    autoComplete="one-time-code"
                    autoFocus
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || totpCode.length !== 6}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    Verify Code
                  </>
                )}
              </button>

              {/* Back button */}
              <button
                type="button"
                onClick={handleBackToCredentials}
                className="w-full py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                ← Back to login
              </button>
            </form>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            This is a secure admin area. All actions are logged.
          </p>
        </div>
      </div>
    </div>
  );
}
