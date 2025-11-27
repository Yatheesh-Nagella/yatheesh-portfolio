'use client';

/**
 * PlaidLink Component
 * Opens Plaid Link modal to connect bank accounts
 * Handles token exchange and account sync
 * 
 * Usage:
 * <PlaidLink onSuccess={() => refetchAccounts()} />
 */

import React, { useState, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Loader2, Link as LinkIcon, AlertCircle } from 'lucide-react';

interface PlaidLinkProps {
  onSuccess?: () => void;
  onExit?: () => void;
  buttonText?: string;
  variant?: 'primary' | 'secondary';
}

export default function PlaidLink({
  onSuccess,
  onExit,
  buttonText = 'Connect Bank Account',
  variant = 'primary',
}: PlaidLinkProps) {
  const { user } = useAuth();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create Plaid Link token
   */
  const createLinkToken = async () => {
    if (!user) {
      setError('You must be logged in to connect a bank account');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get session token
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch('/api/plaid/create-link-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create link token');
      }

      setLinkToken(data.link_token);
    } catch (err) {
      console.error('Error creating link token:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize Plaid');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle successful bank connection
   */
  const onPlaidSuccess = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (publicToken: string, metadata: any) => {
      try {
        setLoading(true);
        setError(null);

        // Get session token
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          throw new Error('No active session');
        }

        // Exchange public token for access token
        const response = await fetch('/api/plaid/exchange-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            publicToken,
            userId: user?.id,
            institutionId: metadata.institution?.institution_id,
            institutionName: metadata.institution?.name,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to connect account');
        }

        // Call success callback
        if (onSuccess) {
          onSuccess();
        }
      } catch (err) {
        console.error('Error exchanging token:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect account');
      } finally {
        setLoading(false);
      }
    },
    [user, onSuccess]
  );

  /**
   * Handle Plaid Link exit
   */
  const onPlaidExit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    (err: any, _metadata: any) => {
      if (err) {
        console.error('Plaid Link error:', err);
        setError('Connection failed. Please try again.');
      }

      if (onExit) {
        onExit();
      }
    },
    [onExit]
  );

  /**
   * Initialize Plaid Link
   */
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: onPlaidSuccess,
    onExit: onPlaidExit,
  });

  /**
   * Handle button click
   */
  const handleClick = () => {
    if (linkToken) {
      // If we have a token, open Plaid Link
      open();
    } else {
      // Otherwise, create a token first
      createLinkToken();
    }
  };

  /**
   * Watch for link token and auto-open
   */
  React.useEffect(() => {
    if (linkToken && ready) {
      open();
    }
  }, [linkToken, ready, open]);

  // Button styles based on variant
  const buttonClasses =
    variant === 'primary'
      ? 'bg-blue-500 hover:bg-blue-600 text-white'
      : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300';

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading || !user}
        className={`
          ${buttonClasses}
          px-6 py-3 rounded-lg font-semibold
          flex items-center justify-center
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-sm hover:shadow-md
        `}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Connecting...
          </>
        ) : (
          <>
            <LinkIcon className="w-5 h-5 mr-2" />
            {buttonText}
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}