# OneLibro Phase 7: Email & Marketing System Testing Guide

This guide provides step-by-step instructions to test all features implemented in Phase 7.

## Prerequisites

Before testing, ensure:
- [ ] Development server is running: `npm run dev`
- [ ] You're logged in as an admin user
- [ ] Database migration is applied
- [ ] Environment variables are set (especially `RESEND_API_KEY`)

---

## Phase 1: Infrastructure Setup

### 1.1 Verify Environment Variables

**Command**:
```bash
node -e "console.log(require('./lib/env').env.email)"
```

**Expected Output**:
```
{
  apiKey: 're_...',
  fromEmail: 'hi@yatheeshnagella.com',
  fromName: 'OneLibro'
}
```

**✅ Pass if**: All three values are present and valid

---

### 1.2 Verify Database Tables

**Test**: Check that all new tables exist in Supabase

**Steps**:
1. Open Supabase dashboard
2. Navigate to Table Editor
3. Verify these tables exist:
   - `notification_preferences`
   - `email_templates`
   - `email_logs`
   - `email_campaigns`
   - `budget_alert_history`

**✅ Pass if**: All 5 tables are visible with correct columns

---

### 1.3 Test Email Service Core

**Create test file**: `test-email.js`
```javascript
const { sendEmail } = require('./lib/email');

(async () => {
  const result = await sendEmail({
    to: 'your-test-email@example.com', // Replace with your email
    subject: 'Test Email from OneLibro',
    templateKey: 'welcome_email',
    templateProps: {
      user_name: 'Test User',
    },
    category: 'transactional',
  });

  console.log('Result:', result);
})();
```

**Run**:
```bash
node test-email.js
```

**Expected**: Email received in inbox

**✅ Pass if**: Email arrives and `result.success === true`

---

## Phase 2: Transactional Emails

### 2.1 Test Welcome Email (Signup Flow)

**Steps**:
1. Create a new invite code at: `http://admin.localhost:3000/admin/invites`
2. Log out of your account
3. Go to: `http://finance.localhost:3000/finance/login`
4. Click "Sign Up" tab
5. Fill form with:
   - Email: Use a test email you can access
   - Password: Any valid password
   - Full Name: Test User
   - Invite Code: The code from step 1
6. Submit form

**Expected**:
- Account created successfully
- **Welcome email** arrives in inbox within 1 minute
- Email contains: "Welcome to OneLibro", user's name, CTA button

**✅ Pass if**: Welcome email received with correct content

---

### 2.2 Test Password Reset Email

**Steps**:
1. Go to: `http://finance.localhost:3000/finance/login`
2. Click "Forgot Password?"
3. Enter your email
4. Submit form

**Expected**:
- Success message: "Check your email for password reset link"
- **Password reset email** arrives in inbox
- Email contains reset link with token
- Clicking link opens reset password page

**✅ Pass if**: Password reset email received and link works

---

### 2.3 Test Plaid Item Error Email

**Steps**:
1. Connect a bank account in development/sandbox mode
2. Trigger a Plaid error manually:

**API Call**:
```bash
curl -X POST http://localhost:3000/api/plaid/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "webhook_type": "ITEM",
    "webhook_code": "PENDING_EXPIRATION",
    "item_id": "your-plaid-item-id",
    "consent_expiration_time": "2025-01-30T00:00:00Z"
  }'
```

**Expected**:
- **Plaid error email** sent to user
- Email contains: institution name, expiration warning, reconnect CTA

**Note**: You'll need to get the actual `item_id` from your `plaid_items` table

**✅ Pass if**: Plaid error email received when webhook triggered

---

## Phase 3: Admin Panel Tools

### 3.1 Test Email Templates Page

**URL**: `http://admin.localhost:3000/admin/emails/templates`

**Tests**:

1. **View Templates**
   - [ ] Page loads without errors
   - [ ] All templates are displayed (should see 6: welcome, password reset, Plaid error, invite code, account created, budget alert)
   - [ ] Each template shows: name, category, key, status, total sent

2. **Filter by Category**
   - [ ] Click "Transactional" - shows only transactional emails
   - [ ] Click "Marketing" - shows only marketing emails
   - [ ] Click "Notification" - shows only notification emails
   - [ ] Click "All" - shows all templates

