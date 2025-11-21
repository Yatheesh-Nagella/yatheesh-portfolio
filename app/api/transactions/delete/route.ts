/**
 * API Route: Delete Manual Transaction
 * DELETE /api/transactions/delete
 * Deletes a manual transaction (only if it belongs to the user and is manual)
 * Recalculates cash account balance after deletion
 */

import { NextResponse } from 'next/server';
import {
  getServerUser,
  createServiceRoleClient,
  updateCashAccountBalance,
} from '@/lib/supabase-server';

export async function DELETE(request: Request) {
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
    const { transactionId } = body;

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
        { error: 'Transaction not found or cannot be deleted' },
        { status: 404 }
      );
    }

    // Delete transaction
    const { error: deleteError } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId);

    if (deleteError) {
      console.error('Error deleting transaction:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete transaction' },
        { status: 500 }
      );
    }

    // Recalculate cash account balance after deletion
    await updateCashAccountBalance(user.id, supabase);

    return NextResponse.json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
