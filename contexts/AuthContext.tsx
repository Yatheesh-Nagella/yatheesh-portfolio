'use client';

/**
 * Authentication Context
 * Provides global auth state and functions throughout the app
 * 
 * Usage:
 * import { useAuth } from '@/contexts/AuthContext';
 * const { user, loading, signIn, signOut } = useAuth();
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getCurrentUser, 
  signIn as supabaseSignIn,
  signUpWithInvite as supabaseSignUp,
  signOut as supabaseSignOut,
} from '@/lib/supabase';
import type { User } from '@/types/database.types';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string, inviteCode: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

// ============================================
// CREATE CONTEXT
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// PROVIDER COMPONENT
// ============================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkUser();
  }, []);

  /**
   * Check if user is authenticated
   */
  async function checkUser() {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Sign in with email and password
   */
  async function signIn(email: string, password: string): Promise<{ error: string | null }> {
    try {
      const { user: newUser, error } = await supabaseSignIn(email, password);
      
      if (error) {
        return { error };
      }

      setUser(newUser);
      router.push('/finance/dashboard');
      return { error: null };
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Sign in failed' 
      };
    }
  }

  /**
   * Sign up with invite code
   */
  async function signUp(
    email: string, 
    password: string, 
    name: string, 
    inviteCode: string
  ): Promise<{ error: string | null }> {
    try {
      const { user: newUser, error } = await supabaseSignUp(
        email, 
        password, 
        name, 
        inviteCode
      );
      
      if (error) {
        return { error };
      }

      setUser(newUser);
      router.push('/finance/dashboard');
      return { error: null };
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Sign up failed' 
      };
    }
  }

  /**
   * Sign out current user
   */
  async function signOut(): Promise<void> {
    try {
      await supabaseSignOut();
      setUser(null);
      router.push('/finance/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// HOOK TO USE AUTH CONTEXT
// ============================================

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// ============================================
// HELPER HOOKS
// ============================================

/**
 * Hook that redirects to login if not authenticated
 * Use in protected pages
 */
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/finance/login');
    }
  }, [user, loading, router]);

  return { user, loading };
}

