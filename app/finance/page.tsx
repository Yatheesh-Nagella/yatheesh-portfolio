'use client';

/**
 * OneLedger Landing Page
 * Public page explaining the app with login button
 * This is the first page users see at /finance
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  TrendingUp,
  Shield,
  BarChart3,
  Wallet,
  Lock,
  Zap,
  ChevronRight,
} from 'lucide-react';

export default function OneLedgerLanding() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Wallet className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">OneLedger</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => router.push('/')}
                className="hidden sm:block text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base"
              >
                Portfolio
              </button>
              <button
                onClick={() => router.push('/finance/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Invite-Only Personal Finance Platform
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Personal Finance
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              All in One Place
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect your bank accounts, track spending, manage budgets, and gain insights into your financial health — all securely encrypted and invite-only.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push('/finance/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center shadow-lg hover:shadow-xl"
            >
              Get Started
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 font-semibold text-lg flex items-center"
            >
              Learn More
              <ChevronRight className="w-5 h-5 ml-1" />
            </a>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Have an invite code?
            <button
              onClick={() => router.push('/finance/login')}
              className="text-blue-600 hover:text-blue-700 font-medium ml-1"
            >
              Login here →
            </button>
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Manage Your Money
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            OneLedger brings all your financial accounts together in one secure, easy-to-use platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Connect All Your Banks
            </h3>
            <p className="text-gray-600">
              Securely link checking, savings, and credit card accounts from 10,000+ institutions via Plaid.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Track Spending
            </h3>
            <p className="text-gray-600">
              Automatically categorize transactions and visualize your spending patterns over time.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Smart Analytics
            </h3>
            <p className="text-gray-600">
              Get insights into your financial health with charts, trends, and spending breakdowns.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Budget Management
            </h3>
            <p className="text-gray-600">
              Create budgets for different categories and track your progress throughout the month.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Bank-Level Security
            </h3>
            <p className="text-gray-600">
              Your data is encrypted end-to-end. We never store your bank credentials.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Invite-Only Access
            </h3>
            <p className="text-gray-600">
              Exclusive platform with controlled access for privacy and quality user experience.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How OneLedger Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started in minutes with our simple 3-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Login with Invite Code
              </h3>
              <p className="text-gray-600">
                Use your unique invite code to create your secure account.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Connect Your Banks
              </h3>
              <p className="text-gray-600">
                Securely link your bank accounts via Plaid in just a few clicks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Track & Manage
              </h3>
              <p className="text-gray-600">
                View your dashboard and start managing your finances with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join OneLedger today and experience financial clarity like never before.
          </p>
          <button
            onClick={() => router.push('/finance/login')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl inline-flex items-center"
          >
            Login to Get Started
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
          <p className="text-sm mt-4 opacity-75">
            Need an invite code? Contact your administrator.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Wallet className="w-6 h-6 text-blue-400" />
                <span className="text-white font-bold text-lg">OneLedger</span>
              </div>
              <p className="text-sm">
                Your personal finance ledger, all in one secure place.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => router.push('/finance/login')}
                    className="hover:text-white transition-colors"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>Security</li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => router.push('/')}
                    className="hover:text-white transition-colors"
                  >
                    Portfolio
                  </button>
                </li>
                <li>
                  <a
                    href="https://github.com/Yatheesh-Nagella"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/in/Yatheesh-Nagella"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>
              © 2025 OneLedger by Yatheesh Nagella. All rights reserved.
            </p>
            <p className="mt-2 text-xs">
              Powered by Plaid • Secured by Supabase • Hosted on Vercel
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
