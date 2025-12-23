-- OneLibro Phase 7: Email & Marketing System
-- Migration: Create email notification and marketing tables
-- Date: 2025-01-20

-- =====================================================
-- 1. NOTIFICATION PREFERENCES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Email notification toggles
  email_enabled BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT true,
  budget_alerts BOOLEAN DEFAULT true,
  transaction_alerts BOOLEAN DEFAULT false,
  weekly_summary BOOLEAN DEFAULT true,
  account_security BOOLEAN DEFAULT true, -- Cannot be disabled

  -- Alert thresholds
  budget_alert_threshold INTEGER DEFAULT 80, -- Percentage (50, 75, 80, 90, 100)
  large_transaction_threshold INTEGER DEFAULT 50000, -- In cents ($500)

  -- Frequency preferences
  alert_frequency TEXT DEFAULT 'immediate' CHECK (alert_frequency IN ('immediate', 'daily_digest', 'weekly_digest')),

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one preference set per user
  UNIQUE(user_id)
);

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);

-- RLS Policies for notification_preferences
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can view own notification preferences
CREATE POLICY "Users can view own notification preferences"
  ON notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update own notification preferences
CREATE POLICY "Users can update own notification preferences"
  ON notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert own notification preferences
CREATE POLICY "Users can insert own notification preferences"
  ON notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 2. EMAIL TEMPLATES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Template identification
  template_key TEXT NOT NULL UNIQUE, -- e.g., 'welcome_email', 'budget_alert_80'
  template_name TEXT NOT NULL, -- Human-readable name
  category TEXT NOT NULL CHECK (category IN ('transactional', 'marketing', 'notification', 'system')),

  -- Template content (stored as React Email component path or HTML)
  subject_template TEXT NOT NULL, -- Can include variables: "Hello {{name}}"
  template_type TEXT DEFAULT 'react' CHECK (template_type IN ('react', 'html')),
  template_path TEXT, -- Path to React component: 'emails/WelcomeEmail'
  html_content TEXT, -- Fallback HTML if not using React

  -- Template variables (JSON schema for validation)
  variables JSONB DEFAULT '{}', -- {"name": "string", "amount": "number"}

  -- Status
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,

  -- Metadata
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE,

  -- Usage tracking
  total_sent INTEGER DEFAULT 0
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email_templates_key ON email_templates(template_key);
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);

-- RLS Policies for email_templates (Admin only for now, will add admin check later)
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Anyone can read active templates (needed for sending emails)
CREATE POLICY "Anyone can read active templates"
  ON email_templates FOR SELECT
  USING (is_active = true);

-- Note: Admin-only INSERT/UPDATE/DELETE policies will be added when admin check is implemented