3. **Search Templates**
   - [ ] Type "welcome" in search box
   - [ ] Only WelcomeEmail template appears

4. **Template Stats Dashboard**
   - [ ] Top stats show: Total Templates, Active, Inactive, Total Sent
   - [ ] Numbers match expected values

5. **Send Test Email**
   - [ ] Click "Send Test" button on any template
   - [ ] Modal opens with test data fields
   - [ ] Fill in your email address
   - [ ] Click "Send Test Email"
   - [ ] Success message appears
   - [ ] Test email arrives in inbox

6. **Toggle Template Status**
   - [ ] Click toggle switch on any template
   - [ ] Status changes (Active → Inactive or vice versa)
   - [ ] Page refreshes and shows updated status

**✅ Pass if**: All 6 sub-tests pass

---

### 3.2 Test Email Logs Page

**URL**: `http://admin.localhost:3000/admin/emails/logs`

**Tests**:

1. **View Logs**
   - [ ] Page loads without errors
   - [ ] All sent emails are displayed (from previous tests)
   - [ ] Each log shows: date, recipient, subject, template, category, status

2. **Filter by Status**
   - [ ] Select "Sent" from status dropdown
   - [ ] Only sent emails appear
   - [ ] Select "Delivered" - only delivered emails appear

3. **Filter by Category**
   - [ ] Select "Transactional" from category dropdown
   - [ ] Only transactional emails appear
   - [ ] Select "Marketing" - only marketing emails appear

4. **Date Range Filter**
   - [ ] Set date range to "Today"
   - [ ] Only today's emails appear
   - [ ] Set to "Last 7 Days" - shows last week's emails

5. **Search by Recipient**
   - [ ] Type your test email in search box
   - [ ] Only emails to that address appear

6. **Analytics Dashboard**
   - [ ] Top stats show: Total Sent, Delivered, Bounced, Delivery Rate
   - [ ] Delivery rate percentage is calculated correctly
   - [ ] Status breakdown chart shows correct counts

7. **Export to CSV**
   - [ ] Click "Export to CSV" button
   - [ ] File downloads: `email-logs-YYYY-MM-DD.csv`
   - [ ] Open CSV file
   - [ ] Contains all filtered logs with correct data

8. **Pagination**
   - [ ] If more than 50 logs, pagination appears
   - [ ] Click "Next" page
   - [ ] Shows next 50 logs
   - [ ] Page number updates

**✅ Pass if**: All 8 sub-tests pass

---

## Phase 4: Marketing Campaigns

### 4.1 Test Campaigns List Page

**URL**: `http://admin.localhost:3000/admin/emails/campaigns`

**Tests**:

1. **View Campaigns**
   - [ ] Page loads without errors
   - [ ] Shows all campaigns (may be empty initially)
   - [ ] "Create Campaign" button is visible

2. **Create Campaign Button**
   - [ ] Click "Create Campaign" button
   - [ ] Redirects to campaign builder

**✅ Pass if**: Page loads and shows campaigns or empty state

---

### 4.2 Test Campaign Builder

**URL**: `http://admin.localhost:3000/admin/emails/campaigns/create`

**Tests**:

1. **Page Load**
   - [ ] Page loads without errors
   - [ ] Form appears with all fields

2. **Template Selection**
   - [ ] Template dropdown shows all active templates
   - [ ] Select "Invite Code Email" template
   - [ ] Template preview appears below

3. **Campaign Details**
   - [ ] Fill in Campaign Name: "Beta Test Invites"
   - [ ] Subject auto-fills from template (can be edited)
   - [ ] Edit subject to: "You're invited to OneLibro Beta!"

4. **Target Audience**
   - [ ] "All Users" option is default
   - [ ] Shows recipient count (number of users in DB)
   - [ ] Preview shows sample recipient emails

5. **Test Send**
   - [ ] Fill in test data:
     ```json
     {
       "code": "TEST123",
       "expires_at": "2025-02-01",
       "recipient_name": "Test User"
     }
     ```
   - [ ] Enter your email address
   - [ ] Click "Send Test Email"
   - [ ] Success message appears
   - [ ] **Invite code email** arrives in inbox
   - [ ] Email shows: invite code "TEST123", expiration date, CTA button

