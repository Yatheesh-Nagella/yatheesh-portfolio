/**
 * Send Test Email API
 * POST /api/admin/emails/send-test
 * Sends a test email with template data to specified address
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, email, templateKey, templateData } = body;

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

    // Validate inputs
    if (!email || !templateKey) {
      return NextResponse.json(
        { error: 'Email and template key are required' },
        { status: 400 }
      );
    }

    // Send test email
    const result = await sendEmail({
      to: email,
      subject: `[TEST] ${templateKey}`,
      templateKey,
      templateProps: templateData || {},
      category: 'transactional',
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        emailId: result.emailId,
        message: `Test email sent to ${email}`,
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/admin/emails/send-test:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
