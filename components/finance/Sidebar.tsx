'use client';

/**
 * Sidebar Component - OneLibro
 * Collapsible sidebar navigation with emoji icons
 * Includes user info and actions at bottom
 */

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Loader2,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  emoji: string;
  description: string;
}

interface SidebarProps {}

const navItems: NavItem[] = [
  {
    href: '/finance/dashboard',
    label: 'Dashboard',
    emoji: '📊',
    description: 'Overview and insights',
  },
  {
    href: '/finance/accounts',
    label: 'Accounts',
    emoji: '🏦',
    description: 'Connected banks',
  },
  {
    href: '/finance/transactions',
    label: 'Transactions',
    emoji: '💸',
    description: 'View all activity',
  },
  {
    href: '/finance/budgets',
    label: 'Budgets',
    emoji: '🎯',
    description: 'Spending goals',
  },
  {
    href: '/finance/settings',
    label: 'Settings',
    emoji: '⚙️',
    description: 'Account preferences',
  },
];

export default function Sidebar({}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Navigation loading state
  const [isPending, startTransition] = useTransition();
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  // Load collapse state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  // Save collapse state to localStorage
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  // Check if route is active
  const isActive = (href: string) => pathname === href;

  // Check if route is loading
  const isLoading = (href: string) => isPending && pendingPath === href;

  // Handle navigation with loading state
  const handleNavigation = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (!isActive(href) && !isPending) {
      setPendingPath(href);
      startTransition(() => {
        router.push(href);
      });
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out?')) {
      signOut();
      router.push('/finance/login');
    }
  };

  return (
    <aside
      className={`
        hidden md:flex flex-col
        bg-[#1a1a1a] border-r border-[#a3a3a3]/10
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        h-screen sticky top-0
      `}
    >
      {/* Header with Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#a3a3a3]/10">
        <Link
          href="/finance/dashboard"
          className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${
            isCollapsed ? 'justify-center w-full' : ''
          }`}
        >
          <div className="w-8 h-8 relative flex-shrink-0">
            <Image
              src="/oneLibro-logo.png"
              alt="OneLibro"
              fill
              className="object-contain"
              priority
            />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold text-[#e5e5e5]">OneLibro</span>
          )}
        </Link>

        {/* Collapse Toggle */}
        {!isCollapsed && (
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#e5e5e5]/5 transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Expand Button (when collapsed) */}
      {isCollapsed && (
        <button
          onClick={toggleCollapse}
          className="mx-auto mt-2 p-2 rounded-lg text-[#a3a3a3] hover:text-[#10b981] hover:bg-[#10b981]/10 transition-colors"
          title="Expand sidebar"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavigation(e, item.href)}
              className={`
                group relative flex items-center gap-3 px-3 py-3 rounded-lg
                transition-all duration-200
                ${
                  isActive(item.href)
                    ? 'bg-[#10b981]/20 text-[#10b981] border-l-4 border-[#10b981]'
                    : 'text-[#a3a3a3] hover:bg-[#e5e5e5]/5 hover:text-[#e5e5e5] border-l-4 border-transparent'
                }
                ${isCollapsed ? 'justify-center' : ''}
                ${isLoading(item.href) ? 'opacity-50 cursor-wait' : ''}
              `}
              title={isCollapsed ? item.label : ''}
            >
              <span className="text-2xl flex-shrink-0">{item.emoji}</span>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate flex items-center gap-2">
                    {item.label}
                    {isLoading(item.href) && (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    )}
                  </p>
                  <p className="text-xs text-[#737373] truncate">
                    {item.description}
                  </p>
                </div>
              )}

              {/* Active Indicator */}
              {isActive(item.href) && !isCollapsed && !isLoading(item.href) && (
                <div className="w-2 h-2 rounded-full bg-[#10b981]" />
              )}

              {/* Loading Indicator when collapsed */}
              {isLoading(item.href) && isCollapsed && (
                <div className="absolute top-1 right-1">
                  <Loader2 className="w-3 h-3 animate-spin text-[#10b981]" />
                </div>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-[#0f0f0f] border border-[#a3a3a3]/20 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  <p className="text-sm font-medium text-[#e5e5e5]">
                    {item.label}
                  </p>
                  <p className="text-xs text-[#737373]">{item.description}</p>
                </div>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom Section - User & Actions */}
      <div className="border-t border-[#a3a3a3]/10 p-3 space-y-2">
        {/* User Info */}
        {!isCollapsed && user && (
          <div className="px-3 py-2 bg-[#e5e5e5]/5 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#10b981]/20 flex items-center justify-center">
                <User className="w-4 h-4 text-[#10b981]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#e5e5e5] truncate">
                  {user.full_name || 'User'}
                </p>
                <p className="text-xs text-[#737373] truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className={`
            w-full flex items-center gap-2 px-3 py-2 rounded-lg
            text-[#737373] hover:text-red-400 hover:bg-red-900/10
            transition-colors
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title={isCollapsed ? 'Sign Out' : ''}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
