'use client';

/**
 * OneLibro Landing Page
 * Dark, sophisticated design for premium financial platform
 * Invite-only personal finance management
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Building2,
  Receipt,
  PieChart,
  TrendingUp,
  Shield,
  UserCheck,
} from 'lucide-react';

export default function OneLibroLanding() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#090C02]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#090C02]/80 backdrop-blur-sm border-b border-[#D0D6B5]/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 relative">
                <Image
                  src="/oneLibro-logo.png"
                  alt="OneLibro Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-sm font-medium tracking-wider text-[#D0D6B5]">
                OneLibro
              </span>
            </div>

            <button
              onClick={() => router.push('/finance/login')}
              className="px-6 py-2 text-sm font-medium tracking-wide text-[#D0D6B5] hover:text-white transition-colors rounded-lg hover:bg-[#4C6B56]/10"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#02224F] via-[#090C02] to-[#4C6B56]/20" />

        <div className="relative max-w-4xl mx-auto text-center space-y-12">
          {/* Logo Display */}
          <div className="w-56 h-56 mx-auto relative rounded-3xl bg-[#E8EBD8] p-6 shadow-2xl">
            <div className="relative w-full h-full">
              <Image
                src="/oneLibro-logo.png"
                alt="OneLibro Logo"
                fill
                className="object-contain drop-shadow-[0_0_40px_rgba(76,107,86,0.4)]"
                priority
              />
            </div>
          </div>

          {/* Hero Text */}
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-[#D0D6B5] text-balance leading-tight">
              Your Personal Finance.
              <br />
              All in One Ledger.
            </h1>
            <p className="text-lg lg:text-xl font-normal text-[#D0D6B5]/70 text-pretty max-w-2xl mx-auto">
              An invite-only, privacy-first platform to track accounts, budgets,
              and investments in real-time.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => router.push('/finance/login')}
            className="inline-block px-10 py-3.5 bg-[#4C6B56] hover:bg-[#4C6B56]/90 text-[#D0D6B5] font-medium tracking-wide rounded-xl transition-all hover:shadow-[0_0_30px_rgba(76,107,86,0.5)] text-base"
          >
            Get started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-[#090C02] to-[#02224F]/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#D0D6B5] text-center mb-16">
            Everything You Need
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="relative rounded-xl p-8 space-y-6 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10 hover:border-[#4C6B56]/40 transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 rounded-lg bg-[#4C6B56]/15 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-[#4C6B56]" strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-bold text-[#D0D6B5]">
                Connect All Your Banks
              </h3>

              <p className="text-[#D0D6B5]/70 font-normal leading-relaxed">
                Securely link checking, savings, and credit card accounts from
                10,000+ institutions via Plaid.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="relative rounded-xl p-8 space-y-6 bg-[#776871]/5 border border-[#776871]/10 hover:border-[#4C6B56]/40 transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 rounded-lg bg-[#4C6B56]/15 flex items-center justify-center">
                <Receipt className="w-7 h-7 text-[#4C6B56]" strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-bold text-[#D0D6B5]">Track Spending</h3>

              <p className="text-[#D0D6B5]/70 font-normal leading-relaxed">
                Automatically categorize transactions and visualize your spending
                patterns over time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="relative rounded-xl p-8 space-y-6 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10 hover:border-[#4C6B56]/40 transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 rounded-lg bg-[#4C6B56]/15 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-[#4C6B56]" strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-bold text-[#D0D6B5]">Smart Analytics</h3>

              <p className="text-[#D0D6B5]/70 font-normal leading-relaxed">
                Get insights into your financial health with charts, trends, and
                spending breakdowns.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="relative rounded-xl p-8 space-y-6 bg-[#776871]/5 border border-[#776871]/10 hover:border-[#4C6B56]/40 transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 rounded-lg bg-[#4C6B56]/15 flex items-center justify-center">
                <PieChart className="w-7 h-7 text-[#4C6B56]" strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-bold text-[#D0D6B5]">
                Budget Management
              </h3>

              <p className="text-[#D0D6B5]/70 font-normal leading-relaxed">
                Create budgets for different categories and track your progress
                throughout the month.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="relative rounded-xl p-8 space-y-6 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10 hover:border-[#4C6B56]/40 transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 rounded-lg bg-[#4C6B56]/15 flex items-center justify-center">
                <Shield className="w-7 h-7 text-[#4C6B56]" strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-bold text-[#D0D6B5]">
                Bank-Level Security
              </h3>

              <p className="text-[#D0D6B5]/70 font-normal leading-relaxed">
                Your data is encrypted end-to-end. We never store your bank
                credentials.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="relative rounded-xl p-8 space-y-6 bg-[#776871]/5 border border-[#776871]/10 hover:border-[#4C6B56]/40 transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 rounded-lg bg-[#4C6B56]/15 flex items-center justify-center">
                <UserCheck className="w-7 h-7 text-[#4C6B56]" strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-bold text-[#D0D6B5]">
                Invite-Only Access
              </h3>

              <p className="text-[#D0D6B5]/70 font-normal leading-relaxed">
                Exclusive platform with controlled access for privacy and quality
                user experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#D0D6B5] text-center mb-16">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#D0D6B5] flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-[#02224F]">1</span>
              </div>
              <h3 className="text-xl font-bold text-[#D0D6B5]">Request Access</h3>
              <p className="text-[#D0D6B5]/70 font-normal leading-relaxed">
                Join our exclusive invite-only platform for serious wealth
                management.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#D0D6B5] flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-[#02224F]">2</span>
              </div>
              <h3 className="text-xl font-bold text-[#D0D6B5]">
                Connect Accounts
              </h3>
              <p className="text-[#D0D6B5]/70 font-normal leading-relaxed">
                Securely link your financial institutions in minutes with
                bank-level encryption.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#D0D6B5] flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-[#02224F]">3</span>
              </div>
              <h3 className="text-xl font-bold text-[#D0D6B5]">
                Track & Optimize
              </h3>
              <p className="text-[#D0D6B5]/70 font-normal leading-relaxed">
                Monitor your wealth in real-time and make informed financial
                decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-8 bg-[#090C02] border-t border-[#D0D6B5]/10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 relative">
                <Image
                  src="/oneLibro-logo.png"
                  alt="OneLibro Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-medium tracking-wider text-[#D0D6B5]">
                OneLibro
              </span>
            </div>
            <p className="text-sm text-[#D0D6B5]/50 text-center">
              Professional wealth management for the privacy-conscious
            </p>
          </div>

          <div className="border-t border-[#D0D6B5]/10" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex gap-8 text-sm font-normal text-[#776871]">
              <button
                onClick={() => router.push('/finance/privacy')}
                className="hover:text-[#090C02] hover:bg-[#D0D6B5] px-3 py-1 rounded transition-all"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => router.push('/finance/terms')}
                className="hover:text-[#090C02] hover:bg-[#D0D6B5] px-3 py-1 rounded transition-all"
              >
                Terms of Service
              </button>
              <button
                onClick={() => router.push('/finance/security')}
                className="hover:text-[#090C02] hover:bg-[#D0D6B5] px-3 py-1 rounded transition-all"
              >
                Security
              </button>
            </div>

            <p className="text-sm font-normal text-[#D0D6B5]/50">
              © 2025 OneLibro by Yatheesh Nagella. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
