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
import { usePlaidLink, PlaidLinkOnSuccessMetadata, PlaidLinkOnExitMetadata, PlaidLinkError } from 'react-plaid-link';
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
    async (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (err: PlaidLinkError | null, _metadata: PlaidLinkOnExitMetadata) => {
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
      ? 'bg-[#10b981] hover:bg-[#10b981]/90 text-[#1a1a1a]'
      : 'bg-[#e5e5e5]/5 hover:bg-[#e5e5e5]/10 text-[#e5e5e5] border border-[#a3a3a3]/20';

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading || !user}
        className={`
          ${buttonClasses}
          px-4 py-2 rounded-lg font-medium text-sm
          inline-flex items-center gap-2
          transition-all
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
            Connecting...
          </>
        ) : (
          <>
            <LinkIcon className="w-4 h-4" strokeWidth={2} />
            {buttonText}
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-3 bg-red-900/20 border border-red-800/50 rounded-lg p-3 flex items-start backdrop-blur-sm">
          <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
}