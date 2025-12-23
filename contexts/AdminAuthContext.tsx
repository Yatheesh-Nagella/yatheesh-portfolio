'use client';

/**
 * Admin Authentication Context
 * Separate authentication for admin dashboard with TOTP 2FA
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '@/lib/admin-auth';

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ requiresTOTP: boolean; userId?: string; error: string | null }>;
  verifyTOTP: (userId: string, code: string) => Promise<{ success: boolean; error: string | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');

      if (!token) {
        setAdminUser(null);
        return;
      }

      const response = await fetch('/api/admin/auth/verify-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.user) {
        setAdminUser(data.user);
      } else {
        localStorage.removeItem('admin_token');
        setAdminUser(null);
      }
    } catch (error) {
      console.error('Error checking admin session:', error);
      localStorage.removeItem('admin_token');
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.error) {
        return { requiresTOTP: false, error: data.error };
      }

      if (data.requiresTOTP) {
        return { requiresTOTP: true, userId: data.userId, error: null };
      }

      // No TOTP required - session created
      if (data.token) {
        localStorage.setItem('admin_token', data.token);
        setAdminUser(data.user);
      }

      return { requiresTOTP: false, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { requiresTOTP: false, error: 'Sign in failed' };
    }
  }

  async function verifyTOTP(userId: string, code: string) {
    try {
      const response = await fetch('/api/admin/auth/verify-totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code }),
      });

      const data = await response.json();

      if (data.error) {
        return { success: false, error: data.error };
      }

      if (data.token) {
        localStorage.setItem('admin_token', data.token);
        setAdminUser(data.user);
        return { success: true, error: null };
      }

      return { success: false, error: 'Verification failed' };
    } catch (error) {
      console.error('Error verifying TOTP:', error);
      return { success: false, error: 'Verification failed' };
    }
  }

  async function signOut() {
    try {
      const token = localStorage.getItem('admin_token');

      if (token) {
        await fetch('/api/admin/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      }

      localStorage.removeItem('admin_token');
      setAdminUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      localStorage.removeItem('admin_token');
      setAdminUser(null);
    }
  }

  async function refreshSession() {
    await checkSession();
  }

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        loading,
        signIn,
        verifyTOTP,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
