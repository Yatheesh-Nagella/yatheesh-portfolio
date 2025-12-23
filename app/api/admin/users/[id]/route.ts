/**
 * Delete User API
 * DELETE /api/admin/users/[id] - Delete user account
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession, getAdminServiceClient, logAdminAction } from '@/lib/admin-auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get token from headers
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin session
    const { user, error: sessionError } = await verifyAdminSession(token);

    if (sessionError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use service role client to bypass RLS
    const supabase = getAdminServiceClient();

    // Delete user's related data first (cascade)
    // 1. Delete accounts
    await supabase.from('accounts').delete().eq('user_id', id);

    // 2. Delete transactions (should cascade from accounts, but just in case)
    await supabase.from('transactions').delete().eq('user_id', id);

    // 3. Delete plaid items
    await supabase.from('plaid_items').delete().eq('user_id', id);

    // 4. Delete budgets
    await supabase.from('budgets').delete().eq('user_id', id);

    // 5. Finally delete the user
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database delete error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete user' },
        { status: 500 }
      );
    }

    // Log the action
    await logAdminAction(
      user.id,
      'user_deleted',
      'user',
      id,
      { deleted_user_id: id }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
