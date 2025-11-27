/**
 * Create Invite Code API
 * POST /api/admin/invites/create
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession, getAdminServiceClient } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const { token, code, max_uses, expires_at } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify admin session
    const { user, error: sessionError } = await verifyAdminSession(token);

    if (sessionError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate input
    if (!code || !expires_at) {
      return NextResponse.json(
        { error: 'Code and expiration date are required' },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS
    const supabase = getAdminServiceClient();

    const { data, error } = await supabase
      .from('invite_codes')
      .insert({
        code: code.toUpperCase(),
        max_uses: max_uses,
        expires_at: expires_at,
        created_by_admin_id: user.id,
        is_active: true,
        used_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);

      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This code already exists' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: error.message || 'Failed to create invite code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating invite code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
