/* eslint-disable react/no-unescaped-entities */
'use client';

/**
 * OneLibro Privacy Policy Page
 * Dark theme design with comprehensive privacy information
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Shield, Lock, Eye, UserCheck, FileText, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
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
              <Shield className="w-10 h-10 text-[#4C6B56]" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#D0D6B5]">
            Privacy Policy
          </h1>
          <p className="text-lg text-[#D0D6B5]/70 max-w-2xl mx-auto">
            Your privacy is our priority. Learn how we collect, use, and protect your personal and financial information.
          </p>
          <p className="text-sm text-[#D0D6B5]/50">
            Last Updated: December 16, 2025
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-16">

          {/* Introduction */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center flex-shrink-0 mt-1">
                <FileText className="w-6 h-6 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  Introduction
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    Welcome to OneLibro ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our personal finance management platform.
                  </p>
                  <p>
                    OneLibro is an invite-only platform that connects to your financial accounts via Plaid to provide you with consolidated views of your finances, transaction tracking, budgeting tools, and financial insights.
                  </p>
                  <p>
                    By using OneLibro, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, please do not use our service.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data We Collect */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#02224F]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <Eye className="w-6 h-6 text-[#D0D6B5]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  Information We Collect
                </h2>
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="rounded-xl p-6 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10 space-y-3">
                    <h3 className="text-xl font-semibold text-[#D0D6B5]">
                      Personal Information
                    </h3>
                    <ul className="space-y-2 text-[#D0D6B5]/70 leading-relaxed list-disc list-inside">
                      <li>Full name</li>
                      <li>Email address</li>
                      <li>Password (hashed and encrypted using bcrypt)</li>
                      <li>Invite code (for account creation)</li>
                      <li>Account preferences and settings</li>
                    </ul>
                  </div>

                  {/* Financial Information */}
                  <div className="rounded-xl p-6 bg-[#776871]/5 border border-[#776871]/10 space-y-3">
                    <h3 className="text-xl font-semibold text-[#D0D6B5]">
                      Financial Information (via Plaid)
                    </h3>
                    <ul className="space-y-2 text-[#D0D6B5]/70 leading-relaxed list-disc list-inside">
                      <li>Bank account details (account numbers, routing numbers, balances)</li>
                      <li>Credit card information (card numbers, balances, credit limits)</li>
                      <li>Transaction history (dates, amounts, merchant names, categories)</li>
                      <li>Investment account information (if connected)</li>
                      <li>Financial institution names and connection status</li>
                    </ul>
                    <p className="text-sm text-[#D0D6B5]/60 italic mt-3">
                      Note: We never store your bank login credentials. All bank connections are handled securely through Plaid's API.
                    </p>
                  </div>

                  {/* Usage Information */}
                  <div className="rounded-xl p-6 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10 space-y-3">
                    <h3 className="text-xl font-semibold text-[#D0D6B5]">
                      Usage Information
                    </h3>
                    <ul className="space-y-2 text-[#D0D6B5]/70 leading-relaxed list-disc list-inside">
                      <li>Login activity and session data</li>
                      <li>Budget creation and modifications</li>
                      <li>Transaction categorization and tags</li>
                      <li>Feature usage and interaction patterns</li>
                      <li>Device information (browser type, operating system)</li>
                      <li>IP address and approximate location</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center flex-shrink-0 mt-1">
                <UserCheck className="w-6 h-6 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  How We Use Your Information
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>We use the information we collect for the following purposes:</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li><span className="font-medium text-[#D0D6B5]">Provide Our Services:</span> Display your financial accounts, transactions, budgets, and insights in a consolidated dashboard</li>
                    <li><span className="font-medium text-[#D0D6B5]">Account Management:</span> Create and manage your OneLibro account, authenticate your identity, and maintain session security</li>
                    <li><span className="font-medium text-[#D0D6B5]">Transaction Syncing:</span> Automatically sync and categorize transactions from your connected financial institutions</li>
                    <li><span className="font-medium text-[#D0D6B5]">Financial Insights:</span> Generate spending analytics, budget tracking, and personalized financial recommendations</li>
                    <li><span className="font-medium text-[#D0D6B5]">Service Improvements:</span> Analyze usage patterns to improve our platform, fix bugs, and develop new features</li>
                    <li><span className="font-medium text-[#D0D6B5]">Security:</span> Detect and prevent fraudulent activity, unauthorized access, and security threats</li>
                    <li><span className="font-medium text-[#D0D6B5]">Communication:</span> Send important account updates, security alerts, and service notifications</li>
                    <li><span className="font-medium text-[#D0D6B5]">Legal Compliance:</span> Comply with applicable laws, regulations, and legal processes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Data Sharing */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#02224F]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <Lock className="w-6 h-6 text-[#D0D6B5]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  Data Sharing and Disclosure
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p className="font-medium text-[#D0D6B5]">
                    We do NOT sell, rent, or trade your personal or financial information to third parties for marketing purposes.
                  </p>
                  <p>We may share your information only in the following limited circumstances:</p>
                  <div className="space-y-4">
                    <div className="rounded-xl p-6 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">Service Providers</h4>
                      <p>
                        We share data with trusted third-party service providers who help us operate our platform:
                      </p>
                      <ul className="mt-2 space-y-1 list-disc list-inside">
                        <li><strong>Plaid:</strong> Connects to your financial institutions and retrieves account data</li>
                        <li><strong>Supabase:</strong> Hosts our database and authentication infrastructure</li>
                        <li><strong>Vercel:</strong> Hosts our web application</li>
                      </ul>
                      <p className="mt-2 text-sm text-[#D0D6B5]/60">
                        These providers are contractually obligated to protect your data and use it only for the services they provide to us.
                      </p>
                    </div>

                    <div className="rounded-xl p-6 bg-[#776871]/5 border border-[#776871]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">Legal Requirements</h4>
                      <p>
                        We may disclose your information if required by law, court order, subpoena, or government request, or to:
                      </p>
                      <ul className="mt-2 space-y-1 list-disc list-inside">
                        <li>Comply with legal obligations</li>
                        <li>Protect our rights, property, or safety</li>
                        <li>Prevent fraud or security threats</li>
                        <li>Respond to emergency situations</li>
                      </ul>
                    </div>

                    <div className="rounded-xl p-6 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">Business Transfers</h4>
                      <p>
                        In the event of a merger, acquisition, reorganization, or sale of assets, your information may be transferred to the acquiring entity. We will notify you of any such change and your rights regarding your data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="w-6 h-6 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  Data Security
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    We implement industry-standard security measures to protect your information:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl p-4 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">Encryption</h4>
                      <p className="text-sm">
                        All data is encrypted in transit (TLS/SSL) and at rest (AES-256-CBC)
                      </p>
                    </div>
                    <div className="rounded-xl p-4 bg-[#776871]/5 border border-[#776871]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">Password Security</h4>
                      <p className="text-sm">
                        Passwords are hashed using bcrypt with salt rounds
                      </p>
                    </div>
                    <div className="rounded-xl p-4 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">Access Control</h4>
                      <p className="text-sm">
                        Role-based permissions and Row Level Security (RLS) in Supabase
                      </p>
                    </div>
                    <div className="rounded-xl p-4 bg-[#776871]/5 border border-[#776871]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">Plaid Security</h4>
                      <p className="text-sm">
                        Bank credentials never stored; Plaid access tokens encrypted
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-[#D0D6B5]/60 italic mt-4">
                    While we strive to use commercially acceptable means to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#02224F]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <UserCheck className="w-6 h-6 text-[#D0D6B5]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  Your Privacy Rights
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>You have the following rights regarding your personal information:</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#4C6B56] mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-[#D0D6B5]">Access</h4>
                        <p>Request a copy of the personal data we hold about you</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#4C6B56] mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-[#D0D6B5]">Correction</h4>
                        <p>Update or correct inaccurate personal information through your account settings</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#4C6B56] mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-[#D0D6B5]">Deletion</h4>
                        <p>Request deletion of your account and associated data (note: some information may be retained for legal compliance)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#4C6B56] mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-[#D0D6B5]">Data Portability</h4>
                        <p>Request an export of your data in a structured, machine-readable format</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#4C6B56] mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-[#D0D6B5]">Disconnect Accounts</h4>
                        <p>Remove connected bank accounts at any time through your dashboard settings</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4">
                    To exercise any of these rights, please contact us at{' '}
                    <a href="mailto:privacy@oneLibro.com" className="text-[#4C6B56] hover:underline">
                      privacy@oneLibro.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Retention */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center flex-shrink-0 mt-1">
                <FileText className="w-6 h-6 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  Data Retention
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    We retain your information for as long as your account is active or as needed to provide you with our services. When you delete your account:
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Your personal information is deleted within 30 days</li>
                    <li>Financial data is deleted within 90 days</li>
                    <li>Some data may be retained longer if required by law or for legitimate business purposes (e.g., fraud prevention, legal compliance)</li>
                    <li>Anonymized or aggregated data may be retained indefinitely for analytics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Cookies and Tracking */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#02224F]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <Eye className="w-6 h-6 text-[#D0D6B5]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  Cookies and Tracking Technologies
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    We use cookies and similar tracking technologies to maintain your session, remember your preferences, and improve your experience:
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li><strong>Essential Cookies:</strong> Required for authentication and basic platform functionality</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and customizations</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform</li>
                  </ul>
                  <p>
                    You can control cookies through your browser settings, but disabling certain cookies may limit your ability to use some features of our service.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Third-Party Links */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center flex-shrink-0 mt-1">
                <Lock className="w-6 h-6 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  Third-Party Services
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    Our service integrates with third-party services (primarily Plaid for banking connections). We are not responsible for the privacy practices of these third parties. We recommend reviewing their privacy policies:
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>
                      <a href="https://plaid.com/legal/#privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#4C6B56] hover:underline">
                        Plaid Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#4C6B56] hover:underline">
                        Supabase Privacy Policy
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Children's Privacy */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#02224F]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <UserCheck className="w-6 h-6 text-[#D0D6B5]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  Children's Privacy
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    OneLibro is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately, and we will delete such information from our systems.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Changes to Policy */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center flex-shrink-0 mt-1">
                <FileText className="w-6 h-6 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  Changes to This Privacy Policy
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by:
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Posting the updated policy on this page with a new "Last Updated" date</li>
                    <li>Sending an email notification to your registered email address</li>
                    <li>Displaying a prominent notice on our platform</li>
                  </ul>
                  <p>
                    Your continued use of OneLibro after any changes indicates your acceptance of the updated Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#02224F]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <Mail className="w-6 h-6 text-[#D0D6B5]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  Contact Us
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="rounded-xl p-6 bg-[#4C6B56]/5 border border-[#4C6B56]/20 space-y-2">
                    <p className="font-medium text-[#D0D6B5]">OneLibro Privacy Team</p>
                    <p>Email: <a href="mailto:privacy@oneLibro.com" className="text-[#4C6B56] hover:underline">privacy@oneLibro.com</a></p>
                    <p>Support: <a href="mailto:support@oneLibro.com" className="text-[#4C6B56] hover:underline">support@oneLibro.com</a></p>
                    <p className="text-sm text-[#D0D6B5]/60 mt-2">
                      We will respond to your inquiry within 30 days.
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
              © {new Date().getFullYear()} OneLibro by Yatheesh Nagella. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
