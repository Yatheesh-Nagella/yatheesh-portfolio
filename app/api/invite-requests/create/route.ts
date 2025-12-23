import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  const supabase = createServiceRoleClient();

  try {
    const { email, name } = await request.json();

    // Validation
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if already requested (within last 24 hours)
    const { data: existing } = await supabase
      .from('invite_code_requests')
      .select('id, created_at')
      .eq('email', email.toLowerCase())
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'You have already submitted a request recently. Please wait 24 hours.' },
        { status: 429 }
      );
    }

    // Insert request into database
    const { error: dbError } = await supabase
      .from('invite_code_requests')
      .insert({
        email: email.toLowerCase(),
        name: name.trim(),
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to submit request' },
        { status: 500 }
      );
    }

    // Send confirmation email (async, don't block response)
    sendEmail({
      to: email,
      subject: 'Thank you for requesting access to OneLibro',
      templateKey: 'invite_request_confirmation',
      templateProps: { name: name.trim() },
      category: 'transactional',
    }).catch((error) => {
      console.error('Failed to send confirmation email:', error);
    });

    return NextResponse.json({
      success: true,
      message: 'Request submitted successfully',
    });
  } catch (error) {
    console.error('Error creating invite request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
