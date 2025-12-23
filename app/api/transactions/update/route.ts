/**
 * API Route: Update Manual Transaction
 * PUT /api/transactions/update
 * Updates a manual transaction (only if it belongs to the user and is manual)
 * Recalculates cash account balance after update
 */

import { NextResponse } from 'next/server';
import {
  getServerUser,
  createServiceRoleClient,
  updateCashAccountBalance,
} from '@/lib/supabase-server';

export async function PUT(request: Request) {
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
      transactionId,
      merchantName,
      amount,
      category,
      transactionDate,
      notes,
    } = body;

    // Validate required fields
    if (!transactionId) {
      return NextResponse.json(
        { error: 'Missing transactionId' },
        { status: 400 }
      );
    }

    // Verify transaction exists and belongs to user and is manual
    const { data: existingTx, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .eq('user_id', user.id)
      .eq('is_manual', true)
      .single();

    if (fetchError || !existingTx) {
      return NextResponse.json(
        { error: 'Transaction not found or not editable' },
        { status: 404 }
      );
    }

    // Build update object (only include provided fields)
    const updates: Record<string, unknown> = {
      edited_at: new Date().toISOString(),
    };

    if (merchantName !== undefined) updates.merchant_name = merchantName;
    if (amount !== undefined) updates.amount = amount;
    if (category !== undefined) updates.category = category;
    if (transactionDate !== undefined) updates.transaction_date = transactionDate;
    if (notes !== undefined) updates.notes = notes;

    // Update transaction
    const { data: updatedTx, error: updateError } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', transactionId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating transaction:', updateError);
      return NextResponse.json(
        { error: 'Failed to update transaction' },
        { status: 500 }
      );
    }

    // Recalculate cash account balance if amount was changed
    if (amount !== undefined) {
      await updateCashAccountBalance(user.id, supabase);
    }

    return NextResponse.json({
      success: true,
      transaction: updatedTx,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
