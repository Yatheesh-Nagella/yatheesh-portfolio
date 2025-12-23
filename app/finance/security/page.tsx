/* eslint-disable react/no-unescaped-entities */
'use client';

/**
 * OneLibro Security Page
 * Dark theme design showcasing security measures and trust indicators
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Shield, Lock, Key, Database, Server, Eye, CheckCircle, AlertTriangle } from 'lucide-react';

export default function SecurityPage() {
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
            Bank-Level Security
          </h1>
          <p className="text-lg text-[#D0D6B5]/70 max-w-2xl mx-auto">
            Your financial data deserves the highest level of protection. Learn how we secure your information with industry-leading encryption and security practices.
          </p>
        </div>
      </section>

      {/* Security Overview */}
      <section className="py-16 px-6 lg:px-8 bg-gradient-to-b from-[#090C02] to-[#02224F]/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#D0D6B5] text-center mb-12">
            How We Protect Your Data
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Security Feature 1 */}
            <div className="rounded-xl p-6 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10 hover:border-[#4C6B56]/40 transition-all space-y-4">
              <div className="w-14 h-14 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center">
                <Lock className="w-7 h-7 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-[#D0D6B5]">
                End-to-End Encryption
              </h3>
              <p className="text-[#D0D6B5]/70 leading-relaxed">
                All data transmitted between your browser and our servers is encrypted using TLS 1.3 with 256-bit encryption.
              </p>
            </div>

            {/* Security Feature 2 */}
            <div className="rounded-xl p-6 bg-[#776871]/5 border border-[#776871]/10 hover:border-[#4C6B56]/40 transition-all space-y-4">
              <div className="w-14 h-14 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center">
                <Database className="w-7 h-7 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-[#D0D6B5]">
                Encrypted Storage
              </h3>
              <p className="text-[#D0D6B5]/70 leading-relaxed">
                Sensitive data is encrypted at rest using AES-256-CBC encryption before being stored in our secure database.
              </p>
            </div>

            {/* Security Feature 3 */}
            <div className="rounded-xl p-6 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10 hover:border-[#4C6B56]/40 transition-all space-y-4">
              <div className="w-14 h-14 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center">
                <Key className="w-7 h-7 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-[#D0D6B5]">
                Password Protection
              </h3>
              <p className="text-[#D0D6B5]/70 leading-relaxed">
                Passwords are hashed using bcrypt with salt rounds, making them irreversible even if data is compromised.
              </p>
            </div>

            {/* Security Feature 4 */}
            <div className="rounded-xl p-6 bg-[#776871]/5 border border-[#776871]/10 hover:border-[#4C6B56]/40 transition-all space-y-4">
              <div className="w-14 h-14 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center">
                <Shield className="w-7 h-7 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-[#D0D6B5]">
                Plaid Security
              </h3>
              <p className="text-[#D0D6B5]/70 leading-relaxed">
                We never store your bank credentials. All banking connections are handled through Plaid's secure infrastructure.
              </p>
            </div>

            {/* Security Feature 5 */}
            <div className="rounded-xl p-6 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10 hover:border-[#4C6B56]/40 transition-all space-y-4">
              <div className="w-14 h-14 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center">
                <Server className="w-7 h-7 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-[#D0D6B5]">
                Row Level Security
              </h3>
              <p className="text-[#D0D6B5]/70 leading-relaxed">
                Database queries are protected with Row Level Security (RLS), ensuring users can only access their own data.
              </p>
            </div>

            {/* Security Feature 6 */}
            <div className="rounded-xl p-6 bg-[#776871]/5 border border-[#776871]/10 hover:border-[#4C6B56]/40 transition-all space-y-4">
              <div className="w-14 h-14 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center">
                <Eye className="w-7 h-7 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-[#D0D6B5]">
                Invite-Only Access
              </h3>
              <p className="text-[#D0D6B5]/70 leading-relaxed">
                Controlled access through invite codes limits exposure and ensures a trusted user base.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-16">

          {/* Data Encryption */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center flex-shrink-0 mt-1">
                <Lock className="w-6 h-6 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  Data Encryption
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    We employ multiple layers of encryption to protect your data at every stage:
                  </p>

                  <div className="space-y-4">
                    <div className="rounded-xl p-5 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#4C6B56] flex-shrink-0 mt-0.5" strokeWidth={2} />
                        <div>
                          <h4 className="font-semibold text-[#D0D6B5] mb-1">Encryption in Transit (TLS 1.3)</h4>
                          <p className="text-sm">
                            All communication between your device and our servers is encrypted using Transport Layer Security (TLS) 1.3 with 256-bit encryption. This prevents eavesdropping and man-in-the-middle attacks.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl p-5 bg-[#776871]/5 border border-[#776871]/10">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#4C6B56] flex-shrink-0 mt-0.5" strokeWidth={2} />
                        <div>
                          <h4 className="font-semibold text-[#D0D6B5] mb-1">Encryption at Rest (AES-256-CBC)</h4>
                          <p className="text-sm">
                            Sensitive financial data, including Plaid access tokens and account details, is encrypted at rest using AES-256-CBC encryption with unique encryption keys. Even if our database were compromised, your data would remain unreadable.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl p-5 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#4C6B56] flex-shrink-0 mt-0.5" strokeWidth={2} />
                        <div>
                          <h4 className="font-semibold text-[#D0D6B5] mb-1">Password Hashing (bcrypt)</h4>
                          <p className="text-sm">
                            Your password is hashed using bcrypt with salt rounds before storage. This one-way cryptographic function makes it impossible to reverse-engineer your password, even for us.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Plaid Security */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#02224F]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="w-6 h-6 text-[#D0D6B5]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  Banking Security with Plaid
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    OneLibro uses Plaid, the industry-leading financial data network trusted by major financial institutions and fintech companies.
                  </p>

                  <div className="rounded-xl p-6 bg-[#4C6B56]/5 border border-[#4C6B56]/20 space-y-4">
                    <h4 className="font-semibold text-[#D0D6B5] text-lg">Why Plaid is Secure:</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4C6B56] mt-2 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-[#D0D6B5]">No Credential Storage:</span> Your bank username and password are NEVER stored by OneLibro or Plaid. They are only used once to establish the connection.
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4C6B56] mt-2 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-[#D0D6B5]">Read-Only Access:</span> Plaid has read-only access to your accounts. We cannot move money, make transfers, or modify your accounts in any way.
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4C6B56] mt-2 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-[#D0D6B5]">Bank-Level Encryption:</span> Plaid uses the same 256-bit encryption as banks and financial institutions.
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4C6B56] mt-2 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-[#D0D6B5]">SOC 2 Type II Certified:</span> Plaid undergoes regular third-party security audits and maintains SOC 2 Type II compliance.
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4C6B56] mt-2 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-[#D0D6B5]">Trusted by Millions:</span> Plaid powers major apps like Venmo, Robinhood, Coinbase, and thousands of other financial applications.
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-xl p-4 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10">
                    <p className="text-sm">
                      <span className="font-semibold text-[#D0D6B5]">You're in Control:</span> You can disconnect your bank accounts at any time through your OneLibro dashboard, immediately revoking access.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Database Security */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center flex-shrink-0 mt-1">
                <Database className="w-6 h-6 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  Database Security
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    Our database infrastructure is hosted on Supabase, a secure PostgreSQL platform with enterprise-grade security features:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl p-4 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">Row Level Security (RLS)</h4>
                      <p className="text-sm">
                        Every database query is protected by RLS policies, ensuring you can only access your own data. Even database administrators cannot bypass these restrictions.
                      </p>
                    </div>

                    <div className="rounded-xl p-4 bg-[#776871]/5 border border-[#776871]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">Automated Backups</h4>
                      <p className="text-sm">
                        Daily automated backups ensure your data is never lost, with point-in-time recovery available for disaster scenarios.
                      </p>
                    </div>

                    <div className="rounded-xl p-4 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">Connection Pooling</h4>
                      <p className="text-sm">
                        Secure connection pooling prevents connection exhaustion attacks and ensures optimal performance under load.
                      </p>
                    </div>

                    <div className="rounded-xl p-4 bg-[#776871]/5 border border-[#776871]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">SSL/TLS Enforcement</h4>
                      <p className="text-sm">
                        All database connections require SSL/TLS encryption, preventing unauthorized access to data in transit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Infrastructure Security */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#02224F]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <Server className="w-6 h-6 text-[#D0D6B5]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  Infrastructure Security
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    OneLibro is hosted on Vercel's globally distributed edge network, providing security and performance benefits:
                  </p>

                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#4C6B56] flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <div>
                        <span className="font-medium text-[#D0D6B5]">DDoS Protection:</span> Built-in protection against distributed denial-of-service attacks
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#4C6B56] flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <div>
                        <span className="font-medium text-[#D0D6B5]">Automatic SSL Certificates:</span> Free, auto-renewing SSL certificates for all domains
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#4C6B56] flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <div>
                        <span className="font-medium text-[#D0D6B5]">Edge Caching:</span> Static assets cached globally for performance without sacrificing security
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#4C6B56] flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <div>
                        <span className="font-medium text-[#D0D6B5]">Zero-Downtime Deployments:</span> Updates deployed without service interruption
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Access Control */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center flex-shrink-0 mt-1">
                <Key className="w-6 h-6 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  Access Control and Authentication
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    We implement strict access controls to protect your account:
                  </p>

                  <div className="space-y-3">
                    <div className="rounded-xl p-4 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">Invite-Only System</h4>
                      <p className="text-sm">
                        Access to OneLibro is controlled through invite codes with usage limits and expiration dates, preventing unauthorized signups.
                      </p>
                    </div>

                    <div className="rounded-xl p-4 bg-[#776871]/5 border border-[#776871]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">Secure Session Management</h4>
                      <p className="text-sm">
                        Sessions are managed using secure HTTP-only cookies with automatic expiration. Sessions are invalidated on logout.
                      </p>
                    </div>

                    <div className="rounded-xl p-4 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">Role-Based Permissions</h4>
                      <p className="text-sm">
                        Admin functions are protected by role-based access controls, ensuring only authorized users can perform administrative tasks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Best Practices */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#02224F]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <AlertTriangle className="w-6 h-6 text-[#D0D6B5]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  Your Security Responsibilities
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    While we implement robust security measures, your cooperation is essential to keeping your account secure:
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#4C6B56] mt-2 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-[#D0D6B5]">Use a Strong Password:</span> Choose a unique password with at least 12 characters, including uppercase, lowercase, numbers, and symbols
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#4C6B56] mt-2 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-[#D0D6B5]">Never Share Your Password:</span> OneLibro staff will never ask for your password
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#4C6B56] mt-2 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-[#D0D6B5]">Enable Browser Security:</span> Keep your browser updated and use reputable security extensions
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#4C6B56] mt-2 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-[#D0D6B5]">Beware of Phishing:</span> Always verify you're on the official OneLibro website before logging in
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#4C6B56] mt-2 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-[#D0D6B5]">Log Out on Shared Devices:</span> Always log out when using public or shared computers
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#4C6B56] mt-2 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-[#D0D6B5]">Report Suspicious Activity:</span> Contact us immediately if you notice unauthorized access or suspicious behavior
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Incident Response */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="w-6 h-6 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  Security Incident Response
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    In the unlikely event of a security breach:
                  </p>

                  <div className="rounded-xl p-6 bg-[#4C6B56]/5 border border-[#4C6B56]/20 space-y-3">
                    <ul className="space-y-2 list-disc list-inside">
                      <li>We will notify affected users within 72 hours of discovering the breach</li>
                      <li>We will provide details about what data was compromised and what steps we're taking</li>
                      <li>We will work with law enforcement and security experts to investigate and remediate</li>
                      <li>We will implement additional security measures to prevent future incidents</li>
                      <li>We will offer support and guidance to affected users</li>
                    </ul>
                  </div>

                  <p className="mt-4">
                    To report a security vulnerability, please contact us at{' '}
                    <a href="mailto:security@oneLibro.com" className="text-[#4C6B56] hover:underline font-medium">
                      security@oneLibro.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#02224F]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-6 h-6 text-[#D0D6B5]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  Compliance and Standards
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    OneLibro adheres to industry standards and best practices:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl p-4 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">OWASP Top 10</h4>
                      <p className="text-sm">
                        We follow OWASP guidelines to protect against common web vulnerabilities like XSS, SQL injection, and CSRF attacks.
                      </p>
                    </div>

                    <div className="rounded-xl p-4 bg-[#776871]/5 border border-[#776871]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">Secure Development</h4>
                      <p className="text-sm">
                        Code reviews, automated security scanning, and dependency monitoring are part of our development process.
                      </p>
                    </div>

                    <div className="rounded-xl p-4 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">Privacy by Design</h4>
                      <p className="text-sm">
                        Security and privacy are built into every feature from the ground up, not added as an afterthought.
                      </p>
                    </div>

                    <div className="rounded-xl p-4 bg-[#776871]/5 border border-[#776871]/10">
                      <h4 className="font-semibold text-[#D0D6B5] mb-2">Regular Updates</h4>
                      <p className="text-sm">
                        We keep all dependencies and infrastructure components up-to-date with the latest security patches.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4C6B56]/15 flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="w-6 h-6 text-[#4C6B56]" strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#D0D6B5]">
                  Security Questions?
                </h2>
                <div className="space-y-4 text-[#D0D6B5]/70 leading-relaxed">
                  <p>
                    If you have questions about our security practices or want to report a vulnerability:
                  </p>
                  <div className="rounded-xl p-6 bg-[#4C6B56]/5 border border-[#4C6B56]/20 space-y-2">
                    <p className="font-medium text-[#D0D6B5]">OneLibro Security Team</p>
                    <p>Security Issues: <a href="mailto:security@oneLibro.com" className="text-[#4C6B56] hover:underline">security@oneLibro.com</a></p>
                    <p>General Support: <a href="mailto:support@oneLibro.com" className="text-[#4C6B56] hover:underline">support@oneLibro.com</a></p>
                    <p className="text-sm text-[#D0D6B5]/60 mt-2">
                      For security vulnerabilities, please use our dedicated security email for fastest response.
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
