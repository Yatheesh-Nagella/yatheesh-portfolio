/**
 * API Route: Create Manual Transaction
 * POST /api/transactions/create
 * Creates a manual transaction for the authenticated user
 * Automatically links to cash account and updates balance
 */

import { NextResponse } from 'next/server';
import {
  getServerUser,
  createServiceRoleClient,
  getOrCreateCashAccount,
  updateCashAccountBalance,
  migrateManualTransactionsToCashAccount,
} from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    // Get auth token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Get current user (verifies JWT token)
    const user = await getServerUser(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Use service role client for database operations (bypasses RLS)
    const supabase = createServiceRoleClient();

    // Parse request body
    const body = await request.json();
    const {
      merchantName,
      amount,
      category,
      transactionDate,
      notes,
      accountId,
    } = body;

    // Validate required fields
    if (!merchantName || amount === undefined || !transactionDate) {
      return NextResponse.json(
        { error: 'Missing required fields: merchantName, amount, transactionDate' },
        { status: 400 }
      );
    }

    // Validate amount
    if (typeof amount !== 'number' || amount === 0) {
      return NextResponse.json(
        { error: 'Amount must be a non-zero number' },
        { status: 400 }
      );
    }

    // First, migrate any existing orphaned manual transactions to cash account
    await migrateManualTransactionsToCashAccount(user.id, supabase);

    // Get or create cash account if no specific account provided
    let targetAccountId = accountId;
    if (!targetAccountId) {
      const cashAccount = await getOrCreateCashAccount(user.id, supabase);
      if (!cashAccount) {
        return NextResponse.json(
          { error: 'Failed to create cash account' },
          { status: 500 }
        );
      }
      targetAccountId = cashAccount.id;
    }

    // Create manual transaction linked to cash account
    const { data: transaction, error: insertError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        account_id: targetAccountId,
        merchant_name: merchantName,
        amount: amount, // Already in cents from frontend
        category: category || null,
        transaction_date: transactionDate,
        notes: notes || null,
        is_manual: true,
        is_pending: false,
        plaid_transaction_id: `manual_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating transaction:', insertError);
      return NextResponse.json(
        { error: 'Failed to create transaction' },
        { status: 500 }
      );
    }

    // Update cash account balance if this was a cash transaction
    if (!accountId) {
      await updateCashAccountBalance(user.id, supabase);
    }

    return NextResponse.json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
