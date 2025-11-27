/**
 * Admin Logout API
 * POST /api/admin/auth/logout
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteAdminSession } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    await deleteAdminSession(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
