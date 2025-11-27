/**
 * Admin Session Verification API
 * POST /api/admin/auth/verify-session
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const { user, error } = await verifyAdminSession(token);

    if (error || !user) {
      return NextResponse.json({ error: error || 'Invalid session' }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
