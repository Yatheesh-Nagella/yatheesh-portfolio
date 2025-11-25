/**
 * Admin Layout
 * Server component wrapper that provides AdminAuthProvider context
 */

import React from 'react';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import AdminLayoutInner from '@/components/admin/AdminLayoutInner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
}
