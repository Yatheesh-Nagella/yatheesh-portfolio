/**
 * Admin TOTP Setup API
 * POST /api/admin/auth/setup-totp
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession, setupAdminTOTP } from '@/lib/admin-auth';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
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

    // Setup TOTP
    const { secret, qrCodeUrl, error } = await setupAdminTOTP(user.id);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    // Generate QR code data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl);

    return NextResponse.json({
      secret,
      qrCodeDataUrl,
    });
  } catch (error) {
    console.error('TOTP setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