6. **Create Draft Campaign**
   - [ ] Click "Save as Draft"
   - [ ] Success message: "Campaign created successfully"
   - [ ] Redirects to campaigns list
   - [ ] New campaign appears with status "Draft"

7. **Send Campaign Immediately**
   - [ ] Go back to campaign builder
   - [ ] Create another campaign with same settings
   - [ ] Click "Send Now" button
   - [ ] Confirmation modal appears: "Send to X recipients?"
   - [ ] Confirm
   - [ ] Progress indicator appears
   - [ ] Success message: "Campaign sent to X recipients"
   - [ ] **All users receive invite code email**

**Expected Email Content** (for campaign send):
- Subject: "You're invited to OneLibro Beta!"
- Body contains: invite code, expiration date, CTA button to sign up
- Footer contains: unsubscribe link

**✅ Pass if**: All 7 sub-tests pass and campaign email arrives

---

### 4.3 Test Campaign Analytics

**Steps**:
1. Go to campaigns list
2. Click on the sent campaign from 4.2.7
3. View campaign details page

**Tests**:
- [ ] Shows campaign stats: Total Recipients, Sent, Delivered, Bounced
- [ ] Shows send timestamp
- [ ] Shows delivery rate percentage
- [ ] List of recipients with individual status

**✅ Pass if**: All stats are displayed correctly

---

## Phase 5: Budget Alerts

### 5.1 Test Notification Preferences

**URL**: `http://finance.localhost:3000/finance/settings/notifications`

**Tests**:

1. **Page Load**
   - [ ] Page loads without errors
   - [ ] Shows all notification toggles

2. **Budget Alert Toggle**
   - [ ] "Budget Alerts" toggle is visible
   - [ ] Default state is ON (enabled)
   - [ ] Toggle OFF
   - [ ] Save changes
   - [ ] Success message appears

3. **Budget Alert Threshold**
   - [ ] "Alert Threshold" slider/input is visible
   - [ ] Default value is 80%
   - [ ] Change to 75%
   - [ ] Save changes
   - [ ] Success message appears

4. **Email Notifications Toggle**
   - [ ] "Email Notifications" master toggle is visible
   - [ ] Toggle OFF
   - [ ] All other toggles should disable
   - [ ] Toggle back ON
   - [ ] Other toggles re-enable

**✅ Pass if**: All preference changes save successfully

---

### 5.2 Create Test Budget (Preparation)

**Steps**:
1. Go to: `http://finance.localhost:3000/finance/budgets`
2. Click "Create Budget"
3. Fill form:
   - **Name**: "Groceries Budget Test"
   - **Category**: "Groceries"
   - **Amount**: $100.00
   - **Period**: Monthly
4. Submit

**Expected**:
- Budget created successfully
- Shows in budgets list as active

**✅ Pass if**: Budget created and shows as active

---

### 5.3 Create Test Transactions (Trigger Alert)

**Steps**:
1. Go to: `http://finance.localhost:3000/finance/transactions/add`
2. Add a transaction:
   - **Description**: "Test grocery purchase"
   - **Amount**: $85.00 (85% of $100 budget)
   - **Category**: "Groceries" (must match budget category)
   - **Date**: Today
3. Submit

**Expected**:
- Transaction created
- Budget spent_amount should be $0 initially (will update when cron runs)

**✅ Pass if**: Transaction created successfully

---

### 5.4 Test Budget Alerts Cron Job Manually

**Run the cron job manually**:

**API Call**:
```bash
curl -X GET http://localhost:3000/api/cron/budget-alerts \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Note**: Replace `YOUR_CRON_SECRET` with the value from your `.env` file

**Expected Response**:
```json
{
  "success": true,
  "budgets_checked": 1,
  "alerts_sent": 1,
  "alerts_skipped": 0,
  "errors_count": 0,
  "duration_ms": 1234
}
```

**Expected Email**:
- **Budget alert email** arrives in inbox within 1 minute
- Subject: "Budget Alert: Groceries Budget Test"
- Shows:
  - Budget name: "Groceries Budget Test"
  - Category: "Groceries"
  - Progress bar at ~85% (orange/yellow color)
  - Spent: $85.00
  - Budget: $100.00
  - Remaining: $15.00
  - Days remaining in month
  - Actionable tips ("Monitor Closely", "Stay on Track", etc.)

**✅ Pass if**: Email arrives with correct budget data and styling

---

### 5.5 Test Alert Deduplication

**Steps**:
1. Run the cron job again immediately:
   ```bash
   curl -X GET http://localhost:3000/api/cron/budget-alerts \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

