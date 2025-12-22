/**
 * Email Unsubscribe Handler
 * Handles one-click unsubscribe from marketing and notification emails
 * Compliant with CAN-SPAM and RFC 8058
 */

import { NextRequest, NextResponse } from 'next/server';
import { updateUserNotificationPreferences } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');

    if (!userId) {
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invalid Unsubscribe Link</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background-color: #0f0f0f;
                color: #e5e5e5;
                padding: 40px 20px;
                text-align: center;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #1a1a1a;
                padding: 40px;
                border-radius: 12px;
              }
              h1 { color: #ef4444; }
              a {
                color: #10b981;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>❌ Invalid Unsubscribe Link</h1>
              <p>This unsubscribe link is invalid or has expired.</p>
              <p>You can manage your email preferences from your <a href="/finance/settings/notifications">account settings</a>.</p>
            </div>
          </body>
        </html>
        `,
        {
          status: 400,
          headers: { 'Content-Type': 'text/html' },
        }
      );
    }

    // Update notification preferences based on category
    const updates: any = {};

    if (category === 'marketing') {
      updates.marketing_emails = false;
    } else if (category === 'notification') {
      // Unsubscribe from all notification types
      updates.budget_alerts = false;
      updates.transaction_alerts = false;
      updates.weekly_summary = false;
    } else {
      // Unsubscribe from all non-essential emails
      updates.marketing_emails = false;
      updates.budget_alerts = false;
      updates.transaction_alerts = false;
      updates.weekly_summary = false;
    }

    // Update preferences
    await updateUserNotificationPreferences(userId, updates);

    // Return success page
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribed Successfully</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: #0f0f0f;
              color: #e5e5e5;
              padding: 40px 20px;
              margin: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #1a1a1a;
              padding: 40px;
              border-radius: 12px;
              text-align: center;
            }
            h1 {
              color: #10b981;
              font-size: 32px;
              margin-bottom: 20px;
            }
            p {
              font-size: 16px;
              line-height: 26px;
              color: #a3a3a3;
              margin-bottom: 16px;
            }
            .success-icon {
              font-size: 64px;
              margin-bottom: 20px;
            }
            .info-box {
              background-color: #e5e5e5;
              color: #1a1a1a;
              padding: 20px;
              border-radius: 8px;
              margin: 24px 0;
              text-align: left;
            }
            .info-box h3 {
              color: #1a1a1a;
              margin-top: 0;
            }
            .info-box ul {
              margin: 8px 0;
              padding-left: 20px;
            }
            .info-box li {
              margin-bottom: 8px;
            }
            .button {
              display: inline-block;
              background-color: #10b981;
              color: #1a1a1a;
              padding: 14px 32px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 600;
              margin-top: 20px;
            }
            .button:hover {
              background-color: #0d9668;
            }
            .footer {
              margin-top: 32px;
              font-size: 14px;
              color: #737373;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✅</div>
            <h1>Successfully Unsubscribed</h1>
            <p>You've been unsubscribed from ${category === 'marketing' ? 'marketing' : 'notification'} emails.</p>

            <div class="info-box">
              <h3>What happens now?</h3>
              <ul>
                ${category === 'marketing' ? `
                  <li>You won't receive product updates or feature announcements</li>
                  <li>You'll still receive important account notifications</li>
                  <li>You can re-subscribe anytime from your settings</li>
                ` : `
                  <li>You won't receive budget alerts or spending notifications</li>
                  <li>You'll still receive important security and account emails</li>
                  <li>Transaction emails and password resets are always sent</li>
                `}
              </ul>
            </div>

            <p>You can manage all your email preferences from your account settings.</p>

            <a href="https://finance.yatheeshnagella.com/finance/settings/notifications" class="button">
              Manage Email Preferences
            </a>

            <div class="footer">
              <p>OneLibro · Personal Finance Management</p>
              <p>© 2025 Yatheesh Nagella</p>
            </div>
          </div>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }
    );

  } catch (error) {
    console.error('Unsubscribe error:', error);

    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribe Error</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: #0f0f0f;
              color: #e5e5e5;
              padding: 40px 20px;
              text-align: center;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #1a1a1a;
              padding: 40px;
              border-radius: 12px;
            }
            h1 { color: #ef4444; }
            a { color: #10b981; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ Something Went Wrong</h1>
            <p>We couldn't process your unsubscribe request. Please try again or contact support.</p>
            <p><a href="/finance/settings/notifications">Go to Email Settings</a></p>
          </div>
        </body>
      </html>
      `,
      {
        status: 500,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }
}

// POST handler for one-click unsubscribe (RFC 8058)
export async function POST(request: NextRequest) {
  return GET(request);
}
