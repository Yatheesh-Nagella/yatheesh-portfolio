-- Seed Email Templates for Phase 7
-- Run this in Supabase SQL Editor after migration

-- Clear existing templates (optional, comment out if you want to keep existing)
-- DELETE FROM email_templates;

-- Insert email templates
INSERT INTO email_templates (template_key, template_name, category, subject_template, template_type, template_path, variables, is_active)
VALUES
  -- Transactional Emails
  (
    'welcome_email',
    'Welcome Email',
    'transactional',
    'Welcome to OneLibro, {{user_name}}!',
    'react',
    'emails/templates/WelcomeEmail',
    '{"user_name": "string"}',
    true
  ),
  (
    'account_created_email',
    'Account Created Confirmation',
    'transactional',
    'Your OneLibro account has been created',
    'react',
    'emails/templates/AccountCreatedEmail',
    '{"user_name": "string"}',
    true
  ),
  (
    'password_reset_email',
    'Password Reset',
    'transactional',
    'Reset your OneLibro password',
    'react',
    'emails/templates/PasswordResetEmail',
    '{"user_name": "string", "reset_link": "string"}',
    true
  ),

  -- Notification Emails
  (
    'plaid_item_error',
    'Bank Connection Error',
    'notification',
    'Action needed: Reconnect your {{institution_name}} account',
    'react',
    'emails/templates/PlaidItemErrorEmail',
    '{"user_name": "string", "institution_name": "string", "consent_expiration_time": "string", "reconnect_link": "string"}',
    true
  ),
  (
    'budget_alert_email',
    'Budget Alert',
    'notification',
    '🚨 Budget Alert: {{budget_name}} is at {{threshold_percentage}}%',
    'react',
    'emails/templates/BudgetAlertEmail',
    '{"user_name": "string", "budget_name": "string", "budget_category": "string", "budget_amount": "number", "spent_amount": "number", "threshold_percentage": "number", "period": "string", "days_remaining": "number"}',
    true
  ),

  -- Marketing Emails
  (
    'invite_code_email',
    'Invite Code Email',
    'marketing',
    'Your OneLibro invite code is here!',
    'react',
    'emails/templates/InviteCodeEmail',
    '{"code": "string", "expires_at": "string", "recipient_name": "string"}',
    true
  )
ON CONFLICT (template_key)
DO UPDATE SET
  template_name = EXCLUDED.template_name,
  category = EXCLUDED.category,
  subject_template = EXCLUDED.subject_template,
  template_type = EXCLUDED.template_type,
  template_path = EXCLUDED.template_path,
  variables = EXCLUDED.variables,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Verify templates were inserted
SELECT template_key, template_name, category, is_active, created_at
FROM email_templates
ORDER BY category, template_name;