**Expected Response**:
```json
{
  "success": true,
  "budgets_checked": 1,
  "alerts_sent": 0,
  "alerts_skipped": 1,
  "errors_count": 0,
  "duration_ms": 500
}
```

**Expected**:
- NO new email is sent (because alert was already sent today)
- `alerts_skipped` count is 1

**✅ Pass if**: No duplicate email received and response shows `alerts_skipped: 1`

---

### 5.6 Test Over-Budget Alert

**Steps**:
1. Add another transaction:
   - **Amount**: $20.00 (total will be $105, over budget)
   - **Category**: "Groceries"
   - **Date**: Today
2. Submit transaction
3. Run cron job again:
   ```bash
   curl -X GET http://localhost:3000/api/cron/budget-alerts \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

**Expected Email**:
- Subject: "Budget Alert: Groceries Budget Test"
- Shows "⚠️ **Budget Exceeded**" (not just "Budget Alert")
- Progress bar at 105% (red color)
- Spent: $105.00
- Budget: $100.00
- **Over by**: $5.00 (shown in red)
- Different action items: "Review Your Spending", "Adjust Your Budget", "Cut Back"

**✅ Pass if**: Over-budget email arrives with red styling and correct messaging

---

### 5.7 Test Vercel Cron Configuration

**File**: `vercel.json`

**Verify**:
```json
{
  "crons": [
    {
      "path": "/api/cron/budget-alerts",
      "schedule": "0 * * * *"
    }
  ]
}
```

**Tests**:
- [ ] File exists at project root
- [ ] Path is correct: `/api/cron/budget-alerts`
- [ ] Schedule is hourly: `0 * * * *`

**Note**: This will only run in production after deployment. In local development, you must trigger manually.

**✅ Pass if**: Configuration is correct

---

### 5.8 Test with Notifications Disabled

**Steps**:
1. Go to: `http://finance.localhost:3000/finance/settings/notifications`
2. Toggle "Budget Alerts" OFF
3. Save changes
4. Run cron job:
   ```bash
   curl -X GET http://localhost:3000/api/cron/budget-alerts \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

**Expected Response**:
```json
{
  "success": true,
  "budgets_checked": 1,
  "alerts_sent": 0,
  "alerts_skipped": 1,
  "errors_count": 0
}
```

**Expected**:
- NO email is sent (user has alerts disabled)
- `alerts_skipped` count is 1

**✅ Pass if**: No email received when notifications are disabled

---

## Integration Tests

### Email Webhook (Resend Delivery Tracking)

**Test delivery status updates**:

**Steps**:
1. Send any email (use test email from Phase 1.3)
2. Check email_logs table in Supabase:
   ```sql
   SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 1;
   ```
3. Note the `resend_email_id`
4. Simulate Resend webhook:
   ```bash
   curl -X POST http://localhost:3000/api/email/webhook \
     -H "Content-Type: application/json" \
     -d '{
       "type": "email.delivered",
       "data": {
         "email_id": "RESEND_EMAIL_ID_HERE",
         "to": "test@example.com"
       }
     }'
   ```
5. Check email_logs table again
6. Verify `status` changed from "sent" to "delivered"

**✅ Pass if**: Status updates correctly when webhook is received

---

### Unsubscribe Flow

**Steps**:
1. Send a marketing email (use invite code campaign)
2. Open email in inbox
3. Scroll to footer
4. Click "Unsubscribe" link
5. Should redirect to unsubscribe confirmation page
6. Verify in Supabase:
   ```sql
   SELECT marketing_emails FROM notification_preferences WHERE user_id = 'YOUR_USER_ID';
   ```
7. Should show `false`
8. Try sending another marketing campaign
9. User should not receive email

**✅ Pass if**: User is unsubscribed and no longer receives marketing emails

---

## Performance Tests

### Bulk Campaign Send (Load Test)

**Prerequisites**: Have at least 10 test users in database

**Steps**:
1. Create campaign targeting "All Users"
2. Send campaign
3. Monitor console logs for batch processing
4. Verify all emails sent within reasonable time (< 30 seconds for 10 users)

**Expected Console Output**:
```
[Campaign] Sending batch 1/1 (10 recipients)...
[Campaign] Batch 1 sent successfully
[Campaign] Campaign complete: 10 sent, 0 failed
```

**✅ Pass if**: All emails sent successfully in batches

---

### Cron Job Performance

**Test cron execution time**:

**Steps**:
1. Create 5 budgets with different categories
2. Add transactions to 3 of them (to trigger alerts)
3. Run cron job
4. Check response `duration_ms`

**Expected**:
- Duration < 5000ms (5 seconds) for 5 budgets
- All budgets processed
- Alerts sent only for budgets exceeding threshold

**✅ Pass if**: Cron completes in reasonable time and processes all budgets

---

## Security Tests

### Cron Authentication

**Test without auth token**:
```bash
curl -X GET http://localhost:3000/api/cron/budget-alerts
```

**Expected Response**:
```json
{
  "error": "Unauthorized"
}
```
**Status Code**: 401

**✅ Pass if**: Request is rejected without proper auth token

---

### Admin-Only Routes

**Test accessing admin pages as non-admin user**:

**Steps**:
1. Log in as a regular user (not admin)
2. Try to access: `http://admin.localhost:3000/admin/emails/templates`

