'use client';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 * Shows loading spinner while checking auth status
 * 
 * Usage:
 * <ProtectedRoute>
 *   <YourProtectedContent />
 * </ProtectedRoute>
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/finance/login' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push(redirectTo);
    return null;
  }

  // User is authenticated, show content
  return <>{children}</>;
}