/**
 * API Route: Exchange Plaid Public Token
 * POST /api/plaid/exchange-token
 * 
 * Exchanges Plaid public token for access token
 * Stores access token in database and triggers account sync
 */

import { NextRequest, NextResponse } from 'next/server';
import { exchangePublicToken, getAccounts } from '@/lib/plaid';
import { getServerUser, createServiceRoleClient } from '@/lib/supabase-server';
import crypto from 'crypto';

/**
 * Encrypt access token before storing
 * Using AES-256-CBC encryption
 */
function encryptAccessToken(accessToken: string): string {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(accessToken, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Return IV + encrypted data (both in hex)
  return iv.toString('hex') + ':' + encrypted;
}

export async function POST(request: NextRequest) {
  try {
    // Get auth token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    // Get current user (server-side)
    const user = await getServerUser(token);
    // Use service role client for database operations (bypasses RLS)
    const supabase = createServiceRoleClient();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { publicToken, userId, institutionId, institutionName } = body;

    // Verify userId matches authenticated user
    if (userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - User ID mismatch' },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!publicToken) {
      return NextResponse.json(
        { error: 'Missing publicToken' },
        { status: 400 }
      );
    }

    // Exchange public token for access token
    const { accessToken, itemId, error: exchangeError } = await exchangePublicToken(publicToken);

    if (exchangeError || !accessToken || !itemId) {
      console.error('Error exchanging public token:', exchangeError);
      return NextResponse.json(
        { error: exchangeError || 'Failed to exchange token' },
        { status: 500 }
      );
    }

    // Encrypt access token
    const encryptedAccessToken = encryptAccessToken(accessToken);

    // Store Plaid item in database
    const { data: plaidItem, error: plaidItemError } = await supabase
      .from('plaid_items')
      .insert({
        user_id: user.id,
        plaid_item_id: itemId,
        access_token: encryptedAccessToken,
        institution_id: institutionId || null,
        institution_name: institutionName || 'Unknown Bank',
        status: 'active',
      })
      .select()
      .single();

    if (plaidItemError || !plaidItem) {
      console.error('Error storing Plaid item:', plaidItemError);
      return NextResponse.json(
        { error: 'Failed to store connection' },
        { status: 500 }
      );
    }

    // Fetch accounts from Plaid
    const { accounts, error: accountsError } = await getAccounts(accessToken);

    if (accountsError || !accounts) {
      console.error('Error fetching accounts:', accountsError);
      // Don't fail the request, but log the error
      return NextResponse.json({
        success: true,
        itemId: plaidItem.id,
        message: 'Bank connected, but failed to fetch accounts. They will sync later.',
      });
    }

    // Store accounts in database
    const accountsToInsert = accounts.map((account) => ({
      user_id: user.id,
      plaid_item_id: plaidItem.id,
      plaid_account_id: account.account_id,
      account_name: account.name,
      account_type: account.type,
      current_balance: account.balances.current ? Math.round(account.balances.current * 100) : 0,
      available_balance: account.balances.available ? Math.round(account.balances.available * 100) : 0,
      currency: account.balances.currency || 'USD',
    }));

    const { error: accountsInsertError } = await supabase
      .from('accounts')
      .insert(accountsToInsert);

    if (accountsInsertError) {
      console.error('Error storing accounts:', accountsInsertError);
      // Don't fail the request
      return NextResponse.json({
        success: true,
        itemId: plaidItem.id,
        message: 'Bank connected, but failed to store accounts. They will sync later.',
      });
    }

    // Trigger transaction sync (async, don't wait)
    // Forward the Authorization header from the current request
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/plaid/sync-transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '', // Forward auth token
      },
      body: JSON.stringify({ itemId: plaidItem.id }),
    }).catch((err) => console.error('Error triggering sync:', err));

    // Return success
    return NextResponse.json({
      success: true,
      itemId: plaidItem.id,
      accountsCount: accounts.length,
      message: 'Bank connected successfully!',
    });
  } catch (error) {
    console.error('Error in exchange-token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}