**Expected**:
- Redirected to login or access denied
- Cannot view templates

**✅ Pass if**: Non-admin users cannot access admin email tools

---

## Cleanup

After testing, clean up test data:

```sql
-- Delete test campaigns
DELETE FROM email_campaigns WHERE name LIKE '%Test%';

-- Delete test email logs (optional, or keep for analytics)
DELETE FROM email_logs WHERE created_at > '2025-01-22';

-- Delete test budgets
DELETE FROM budgets WHERE name LIKE '%Test%';

-- Reset notification preferences
UPDATE notification_preferences SET marketing_emails = true;
```

---

## Summary Checklist

Use this quick checklist to track overall progress:

- [ ] Phase 1: Infrastructure (env vars, DB tables, email service)
- [ ] Phase 2: Transactional Emails (welcome, password reset, Plaid errors)
- [ ] Phase 3: Admin Tools (templates page, logs page)
- [ ] Phase 4: Marketing Campaigns (campaign builder, send campaigns)
- [ ] Phase 5: Budget Alerts (cron job, alert emails, deduplication)
- [ ] Integration Tests (webhooks, unsubscribe)
- [ ] Performance Tests (bulk send, cron speed)
- [ ] Security Tests (auth, admin-only access)

---

## Troubleshooting

### No emails arriving?

1. Check Resend dashboard for delivery status
2. Verify `RESEND_API_KEY` is correct
3. Check spam/junk folder
4. Verify email domain is verified in Resend

### Cron job errors?

1. Check `CRON_SECRET` environment variable
2. Verify budgets have `user_id`, `category`, and `period` set
3. Check console logs for specific error messages

### Template not found?

1. Verify template exists in `email_templates` table
2. Check `is_active` is true
3. Verify `template_path` matches file path in `emails/templates/`

### Type errors?

1. Regenerate Supabase types: `npx supabase gen types typescript --project-id PROJECT_ID > types/supabase.ts`
2. Run `npm run build` to check for compilation errors

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Update `RESEND_API_KEY` to production key
- [ ] Verify production domain in Resend dashboard
- [ ] Update all email template URLs to production domain
- [ ] Set up Resend webhook endpoint: `https://yourdomain.com/api/email/webhook`
- [ ] Generate strong `CRON_SECRET` for production
- [ ] Test cron job in Vercel dashboard after deployment
- [ ] Monitor email logs for first 24 hours
- [ ] Check deliverability rate (should be >95%)

---

**Good luck with testing!** 🚀

If you encounter any issues, check the console logs and Supabase database for error details.
