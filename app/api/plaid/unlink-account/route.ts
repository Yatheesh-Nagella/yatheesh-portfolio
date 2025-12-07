/**
 * API Route: Unlink Account
 * POST /api/plaid/unlink-account
 *
 * Removes a Plaid item and its associated accounts
 * Marks transactions as hidden (soft delete)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerUser, createServiceRoleClient } from '@/lib/supabase-server';
import { plaidClient } from '@/lib/plaid';
import { decryptAccessToken } from '@/lib/supabase';

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
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json(
        { error: 'Missing itemId' },
        { status: 400 }
      );
    }

    // Get Plaid item from database to verify ownership
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

    // Verify user owns this item
    if (plaidItem.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - You don\'t own this connection' },
        { status: 403 }
      );
    }

    // Get all accounts for this Plaid item
    const { data: accounts } = await supabase
      .from('accounts')
      .select('id')
      .eq('plaid_item_id', itemId);

    const accountIds = accounts?.map(acc => acc.id) || [];

    // Soft delete: Mark transactions as hidden
    if (accountIds.length > 0) {
      await supabase
        .from('transactions')
        .update({ is_hidden: true })
        .in('account_id', accountIds);
    }

    // Delete accounts
    if (accountIds.length > 0) {
      await supabase
        .from('accounts')
        .delete()
        .in('id', accountIds);
    }

    // SECURITY: Invalidate the access token with Plaid BEFORE deleting from database
    // This ensures the token can't be used even if our database is compromised
    try {
      const decryptedAccessToken = decryptAccessToken(plaidItem.access_token);
      await plaidClient.itemRemove({
        access_token: decryptedAccessToken,
      });
      console.log(`[Unlink] Successfully invalidated Plaid access token for item ${itemId}`);
    } catch (plaidError) {
      // Log error but don't fail the entire operation
      // Database cleanup should succeed even if Plaid API fails
      console.error('[Unlink] Failed to invalidate Plaid token:', plaidError);
      console.warn('[Unlink] Continuing with database cleanup despite Plaid API error');
    }

    // Delete Plaid item from database
    const { error: deleteError } = await supabase
      .from('plaid_items')
      .delete()
      .eq('id', itemId);

    if (deleteError) {
      console.error('Error deleting Plaid item:', deleteError);
      return NextResponse.json(
        { error: 'Failed to unlink account' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Account unlinked successfully',
    });
  } catch (error) {
    console.error('Error in unlink-account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
