/**
 * Admin Login API
 * POST /api/admin/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, createAdminSession } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get IP address
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Authenticate
    const { requiresTOTP, userId, error } = await authenticateAdmin(email, password, ipAddress);

    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    // If TOTP is required, return userId for next step
    if (requiresTOTP && userId) {
      return NextResponse.json({ requiresTOTP: true, userId });
    }

    // No TOTP - create session directly
    if (userId) {
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
    }

    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
