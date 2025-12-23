/* eslint-disable react/no-unescaped-entities */
'use client';

/**
 * OneLibro Terms of Service Page
 * Dark theme design with comprehensive legal terms
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FileText, Scale, Shield, AlertCircle, UserX, RefreshCw } from 'lucide-react';

export default function TermsOfService() {
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
              onClick={() => router.push('/finance')}
              className="px-6 py-2 text-sm font-medium tracking-wide text-[#D0D6B5] hover:text-white transition-colors rounded-lg hover:bg-[#4C6B56]/10"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#02224F] via-[#090C02] to-[#4C6B56]/20" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-[#4C6B56]/15 flex items-center justify-center">
              <Scale className="w-10 h-10 text-[#4C6B56]" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#D0D6B5]">
            Terms of Service
          </h1>
          <p className="text-lg text-[#D0D6B5]/70 max-w-2xl mx-auto">
            Please read these terms carefully before using OneLibro. By accessing our platform, you agree to be bound by these terms.
          </p>
          <p className="text-sm text-[#D0D6B5]/50">
            Last Updated: December 16, 2025
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-16">

          {/* Acceptance of Terms */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center flex-shrink-0 mt-1">
                <FileText className="w-6 h-6 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  1. Acceptance of Terms
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    These Terms of Service ("Terms") constitute a legally binding agreement between you and OneLibro ("we," "us," or "our") regarding your use of the OneLibro personal finance management platform (the "Service").
                  </p>
                  <p>
                    By creating an account, accessing, or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms, as well as our{' '}
                    <button onClick={() => router.push('/finance/privacy')} className="text-[#4C6B56] hover:underline">
                      Privacy Policy
                    </button>
                    .
                  </p>
                  <p className="font-medium text-[#D0D6B5]">
                    If you do not agree to these Terms, you must not access or use the Service.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#02224F]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <UserX className="w-6 h-6 text-[#D0D6B5]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  2. Eligibility
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>To use OneLibro, you must:</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Be at least 18 years of age</li>
                    <li>Have the legal capacity to enter into a binding contract</li>
                    <li>Possess a valid invite code (OneLibro is invite-only)</li>
                    <li>Reside in a jurisdiction where our Service is available</li>
                    <li>Not be prohibited from using the Service under applicable laws</li>
                  </ul>
                  <div className="rounded-xl p-4 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10 mt-4">
                    <p className="text-sm">
                      <span className="font-semibold text-[#D0D6B5]">Note:</span> By using the Service, you represent and warrant that you meet all eligibility requirements. If you do not meet these requirements, you must not access or use the Service.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Registration */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="w-6 h-6 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  3. Account Registration and Security
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <h3 className="text-lg font-semibold text-[#D0D6B5]">3.1 Account Creation</h3>
                  <p>
                    To access the Service, you must create an account using a valid invite code. You agree to:
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Provide accurate, current, and complete information during registration</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Keep your password secure and confidential</li>
                    <li>Notify us immediately of any unauthorized access to your account</li>
                    <li>Accept responsibility for all activities that occur under your account</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-[#D0D6B5] mt-6">3.2 Invite-Only Access</h3>
                  <p>
                    OneLibro is an exclusive, invite-only platform. Invite codes:
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Are non-transferable and for personal use only</li>
                    <li>May have usage limits and expiration dates</li>
                    <li>Can be revoked at our discretion</li>
                    <li>Must not be sold, traded, or publicly distributed</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-[#D0D6B5] mt-6">3.3 Account Termination</h3>
                  <p>
                    We reserve the right to suspend or terminate your account at any time for:
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Violation of these Terms</li>
                    <li>Fraudulent or illegal activity</li>
                    <li>Prolonged inactivity (90+ days)</li>
                    <li>Providing false or misleading information</li>
                    <li>Any other reason at our sole discretion</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Service Description */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#02224F]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <FileText className="w-6 h-6 text-[#D0D6B5]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  4. Service Description
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    OneLibro provides personal finance management tools, including:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl p-4 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">Account Aggregation</h4>
                      <p className="text-sm">Connect and view multiple financial accounts in one place via Plaid integration</p>
                    </div>
                    <div className="rounded-xl p-4 bg-[#776871]/5 border border-[#776871]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">Transaction Tracking</h4>
                      <p className="text-sm">Automatic categorization and syncing of financial transactions</p>
                    </div>
                    <div className="rounded-xl p-4 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">Budget Management</h4>
                      <p className="text-sm">Create and track budgets across spending categories</p>
                    </div>
                    <div className="rounded-xl p-4 bg-[#776871]/5 border border-[#776871]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">Financial Insights</h4>
                      <p className="text-sm">Analytics, charts, and spending trend visualizations</p>
                    </div>
                  </div>
                  <div className="rounded-xl p-4 bg-[#4C6B56]/5 border border-[#4C6B56]/20 mt-4">
                    <p className="text-sm">
                      <span className="font-semibold text-[#D0D6B5]">Important:</span> OneLibro is a financial management tool only. We do not provide financial advice, investment recommendations, tax guidance, or banking services. You are solely responsible for your financial decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Responsibilities */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center flex-shrink-0 mt-1">
                <AlertCircle className="w-6 h-6 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  5. User Responsibilities and Prohibited Conduct
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p className="font-medium text-[#D0D6B5]">You agree NOT to:</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Use the Service for any illegal, fraudulent, or unauthorized purpose</li>
                    <li>Attempt to gain unauthorized access to our systems, servers, or networks</li>
                    <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                    <li>Use automated systems (bots, scrapers) to access the Service</li>
                    <li>Interfere with or disrupt the Service or servers</li>
                    <li>Impersonate any person or entity, or falsely represent your affiliation</li>
                    <li>Upload or transmit viruses, malware, or malicious code</li>
                    <li>Collect or harvest user information without consent</li>
                    <li>Share your account credentials with others</li>
                    <li>Resell, redistribute, or sublicense the Service</li>
                    <li>Use the Service to violate any applicable laws or regulations</li>
                  </ul>
                  <p className="mt-4">
                    <span className="font-semibold text-[#D0D6B5]">Consequences:</span> Violation of these prohibited activities may result in immediate account termination, legal action, and referral to law enforcement authorities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Data */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#02224F]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="w-6 h-6 text-[#D0D6B5]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  6. Financial Data and Third-Party Services
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <h3 className="text-lg font-semibold text-[#D0D6B5]">6.1 Plaid Integration</h3>
                  <p>
                    OneLibro uses Plaid to connect to your financial institutions. By linking your accounts:
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>You authorize Plaid to access your financial data on your behalf</li>
                    <li>You agree to Plaid's Terms of Service and Privacy Policy</li>
                    <li>You understand that we do not store your bank login credentials</li>
                    <li>You acknowledge that account connectivity depends on Plaid's service availability</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-[#D0D6B5] mt-6">6.2 Data Accuracy</h3>
                  <p>
                    While we strive for accuracy, we cannot guarantee that:
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Financial data from third parties is always current or accurate</li>
                    <li>Transaction categorization is 100% correct</li>
                    <li>Account balances are real-time (syncing may be delayed)</li>
                    <li>All institutions are supported or will remain supported</li>
                  </ul>
                  <p className="mt-4 font-medium text-[#D0D6B5]">
                    You are responsible for verifying your financial information and should not rely solely on OneLibro for critical financial decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center flex-shrink-0 mt-1">
                <FileText className="w-6 h-6 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  7. Intellectual Property Rights
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    The Service, including all content, features, functionality, software, designs, text, graphics, logos, and trademarks, is owned by OneLibro and protected by copyright, trademark, and other intellectual property laws.
                  </p>
                  <p>
                    You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Service for personal, non-commercial purposes only.
                  </p>
                  <p className="font-medium text-[#D0D6B5]">
                    You may NOT copy, modify, distribute, sell, or create derivative works from any part of the Service without our express written permission.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimers */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#02224F]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <AlertCircle className="w-6 h-6 text-[#D0D6B5]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  8. Disclaimers and Warranties
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <div className="rounded-xl p-6 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10">
                    <p className="font-bold text-[#D0D6B5] mb-3">THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.</p>
                    <p className="mb-2">To the fullest extent permitted by law, we disclaim all warranties, express or implied, including:</p>
                    <ul className="space-y-1 list-disc list-inside text-sm">
                      <li>Warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
                      <li>Warranties regarding accuracy, reliability, or availability of the Service</li>
                      <li>Warranties that the Service will be uninterrupted, secure, or error-free</li>
                      <li>Warranties that defects will be corrected</li>
                    </ul>
                  </div>

                  <p className="mt-4">
                    <span className="font-semibold text-[#D0D6B5]">No Financial Advice:</span> OneLibro does not provide financial, investment, tax, or legal advice. Any information provided through the Service is for informational purposes only and should not be construed as professional advice.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center flex-shrink-0 mt-1">
                <Scale className="w-6 h-6 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  9. Limitation of Liability
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <div className="rounded-xl p-6 bg-[#776871]/5 border border-[#776871]/10">
                    <p className="font-bold text-[#D0D6B5] mb-3">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
                    <p className="mb-3">
                      OneLibro, its affiliates, officers, directors, employees, and agents shall NOT be liable for any indirect, incidental, special, consequential, or punitive damages, including:
                    </p>
                    <ul className="space-y-1 list-disc list-inside text-sm">
                      <li>Loss of profits, revenue, data, or business opportunities</li>
                      <li>Financial losses resulting from your use of or inability to use the Service</li>
                      <li>Errors, omissions, or inaccuracies in financial data</li>
                      <li>Unauthorized access to your account or data</li>
                      <li>Third-party conduct or content</li>
                      <li>Service interruptions or security breaches</li>
                    </ul>
                    <p className="mt-3 font-semibold text-[#D0D6B5]">
                      Our total liability to you for any claims arising from your use of the Service shall not exceed the greater of $100 USD or the amount you paid us in the past 12 months.
                    </p>
                  </div>
                  <p className="text-sm italic">
                    Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability for incidental or consequential damages. In such jurisdictions, our liability will be limited to the greatest extent permitted by law.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Indemnification */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#02224F]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="w-6 h-6 text-[#D0D6B5]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  10. Indemnification
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    You agree to indemnify, defend, and hold harmless OneLibro, its affiliates, and their respective officers, directors, employees, and agents from any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising from:
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Your use or misuse of the Service</li>
                    <li>Your violation of these Terms</li>
                    <li>Your violation of any laws or regulations</li>
                    <li>Your violation of any third-party rights</li>
                    <li>Any financial decisions you make based on the Service</li>
                    <li>Unauthorized access to your account due to your negligence</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Changes to Service */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center flex-shrink-0 mt-1">
                <RefreshCw className="w-6 h-6 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  11. Modifications to Service and Terms
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <h3 className="text-lg font-semibold text-[#D0D6B5]">11.1 Service Changes</h3>
                  <p>
                    We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time, with or without notice. We are not liable for any modification, suspension, or discontinuation of the Service.
                  </p>

                  <h3 className="text-lg font-semibold text-[#D0D6B5] mt-6">11.2 Terms Changes</h3>
                  <p>
                    We may update these Terms from time to time. When we make material changes, we will:
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Update the "Last Updated" date at the top of this page</li>
                    <li>Notify you via email or through the Service</li>
                    <li>Provide you with an opportunity to review the changes</li>
                  </ul>
                  <p className="mt-4 font-medium text-[#D0D6B5]">
                    Your continued use of the Service after changes become effective constitutes your acceptance of the revised Terms. If you do not agree to the new Terms, you must stop using the Service and close your account.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Termination */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#02224F]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <UserX className="w-6 h-6 text-[#D0D6B5]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  12. Termination
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <h3 className="text-lg font-semibold text-[#D0D6B5]">12.1 Termination by You</h3>
                  <p>
                    You may terminate your account at any time by contacting us at{' '}
                    <a href="mailto:support@oneLibro.com" className="text-[#4C6B56] hover:underline">
                      support@oneLibro.com
                    </a>
                    {' '}or through your account settings.
                  </p>

                  <h3 className="text-lg font-semibold text-[#D0D6B5] mt-6">12.2 Termination by Us</h3>
                  <p>
                    We may terminate or suspend your account immediately, without prior notice, if:
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>You breach these Terms</li>
                    <li>We are required to do so by law</li>
                    <li>We suspect fraudulent, abusive, or illegal activity</li>
                    <li>We discontinue the Service</li>
                    <li>Your account remains inactive for 90+ days</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-[#D0D6B5] mt-6">12.3 Effect of Termination</h3>
                  <p>
                    Upon termination:
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Your right to access and use the Service ceases immediately</li>
                    <li>Your data will be deleted in accordance with our Privacy Policy</li>
                    <li>All provisions that should survive termination will remain in effect (including disclaimers, limitations of liability, and indemnification)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Governing Law */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center flex-shrink-0 mt-1">
                <Scale className="w-6 h-6 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  13. Governing Law and Dispute Resolution
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <h3 className="text-lg font-semibold text-[#D0D6B5]">13.1 Governing Law</h3>
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of the United States and the State of [Your State], without regard to its conflict of law provisions.
                  </p>

                  <h3 className="text-lg font-semibold text-[#D0D6B5] mt-6">13.2 Dispute Resolution</h3>
                  <p>
                    In the event of any dispute arising from these Terms or your use of the Service, you agree to first attempt to resolve the dispute informally by contacting us at{' '}
                    <a href="mailto:legal@oneLibro.com" className="text-[#4C6B56] hover:underline">
                      legal@oneLibro.com
                    </a>
                    .
                  </p>
                  <p>
                    If the dispute cannot be resolved within 30 days, either party may pursue legal remedies in accordance with applicable law.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Miscellaneous */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#02224F]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <FileText className="w-6 h-6 text-[#D0D6B5]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  14. Miscellaneous
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-[#D0D6B5]">Entire Agreement</h4>
                      <p className="text-sm">These Terms, together with our Privacy Policy, constitute the entire agreement between you and OneLibro regarding your use of the Service.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#D0D6B5]">Severability</h4>
                      <p className="text-sm">If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#D0D6B5]">Waiver</h4>
                      <p className="text-sm">Our failure to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#D0D6B5]">Assignment</h4>
                      <p className="text-sm">You may not assign or transfer these Terms or your account without our prior written consent. We may assign these Terms without restriction.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#D0D6B5]">Force Majeure</h4>
                      <p className="text-sm">We are not liable for any failure to perform due to circumstances beyond our reasonable control, including natural disasters, war, terrorism, riots, or network failures.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center flex-shrink-0 mt-1">
                <AlertCircle className="w-6 h-6 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  15. Contact Information
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    If you have any questions, concerns, or feedback regarding these Terms of Service, please contact us:
                  </p>
                  <div className="rounded-xl p-6 bg-[#4C6B56]/5 border border-[#4C6B56]/20 space-y-2">
                    <p className="font-medium text-[#D0D6B5]">OneLibro Legal Team</p>
                    <p>Email: <a href="mailto:legal@oneLibro.com" className="text-[#4C6B56] hover:underline">legal@oneLibro.com</a></p>
                    <p>Support: <a href="mailto:support@oneLibro.com" className="text-[#4C6B56] hover:underline">support@oneLibro.com</a></p>
                    <p className="text-sm text-[#D0D6B5]/60 mt-2">
                      We will respond to your inquiry within 5-7 business days.
                    </p>
                  </div>
                  <div className="rounded-xl p-4 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10 mt-4">
                    <p className="text-sm font-medium text-[#D0D6B5]">
                      By using OneLibro, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-8 bg-[#090C02] border-t border-[#D0D6B5]/10">
        <div className="max-w-6xl mx-auto space-y-8">
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
