'use client';

/**
 * Login & Signup Page
 * Combined authentication page with tabs for login and signup
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Mail, Lock, User, Ticket, LogIn, UserPlus } from 'lucide-react';
import RequestInviteModal from '@/components/finance/RequestInviteModal';

type TabType = 'login' | 'signup';

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupInviteCode, setSignupInviteCode] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Request invite modal state
  const [showRequestModal, setShowRequestModal] = useState(false);

  /**
   * Handle login form submission
   */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    // Validate inputs
    if (!loginEmail || !loginPassword) {
      setLoginError('Please fill in all fields');
      setLoginLoading(false);
      return;
    }

    // Attempt sign in
    const { error } = await signIn(loginEmail, loginPassword);

    if (error) {
      setLoginError(error);
      setLoginLoading(false);
    }

    // Success - AuthContext will handle redirect
  }

  /**
   * Handle signup form submission
   */
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setSignupError('');
    setSignupLoading(true);

    // Validate inputs
    if (!signupEmail || !signupPassword || !signupName || !signupInviteCode) {
      setSignupError('Please fill in all fields');
      setSignupLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail)) {
      setSignupError('Please enter a valid email address');
      setSignupLoading(false);
      return;
    }

    // Validate password length
    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters');
      setSignupLoading(false);
      return;
    }

    // Attempt sign up
    const { error } = await signUp(signupEmail, signupPassword, signupName, signupInviteCode);

    if (error) {
      // Check if it's an email confirmation error
      if (error.includes('confirm') || error.includes('verification')) {
        setSignupSuccess(true);
        setSignupLoading(false);
      } else {
        setSignupError(error);
        setSignupLoading(false);
      }
    } else {
      // Success - check if user was created but needs confirmation
      setSignupSuccess(true);
      setSignupLoading(false);

      // If no error, AuthContext will handle redirect
      // If email confirmation is required, user will see success message
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#10b981] rounded-2xl mb-4 p-3">
            <div className="relative w-full h-full">
              <Image
                src="/oneLibro-logo.png"
                alt="OneLibro"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#e5e5e5] mb-2">
            Welcome to OneLibro
          </h1>
          <p className="text-[#a3a3a3]">
            {activeTab === 'login'
              ? 'Sign in to your account'
              : 'Create your account with an invite code'}
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-[#e5e5e5]/5 backdrop-blur-sm border border-[#a3a3a3]/10 rounded-t-2xl shadow-xl">
          <div className="flex border-b border-[#a3a3a3]/10">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'login'
                  ? 'text-[#10b981] border-b-2 border-[#10b981]'
                  : 'text-[#737373] hover:text-[#e5e5e5]'
              }`}
            >
              <LogIn className="w-5 h-5 inline mr-2" />
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'signup'
                  ? 'text-[#10b981] border-b-2 border-[#10b981]'
                  : 'text-[#737373] hover:text-[#e5e5e5]'
              }`}
            >
              <UserPlus className="w-5 h-5 inline mr-2" />
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <div className="p-8">
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Error Message */}
                {loginError && (
                  <div className="bg-red-900/20 border border-red-800/50 text-red-300 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
                    {loginError}
                  </div>
                )}

                {/* Email Input */}
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-[#e5e5e5] mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#737373] w-5 h-5" />
                    <input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      disabled={loginLoading}
                      className="w-full pl-10 pr-4 py-3 bg-[#0f0f0f] border border-[#a3a3a3]/20 text-[#e5e5e5] placeholder-[#737373] rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-[#e5e5e5] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#737373] w-5 h-5" />
                    <input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={loginLoading}
                      className="w-full pl-10 pr-4 py-3 bg-[#0f0f0f] border border-[#a3a3a3]/20 text-[#e5e5e5] placeholder-[#737373] rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-[#10b981] hover:bg-[#10b981]/90 text-[#1a1a1a] font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign In
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Signup Form */}
          {activeTab === 'signup' && (
            <div className="p-8">
              <form onSubmit={handleSignup} className="space-y-5">
                {/* Error Message */}
                {signupError && (
                  <div className="bg-red-900/20 border border-red-800/50 text-red-300 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
                    {signupError}
                  </div>
                )}

                {/* Name Input */}
                <div>
                  <label htmlFor="signup-name" className="block text-sm font-medium text-[#e5e5e5] mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#737373] w-5 h-5" />
                    <input
                      id="signup-name"
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="John Doe"
                      required
                      disabled={signupLoading}
                      className="w-full pl-10 pr-4 py-3 bg-[#0f0f0f] border border-[#a3a3a3]/20 text-[#e5e5e5] placeholder-[#737373] rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-[#e5e5e5] mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#737373] w-5 h-5" />
                    <input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      disabled={signupLoading}
                      className="w-full pl-10 pr-4 py-3 bg-[#0f0f0f] border border-[#a3a3a3]/20 text-[#e5e5e5] placeholder-[#737373] rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-[#e5e5e5] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#737373] w-5 h-5" />
                    <input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={signupLoading}
                      minLength={6}
                      className="w-full pl-10 pr-4 py-3 bg-[#0f0f0f] border border-[#a3a3a3]/20 text-[#e5e5e5] placeholder-[#737373] rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#737373]">
                    At least 6 characters
                  </p>
                </div>

                {/* Invite Code Input */}
                <div>
                  <label htmlFor="signup-inviteCode" className="block text-sm font-medium text-[#e5e5e5] mb-2">
                    Invite Code
                  </label>
                  <div className="relative">
                    <Ticket className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#737373] w-5 h-5" />
                    <input
                      id="signup-inviteCode"
                      type="text"
                      value={signupInviteCode}
                      onChange={(e) => setSignupInviteCode(e.target.value.toUpperCase())}
                      placeholder="TEST-2025"
                      required
                      disabled={signupLoading}
                      className="w-full pl-10 pr-4 py-3 bg-[#0f0f0f] border border-[#a3a3a3]/20 text-[#e5e5e5] placeholder-[#737373] rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed uppercase font-mono"
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#737373]">
                    Received from OneLibro admin
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={signupLoading}
                  className="w-full bg-[#10b981] hover:bg-[#10b981]/90 text-[#1a1a1a] font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {signupLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Create Account
                    </>
                  )}
                </button>

                {/* Request Invite Code Link */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">
                    Don&apos;t have an invite code?{' '}
                    <button
                      type="button"
                      onClick={() => setShowRequestModal(true)}
                      className="text-[#10b981] hover:underline font-medium"
                    >
                      Request one
                    </button>
                  </p>
                </div>

                {/* Success Message */}
                {signupSuccess && (
                  <div className="bg-green-900/20 border border-green-800/50 text-green-300 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
                    <p className="font-semibold">Account created successfully!</p>
                    <p className="text-xs mt-1">
                      Please check your email to confirm your account, then use the Login tab above.
                    </p>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-sm text-[#10b981] font-semibold mb-1">
            💡 {activeTab === 'login' ? 'First time here?' : 'Need an invite code?'}
          </p>
          <p className="text-xs text-[#a3a3a3]">
            {activeTab === 'login'
              ? 'Click the "Sign Up" tab above to create an account with an invite code.'
              : 'Invite codes are provided by OneLibro administrators. Contact support if you need one.'}
          </p>
        </div>
      </div>

      {/* Request Invite Modal */}
      <RequestInviteModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
    </div>
  );
}
