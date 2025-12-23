'use client';

/**
 * BottomNav Component - OneLibro
 * Mobile-only bottom navigation bar
 * Provides quick access to main sections
 */

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  emoji: string;
}

const navItems: NavItem[] = [
  { href: '/finance/dashboard', label: 'Dashboard', emoji: '📊' },
  { href: '/finance/accounts', label: 'Accounts', emoji: '🏦' },
  { href: '/finance/transactions', label: 'Transactions', emoji: '💸' },
  { href: '/finance/budgets', label: 'Budgets', emoji: '🎯' },
  { href: '/finance/settings', label: 'Settings', emoji: '⚙️' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Navigation loading state
  const [isPending, startTransition] = useTransition();
  const [pendingPath, setPendingPath] = useState<string | null>(null);

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

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a]/98 backdrop-blur-md border-t border-[#a3a3a3]/10 safe-area-inset-bottom">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={(e) => handleNavigation(e, item.href)}
            className={`
              flex flex-col items-center justify-center gap-1 transition-all relative
              ${
                isActive(item.href)
                  ? 'text-[#10b981]'
                  : 'text-[#737373] active:bg-[#e5e5e5]/5'
              }
              ${isLoading(item.href) ? 'opacity-50' : ''}
            `}
          >
            {/* Emoji Icon or Loading Spinner */}
            {isLoading(item.href) ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#10b981]" />
            ) : (
              <span
                className={`text-xl transition-transform ${
                  isActive(item.href) ? 'scale-110' : ''
                }`}
              >
                {item.emoji}
              </span>
            )}

            {/* Label */}
            <span
              className={`text-[10px] font-medium leading-tight ${
                isActive(item.href) ? 'font-bold' : ''
              }`}
            >
              {item.label}
            </span>

            {/* Active Indicator */}
            {isActive(item.href) && !isLoading(item.href) && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#10b981]" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
