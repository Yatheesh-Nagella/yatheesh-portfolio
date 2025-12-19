'use client';

/**
 * TopBar Component - OneLibro
 * Displays current page title with emoji and actions
 * Complements the Sidebar component
 */

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PlaidLink from '@/components/finance/PlaidLink';
import { LogOut, User, ChevronDown } from 'lucide-react';

interface TopBarProps {
  onBankConnected?: () => void;
}

interface PageInfo {
  title: string;
  emoji: string;
}

const pageMap: Record<string, PageInfo> = {
  '/finance/dashboard': { title: 'Dashboard', emoji: '📊' },
  '/finance/accounts': { title: 'Accounts', emoji: '🏦' },
  '/finance/transactions': { title: 'Transactions', emoji: '💸' },
  '/finance/budgets': { title: 'Budgets', emoji: '🎯' },
  '/finance/settings': { title: 'Settings', emoji: '⚙️' },
};

export default function TopBar({ onBankConnected }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Get current page info
  const pageInfo = pageMap[pathname] || { title: 'OneLibro', emoji: '💚' };

  // Handle bank connected
  const handleBankConnected = () => {
    if (onBankConnected) {
      onBankConnected();
    }
    router.refresh();
  };

  // Handle sign out
  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out?')) {
      signOut();
      router.push('/finance/login');
    }
    setDropdownOpen(false);
  };

  return (
    <div className="hidden md:block bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-[#a3a3a3]/10 sticky top-0 z-40">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Left: Page Title */}
        <div className="flex items-center gap-3">
          <span className="text-3xl">{pageInfo.emoji}</span>
          <h1 className="text-xl font-bold text-[#e5e5e5]">{pageInfo.title}</h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Connect Bank Button */}
          <PlaidLink
            onSuccess={handleBankConnected}
            buttonText="Connect Bank"
            variant="primary"
          />

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-[#e5e5e5]/5 hover:bg-[#e5e5e5]/10 border border-[#a3a3a3]/10 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#10b981]/20 flex items-center justify-center">
                <User className="w-4 h-4 text-[#10b981]" />
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-medium text-[#e5e5e5] leading-tight">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-[#737373] leading-tight truncate max-w-[120px]">
                  {user?.email}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#a3a3a3] transition-transform ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />

                {/* Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-[#0f0f0f] border border-[#a3a3a3]/20 rounded-lg shadow-lg z-20 overflow-hidden">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-[#a3a3a3]/10">
                    <p className="text-sm font-medium text-[#e5e5e5] truncate">
                      {user?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-[#737373] truncate">
                      {user?.email}
                    </p>
                    {user?.is_admin && (
                      <span className="inline-block mt-2 px-2 py-1 bg-purple-900/30 text-purple-300 rounded text-xs font-medium">
                        Administrator
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        router.push('/finance/settings');
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#e5e5e5]/5 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#737373] hover:text-red-400 hover:bg-red-900/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
