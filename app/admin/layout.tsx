/**
 * Admin Layout
 * Server component wrapper that provides AdminAuthProvider and AdminThemeProvider contexts
 */

import React from 'react';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { AdminThemeProvider } from '@/contexts/AdminThemeContext';
import AdminLayoutInner from '@/components/admin/AdminLayoutInner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminThemeProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </AdminThemeProvider>
    </AdminAuthProvider>
  );
}
