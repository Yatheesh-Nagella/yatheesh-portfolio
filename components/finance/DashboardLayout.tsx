'use client';

/**
 * DashboardLayout Component - OneLibro
 * Main layout wrapper for all finance pages
 * Combines Sidebar, TopBar, and BottomNav
 */

import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onBankConnected?: () => void;
}

export default function DashboardLayout({
  children,
  onBankConnected,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      {/* Sidebar - Desktop Only */}
      <Sidebar onBankConnected={onBankConnected} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TopBar - Desktop Only */}
        <TopBar onBankConnected={onBankConnected} />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden">
          {/* Mobile Header - Shows on mobile instead of TopBar */}
          <div className="md:hidden bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-[#a3a3a3]/10 sticky top-0 z-40">
            <div className="h-14 px-4 flex items-center">
              <h1 className="text-lg font-bold text-[#e5e5e5]">OneLibro</h1>
            </div>
          </div>

          {/* Page Content with padding */}
          <div className="p-4 md:p-6 pb-20 md:pb-6">{children}</div>
        </main>

        {/* Bottom Navigation - Mobile Only */}
        <BottomNav />
      </div>
    </div>
  );
}
