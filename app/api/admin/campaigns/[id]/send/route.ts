/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Campaign Send API
 * POST /api/admin/campaigns/[id]/send
 * Sends campaign emails to all target recipients with batch processing
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession, getAdminServiceClient } from '@/lib/admin-auth';
import { sendEmail } from '@/lib/email';

const BATCH_SIZE = 50; // Send 50 emails per batch (Resend rate limit)
const BATCH_DELAY = 1000; // 1 second delay between batches

/**
 * POST /api/admin/campaigns/[id]/send
 * Send campaign to all target recipients
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { token, test_mode, test_email } = body;

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

    const supabase = getAdminServiceClient();

    // Get campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Check campaign status
    if (campaign.status === 'sending' || campaign.status === 'sent') {
      return NextResponse.json(
        { error: 'Campaign is already sent or sending' },
        { status: 400 }
      );
    }

    // Get template
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('template_key', campaign.template_key)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Test mode: send to single test email
    if (test_mode && test_email) {
      try {
        // Send test email
        const result = await sendEmail({
          to: test_email,
          subject: `[TEST] ${campaign.subject}`,
          templateKey: campaign.template_key,
          templateProps: {
            // Use sample data for testing
            code: 'TEST123',
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            recipient_name: 'Test User',
          },
          category: 'marketing',
        });

        if (result.success) {
          return NextResponse.json({
            success: true,
            test_mode: true,
            email_id: result.emailId,
            message: `Test email sent to ${test_email}`,
          });
        } else {
          return NextResponse.json(
            { error: `Failed to send test email: ${result.error}` },
            { status: 500 }
          );
        }
      } catch (error) {
        console.error('Test email error:', error);
        return NextResponse.json(
          { error: 'Failed to send test email' },
          { status: 500 }
        );
      }
    }

    // Production mode: send to all target recipients
    // Update campaign status to 'sending'
    await supabase
      .from('email_campaigns')
      .update({ status: 'sending' })
      .eq('id', id);

    // Get target recipients
    let query = supabase
      .from('users')
      .select('id, email, full_name');

    // Apply audience filters
    const audience = campaign.target_audience || {};

    if (audience.active_only) {
      query = query.eq('is_active', true);
    }

    if (audience.signup_after) {
      query = query.gte('created_at', audience.signup_after);
    }

    if (audience.signup_before) {
      query = query.lte('created_at', audience.signup_before);
    }

    const { data: recipients, error: recipientsError } = await query;

    if (recipientsError) {
      console.error('Error fetching recipients:', recipientsError);
      // Revert campaign status
      await supabase
        .from('email_campaigns')
        .update({ status: 'draft' })
        .eq('id', id);

      return NextResponse.json(
        { error: 'Failed to fetch recipients' },
        { status: 500 }
      );
    }

    if (!recipients || recipients.length === 0) {
      // Revert campaign status
      await supabase
        .from('email_campaigns')
        .update({ status: 'draft' })
        .eq('id', id);

      return NextResponse.json(
        { error: 'No recipients match the target audience' },
        { status: 400 }
      );
    }

    // Send emails in batches
    let totalSent = 0;
    let totalFailed = 0;

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);

      // Send emails in parallel within batch
      const promises = batch.map(async (recipient) => {
        try {
          // For invite code campaigns, we need to fetch or create an invite code
          let templateProps: any = {
            recipient_name: recipient.full_name,
          };

          // If this is an invite code campaign, get the code
          if (campaign.template_key === 'invite_code_email') {
            // For now, use a placeholder - in production, you'd fetch from invite_codes table
            // or generate a new one for each recipient
            templateProps = {
              ...templateProps,
              code: 'BETA2025', // Placeholder - should be dynamic
              expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            };
          }

          const result = await sendEmail({
            to: recipient.email,
            subject: campaign.subject,
            templateKey: campaign.template_key,
            templateProps,
            userId: recipient.id,
            category: 'marketing',
          });

          if (result.success) {
            totalSent++;
            return { success: true, recipient: recipient.email };
          } else {
            totalFailed++;
            return { success: false, recipient: recipient.email, error: result.error };
          }
        } catch (error) {
          totalFailed++;
          console.error(`Failed to send to ${recipient.email}:`, error);
          return { success: false, recipient: recipient.email, error: String(error) };
        }
      });

      // Wait for batch to complete
      await Promise.all(promises);

      // Update campaign stats after each batch
      await supabase
        .from('email_campaigns')
        .update({
          total_sent: totalSent,
        })
        .eq('id', id);

      // Delay between batches to respect rate limits
      if (i + BATCH_SIZE < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
      }
    }

    // Mark campaign as sent
    await supabase
      .from('email_campaigns')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        total_sent: totalSent,
        total_recipients: recipients.length,
      })
      .eq('id', id);

    return NextResponse.json({
      success: true,
      campaign_id: id,
      total_recipients: recipients.length,
      total_sent: totalSent,
      total_failed: totalFailed,
    });
  } catch (error) {
    console.error('Error in POST /api/admin/campaigns/[id]/send:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Helper to delay execution
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
