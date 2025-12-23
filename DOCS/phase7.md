OneLibro Phase 7: Email & Marketing System Implementation Plan

 Overview

 Implement a comprehensive email and marketing system for OneLibro using Resend (email service) and React Email
 (template framework). This system will support marketing campaigns with invite codes, transactional emails, budget
 alerts, and full admin management.

 Technology Stack

 - Email Service: Resend (Next.js-native, $20/month for 50k emails)
 - Templates: React Email (TypeScript React components)
 - Database: Supabase (5 new tables)
 - Cron Jobs: Vercel Cron (budget monitoring)

 User Priorities (Implementation Order)

 1. ✅ Marketing Campaigns (send invite codes for beta testing)
 2. ✅ Transactional Emails (welcome, password reset, notifications)
 3. ✅ Admin Panel Tools (template management, campaign builder, analytics)
 4. Budget Alerts (automated spending threshold notifications)

 ---
 Database Schema Changes

 New Tables to Create

 Migration File: supabase/migrations/20250120_email_system_phase7.sql

 1. notification_preferences

 CREATE TABLE notification_preferences (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,

   -- Email notification toggles
   email_enabled BOOLEAN DEFAULT true,
   marketing_emails BOOLEAN DEFAULT true,
   budget_alerts BOOLEAN DEFAULT true,
   transaction_alerts BOOLEAN DEFAULT false,
   weekly_summary BOOLEAN DEFAULT true,
   account_security BOOLEAN DEFAULT true,

   -- Alert thresholds
   budget_alert_threshold INTEGER DEFAULT 80, -- Percentage
   large_transaction_threshold INTEGER DEFAULT 50000, -- Cents ($500)
   alert_frequency TEXT DEFAULT 'immediate',

   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 );

 -- RLS: Users can view/update own preferences

 2. email_templates

 CREATE TABLE email_templates (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   template_key TEXT NOT NULL UNIQUE,
   template_name TEXT NOT NULL,
   category TEXT NOT NULL, -- 'transactional', 'marketing', 'notification', 'system'

   -- Template content
   subject_template TEXT NOT NULL,
   template_path TEXT, -- Path to React component: 'emails/WelcomeEmail'
   variables JSONB DEFAULT '{}', -- Variable schema

   -- Status
   is_active BOOLEAN DEFAULT true,
   version INTEGER DEFAULT 1,
   total_sent INTEGER DEFAULT 0,

   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 );

 -- RLS: Admin only

 3. email_logs

 CREATE TABLE email_logs (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   user_id UUID REFERENCES users(id) ON DELETE SET NULL,
   recipient_email TEXT NOT NULL,
   template_key TEXT REFERENCES email_templates(template_key),
   subject TEXT NOT NULL,
   category TEXT NOT NULL,

   -- Resend tracking
   resend_email_id TEXT UNIQUE,
   status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'bounced', 'failed'
   error_message TEXT,

   -- Delivery tracking
   sent_at TIMESTAMP WITH TIME ZONE,
   delivered_at TIMESTAMP WITH TIME ZONE,
   bounced_at TIMESTAMP WITH TIME ZONE,

   metadata JSONB DEFAULT '{}',
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 );

 -- RLS: Users can view own logs, admins can view all

 4. email_campaigns

 CREATE TABLE email_campaigns (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   name TEXT NOT NULL,
   subject TEXT NOT NULL,
   template_key TEXT REFERENCES email_templates(template_key),

   -- Targeting
   target_audience JSONB DEFAULT '{}',

   -- Status
   status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'sent', 'cancelled'
   scheduled_at TIMESTAMP WITH TIME ZONE,
   sent_at TIMESTAMP WITH TIME ZONE,

   -- Analytics
   total_recipients INTEGER DEFAULT 0,
   total_sent INTEGER DEFAULT 0,
   total_delivered INTEGER DEFAULT 0,
   total_bounced INTEGER DEFAULT 0,

   created_by UUID REFERENCES users(id),
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 );

 -- RLS: Admin only

 5. budget_alert_history

 CREATE TABLE budget_alert_history (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,

   threshold_percentage INTEGER NOT NULL,
   spent_amount INTEGER NOT NULL,
   budget_amount INTEGER NOT NULL,
   period TEXT NOT NULL,

   email_log_id UUID REFERENCES email_logs(id),
   alerted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

   UNIQUE(budget_id, threshold_percentage, period, alerted_at::date)
 );

 -- RLS: Users can view own history

 Seed Data: Create default templates and preferences for existing users

 ---
 Core Implementation Files

 1. Email Service Core (lib/email.ts)

 Purpose: Abstraction layer for all email operations

 Key Functions:
 import { Resend } from 'resend';
 import { render } from '@react-email/render';

 const resend = new Resend(env.email.apiKey);

 interface SendEmailOptions {
   to: string | string[];
   subject: string;
   templateKey: string;
   templateProps: Record<string, any>;
   userId?: string;
   category?: 'transactional' | 'marketing' | 'notification' | 'system';
 }

 export async function sendEmail(options: SendEmailOptions) {
   // 1. Check user notification preferences
   // 2. Get template from database
   // 3. Render React Email component
   // 4. Send via Resend
   // 5. Log to email_logs table
   // 6. Return result
 }

 export async function sendBulkEmails(emails: SendEmailOptions[]) {
   // Batch send with rate limiting (50 emails per batch)
 }

 export async function getTemplate(templateKey: string) {
   // Fetch template metadata from database
   // Return template path and variables
 }

 Pattern: Similar to lib/plaid.ts - external service integration

 ---
 2. Email Template System

 Directory Structure:
 emails/
 ├── components/
 │   ├── EmailLayout.tsx       # Base layout with header/footer
 │   ├── Button.tsx            # CTA button component
 │   ├── Header.tsx            # OneLibro logo/header
 │   └── Footer.tsx            # Unsubscribe + social links
 ├── templates/
 │   ├── WelcomeEmail.tsx
 │   ├── InviteCodeEmail.tsx
 │   ├── BudgetAlertEmail.tsx
 │   ├── PasswordResetEmail.tsx
 │   ├── AccountCreatedEmail.tsx
 │   └── PlaidItemErrorEmail.tsx
 └── index.ts

 Template Categories:
 1. Transactional (cannot opt-out): Welcome, password reset, account created
 2. Marketing (can opt-out): Invite codes, product updates, feature announcements
 3. Notification (can configure): Budget alerts, transaction alerts, Plaid errors
 4. System (cannot opt-out): Security alerts, TOS updates

 Example Template: emails/templates/InviteCodeEmail.tsx
 import { EmailLayout } from '../components/EmailLayout';
 import { Button } from '../components/Button';

 interface InviteCodeEmailProps {
   code: string;
   expires_at: string;
   recipient_name?: string;
 }

 export default function InviteCodeEmail({ code, expires_at, recipient_name }: InviteCodeEmailProps) {
   return (
     <EmailLayout>
       <h1>Your OneLibro Invite Code</h1>
       <p>Hi {recipient_name || 'there'},</p>
       <p>You've been invited to join OneLibro, the privacy-first personal finance platform.</p>

       <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center' }}>
         <h2 style={{ fontSize: '32px', letterSpacing: '4px' }}>{code}</h2>
       </div>

       <p>Use this code to create your account. This invite expires on {expires_at}.</p>

       <Button href="https://finance.yatheeshnagella.com/finance/login">
         Get Started
       </Button>
     </EmailLayout>
   );
 }

 ---
 3. API Routes

 Email APIs (Internal)

 - app/api/email/send/route.ts: Internal email sending API (server-side only)
 - app/api/email/webhook/route.ts: Resend webhook for delivery/bounce tracking

 User-Facing APIs

 - app/api/notifications/preferences/route.ts: GET/PUT user notification preferences
 - app/api/notifications/unsubscribe/route.ts: One-click unsubscribe handler

 Admin APIs

 - app/api/admin/emails/templates/route.ts: List/create templates
 - app/api/admin/emails/templates/[id]/route.ts: Update/delete template
 - app/api/admin/emails/logs/route.ts: View email logs with filters
 - app/api/admin/emails/send-test/route.ts: Send test email
 - app/api/admin/campaigns/route.ts: List/create campaigns
 - app/api/admin/campaigns/[id]/route.ts: Update/delete campaign
 - app/api/admin/campaigns/[id]/send/route.ts: Send or schedule campaign

 Cron Jobs

 - app/api/cron/budget-alerts/route.ts: Hourly budget monitoring (Vercel Cron)

 ---
 4. Admin Panel UI

 Email Template Management

 Page: app/admin/emails/templates/page.tsx

 Features:
 - List all templates with search/filter
 - View template stats (total sent, last used)
 - Edit subject line and metadata
 - Preview template with test data
 - Send test email to admin
 - Toggle active/inactive status

 Campaign Management

 Page: app/admin/emails/campaigns/create/page.tsx

 Features:
 - Campaign builder (name, subject, template selection)
 - Target audience selector:
   - All users
   - Active users only
   - Custom filters (account status, signup date, etc.)
 - Preview recipient list and count
 - Send test email with sample data
 - Schedule or send immediately
 - Real-time progress tracking

 Page: app/admin/emails/campaigns/page.tsx
 - List all campaigns with status
 - View campaign analytics (sent, delivered, bounced)
 - Duplicate/edit campaigns

 Email Logs

 Page: app/admin/emails/logs/page.tsx

 Features:
 - View all sent emails
 - Filter by status, template, date range, user
 - Search by recipient email
 - View delivery details
 - Export logs as CSV
 - Analytics dashboard (deliverability rate, bounce rate, top templates)

 ---
 5. User-Facing UI

 Notification Preferences

 Page: app/finance/settings/notifications/page.tsx

 Features:
 - Toggle email notifications globally
 - Configure notification categories:
   - Marketing emails (opt-in/out)
   - Budget alerts (opt-in/out + threshold)
   - Transaction alerts (opt-in/out + amount threshold)
   - Weekly summary (opt-in/out)
   - Account security (always on, view only)
 - Set alert frequency (immediate, daily digest, weekly digest)
 - Save preferences to notification_preferences table

 ---
 Integration Points

 1. Update Plaid Webhook

 File: app/api/plaid/webhook/route.ts (line 258)

 Current:
 // TODO: Send email notification to user

 Replace with:
 import { sendEmail } from '@/lib/email';

 // In PENDING_EXPIRATION handler
 await sendEmail({
   to: plaidItem.users.email,
   subject: `Action needed: Reconnect your ${plaidItem.institution_name} account`,
   templateKey: 'plaid_item_error',
   templateProps: {
     institution_name: plaidItem.institution_name,
     consent_expiration_time: payload.consent_expiration_time,
     reconnect_link: `${env.app.url}/finance/settings`,
   },
   userId: plaidItem.user_id,
   category: 'notification',
 });

 2. Update Signup Flow

 File: lib/supabase.ts - signUpWithInvite() function

 Add after user creation:
 // Send welcome email
 await sendEmail({
   to: email,
   subject: 'Welcome to OneLibro!',
   templateKey: 'welcome_email',
   templateProps: { name: fullName },
   userId: newUser.id,
   category: 'transactional',
 });

 // Create default notification preferences
 await supabase.from('notification_preferences').insert({
   user_id: newUser.id,
 });

 3. Update Admin Navigation

 File: app/admin/layout.tsx

 Add to navigation:
 {
   href: '/admin/emails',
   label: 'Emails',
   icon: Mail,
   children: [
     { href: '/admin/emails/templates', label: 'Templates' },
     { href: '/admin/emails/campaigns', label: 'Campaigns' },
     { href: '/admin/emails/logs', label: 'Logs' },
   ],
 }

 ---
 Implementation Phases

 Phase 1: Infrastructure Setup (Foundation)

 Timeline: Week 1

 Tasks:
 1. Install dependencies: resend, react-email, @react-email/components, @react-email/render
 2. Add environment variables to .env: RESEND_API_KEY, RESEND_FROM_EMAIL
 3. Update lib/env.ts with email configuration
 4. Create database migration and run locally: npx supabase db push
 5. Seed default email templates
 6. Create lib/email.ts service abstraction
 7. Set up emails/ directory structure with base components
 8. Verify domain in Resend dashboard (DNS records: SPF, DKIM, DMARC)

 Deliverables: Email sending works, database ready, domain verified

 ---
 Phase 2: Transactional Emails (Priority #2)

 Timeline: Week 2

 Tasks:
 1. Create React Email templates:
   - WelcomeEmail.tsx - Sent after signup
   - AccountCreatedEmail.tsx - Confirmation
   - PasswordResetEmail.tsx - Password reset link
   - PlaidItemErrorEmail.tsx - Bank connection error
 2. Implement email triggers:
   - Update lib/supabase.ts signup to send welcome email
   - Update Plaid webhook to send error notifications (line 258)
 3. Create API routes:
   - POST /api/email/send (internal)
   - POST /api/email/webhook (Resend webhooks)
   - GET /api/notifications/unsubscribe (one-click unsubscribe)
 4. Implement email logging to email_logs table
 5. Add unsubscribe footer to all emails (Footer.tsx component)

 Deliverables: Welcome emails sent on signup, Plaid error emails automated, unsubscribe works

 ---
 Phase 3: Admin Panel Tools (Priority #3)

 Timeline: Week 3

 Tasks:
 1. Create template management UI:
   - app/admin/emails/templates/page.tsx - List templates
   - app/admin/emails/templates/[id]/page.tsx - Edit template
 2. Create email log viewer:
   - app/admin/emails/logs/page.tsx - View all logs
   - Filters: status, template, date range, user
   - Search by recipient email
   - Export to CSV
 3. Implement test email functionality:
   - POST /api/admin/emails/send-test
   - Button on template detail page
   - Modal to edit test data
 4. Create analytics dashboard:
   - Deliverability rate
   - Bounce rate by template
   - Most sent templates
   - Recent failures
 5. Add admin API routes:
   - GET/POST /api/admin/emails/templates
   - PUT /api/admin/emails/templates/[id]
   - GET /api/admin/emails/logs

 Deliverables: Admins can manage templates, view logs, send test emails, view analytics

 ---
 Phase 4: Marketing Campaigns (Priority #1)

 Timeline: Week 4

 Tasks:
 1. Create campaign management UI:
   - app/admin/emails/campaigns/page.tsx - List campaigns
   - app/admin/emails/campaigns/create/page.tsx - Campaign builder
   - app/admin/emails/campaigns/[id]/page.tsx - Campaign details
 2. Implement campaign builder:
   - Template selection dropdown
   - Target audience selector with filters
   - Preview recipient list (count + sample)
   - Test send to admin email
 3. Implement campaign sending:
   - POST /api/admin/campaigns/[id]/send - Send campaign
   - Batch sending with rate limiting (50 emails/batch)
   - Real-time progress tracking
   - Update campaign stats
 4. Create invite code email template:
   - InviteCodeEmail.tsx for beta invitations
   - Integration with existing invite code system
 5. Add campaign analytics:
   - Track sends, deliveries, bounces
   - Update campaign stats via webhooks
   - Campaign performance dashboard
 6. Implement campaign scheduling (optional):
   - Schedule campaigns for future send
   - Cron job to process scheduled campaigns

 Deliverables: Admins can create and send email campaigns, invite code campaigns work, analytics tracked

 ---
 Phase 5: Budget Alerts

 Timeline: Week 5

 Tasks:
 1. Create budget alert email template:
   - BudgetAlertEmail.tsx with dynamic threshold rendering
 2. Implement budget monitoring service:
   - lib/budget-alerts.ts with threshold calculation
   - app/api/cron/budget-alerts/route.ts cron job
 3. Set up Vercel Cron:
   - Add to vercel.json: hourly budget check
   - Deploy and test cron execution
 4. Create notification preferences UI:
   - app/finance/settings/notifications/page.tsx
   - GET/PUT /api/notifications/preferences
 5. Implement alert deduplication:
   - Log alerts to budget_alert_history
   - Prevent duplicate alerts same day

 Deliverables: Budget alerts sent hourly when thresholds crossed, users can configure preferences

 ---
 Phase 6: Polish & Advanced Features

 Timeline: Week 6

 Tasks:
 1. Implement email verification flow:
   - Require verification before accessing finance app
   - Resend verification option
   - Verification status indicator
 2. Add advanced notification preferences:
   - Alert frequency (immediate, daily digest, weekly)
   - Custom thresholds per budget
   - Large transaction threshold
 3. Implement bounce handling:
   - Mark bounced emails in email_logs
   - Disable sending to repeated bounces
   - Admin notification for high bounce rates
 4. Create user email history page:
   - app/finance/settings/email-history/page.tsx
   - Users can view emails sent to them
   - Filter by category and date
 5. Add GDPR compliance features:
   - Include email logs in user data export
   - Download email history as JSON
   - Data retention policies (anonymize after 90 days)

 Deliverables: Email verification required, bounce handling works, GDPR compliant

 ---
 Phase 7: Production Deployment

 Timeline: Week 7

 Tasks:
 1. Production environment setup:
   - Generate production Resend API key
   - Verify production domain (finance.yatheeshnagella.com)
   - Add environment variables to Vercel
 2. Database migration to production:
   - Run migration on production Supabase
   - Seed default templates
   - Create preferences for existing users
 3. Set up monitoring:
   - Resend webhook for bounce/complaint tracking
   - Alert admins for high bounce rates
   - Error tracking (Sentry integration)
 4. Load testing:
   - Test bulk sending (100+ recipients)
   - Verify rate limiting
   - Test cron job performance
 5. Documentation:
   - Create runbook for email operations
   - Document troubleshooting procedures
   - Create user help documentation

 Deliverables: Email system live in production, monitoring active, documentation complete

 ---
 Environment Variables

 Add to .env:
 # Resend Email Service
 RESEND_API_KEY=re_xxxxxxxxxxxxx
 RESEND_FROM_EMAIL=noreply@yatheeshnagella.com
 RESEND_FROM_NAME=OneLibro

 # Cron Job Secret (for budget alerts)
 CRON_SECRET=generate_random_secret_here

 Add to lib/env.ts:
 email: {
   get apiKey() {
     return getEnvVar('RESEND_API_KEY');
   },
   get fromEmail() {
     return getEnvVar('RESEND_FROM_EMAIL', true) || 'noreply@yatheeshnagella.com';
   },
   get fromName() {
     return getEnvVar('RESEND_FROM_NAME', true) || 'OneLibro';
   },
 },
 cron: {
   get secret() {
     return getEnvVar('CRON_SECRET');
   },
 },

 ---
 Dependencies to Install

 Add to package.json:
 npm install resend react-email @react-email/components @react-email/render

 Development dependencies (for template preview):
 npm install -D @react-email/tailwind

 Add script to package.json:
 {
   "scripts": {
     "email:dev": "email dev --dir emails"
   }
 }

 Run npm run email:dev to preview templates at http://localhost:3000

 ---
 Security & Compliance

 1. CAN-SPAM Compliance

 - ✅ Unsubscribe link in every marketing email footer
 - ✅ One-click unsubscribe (no login required)
 - ✅ Process unsubscribe within 10 business days (immediate in our case)
 - ✅ List-Unsubscribe header for email clients

 2. GDPR Compliance

 - ✅ Users can access email preferences anytime
 - ✅ Users can download email history (data portability)
 - ✅ Users can request deletion of email logs
 - ✅ Opt-in by default for marketing emails
 - ✅ Data retention policy (anonymize after 90 days)

 3. Rate Limiting

 - Admin campaigns: Max 5 per day
 - User actions: Max 100 emails/hour per user
 - Password reset: Max 3/hour per email
 - Global: 10 requests/sec to Resend (handled by Resend)

 4. Email Verification

 - Required before accessing finance app
 - Resend verification option
 - Verification status tracked in users table

 ---
 Critical Files Summary

 Files to Create (20+ new files)

 Core Services:
 1. lib/email.ts - Email service abstraction with Resend
 2. lib/budget-alerts.ts - Budget monitoring logic

 Email Templates (in emails/ directory):
 3. components/EmailLayout.tsx
 4. components/Footer.tsx (with unsubscribe)
 5. templates/WelcomeEmail.tsx
 6. templates/InviteCodeEmail.tsx
 7. templates/BudgetAlertEmail.tsx
 8. templates/PasswordResetEmail.tsx
 9. templates/AccountCreatedEmail.tsx
 10. templates/PlaidItemErrorEmail.tsx

 API Routes:
 11. app/api/email/send/route.ts
 12. app/api/email/webhook/route.ts
 13. app/api/notifications/preferences/route.ts
 14. app/api/notifications/unsubscribe/route.ts
 15. app/api/cron/budget-alerts/route.ts
 16. app/api/admin/emails/templates/route.ts
 17. app/api/admin/emails/logs/route.ts
 18. app/api/admin/campaigns/route.ts

 Admin UI:
 19. app/admin/emails/templates/page.tsx
 20. app/admin/emails/logs/page.tsx
 21. app/admin/emails/campaigns/create/page.tsx

 User UI:
 22. app/finance/settings/notifications/page.tsx

 Database:
 23. supabase/migrations/20250120_email_system_phase7.sql

 Files to Modify (9 existing files)

 1. lib/env.ts - Add email service env variables
 2. types/database.types.ts - Add new table types
 3. app/api/plaid/webhook/route.ts - Line 258: Replace TODO with sendEmail()
 4. lib/supabase.ts - Add helper functions for email preferences
 5. contexts/AuthContext.tsx - Create notification preferences on signup
 6. app/admin/layout.tsx - Add "Emails" navigation section
 7. package.json - Add email dependencies
 8. vercel.json - Add cron job configuration
 9. .env - Add email environment variables

 ---
 Testing Strategy

 Unit Tests

 - Test email template rendering
 - Test preference checking logic
 - Test budget threshold calculations

 Integration Tests

 - Test email sending flow end-to-end
 - Test webhook delivery status updates
 - Test campaign sending with batching

 Manual Testing

 - Send test emails from admin panel
 - Verify unsubscribe flow
 - Test notification preference changes
 - Verify budget alert deduplication

 Load Testing

 - Send campaign to 100+ users
 - Verify rate limiting
 - Test cron job performance

 ---
 Success Criteria

 ✅ Marketing Campaigns: Admins can create and send invite code campaigns to targeted user segments

 ✅ Transactional Emails: Users receive welcome emails on signup, password reset emails work, Plaid error notifications
  automated

 ✅ Admin Tools: Admins can manage templates, view email logs, send test emails, track campaign analytics

 ✅ Budget Alerts: Users receive automated email alerts when approaching spending limits (hourly checks)

 ✅ User Control: Users can configure notification preferences and unsubscribe from marketing emails

 ✅ Compliance: System is GDPR and CAN-SPAM compliant with proper unsubscribe mechanisms

 ✅ Deliverability: 95%+ email deliverability rate, <2% bounce rate

 ---
 Post-Implementation

 Monitoring

 - Track email deliverability rate weekly
 - Monitor bounce/complaint rates
 - Alert admins if bounce rate >5%
 - Review campaign performance monthly

 Maintenance

 - Update email templates as brand evolves
 - Add new templates as needed
 - Review and optimize cron job performance
 - Clean up old email logs (90-day policy)

 Future Enhancements

 - Weekly summary emails (spending recap)
 - A/B testing for campaign subject lines
 - Email open/click tracking (optional)
 - SMS notifications (Twilio integration)
 - Push notifications (web push API)

🚀 What's Left?

  Phase 7 is 99% complete. The only remaining item is:

  Budget Alert Cron Job Deployment - This requires deploying to Vercel with cron configuration in vercel.json. The code exists at app/api/cron/budget-alerts/route.ts but needs to be scheduled in production.