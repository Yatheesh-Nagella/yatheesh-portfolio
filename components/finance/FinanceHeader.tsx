/* eslint-disable react/no-unescaped-entities */
'use client';

/**
 * Finance Header Component - OneLibro
 * Dark sophisticated theme with premium design
 * Persistent header/navigation for all finance pages
 */

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PlaidLink from '@/components/finance/PlaidLink';
import { Loader2, LogOut, Menu, X } from 'lucide-react';

interface FinanceHeaderProps {
  onBankConnected?: () => void;
}

export default function FinanceHeader({ onBankConnected }: FinanceHeaderProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track navigation loading state
  const [isPending, startTransition] = useTransition();
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  /**
   * Check if a route is active
   */
  const isActive = (path: string) => {
    return pathname === path;
  };

  /**
   * Check if a route is currently loading
   */
  const isLoading = (path: string) => {
    return isPending && pendingPath === path;
  };

  /**
   * Handle successful bank connection
   */
  const handleBankConnected = () => {
    if (onBankConnected) {
      onBankConnected();
    }
    // Force a refresh of the current page data
    router.refresh();
  };

  /**
   * Handle sign out with confirmation
   */
  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out?')) {
      signOut();
    }
  };

  /**
   * Navigation links
   */
  const navLinks = [
    { href: '/finance/dashboard', label: 'Dashboard' },
    { href: '/finance/accounts', label: 'Accounts' },
    { href: '/finance/transactions', label: 'Transactions' },
    { href: '/finance/budgets', label: 'Budgets' },
    { href: '/finance/settings', label: 'Settings' },
  ];

  /**
   * Handle navigation with loading state
   */
  const handleNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (!isActive(path) && !isPending) {
      setPendingPath(path);
      startTransition(() => {
        router.push(path);
        setMobileMenuOpen(false);
      });
    }
  };

  return (
    <header className="bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-[#a3a3a3]/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Title */}
          <Link
            href="/finance/dashboard"
            onClick={(e) => handleNavigation(e, '/finance/dashboard')}
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 relative">
              <Image
                src="/oneLibro-logo.png"
                alt="OneLibro"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#e5e5e5]">OneLibro</h1>
              <p className="text-xs text-[#a3a3a3]">
                Welcome, {user?.full_name || 'User'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavigation(e, link.href)}
                className={`
                  inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    isActive(link.href)
                      ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30'
                      : 'text-[#737373] hover:text-[#e5e5e5] hover:bg-[#e5e5e5]/5'
                  }
                  ${isLoading(link.href) ? 'opacity-50 cursor-wait' : ''}
                `}
              >
                {link.label}
                {isLoading(link.href) && <Loader2 className="w-3 h-3 animate-spin" />}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Plaid Link */}
            <PlaidLink
              onSuccess={handleBankConnected}
              buttonText="Connect"
              variant="primary"
            />

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#737373] hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" strokeWidth={2} />
              Sign Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <PlaidLink
              onSuccess={handleBankConnected}
              buttonText="Connect"
              variant="primary"
            />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#e5e5e5] hover:bg-[#e5e5e5]/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" strokeWidth={2} />
              ) : (
                <Menu className="w-6 h-6" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#a3a3a3]/10 bg-[#1a1a1a]/98 backdrop-blur-sm">
          <nav className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavigation(e, link.href)}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${
                    isActive(link.href)
                      ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30'
                      : 'text-[#737373] hover:text-[#e5e5e5] hover:bg-[#e5e5e5]/5'
                  }
                  ${isLoading(link.href) ? 'opacity-50 cursor-wait' : ''}
                `}
              >
                {link.label}
                {isLoading(link.href) && <Loader2 className="w-4 h-4 animate-spin" />}
              </Link>
            ))}

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#737373] hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" strokeWidth={2} />
              Sign Out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
