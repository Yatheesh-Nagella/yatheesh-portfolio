/**
 * Admin TOTP Verification API
 * POST /api/admin/auth/verify-totp
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminTOTP, createAdminSession } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const { userId, code } = await request.json();

    if (!userId || !code) {
      return NextResponse.json(
        { error: 'User ID and code are required' },
        { status: 400 }
      );
    }

    // Verify TOTP code
    const { valid, error } = await verifyAdminTOTP(userId, code);

    if (!valid) {
      return NextResponse.json({ error: error || 'Invalid code' }, { status: 401 });
    }

    // Create session
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const { session, user, error: sessionError } = await createAdminSession(
      userId,
      ipAddress,
      userAgent
    );

    if (sessionError || !session || !user) {
      return NextResponse.json(
        { error: sessionError || 'Failed to create session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ token: session.token, user });
  } catch (error) {
    console.error('TOTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
