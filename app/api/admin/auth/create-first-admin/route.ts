/**
 * Create First Admin User API
 * POST /api/admin/auth/create-first-admin
 *
 * SECURITY: This route should be disabled in production or protected with a secret key
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminUser } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, secretKey } = await request.json();

    // SECURITY: Require a secret key to prevent unauthorized admin creation
    const expectedSecretKey = process.env.ADMIN_SETUP_SECRET || 'change-me-in-production';

    if (secretKey !== expectedSecretKey) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid secret key' },
        { status: 401 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Create admin user
    const { user, error } = await createAdminUser(email, password, fullName || null);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: user?.id,
        email: user?.email,
        full_name: user?.full_name,
      },
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