-- =====================================================
-- 3. EMAIL LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Recipient info
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,

  -- Email details
  template_key TEXT REFERENCES email_templates(template_key),
  subject TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('transactional', 'marketing', 'notification', 'system')),

  -- Resend details
  resend_email_id TEXT UNIQUE, -- ID from Resend API

  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'bounced', 'failed', 'complained')),
  error_message TEXT,

  -- Delivery tracking
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  bounced_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  metadata JSONB DEFAULT '{}', -- Store template variables used
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_resend_id ON email_logs(resend_email_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_category ON email_logs(category);

-- RLS Policies for email_logs
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Users can view own email logs
CREATE POLICY "Users can view own email logs"
  ON email_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Note: Admin policy to view all logs will be added when admin check is implemented

-- =====================================================
-- 4. BUDGET ALERT HISTORY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS budget_alert_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- References
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,

  -- Alert details
  threshold_percentage INTEGER NOT NULL, -- 50, 75, 80, 90, 100
  spent_amount INTEGER NOT NULL, -- In cents
  budget_amount INTEGER NOT NULL, -- In cents
  period TEXT NOT NULL, -- 'weekly', 'monthly', 'yearly'

  -- Tracking
  email_log_id UUID REFERENCES email_logs(id),
  alerted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_budget_alert_history_user_id ON budget_alert_history(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_alert_history_budget_id ON budget_alert_history(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_alert_history_alerted_at ON budget_alert_history(alerted_at DESC);

-- Note: Duplicate alert prevention is handled in application code
-- by checking budget_alert_history before sending alerts

-- RLS Policies for budget_alert_history
ALTER TABLE budget_alert_history ENABLE ROW LEVEL SECURITY;

-- Users can view own budget alert history
CREATE POLICY "Users can view own budget alert history"
  ON budget_alert_history FOR SELECT
  USING (auth.uid() = user_id);

-- =====================================================
-- 5. EMAIL CAMPAIGNS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Campaign details
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_key TEXT REFERENCES email_templates(template_key),

  -- Targeting
  target_audience JSONB DEFAULT '{}', -- {"is_admin": false, "account_status": "active"}

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),

  -- Scheduling
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,

  -- Analytics
  total_recipients INTEGER DEFAULT 0,
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_bounced INTEGER DEFAULT 0,

  -- Metadata
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_scheduled_at ON email_campaigns(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_by ON email_campaigns(created_by);

-- RLS Policies for email_campaigns (Admin only)
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

-- Note: Admin-only policies will be added when admin check is implemented

-- =====================================================
-- SEED DATA: Default Email Templates
-- =====================================================

INSERT INTO email_templates (template_key, template_name, category, subject_template, template_type, template_path, variables)
VALUES
  (
    'welcome_email',
    'Welcome Email',
    'transactional',
    'Welcome to OneLibro, {{name}}!',
    'react',
    'emails/templates/WelcomeEmail',
    '{"name": "string"}'::jsonb
  ),
  (
    'invite_code',
    'Invite Code Email',
    'marketing',
    'Your OneLibro Invite Code: {{code}}',
    'react',
    'emails/templates/InviteCodeEmail',
    '{"code": "string", "expires_at": "string", "recipient_name": "string"}'::jsonb
  ),
  (
    'budget_alert_80',
    'Budget Alert 80%',
    'notification',
    '⚠️ You''ve used 80% of your {{budget_name}} budget',
    'react',
    'emails/templates/BudgetAlertEmail',
    '{"budget_name": "string", "spent": "number", "total": "number", "percentage": "number", "threshold": "number"}'::jsonb
  ),
  (
    'budget_alert_90',
    'Budget Alert 90%',
    'notification',
    '🚨 You''ve used 90% of your {{budget_name}} budget',
    'react',
    'emails/templates/BudgetAlertEmail',
    '{"budget_name": "string", "spent": "number", "total": "number", "percentage": "number", "threshold": "number"}'::jsonb
  ),
  (
    'budget_alert_100',
    'Budget Alert 100%',
    'notification',
    '❌ You''ve exceeded your {{budget_name}} budget',
    'react',
    'emails/templates/BudgetAlertEmail',
    '{"budget_name": "string", "spent": "number", "total": "number", "percentage": "number", "threshold": "number"}'::jsonb
  ),
  (
    'password_reset',
    'Password Reset',
    'transactional',
    'Reset your OneLibro password',
    'react',
    'emails/templates/PasswordResetEmail',
    '{"reset_link": "string", "name": "string"}'::jsonb
  ),
  (
    'account_created',
    'Account Created',
    'transactional',
    'Your OneLibro account is ready!',
    'react',
    'emails/templates/AccountCreatedEmail',
    '{"name": "string", "email": "string"}'::jsonb
  ),
  (
    'plaid_item_error',
    'Bank Connection Issue',
    'notification',
    'Action needed: Reconnect your {{institution_name}} account',
    'react',
    'emails/templates/PlaidItemErrorEmail',
    '{"institution_name": "string", "error_message": "string", "reconnect_link": "string"}'::jsonb
  )
ON CONFLICT (template_key) DO NOTHING;

-- =====================================================
-- SEED DATA: Create Default Notification Preferences for Existing Users
-- =====================================================

-- Insert default notification preferences for all existing users who don't have them
INSERT INTO notification_preferences (user_id)
SELECT id FROM users
WHERE id NOT IN (SELECT user_id FROM notification_preferences)
ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- FUNCTION: Auto-create notification preferences on user signup
-- =====================================================

CREATE OR REPLACE FUNCTION create_notification_preferences_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create notification preferences
DROP TRIGGER IF EXISTS on_user_created_notification_preferences ON users;
CREATE TRIGGER on_user_created_notification_preferences
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_notification_preferences_for_new_user();

-- =====================================================
-- FUNCTION: Update updated_at timestamp
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_notification_preferences_updated_at ON notification_preferences;
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_email_templates_updated_at ON email_templates;
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_email_campaigns_updated_at ON email_campaigns;
CREATE TRIGGER update_email_campaigns_updated_at
  BEFORE UPDATE ON email_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ OneLibro Phase 7 Email System migration completed successfully';
  RAISE NOTICE '📊 Tables created: notification_preferences, email_templates, email_logs, budget_alert_history, email_campaigns';
  RAISE NOTICE '🔒 RLS policies enabled for all tables';
  RAISE NOTICE '📧 Default email templates seeded';
  RAISE NOTICE '👤 Notification preferences created for existing users';
END $$;
