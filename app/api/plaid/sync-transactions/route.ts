/**
 * API Route: Sync Transactions
 * POST /api/plaid/sync-transactions
 * 
 * Fetches transactions from Plaid and stores them in database
 * Uses cursor-based pagination for incremental syncs
 */

import { NextRequest, NextResponse } from 'next/server';
import { syncTransactions } from '@/lib/plaid';
import { getCurrentUser } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

/**
 * Decrypt access token from database
 */
function decryptAccessToken(encryptedToken: string): string {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
  
  // Split IV and encrypted data
  const parts = encryptedToken.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

export async function POST(request: NextRequest) {
  try {
    // Get current user (optional for this endpoint)
    const user = await getCurrentUser();

    // Get request body
    const body = await request.json();
    const { itemId, cursor } = body;

    if (!itemId) {
      return NextResponse.json(
        { error: 'Missing itemId' },
        { status: 400 }
      );
    }

    // Get Plaid item from database
    const { data: plaidItem, error: itemError } = await supabase
      .from('plaid_items')
      .select('*')
      .eq('id', itemId)
      .single();

    if (itemError || !plaidItem) {
      console.error('Error fetching Plaid item:', itemError);
      return NextResponse.json(
        { error: 'Plaid item not found' },
        { status: 404 }
      );
    }

    // If user is authenticated, verify they own this item
    if (user && plaidItem.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - You don\'t own this connection' },
        { status: 403 }
      );
    }

    // Decrypt access token
    const accessToken = decryptAccessToken(plaidItem.access_token);

    // Sync transactions from Plaid
    const {
      added,
      modified,
      removed,
      nextCursor,
      hasMore,
      error: syncError,
    } = await syncTransactions(accessToken, cursor);

    if (syncError) {
      console.error('Error syncing transactions:', syncError);
      
      // Update Plaid item status
      await supabase
        .from('plaid_items')
        .update({ 
          status: 'error',
          error_message: syncError,
        })
        .eq('id', itemId);

      return NextResponse.json(
        { error: syncError },
        { status: 500 }
      );
    }

    // Get account mappings for this Plaid item
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('plaid_account_id, id')
      .eq('plaid_item_id', itemId);

    if (accountsError || !accounts) {
      console.error('Error fetching accounts:', accountsError);
      return NextResponse.json(
        { error: 'Failed to fetch accounts' },
        { status: 500 }
      );
    }

    // Create account ID lookup
    const accountIdMap = new Map(
      accounts.map((acc) => [acc.plaid_account_id, acc.id])
    );

    // Process added transactions
    if (added.length > 0) {
      const transactionsToInsert = added
        .filter((tx) => accountIdMap.has(tx.account_id))
        .map((tx) => ({
          user_id: plaidItem.user_id,
          account_id: accountIdMap.get(tx.account_id),
          plaid_transaction_id: tx.transaction_id,
          amount: Math.round(tx.amount * 100), // Convert to cents
          transaction_date: tx.date,
          merchant_name: tx.merchant_name || tx.name,
          category: tx.category ? tx.category[0] : null,
          is_pending: tx.pending,
          currency: 'USD',
        }));

      if (transactionsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('transactions')
          .insert(transactionsToInsert);

        if (insertError) {
          console.error('Error inserting transactions:', insertError);
          // Don't fail the entire request
        }
      }
    }

    // Process modified transactions
    if (modified.length > 0) {
      for (const tx of modified) {
        const accountId = accountIdMap.get(tx.account_id);
        if (!accountId) continue;

        await supabase
          .from('transactions')
          .update({
            amount: Math.round(tx.amount * 100),
            transaction_date: tx.date,
            merchant_name: tx.merchant_name || tx.name,
            category: tx.category ? tx.category[0] : null,
            is_pending: tx.pending,
          })
          .eq('plaid_transaction_id', tx.transaction_id);
      }
    }

    // Process removed transactions
    if (removed.length > 0) {
      await supabase
        .from('transactions')
        .update({ is_hidden: true })
        .in('plaid_transaction_id', removed);
    }

    // Update Plaid item sync status
    await supabase
      .from('plaid_items')
      .update({
        last_synced_at: new Date().toISOString(),
        status: 'active',
        error_message: null,
      })
      .eq('id', itemId);

    // If there are more transactions, recursively sync
    if (hasMore && nextCursor) {
      // Trigger another sync (async, don't wait)
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/plaid/sync-transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, cursor: nextCursor }),
      }).catch((err) => console.error('Error in recursive sync:', err));
    }

    // Return success
    return NextResponse.json({
      success: true,
      added: added.length,
      modified: modified.length,
      removed: removed.length,
      hasMore,
      message: `Synced ${added.length} new transactions`,
    });
  } catch (error) {
    console.error('Error in sync-transactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}