/**
 * Admin TOTP Setup Verification API
 * POST /api/admin/auth/verify-totp-setup
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession, verifyTOTPSetup } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const { token, code } = await request.json();

    if (!token || !code) {
      return NextResponse.json(
        { error: 'Token and code are required' },
        { status: 400 }
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

    // Verify TOTP setup
    const { success, error } = await verifyTOTPSetup(user.id, code);

    if (!success) {
      return NextResponse.json({ error: error || 'Invalid code' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('TOTP setup verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
