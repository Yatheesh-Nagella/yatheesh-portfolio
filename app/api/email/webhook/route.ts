/**
 * Resend Webhook Handler
 * Receives delivery, bounce, and open/click events from Resend
 * Updates email_logs table with delivery status
 */

import { NextRequest, NextResponse } from 'next/server';
import { updateEmailStatus } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify webhook signature (optional but recommended for production)
    // const signature = request.headers.get('resend-signature');
    // TODO: Implement signature verification for security

    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    const emailId = data.email_id;
    if (!emailId) {
      return NextResponse.json(
        { error: 'Missing email_id in webhook data' },
        { status: 400 }
      );
    }

    // Handle different webhook events
    switch (type) {
      case 'email.sent':
        // Email was successfully sent
        await updateEmailStatus(emailId, 'sent', new Date(data.created_at));
        break;

      case 'email.delivered':
        // Email was delivered to recipient's inbox
        await updateEmailStatus(emailId, 'delivered', new Date(data.created_at));
        break;

      case 'email.delivery_delayed':
        // Delivery is delayed but still being attempted
        console.log(`Email ${emailId} delivery delayed`);
        break;

      case 'email.bounced':
        // Email bounced (hard or soft)
        await updateEmailStatus(emailId, 'bounced', new Date(data.created_at));
        console.warn(`Email ${emailId} bounced:`, data.bounce_type);
        break;

      case 'email.complained':
        // Recipient marked email as spam
        await updateEmailStatus(emailId, 'complained', new Date(data.created_at));
        console.warn(`Email ${emailId} marked as spam by recipient`);
        break;

      case 'email.opened':
        // Recipient opened the email (requires open tracking to be enabled)
        await updateEmailStatus(emailId, 'opened', new Date(data.created_at));
        break;

      case 'email.clicked':
        // Recipient clicked a link (requires click tracking to be enabled)
        await updateEmailStatus(emailId, 'clicked', new Date(data.created_at));
        break;

      default:
        console.log(`Unhandled webhook type: ${type}`);
    }

    // Always return 200 OK to Resend to acknowledge receipt
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);

    // Still return 200 to prevent Resend from retrying
    // Log the error for investigation
    return NextResponse.json(
      { error: 'Webhook processing failed', received: true },
      { status: 200 }
    );
  }
}
