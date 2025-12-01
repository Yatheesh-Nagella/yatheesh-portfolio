'use client';

/**
 * Finance Header Component
 * Persistent header/navigation for all finance pages
 * Stays mounted during navigation (no re-render)
 */

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useFinanceTheme } from '@/contexts/FinanceThemeContext';
import PlaidLink from '@/components/finance/PlaidLink';
import { Moon, Sun } from 'lucide-react';

interface FinanceHeaderProps {
  onBankConnected?: () => void;
}

export default function FinanceHeader({ onBankConnected }: FinanceHeaderProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useFinanceTheme();

  /**
   * Check if a route is active
   */
  const isActive = (path: string) => {
    return pathname === path;
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

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              OneLedger Finance
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Welcome back, {user?.full_name || 'User'}
            </p>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => router.push('/finance/dashboard')}
              className={`text-sm font-medium ${isActive('/finance/dashboard')
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push('/finance/accounts')}
              className={`text-sm font-medium ${isActive('/finance/accounts')
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              Accounts
            </button>
            <button
              onClick={() => router.push('/finance/transactions')}
              className={`text-sm font-medium ${isActive('/finance/transactions')
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              Transactions
            </button>
            <button
              onClick={() => router.push('/finance/budgets')}
              className={`text-sm font-medium ${isActive('/finance/budgets')
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              Budgets
            </button>
            <button
              onClick={() => router.push('/finance/settings')}
              className={`text-sm font-medium ${isActive('/finance/settings')
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              Settings
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Plaid Link */}
            <PlaidLink
              onSuccess={handleBankConnected}
              buttonText="Connect"
              variant="primary"
            />

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Plaid Link */}
            <PlaidLink
              onSuccess={handleBankConnected}
              buttonText="+"
              variant="primary"
            />

            {/* Mobile Menu Button */}
            <button
              onClick={() => router.push('/finance/settings')}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
