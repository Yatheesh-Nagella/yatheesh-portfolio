/**
 * Update/Delete Invite Code API
 * PATCH /api/admin/invites/[id] - Update invite code
 * DELETE /api/admin/invites/[id] - Delete invite code
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession, getAdminServiceClient } from '@/lib/admin-auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { token, is_active } = await request.json();

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

    const { data, error } = await supabase
      .from('invite_codes')
      .update({ is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database update error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update invite code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating invite code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get token from query params or headers
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

    const { error } = await supabase
      .from('invite_codes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database delete error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete invite code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting invite code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
