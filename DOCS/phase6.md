UI improvements & Name change:


So we changed the name of OneLedger to OneLibro to better reflect our mission of creating an inclusive and accessible financial ecosystem for everyone. Along with the name change, we have made several UI improvements to enhance user experience across our platform.

Key UI Improvements:
1. Redesigned Dashboard: The dashboard has been revamped to provide a more intuitive and user-friendly interface, making it easier for users to navigate and access key features.
2. Redesigned every page with a fresh look: We have updated the design of every page on our platform to ensure a consistent and modern aesthetic that aligns with our brand identity.
3. Improved Accessibility

You can also propse changes on UI and iam uploading the screenshots of our UI here please go through each of them and suggest changes if any.

Landing page:
![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-3.png)

So now iam uploading code here: We might want to implement the same into our UI. If you have any questions ask away. Strucutrally and colorfully this looks good to me. and we might want to implement the same.

import Image from "next/image"
import Link from "next/link"
import { Building2, Receipt, PieChart, TrendingUp, Shield, UserCheck } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#090C02]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#090C02]/80 backdrop-blur-sm border-b border-[#D0D6B5]/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 relative">
                <Image src="/images/logo.png" alt="OneLedger Logo" fill className="object-contain" />
              </div>
              <span className="text-sm font-medium tracking-wider text-[#D0D6B5]">OneLedger</span>
            </div>

            <Link
              href="/auth"
              className="px-6 py-2 text-sm font-medium tracking-wide text-[#D0D6B5] hover:text-white transition-colors rounded-lg hover:bg-[#4C6B56]/10"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      <section className="relative pt-32 pb-24 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#02224F] via-[#090C02] to-[#4C6B56]/20" />

        <div className="relative max-w-4xl mx-auto text-center space-y-12">
          <div className="w-56 h-56 mx-auto relative rounded-3xl bg-[#E8EBD8] p-6 shadow-2xl">
            <div className="relative w-full h-full">
              <Image
                src="/images/logo.png"
                alt="OneLedger 1L Logo"
                fill
                className="object-contain drop-shadow-[0_0_40px_rgba(76,107,86,0.4)]"
                priority
              />
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-[#D0D6B5] text-balance leading-tight">
              Your Personal Finance.
              <br />
              All in One Ledger.
            </h1>
            <p className="text-lg lg:text-xl font-normal text-[#D0D6B5]/70 text-pretty max-w-2xl mx-auto">
              An invite-only, privacy-first platform to track accounts, budgets, and investments in real-time.
            </p>
          </div>

          <Link
            href="/auth"
            className="inline-block px-10 py-3.5 bg-[#4C6B56] hover:bg-[#4C6B56]/90 text-[#D0D6B5] font-medium tracking-wide rounded-xl transition-all hover:shadow-[0_0_30px_rgba(76,107,86,0.5)] text-base"
          >
            Get started
          </Link>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-[#090C02] to-[#02224F]/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#D0D6B5] text-center mb-16">Everything You Need</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative rounded-xl p-8 space-y-6 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10 hover:border-[#4C6B56]/40 transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 rounded-lg bg-[#4C6B56]/15 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-[#4C6B56]" strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-bold text-[#D0D6B5]">Connect All Your Banks</h3>

              <p className="text-[#D0D6B5]/70 font-normal leading-relaxed">
                Securely link checking, savings, and credit card accounts from 10,000+ institutions via Plaid.
              </p>
            </div>

            <div className="relative rounded-xl p-8 space-y-6 bg-[#776871]/5 border border-[#776871]/10 hover:border-[#4C6B56]/40 transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 rounded-lg bg-[#4C6B56]/15 flex items-center justify-center">
                <Receipt className="w-7 h-7 text-[#4C6B56]" strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-bold text-[#D0D6B5]">Track Spending</h3>

              <p className="text-[#D0D6B5]/70 font-normal leading-relaxed">
                Automatically categorize transactions and visualize your spending patterns over time.
              </p>
            </div>

            <div className="relative rounded-xl p-8 space-y-6 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10 hover:border-[#4C6B56]/40 transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 rounded-lg bg-[#4C6B56]/15 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-[#4C6B56]" strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-bold text-[#D0D6B5]">Smart Analytics</h3>

              <p className="text-[#D0D6B5]/70 font-normal leading-relaxed">
                Get insights into your financial health with charts, trends, and spending breakdowns.
              </p>
            </div>

            <div className="relative rounded-xl p-8 space-y-6 bg-[#776871]/5 border border-[#776871]/10 hover:border-[#4C6B56]/40 transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 rounded-lg bg-[#4C6B56]/15 flex items-center justify-center">
                <PieChart className="w-7 h-7 text-[#4C6B56]" strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-bold text-[#D0D6B5]">Budget Management</h3>

              <p className="text-[#D0D6B5]/70 font-normal leading-relaxed">
                Create budgets for different categories and track your progress throughout the month.
              </p>
            </div>

            <div className="relative rounded-xl p-8 space-y-6 bg-[#D0D6B5]/5 border border-[#D0D6B5]/10 hover:border-[#4C6B56]/40 transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 rounded-lg bg-[#4C6B56]/15 flex items-center justify-center">
                <Shield className="w-7 h-7 text-[#4C6B56]" strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-bold text-[#D0D6B5]">Bank-Level Security</h3>

              <p className="text-[#D0D6B5]/70 font-normal leading-relaxed">
                Your data is encrypted end-to-end. We never store your bank credentials.
              </p>
            </div>

            <div className="relative rounded-xl p-8 space-y-6 bg-[#776871]/5 border border-[#776871]/10 hover:border-[#4C6B56]/40 transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 rounded-lg bg-[#4C6B56]/15 flex items-center justify-center">
                <UserCheck className="w-7 h-7 text-[#4C6B56]" strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-bold text-[#D0D6B5]">Invite-Only Access</h3>

              <p className="text-[#D0D6B5]/70 font-normal leading-relaxed">
                Exclusive platform with controlled access for privacy and quality user experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#D0D6B5] text-center mb-16">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#D0D6B5] flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-[#02224F]">1</span>
              </div>
              <h3 className="text-xl font-bold text-[#D0D6B5]">Request Access</h3>
              <p className="text-[#D0D6B5]/70 font-normal leading-relaxed">
                Join our exclusive invite-only platform for serious wealth management.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#D0D6B5] flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-[#02224F]">2</span>
              </div>
              <h3 className="text-xl font-bold text-[#D0D6B5]">Connect Accounts</h3>
              <p className="text-[#D0D6B5]/70 font-normal leading-relaxed">
                Securely link your financial institutions in minutes with bank-level encryption.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#D0D6B5] flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-[#02224F]">3</span>
              </div>
              <h3 className="text-xl font-bold text-[#D0D6B5]">Track & Optimize</h3>
              <p className="text-[#D0D6B5]/70 font-normal leading-relaxed">
                Monitor your wealth in real-time and make informed financial decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 px-6 lg:px-8 bg-[#090C02] border-t border-[#D0D6B5]/10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 relative">
                <Image src="/images/logo.png" alt="OneLedger Logo" fill className="object-contain" />
              </div>
              <span className="text-lg font-medium tracking-wider text-[#D0D6B5]">OneLedger</span>
            </div>
            <p className="text-sm text-[#D0D6B5]/50 text-center">
              Professional wealth management for the privacy-conscious
            </p>
          </div>

          <div className="border-t border-[#D0D6B5]/10" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex gap-8 text-sm font-normal text-[#776871]">
              <a href="#" className="hover:text-[#090C02] hover:bg-[#D0D6B5] px-3 py-1 rounded transition-all">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-[#090C02] hover:bg-[#D0D6B5] px-3 py-1 rounded transition-all">
                Terms of Service
              </a>
              <a href="#" className="hover:text-[#090C02] hover:bg-[#D0D6B5] px-3 py-1 rounded transition-all">
                Security
              </a>
            </div>

            <p className="text-sm font-normal text-[#D0D6B5]/50">© 2025 OneLedger. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


Login/signup page:
![alt text](image-4.png)
![alt text](image-5.png)

"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Mail, Lock, User, Ticket } from "lucide-react"

type TabType = "login" | "signup"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<TabType>("login")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    inviteCode: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setSuccess("Login successful! Redirecting...")
    }, 1500)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!signupForm.inviteCode) {
      setError("Invite code is required to join OneLedger")
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setSuccess("Account created successfully! Please check your email.")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#02224F] via-[#090C02] to-[#090C02] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8 space-y-6">
          <div className="w-24 h-24 mx-auto relative rounded-2xl bg-[#E8EBD8] p-4 shadow-xl">
            <div className="relative w-full h-full">
              <Image src="/images/logo.png" alt="OneLedger Logo" fill className="object-contain" priority />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#D0D6B5] mb-2">
              {activeTab === "login" ? "Welcome Back" : "Join OneLedger"}
            </h1>
            <p className="text-sm text-[#D0D6B5]/60">
              {activeTab === "login"
                ? "Sign in to access your financial dashboard"
                : "Create your account with an invite code"}
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-[#D0D6B5]/5 backdrop-blur-xl border border-[#D0D6B5]/10 rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-[#090C02]/50 rounded-xl">
            <button
              onClick={() => {
                setActiveTab("login")
                setError("")
                setSuccess("")
              }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === "login"
                  ? "bg-[#4C6B56] text-[#D0D6B5] shadow-lg"
                  : "text-[#D0D6B5]/60 hover:text-[#D0D6B5]"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setActiveTab("signup")
                setError("")
                setSuccess("")
              }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === "signup"
                  ? "bg-[#4C6B56] text-[#D0D6B5] shadow-lg"
                  : "text-[#D0D6B5]/60 hover:text-[#D0D6B5]"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-[#4C6B56]/20 border border-[#4C6B56]/40 rounded-lg p-4">
              <p className="text-sm text-[#D0D6B5] font-medium">{success}</p>
            </div>
          )}

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-[#D0D6B5] mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D0D6B5]/40" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-[#090C02]/40 border border-[#D0D6B5]/20 rounded-xl text-[#D0D6B5] placeholder:text-[#D0D6B5]/30 focus:outline-none focus:ring-2 focus:ring-[#4C6B56] focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-[#D0D6B5] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D0D6B5]/40" />
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-[#090C02]/40 border border-[#D0D6B5]/20 rounded-xl text-[#D0D6B5] placeholder:text-[#D0D6B5]/30 focus:outline-none focus:ring-2 focus:ring-[#4C6B56] focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#4C6B56] hover:bg-[#4C6B56]/90 disabled:bg-[#4C6B56]/50 text-[#D0D6B5] font-semibold rounded-xl transition-all shadow-lg hover:shadow-[0_0_30px_rgba(76,107,86,0.4)] disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}

          {/* Signup Form */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label htmlFor="signup-name" className="block text-sm font-medium text-[#D0D6B5] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D0D6B5]/40" />
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-[#090C02]/40 border border-[#D0D6B5]/20 rounded-xl text-[#D0D6B5] placeholder:text-[#D0D6B5]/30 focus:outline-none focus:ring-2 focus:ring-[#4C6B56] focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-[#D0D6B5] mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D0D6B5]/40" />
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-[#090C02]/40 border border-[#D0D6B5]/20 rounded-xl text-[#D0D6B5] placeholder:text-[#D0D6B5]/30 focus:outline-none focus:ring-2 focus:ring-[#4C6B56] focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-[#D0D6B5] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D0D6B5]/40" />
                  <input
                    id="signup-password"
                    type="password"
                    required
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-[#090C02]/40 border border-[#D0D6B5]/20 rounded-xl text-[#D0D6B5] placeholder:text-[#D0D6B5]/30 focus:outline-none focus:ring-2 focus:ring-[#4C6B56] focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-invite" className="block text-sm font-medium text-[#D0D6B5] mb-2">
                  Invite Code
                </label>
                <div className="relative">
                  <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D0D6B5]/40" />
                  <input
                    id="signup-invite"
                    type="text"
                    required
                    value={signupForm.inviteCode}
                    onChange={(e) => setSignupForm({ ...signupForm, inviteCode: e.target.value.toUpperCase() })}
                    className="w-full pl-12 pr-4 py-3 bg-[#090C02]/40 border border-[#D0D6B5]/20 rounded-xl text-[#D0D6B5] placeholder:text-[#D0D6B5]/30 focus:outline-none focus:ring-2 focus:ring-[#4C6B56] focus:border-transparent transition-all font-mono tracking-wider uppercase"
                    placeholder="XXXXX-XXXXX"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#4C6B56] hover:bg-[#4C6B56]/90 disabled:bg-[#4C6B56]/50 text-[#D0D6B5] font-semibold rounded-xl transition-all shadow-lg hover:shadow-[0_0_30px_rgba(76,107,86,0.4)] disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}

          {/* Info Box */}
          <div className="pt-4 border-t border-[#D0D6B5]/10">
            <div className="bg-[#4C6B56]/10 border border-[#4C6B56]/20 rounded-lg p-4">
              <p className="text-xs text-[#D0D6B5]/70 leading-relaxed">
                {activeTab === "login" ? (
                  <>
                    <strong className="text-[#D0D6B5]">Secure Access:</strong> Your credentials are encrypted and
                    protected with bank-level security.
                  </>
                ) : (
                  <>
                    <strong className="text-[#D0D6B5]">Invite Only:</strong> OneLedger is currently available by
                    invitation only. Please enter your unique invite code to create an account.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-[#D0D6B5]/60 hover:text-[#D0D6B5] transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}


Dashboard:
![alt text](image-6.png)
![alt text](image-7.png)

Over here i know that we hadn't figured out how can we have recurring trasactions set but we will figure it out soon. and also the images in recent trasactions are not needed for our design.

"use client"

import { Calendar, TrendingUp } from "lucide-react"
import { Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import Image from "next/image"

// Sample data for Net Worth Growth
const netWorthData = [
  { month: "Jul", value: 45000 },
  { month: "Aug", value: 48500 },
  { month: "Sep", value: 47200 },
  { month: "Oct", value: 51000 },
  { month: "Nov", value: 53800 },
  { month: "Dec", value: 58200 },
]

// Sample data for Spending by Category
const spendingData = [
  { name: "Housing", value: 1800, color: "#4C6B56" },
  { name: "Food", value: 650, color: "#776871" },
  { name: "Transport", value: 320, color: "#D0D6B5" },
  { name: "Entertainment", value: 280, color: "#02224F" },
  { name: "Shopping", value: 450, color: "#6B8E7F" },
]

// Sample recent transactions
const recentTransactions = [
  {
    id: 1,
    merchant: "Whole Foods",
    amount: -127.45,
    date: "Dec 9",
    category: "Food",
    logo: "/colorful-grocery-aisle.png",
  },
  {
    id: 2,
    merchant: "Shell Gas",
    amount: -45.2,
    date: "Dec 8",
    category: "Transport",
    logo: "/gas.jpg",
  },
  {
    id: 3,
    merchant: "Netflix",
    amount: -15.99,
    date: "Dec 7",
    category: "Entertainment",
    logo: "/streaming-service-interface.png",
  },
  {
    id: 4,
    merchant: "Salary Deposit",
    amount: 5000.0,
    date: "Dec 5",
    category: "Income",
    logo: "/bank-exterior.png",
  },
  {
    id: 5,
    merchant: "Amazon",
    amount: -89.99,
    date: "Dec 4",
    category: "Shopping",
    logo: "/generic-online-marketplace.png",
  },
]

// Sample upcoming bills
const upcomingBills = [
  { id: 1, name: "Rent Payment", amount: 1800, date: "Dec 15", daysUntil: 5 },
  { id: 2, name: "Car Insurance", amount: 185, date: "Dec 17", daysUntil: 7 },
  { id: 3, name: "Internet Bill", amount: 79.99, date: "Dec 18", daysUntil: 8 },
  { id: 4, name: "Phone Bill", amount: 65, date: "Dec 20", daysUntil: 10 },
]

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#090C02]">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-20 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-8">
          {/* Header */}
          <h1 className="text-4xl font-bold text-[#D0D6B5] mb-8">Welcome back, User</h1>

          {/* Top Row Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Net Worth */}
            <Card className="bg-[#02224F]/10 backdrop-blur-xl border-[#4C6B56]/20 shadow-lg shadow-[#4C6B56]/5">
              <CardHeader>
                <CardDescription className="text-[#D0D6B5]/60">Total Net Worth</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-[#4C6B56] drop-shadow-[0_0_20px_rgba(76,107,86,0.5)]">$58,200</p>
                <p className="text-sm text-[#4C6B56] mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +12.5% this month
                </p>
              </CardContent>
            </Card>

            {/* Monthly Spending */}
            <Card className="bg-[#02224F]/10 backdrop-blur-xl border-[#776871]/20">
              <CardHeader>
                <CardDescription className="text-[#D0D6B5]/60">Monthly Spending</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-[#D0D6B5]">$3,580</p>
                <p className="text-sm text-[#D0D6B5]/60 mt-2">December 2024</p>
              </CardContent>
            </Card>

            {/* Savings Rate */}
            <Card className="bg-[#02224F]/10 backdrop-blur-xl border-[#4C6B56]/20">
              <CardHeader>
                <CardDescription className="text-[#D0D6B5]/60">Savings Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold text-[#4C6B56] drop-shadow-[0_0_20px_rgba(76,107,86,0.3)]">42%</p>
                <p className="text-sm text-[#D0D6B5]/60 mt-2">Above average</p>
              </CardContent>
            </Card>
          </div>

          {/* Middle Row - Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Net Worth Growth Chart */}
            <Card className="bg-[#02224F]/10 backdrop-blur-xl border-[#4C6B56]/20 shadow-lg shadow-[#4C6B56]/5">
              <CardHeader>
                <CardTitle className="text-[#D0D6B5]">Net Worth Growth</CardTitle>
                <CardDescription className="text-[#D0D6B5]/60">Last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={netWorthData}>
                    <XAxis dataKey="month" stroke="#D0D6B5" opacity={0.5} tick={{ fill: "#D0D6B5" }} />
                    <YAxis
                      stroke="#D0D6B5"
                      opacity={0.5}
                      tick={{ fill: "#D0D6B5" }}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#02224F",
                        border: "1px solid #4C6B56",
                        borderRadius: "8px",
                        color: "#D0D6B5",
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Net Worth"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4C6B56"
                      strokeWidth={3}
                      dot={{ fill: "#4C6B56", r: 5 }}
                      activeDot={{ r: 7, fill: "#4C6B56", stroke: "#D0D6B5" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Spending by Category Pie Chart */}
            <Card className="bg-[#02224F]/10 backdrop-blur-xl border-[#776871]/20">
              <CardHeader>
                <CardTitle className="text-[#D0D6B5]">Spending by Category</CardTitle>
                <CardDescription className="text-[#D0D6B5]/60">This month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={spendingData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#02224F",
                        border: "1px solid #776871",
                        borderRadius: "8px",
                        color: "#D0D6B5",
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <Card className="bg-[#02224F]/10 backdrop-blur-xl border-[#4C6B56]/20">
              <CardHeader>
                <CardTitle className="text-[#D0D6B5]">Recent Transactions</CardTitle>
                <CardDescription className="text-[#D0D6B5]/60">Latest activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#090C02]/50 border border-[#4C6B56]/10 hover:border-[#4C6B56]/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#4C6B56]/20 flex items-center justify-center overflow-hidden">
                          <Image
                            src={transaction.logo || "/placeholder.svg"}
                            alt={transaction.merchant}
                            width={32}
                            height={32}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-[#D0D6B5]">{transaction.merchant}</p>
                          <p className="text-sm text-[#D0D6B5]/60">
                            {transaction.date} • {transaction.category}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`font-bold ${transaction.amount > 0 ? "text-[#4C6B56] drop-shadow-[0_0_10px_rgba(76,107,86,0.5)]" : "text-[#D0D6B5]"}`}
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {transaction.amount > 0
                          ? `$${transaction.amount.toFixed(2)}`
                          : `-$${Math.abs(transaction.amount).toFixed(2)}`}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Bills */}
            <Card className="bg-[#02224F]/10 backdrop-blur-xl border-[#776871]/20">
              <CardHeader>
                <CardTitle className="text-[#D0D6B5] flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Bills
                </CardTitle>
                <CardDescription className="text-[#D0D6B5]/60">Due in the next 2 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingBills.map((bill) => (
                    <div
                      key={bill.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-[#090C02]/50 border border-[#776871]/10 hover:border-[#776871]/30 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-[#D0D6B5]">{bill.name}</p>
                        <p className="text-sm text-[#D0D6B5]/60">
                          Due {bill.date} • In {bill.daysUntil} days
                        </p>
                      </div>
                      <p className="text-lg font-bold text-[#D0D6B5]">${bill.amount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}



Account page:
![alt text](image-8.png)
![alt text](image-9.png)
"use client"

import { useState, useEffect } from "react"
import { Building2, CreditCard, TrendingUp, Wallet, Plus, RefreshCw, Loader2 } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

type AccountType = "depository" | "credit" | "investment"

interface Account {
  id: string
  name: string
  type: AccountType
  balance: number
  available?: number
  limit?: number
  institution: string
  lastSynced: string
  mask?: string
}

// Mock data for demonstration
const mockAccounts: Account[] = [
  {
    id: "1",
    name: "Premier Checking",
    type: "depository",
    balance: 12450.32,
    available: 12450.32,
    institution: "Chase",
    lastSynced: "2 hours ago",
    mask: "4532",
  },
  {
    id: "2",
    name: "High Yield Savings",
    type: "depository",
    balance: 45200.0,
    available: 45200.0,
    institution: "Marcus",
    lastSynced: "2 hours ago",
    mask: "8901",
  },
  {
    id: "3",
    name: "Reserve Credit Card",
    type: "credit",
    balance: 2340.5,
    available: 7659.5,
    limit: 10000,
    institution: "Chase",
    lastSynced: "3 hours ago",
    mask: "7823",
  },
  {
    id: "4",
    name: "Platinum Card",
    type: "credit",
    balance: 890.25,
    available: 14109.75,
    limit: 15000,
    institution: "American Express",
    lastSynced: "3 hours ago",
    mask: "1005",
  },
  {
    id: "5",
    name: "Investment Portfolio",
    type: "investment",
    balance: 128450.75,
    institution: "Vanguard",
    lastSynced: "1 hour ago",
  },
]

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setAccounts(mockAccounts)
      setLoading(false)
    }, 800)
  }, [])

  const handleSync = (accountId: string) => {
    setSyncing(accountId)
    setTimeout(() => {
      setSyncing(null)
    }, 2000)
  }

  const depositoryAccounts = accounts.filter((a) => a.type === "depository")
  const creditAccounts = accounts.filter((a) => a.type === "credit")
  const investmentAccounts = accounts.filter((a) => a.type === "investment")

  const totalAssets =
    depositoryAccounts.reduce((sum, a) => sum + a.balance, 0) +
    investmentAccounts.reduce((sum, a) => sum + a.balance, 0)
  const totalLiabilities = creditAccounts.reduce((sum, a) => sum + a.balance, 0)
  const netWorth = totalAssets - totalLiabilities

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#090C02]">
        <Sidebar />
        <div className="flex-1 ml-20 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#4C6B56]" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#090C02]">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-20 overflow-y-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#D0D6B5] mb-2">Accounts & Assets</h1>
          <p className="text-[#D0D6B5]/60">Overview of all your financial accounts</p>
        </div>

        {/* Net Worth Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#02224F]/10 backdrop-blur-xl border border-[#4C6B56]/20 rounded-2xl p-6">
            <p className="text-[#D0D6B5]/60 text-sm mb-2">Total Assets</p>
            <p className="text-3xl font-bold text-[#4C6B56]">
              ${totalAssets.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-[#02224F]/10 backdrop-blur-xl border border-[#776871]/20 rounded-2xl p-6">
            <p className="text-[#D0D6B5]/60 text-sm mb-2">Total Liabilities</p>
            <p className="text-3xl font-bold text-[#776871]">
              ${totalLiabilities.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-[#02224F]/10 backdrop-blur-xl border border-[#4C6B56]/30 rounded-2xl p-6">
            <p className="text-[#D0D6B5]/60 text-sm mb-2">Net Worth</p>
            <p className="text-3xl font-bold text-[#D0D6B5]">
              ${netWorth.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Depository Accounts */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-[#D0D6B5] mb-4 flex items-center">
            <Building2 className="w-6 h-6 mr-2 text-[#4C6B56]" />
            Depository Accounts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {depositoryAccounts.map((account) => (
              <div
                key={account.id}
                className="bg-[#02224F]/10 backdrop-blur-xl border border-[#4C6B56]/20 rounded-2xl p-6 hover:border-[#4C6B56]/40 transition-all group"
              >
                {/* Debit Card Visual */}
                <div className="bg-gradient-to-br from-[#4C6B56] to-[#4C6B56]/60 rounded-xl p-4 mb-4 h-32 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <Wallet className="w-8 h-8 text-white/90" />
                    <span className="text-white/70 text-xs font-mono">{account.institution}</span>
                  </div>
                  <div className="text-white/90 text-sm font-mono">•••• {account.mask}</div>
                </div>

                <h3 className="text-lg font-semibold text-[#D0D6B5] mb-1">{account.name}</h3>
                <p className="text-[#D0D6B5]/60 text-sm mb-4">{account.institution}</p>

                <div className="mb-4">
                  <p className="text-[#D0D6B5]/60 text-xs mb-1">Available Balance</p>
                  <p className="text-2xl font-bold text-[#4C6B56]">
                    ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#D0D6B5]/10">
                  <span className="text-xs text-[#D0D6B5]/50">Synced {account.lastSynced}</span>
                  <button
                    onClick={() => handleSync(account.id)}
                    disabled={syncing === account.id}
                    className="text-[#4C6B56] hover:text-[#4C6B56]/80 transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing === account.id ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Credit Accounts */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-[#D0D6B5] mb-4 flex items-center">
            <CreditCard className="w-6 h-6 mr-2 text-[#776871]" />
            Credit Accounts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creditAccounts.map((account) => {
              const utilization = account.limit ? (account.balance / account.limit) * 100 : 0
              return (
                <div
                  key={account.id}
                  className="bg-[#02224F]/10 backdrop-blur-xl border border-[#776871]/20 rounded-2xl p-6 hover:border-[#776871]/40 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <CreditCard className="w-10 h-10 text-[#776871]" />
                    <span className="text-xs text-[#D0D6B5]/50">{account.institution}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-[#D0D6B5] mb-1">{account.name}</h3>
                  <p className="text-[#D0D6B5]/60 text-sm mb-4">•••• {account.mask}</p>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#D0D6B5]/60">Current Balance</span>
                      <span className="text-[#776871] font-semibold">
                        ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#090C02] rounded-full overflow-hidden">
                      <div className="h-full bg-[#776871] transition-all" style={{ width: `${utilization}%` }} />
                    </div>
                    <div className="flex justify-between text-xs mt-2 text-[#D0D6B5]/50">
                      <span>{utilization.toFixed(1)}% utilized</span>
                      <span>Limit: ${account.limit?.toLocaleString("en-US")}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#D0D6B5]/10">
                    <span className="text-xs text-[#D0D6B5]/50">Synced {account.lastSynced}</span>
                    <button
                      onClick={() => handleSync(account.id)}
                      disabled={syncing === account.id}
                      className="text-[#776871] hover:text-[#776871]/80 transition-colors"
                    >
                      <RefreshCw className={`w-4 h-4 ${syncing === account.id ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Investment Accounts */}
        <section>
          <h2 className="text-2xl font-semibold text-[#D0D6B5] mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-[#4C6B56]" />
            Investment Accounts
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {investmentAccounts.map((account) => (
              <div
                key={account.id}
                className="bg-[#02224F]/10 backdrop-blur-xl border border-[#4C6B56]/20 rounded-2xl p-6 hover:border-[#4C6B56]/40 transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-[#D0D6B5] mb-1">{account.name}</h3>
                    <p className="text-[#D0D6B5]/60 text-sm">{account.institution}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-[#4C6B56]" />
                </div>

                <div className="mb-4">
                  <p className="text-[#D0D6B5]/60 text-sm mb-2">Portfolio Value</p>
                  <p className="text-3xl font-bold text-[#4C6B56]">
                    ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Mini Sparkline Chart Placeholder */}
                <div className="h-16 mb-4 flex items-end gap-1">
                  {[65, 72, 68, 75, 82, 78, 85, 89, 92, 88, 94, 100].map((height, i) => (
                    <div key={i} className="flex-1 bg-[#4C6B56]/30 rounded-t" style={{ height: `${height}%` }} />
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#D0D6B5]/10">
                  <span className="text-xs text-[#D0D6B5]/50">Synced {account.lastSynced}</span>
                  <button
                    onClick={() => handleSync(account.id)}
                    disabled={syncing === account.id}
                    className="text-[#4C6B56] hover:text-[#4C6B56]/80 transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing === account.id ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Add Account Button */}
        <div className="mt-8 flex justify-center">
          <button className="bg-[#4C6B56] hover:bg-[#4C6B56]/80 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Connect New Account
          </button>
        </div>
      </main>
    </div>
  )
}



Transaction page:
![alt text](image-10.png)
"use client"

import type React from "react"

import { useState } from "react"
import {
  Search,
  Filter,
  Calendar,
  Tag,
  ChevronDown,
  Download,
  Plus,
  X,
  DollarSign,
  Store,
  CreditCard,
} from "lucide-react"
import { Sidebar } from "@/components/sidebar"

type DateFilter = "7d" | "30d" | "90d" | "365d" | "all"

const DATE_FILTERS: { value: DateFilter; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "365d", label: "Last year" },
  { value: "all", label: "All time" },
]

const mockTransactions = [
  {
    id: "1",
    merchant_name: "Whole Foods Market",
    amount: -127.45,
    transaction_date: "2024-12-09",
    category: "Groceries",
    is_pending: false,
  },
  {
    id: "2",
    merchant_name: "Shell Gas Station",
    amount: -45.2,
    transaction_date: "2024-12-08",
    category: "Transportation",
    is_pending: false,
  },
  {
    id: "3",
    merchant_name: "Netflix",
    amount: -15.99,
    transaction_date: "2024-12-07",
    category: "Entertainment",
    is_pending: false,
  },
  {
    id: "4",
    merchant_name: "Starbucks",
    amount: -6.75,
    transaction_date: "2024-12-07",
    category: "Dining",
    is_pending: false,
  },
  {
    id: "5",
    merchant_name: "Amazon",
    amount: -89.99,
    transaction_date: "2024-12-06",
    category: "Shopping",
    is_pending: false,
  },
  {
    id: "6",
    merchant_name: "Target",
    amount: -156.34,
    transaction_date: "2024-12-05",
    category: "Shopping",
    is_pending: false,
  },
  {
    id: "7",
    merchant_name: "Chipotle",
    amount: -12.85,
    transaction_date: "2024-12-05",
    category: "Dining",
    is_pending: true,
  },
  {
    id: "8",
    merchant_name: "Salary Deposit",
    amount: 5000.0,
    transaction_date: "2024-12-01",
    category: "Income",
    is_pending: false,
  },
  {
    id: "9",
    merchant_name: "Gym Membership",
    amount: -49.99,
    transaction_date: "2024-12-01",
    category: "Health",
    is_pending: false,
  },
  {
    id: "10",
    merchant_name: "Electric Bill",
    amount: -125.67,
    transaction_date: "2024-11-30",
    category: "Utilities",
    is_pending: false,
  },
]

function formatCurrency(amount: number): string {
  return `$${Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(mockTransactions)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState<DateFilter>("30d")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense")
  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    merchant: "",
    category: "",
    account: "Cash / Wallet",
  })

  // Extract unique categories
  const categories = Array.from(new Set(transactions.map((tx) => tx.category))).sort()

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    // Search filter
    if (searchQuery.trim() && !tx.merchant_name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Category filter
    if (categoryFilter !== "all" && tx.category !== categoryFilter) {
      return false
    }

    // Date filter
    if (dateFilter !== "all") {
      const daysAgo = Number.parseInt(dateFilter)
      const txDate = new Date(tx.transaction_date)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo)
      if (txDate < cutoffDate) {
        return false
      }
    }

    return true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newTransaction = {
      id: (transactions.length + 1).toString(),
      merchant_name: formData.merchant,
      amount: transactionType === "expense" ? -Number.parseFloat(formData.amount) : Number.parseFloat(formData.amount),
      transaction_date: formData.date,
      category: formData.category || "Other",
      is_pending: false,
    }
    setTransactions([newTransaction, ...transactions])
    setShowAddModal(false)
    setFormData({
      amount: "",
      date: new Date().toISOString().split("T")[0],
      merchant: "",
      category: "",
      account: "Cash / Wallet",
    })
  }

  return (
    <div className="flex min-h-screen bg-[#090C02]">
      <Sidebar />

      {/* Main Content */}
      <main className={`flex-1 ml-20 overflow-y-auto ${showAddModal ? "blur-sm" : ""}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-[#D0D6B5]">Transactions</h2>
                <p className="text-[#D0D6B5]/60 mt-2">
                  {filteredTransactions.length} of {transactions.length} transactions
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-[#4C6B56] hover:bg-[#4C6B56]/80 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Transaction</span>
                </button>
                <button className="flex items-center gap-2 bg-[#02224F]/50 hover:bg-[#02224F]/70 border border-[#4C6B56]/20 text-[#D0D6B5] px-4 py-2 rounded-lg font-medium transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-[#02224F]/10 backdrop-blur-xl border border-[#4C6B56]/20 rounded-xl p-4 mb-6">
            {/* Mobile: Show/Hide Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-between w-full text-left font-semibold text-[#D0D6B5] mb-4"
            >
              <span className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {/* Filters Content */}
            <div className={`space-y-4 ${showFilters ? "block" : "hidden lg:block"}`}>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D0D6B5]/40" />
                <input
                  type="text"
                  placeholder="Search by merchant name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#4C6B56]/20 rounded-lg focus:ring-2 focus:ring-[#4C6B56] focus:border-transparent bg-[#090C02] text-[#D0D6B5] placeholder-[#D0D6B5]/40"
                />
              </div>

              {/* Date and Category Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date Filter */}
                <div>
                  <label className="flex items-center text-sm font-medium text-[#D0D6B5]/70 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Date Range
                  </label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                    className="w-full px-3 py-2 border border-[#4C6B56]/20 rounded-lg focus:ring-2 focus:ring-[#4C6B56] focus:border-transparent bg-[#090C02] text-[#D0D6B5]"
                  >
                    {DATE_FILTERS.map((filter) => (
                      <option key={filter.value} value={filter.value}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="flex items-center text-sm font-medium text-[#D0D6B5]/70 mb-2">
                    <Tag className="w-4 h-4 mr-2" />
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-[#4C6B56]/20 rounded-lg focus:ring-2 focus:ring-[#4C6B56] focus:border-transparent bg-[#090C02] text-[#D0D6B5]"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table (Desktop) */}
          <div className="hidden md:block bg-[#02224F]/10 backdrop-blur-xl border border-[#4C6B56]/20 rounded-xl overflow-hidden">
            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <Search className="w-12 h-12 text-[#D0D6B5]/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#D0D6B5] mb-2">No transactions found</h3>
                <p className="text-[#D0D6B5]/60">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-[#090C02]/50 border-b border-[#4C6B56]/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#D0D6B5]/60 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#D0D6B5]/60 uppercase tracking-wider">
                      Merchant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#D0D6B5]/60 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#D0D6B5]/60 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-[#D0D6B5]/60 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4C6B56]/10">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-[#4C6B56]/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D0D6B5]">
                        {formatDate(transaction.transaction_date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#D0D6B5]">{transaction.merchant_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 bg-[#4C6B56]/20 text-[#D0D6B5] rounded-full text-xs font-medium">
                          {transaction.category}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                          transaction.amount > 0 ? "text-[#4C6B56]" : "text-[#D0D6B5]"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {transaction.is_pending ? (
                          <span className="px-2 py-1 bg-[#776871]/20 text-[#776871] rounded-full text-xs font-medium">
                            Pending
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-[#4C6B56]/20 text-[#4C6B56] rounded-full text-xs font-medium">
                            Posted
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Transactions Cards (Mobile) */}
          <div className="md:hidden space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="bg-[#02224F]/10 backdrop-blur-xl border border-[#4C6B56]/20 rounded-xl p-12 text-center">
                <Search className="w-12 h-12 text-[#D0D6B5]/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#D0D6B5] mb-2">No transactions found</h3>
                <p className="text-[#D0D6B5]/60">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-[#02224F]/10 backdrop-blur-xl border border-[#4C6B56]/20 rounded-xl p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#D0D6B5]">{transaction.merchant_name}</h3>
                      <p className="text-sm text-[#D0D6B5]/60 mt-1">{formatDate(transaction.transaction_date)}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${transaction.amount > 0 ? "text-[#4C6B56]" : "text-[#D0D6B5]"}`}
                      >
                        {transaction.amount > 0 ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#4C6B56]/10">
                    <span className="px-2 py-1 bg-[#4C6B56]/20 text-[#D0D6B5] rounded-full text-xs font-medium">
                      {transaction.category}
                    </span>
                    {transaction.is_pending ? (
                      <span className="px-2 py-1 bg-[#776871]/20 text-[#776871] rounded-full text-xs font-medium">
                        Pending
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-[#4C6B56]/20 text-[#4C6B56] rounded-full text-xs font-medium">
                        Posted
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#02224F]/90 backdrop-blur-2xl border border-[#4C6B56]/30 rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-[#D0D6B5]/60 hover:text-[#D0D6B5] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <h2 className="text-2xl font-bold text-[#D0D6B5] mb-6">Add Manual Transaction</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-[#D0D6B5] mb-2">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4C6B56]" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="15.00"
                    className="w-full pl-10 pr-4 py-3 bg-[#090C02] border border-[#4C6B56]/20 rounded-lg text-[#D0D6B5] text-lg font-semibold focus:ring-2 focus:ring-[#4C6B56] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Type Toggle */}
              <div>
                <label className="block text-sm font-medium text-[#D0D6B5] mb-2">Type</label>
                <div className="flex gap-2 bg-[#090C02] p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setTransactionType("expense")}
                    className={`flex-1 py-2 rounded-md font-medium transition-all ${
                      transactionType === "expense"
                        ? "bg-[#776871] text-white"
                        : "text-[#D0D6B5]/60 hover:text-[#D0D6B5]"
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransactionType("income")}
                    className={`flex-1 py-2 rounded-md font-medium transition-all ${
                      transactionType === "income"
                        ? "bg-[#4C6B56] text-white"
                        : "text-[#D0D6B5]/60 hover:text-[#D0D6B5]"
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Date Picker */}
              <div>
                <label className="block text-sm font-medium text-[#D0D6B5] mb-2">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4C6B56]" />
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-[#090C02] border border-[#4C6B56]/20 rounded-lg text-[#D0D6B5] focus:ring-2 focus:ring-[#4C6B56] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Merchant Input */}
              <div>
                <label className="block text-sm font-medium text-[#D0D6B5] mb-2">Merchant</label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4C6B56]" />
                  <input
                    type="text"
                    required
                    value={formData.merchant}
                    onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                    placeholder="e.g., Starbucks"
                    className="w-full pl-10 pr-4 py-3 bg-[#090C02] border border-[#4C6B56]/20 rounded-lg text-[#D0D6B5] focus:ring-2 focus:ring-[#4C6B56] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-sm font-medium text-[#D0D6B5] mb-2">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4C6B56]" />
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-[#090C02] border border-[#4C6B56]/20 rounded-lg text-[#D0D6B5] focus:ring-2 focus:ring-[#4C6B56] focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Food & Drink">Food & Drink</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Dining">Dining</option>
                    <option value="Health">Health</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Income">Income</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Account Dropdown */}
              <div>
                <label className="block text-sm font-medium text-[#D0D6B5] mb-2">Account</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4C6B56]" />
                  <select
                    value={formData.account}
                    onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-[#090C02] border border-[#4C6B56]/20 rounded-lg text-[#D0D6B5] focus:ring-2 focus:ring-[#4C6B56] focus:border-transparent"
                  >
                    <option value="Cash / Wallet">Cash / Wallet</option>
                    <option value="Checking Account">Checking Account</option>
                    <option value="Savings Account">Savings Account</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-[#4C6B56]/20 text-[#D0D6B5] rounded-lg font-medium hover:bg-[#4C6B56]/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#4C6B56] hover:bg-[#4C6B56]/90 text-white rounded-lg font-medium transition-colors"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}



Budget:

![alt text](image-11.png)
![alt text](image-12.png)
"use client"

import type React from "react"

/**
 * Budgets Page
 * View, create, and manage spending budgets
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, Calendar, DollarSign, MoreVertical, X, Target, Bell } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Sidebar } from "@/components/sidebar"

const mockBudgets = [
  {
    id: "1",
    name: "Groceries",
    category: "Food",
    amount: 600,
    spent: 425,
    color: "#4C6B56",
    period: "monthly",
  },
  {
    id: "2",
    name: "Entertainment",
    category: "Entertainment",
    amount: 300,
    spent: 275,
    color: "#776871",
    period: "monthly",
  },
  {
    id: "3",
    name: "Transportation",
    category: "Transport",
    amount: 400,
    spent: 380,
    color: "#02224F",
    period: "monthly",
  },
  {
    id: "4",
    name: "Dining Out",
    category: "Food",
    amount: 250,
    spent: 180,
    color: "#D0D6B5",
    period: "monthly",
  },
]

const mockRecurringExpenses = [
  {
    id: "1",
    name: "Netflix",
    amount: 15.99,
    nextBilling: "Jan 15, 2025",
    category: "Entertainment",
  },
  {
    id: "2",
    name: "Spotify",
    amount: 10.99,
    nextBilling: "Jan 20, 2025",
    category: "Entertainment",
  },
  {
    id: "3",
    name: "Gym Membership",
    amount: 49.99,
    nextBilling: "Jan 1, 2025",
    category: "Health",
  },
  {
    id: "4",
    name: "Phone Bill",
    amount: 75.0,
    nextBilling: "Jan 10, 2025",
    category: "Utilities",
  },
  {
    id: "5",
    name: "Cloud Storage",
    amount: 9.99,
    nextBilling: "Jan 25, 2025",
    category: "Technology",
  },
]

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function BudgetsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"budgets" | "recurring">("budgets")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [budgetForm, setBudgetForm] = useState({
    category: "",
    period: "monthly" as "weekly" | "monthly" | "yearly",
    amount: "",
    alertEnabled: true,
  })
  const [budgets, setBudgets] = useState(mockBudgets)

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault()
    const newBudget = {
      id: (budgets.length + 1).toString(),
      name: budgetForm.category,
      category: budgetForm.category,
      amount: Number.parseFloat(budgetForm.amount),
      spent: 0,
      color: ["#4C6B56", "#776871", "#02224F", "#D0D6B5"][budgets.length % 4],
      period: budgetForm.period,
    }
    setBudgets([...budgets, newBudget])
    setShowCreateModal(false)
    setBudgetForm({ category: "", period: "monthly", amount: "", alertEnabled: true })
  }

  const chartData = budgets.map((b) => ({
    name: b.name,
    value: b.spent,
    color: b.color,
  }))

  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0)
  const recurringTotal = mockRecurringExpenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="flex min-h-screen bg-[#090C02]">
      <Sidebar />

      {/* Main Content */}
      <main className={`flex-1 ml-20 overflow-y-auto p-6 lg:p-8 ${showCreateModal ? "blur-sm" : ""}`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#D0D6B5] mb-2">Budget Analysis</h1>
              <p className="text-[#D0D6B5]/60">Track spending habits and manage your budgets</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-[#4C6B56] hover:bg-[#4C6B56]/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="hidden sm:inline">New Budget</span>
            </button>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("budgets")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "budgets"
                ? "bg-[#4C6B56] text-white"
                : "bg-[#02224F]/10 text-[#D0D6B5]/60 hover:text-[#D0D6B5]"
            }`}
          >
            Category Budgets
          </button>
          <button
            onClick={() => setActiveTab("recurring")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "recurring"
                ? "bg-[#4C6B56] text-white"
                : "bg-[#02224F]/10 text-[#D0D6B5]/60 hover:text-[#D0D6B5]"
            }`}
          >
            Recurring Subscriptions
          </button>
        </div>

        {activeTab === "budgets" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Donut Chart */}
            <div className="bg-[#02224F]/10 backdrop-blur-xl border border-[#4C6B56]/20 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-[#D0D6B5] mb-6">Spending Breakdown</h2>

              <div className="relative">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={100}
                      outerRadius={150}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#02224F",
                        border: "1px solid #4C6B56",
                        borderRadius: "8px",
                        color: "#D0D6B5",
                      }}
                      formatter={(value: number) => `$${value.toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-[#D0D6B5]/60 text-sm mb-1">Total Spent</p>
                  <p className="text-3xl font-bold text-[#D0D6B5]">${totalSpent.toLocaleString()}</p>
                  <p className="text-[#D0D6B5]/60 text-sm mt-1">of ${totalBudgeted.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Right: Category Progress Bars */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-[#D0D6B5] mb-6">Budget Progress</h2>

              {budgets.map((budget) => {
                const percentage = (budget.spent / budget.amount) * 100
                const isOverBudget = percentage > 100
                const isNearLimit = percentage > 80 && percentage <= 100

                return (
                  <div
                    key={budget.id}
                    className="bg-[#02224F]/10 backdrop-blur-xl border border-[#D0D6B5]/10 rounded-xl p-6 hover:border-[#4C6B56]/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-[#D0D6B5]">{budget.name}</h3>
                      <button className="text-[#D0D6B5]/40 hover:text-[#D0D6B5] transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-2xl font-bold text-[#4C6B56]">{formatCurrency(budget.spent)}</span>
                      <span className="text-sm text-[#D0D6B5]/60">of {formatCurrency(budget.amount)}</span>
                    </div>

                    <div className="w-full h-3 bg-[#090C02] rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full transition-all ${
                          isOverBudget ? "bg-red-500" : isNearLimit ? "bg-yellow-500" : "bg-[#4C6B56]"
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={`font-medium ${
                          isOverBudget ? "text-red-400" : isNearLimit ? "text-yellow-400" : "text-[#4C6B56]"
                        }`}
                      >
                        {percentage.toFixed(1)}% used
                      </span>
                      <span className="text-[#D0D6B5]/60">
                        {formatCurrency(budget.amount - budget.spent)} remaining
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* Recurring Subscriptions View */
          <div className="bg-[#02224F]/10 backdrop-blur-xl border border-[#4C6B56]/20 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-[#D0D6B5]">Recurring Expenses</h2>
              <div className="text-right">
                <p className="text-[#D0D6B5]/60 text-sm">Monthly Total</p>
                <p className="text-2xl font-bold text-[#4C6B56]">{formatCurrency(recurringTotal)}</p>
              </div>
            </div>

            <div className="space-y-4">
              {mockRecurringExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-[#090C02]/50 border border-[#D0D6B5]/10 rounded-xl p-5 hover:border-[#4C6B56]/30 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#4C6B56]/20 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-[#4C6B56]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#D0D6B5] mb-1">{expense.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-[#D0D6B5]/60">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Next: {expense.nextBilling}
                        </span>
                        <span className="px-2 py-0.5 bg-[#4C6B56]/20 rounded-full text-xs">{expense.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#D0D6B5]">{formatCurrency(expense.amount)}</p>
                    <p className="text-xs text-[#D0D6B5]/60">per month</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#02224F]/90 backdrop-blur-2xl border border-[#4C6B56]/30 rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-[#D0D6B5]/60 hover:text-[#D0D6B5] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header with Icon */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#D0D6B5]/10 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-[#D0D6B5]" />
              </div>
              <h2 className="text-2xl font-bold text-[#D0D6B5]">Set New Budget Target</h2>
            </div>

            <form onSubmit={handleCreateBudget} className="space-y-6">
              {/* Category Dropdown */}
              <div>
                <label className="block text-sm font-medium text-[#D0D6B5] mb-2">Category</label>
                <select
                  required
                  value={budgetForm.category}
                  onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                  className="w-full px-4 py-3 bg-[#090C02] border border-[#4C6B56]/20 rounded-lg text-[#D0D6B5] focus:ring-2 focus:ring-[#4C6B56] focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Dining Out">Dining Out</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Health & Fitness">Health & Fitness</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Rent / Mortgage">Rent / Mortgage</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Travel">Travel</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Period Segmented Control */}
              <div>
                <label className="block text-sm font-medium text-[#D0D6B5] mb-2">Period</label>
                <div className="flex gap-2 bg-[#090C02] p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setBudgetForm({ ...budgetForm, period: "weekly" })}
                    className={`flex-1 py-2 rounded-md font-medium transition-all ${
                      budgetForm.period === "weekly"
                        ? "bg-[#4C6B56] text-white"
                        : "text-[#D0D6B5]/60 hover:text-[#D0D6B5]"
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBudgetForm({ ...budgetForm, period: "monthly" })}
                    className={`flex-1 py-2 rounded-md font-medium transition-all ${
                      budgetForm.period === "monthly"
                        ? "bg-[#4C6B56] text-white"
                        : "text-[#D0D6B5]/60 hover:text-[#D0D6B5]"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBudgetForm({ ...budgetForm, period: "yearly" })}
                    className={`flex-1 py-2 rounded-md font-medium transition-all ${
                      budgetForm.period === "yearly"
                        ? "bg-[#4C6B56] text-white"
                        : "text-[#D0D6B5]/60 hover:text-[#D0D6B5]"
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>

              {/* Limit Amount Input */}
              <div>
                <label className="block text-sm font-medium text-[#D0D6B5] mb-2">Limit Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-[#4C6B56]" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={budgetForm.amount}
                    onChange={(e) => setBudgetForm({ ...budgetForm, amount: e.target.value })}
                    placeholder="500.00"
                    className="w-full pl-12 pr-4 py-3 bg-[#090C02] border border-[#4C6B56]/20 rounded-lg text-[#D0D6B5] text-2xl font-bold focus:ring-2 focus:ring-[#4C6B56] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Alert Checkbox */}
              <div className="bg-[#090C02] border border-[#4C6B56]/20 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={budgetForm.alertEnabled}
                    onChange={(e) => setBudgetForm({ ...budgetForm, alertEnabled: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded border-[#4C6B56]/20 text-[#4C6B56] focus:ring-[#4C6B56] focus:ring-offset-0 bg-[#090C02]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-[#D0D6B5] font-medium">
                      <Bell className="w-4 h-4" />
                      <span>Budget Alerts</span>
                    </div>
                    <p className="text-sm text-[#D0D6B5]/60 mt-1">Notify me when I reach 80% of my budget</p>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 border border-[#4C6B56]/20 text-[#D0D6B5] rounded-lg font-medium hover:bg-[#4C6B56]/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#4C6B56] hover:bg-[#4C6B56]/90 text-white rounded-lg font-medium transition-colors"
                >
                  Create Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}



Settings:
![alt text](image-13.png)

"use client"

/**
 * Settings Page
 * User profile, account settings, and preferences
 * Mobile responsive
 */

import { useState } from "react"
import { User, Mail, Calendar, Shield, CreditCard, LogOut, AlertCircle } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

const mockUser = {
  id: "user_123456",
  email: "user@onelegder.com",
  full_name: "John Doe",
  created_at: "2024-01-15T10:30:00Z",
  last_login_at: "2024-12-10T08:15:00Z",
  invite_code: "INVITE2024XYZ",
  invite_expires_at: "2025-12-31T23:59:59Z",
  is_admin: false,
}

const mockPlaidItems = [
  {
    id: "1",
    institution_name: "Chase Bank",
    status: "active" as const,
    created_at: "2024-01-20T14:00:00Z",
    last_synced_at: "2024-12-10T06:00:00Z",
  },
  {
    id: "2",
    institution_name: "American Express",
    status: "active" as const,
    created_at: "2024-02-15T10:00:00Z",
    last_synced_at: "2024-12-10T06:00:00Z",
  },
]

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "today"
  if (diffDays === 1) return "yesterday"
  if (diffDays < 30) return `${diffDays} days ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

export default function SettingsPage() {
  const [user] = useState(mockUser)
  const [plaidItems] = useState(mockPlaidItems)

  const handleSignOut = () => {
    if (confirm("Are you sure you want to sign out?")) {
      window.location.href = "/auth"
    }
  }

  return (
    <div className="flex min-h-screen bg-[#090C02]">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-20 overflow-y-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#D0D6B5]">Settings</h1>
          <p className="text-[#D0D6B5]/60 mt-2">Manage your account and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <section className="bg-[#02224F]/10 backdrop-blur-xl border border-[#4C6B56]/20 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-[#D0D6B5] mb-6 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Profile Information
            </h2>

            <div className="space-y-4">
              {/* Full Name */}
              <div className="flex items-start justify-between py-3 border-b border-[#D0D6B5]/10">
                <div className="flex items-start">
                  <User className="w-5 h-5 text-[#D0D6B5]/40 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-[#D0D6B5]/60">Full Name</p>
                    <p className="text-base text-[#D0D6B5] mt-1">{user.full_name}</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start justify-between py-3 border-b border-[#D0D6B5]/10">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-[#D0D6B5]/40 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-[#D0D6B5]/60">Email</p>
                    <p className="text-base text-[#D0D6B5] mt-1">{user.email}</p>
                  </div>
                </div>
                {user.is_admin && (
                  <span className="px-2 py-1 bg-[#4C6B56]/20 text-[#4C6B56] rounded-full text-xs font-medium">
                    Admin
                  </span>
                )}
              </div>

              {/* Member Since */}
              <div className="flex items-start py-3 border-b border-[#D0D6B5]/10">
                <Calendar className="w-5 h-5 text-[#D0D6B5]/40 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-[#D0D6B5]/60">Member Since</p>
                  <p className="text-base text-[#D0D6B5] mt-1">{formatDate(user.created_at)}</p>
                  <p className="text-sm text-[#D0D6B5]/40 mt-0.5">{formatRelativeTime(user.created_at)}</p>
                </div>
              </div>

              {/* Last Login */}
              <div className="flex items-start py-3">
                <Calendar className="w-5 h-5 text-[#D0D6B5]/40 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-[#D0D6B5]/60">Last Login</p>
                  <p className="text-base text-[#D0D6B5] mt-1">{formatDate(user.last_login_at)}</p>
                  <p className="text-sm text-[#D0D6B5]/40 mt-0.5">{formatRelativeTime(user.last_login_at)}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Invite Information */}
          <section className="bg-[#02224F]/10 backdrop-blur-xl border border-[#4C6B56]/20 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-[#D0D6B5] mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Invite Information
            </h2>

            <div className="space-y-4">
              {/* Invite Code */}
              <div className="flex items-start py-3 border-b border-[#D0D6B5]/10">
                <Shield className="w-5 h-5 text-[#D0D6B5]/40 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-[#D0D6B5]/60">Invite Code Used</p>
                  <p className="text-base text-[#D0D6B5] mt-1 font-mono">{user.invite_code}</p>
                </div>
              </div>

              {/* Invite Expiration */}
              <div className="flex items-start py-3">
                <Calendar className="w-5 h-5 text-[#D0D6B5]/40 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-[#D0D6B5]/60">Invite Expiration</p>
                  <p className="text-base text-[#D0D6B5] mt-1">{formatDate(user.invite_expires_at)}</p>
                  <p className="text-sm text-[#4C6B56] mt-0.5">Active</p>
                </div>
              </div>
            </div>
          </section>

          {/* Connected Banks */}
          <section className="bg-[#02224F]/10 backdrop-blur-xl border border-[#4C6B56]/20 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-[#D0D6B5] mb-6 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Connected Banks
            </h2>

            {plaidItems.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-[#D0D6B5]/40 mx-auto mb-3" />
                <p className="text-[#D0D6B5]/60">No bank accounts connected</p>
              </div>
            ) : (
              <div className="space-y-3">
                {plaidItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-[#D0D6B5]/10 rounded-xl hover:border-[#4C6B56]/30 transition-colors"
                  >
                    <div className="flex items-center flex-1">
                      <CreditCard className="w-5 h-5 text-[#D0D6B5]/40 mr-3" />
                      <div className="flex-1">
                        <p className="font-semibold text-[#D0D6B5]">{item.institution_name}</p>
                        <p className="text-sm text-[#D0D6B5]/60">Connected {formatRelativeTime(item.created_at)}</p>
                        <p className="text-xs text-[#D0D6B5]/40 mt-0.5">
                          Last synced {formatRelativeTime(item.last_synced_at)}
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-[#4C6B56]/20 text-[#4C6B56] rounded-full text-xs font-medium">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Danger Zone */}
          <section className="bg-[#02224F]/10 backdrop-blur-xl border border-[#776871]/20 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-[#776871] mb-6 flex items-center">
              <LogOut className="w-5 h-5 mr-2" />
              Account Actions
            </h2>

            <div className="space-y-4">
              {/* Sign Out */}
              <div className="flex items-center justify-between p-4 border border-[#D0D6B5]/10 rounded-xl">
                <div>
                  <p className="font-semibold text-[#D0D6B5]">Sign Out</p>
                  <p className="text-sm text-[#D0D6B5]/60 mt-1">Sign out of your OneLedger account</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="bg-[#776871] hover:bg-[#776871]/80 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>

              {/* Account Info */}
              <div className="p-4 bg-[#090C02]/50 rounded-xl border border-[#D0D6B5]/10">
                <p className="text-sm text-[#D0D6B5]/60">
                  <strong>Account ID:</strong> <span className="font-mono text-xs">{user.id}</span>
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}


OneLibro logo:
![alt text](OneLedgeria-log.png)
![alt text](OneLibro-icon.png)
