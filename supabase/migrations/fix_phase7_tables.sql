-- Fix Phase 7 Migration - Only create missing tables
-- Run this if the main migration partially failed

-- Drop existing policies to allow recreation
DROP POLICY IF EXISTS "Users can view own notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Users can update own notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Users can insert own notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Admin users can view all notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Users can view own email logs" ON email_logs;
DROP POLICY IF EXISTS "Admin users can view all email logs" ON email_logs;
DROP POLICY IF EXISTS "Users can view own budget alert history" ON budget_alert_history;
DROP POLICY IF EXISTS "Admin users can manage email templates" ON email_templates;
DROP POLICY IF EXISTS "Admin users can manage email campaigns" ON email_campaigns;

-- =====================================================
-- 2. EMAIL TEMPLATES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_key TEXT NOT NULL UNIQUE,
  template_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('transactional', 'marketing', 'notification', 'system')),

  -- Template content
  subject_template TEXT NOT NULL,
  template_type TEXT DEFAULT 'react' CHECK (template_type IN ('react', 'html')),
  template_path TEXT, -- Path to React Email component (e.g., 'emails/templates/WelcomeEmail')
  html_content TEXT, -- For HTML templates

  -- Template metadata
  variables JSONB DEFAULT '{}', -- Expected variables schema
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,

  -- Usage tracking
  total_sent INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for template lookups
CREATE INDEX IF NOT EXISTS idx_email_templates_key ON email_templates(template_key);
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);

-- =====================================================
-- 3. EMAIL LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  template_key TEXT REFERENCES email_templates(template_key),
  subject TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('transactional', 'marketing', 'notification', 'system')),

  -- Resend tracking
  resend_email_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'bounced', 'complained', 'opened', 'clicked', 'failed')),
  error_message TEXT,

  -- Delivery tracking timestamps
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  bounced_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,

  -- Additional metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for email log queries
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient_email ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_template_key ON email_logs(template_key);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_resend_email_id ON email_logs(resend_email_id);

-- =====================================================
-- 4. EMAIL CAMPAIGNS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_key TEXT NOT NULL REFERENCES email_templates(template_key),

  -- Targeting
  target_audience JSONB DEFAULT '{}', -- Filters for recipient selection

  -- Campaign status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,

  -- Analytics
  total_recipients INTEGER DEFAULT 0,
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_bounced INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,

  -- Metadata
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for campaign queries
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_by ON email_campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_at ON email_campaigns(created_at DESC);

-- =====================================================
-- 5. BUDGET ALERT HISTORY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS budget_alert_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,

  -- Alert details
  threshold_percentage INTEGER NOT NULL,
  spent_amount INTEGER NOT NULL, -- In cents
  budget_amount INTEGER NOT NULL, -- In cents
  period TEXT NOT NULL CHECK (period IN ('weekly', 'monthly', 'yearly')),

  -- Email tracking
  email_log_id UUID REFERENCES email_logs(id) ON DELETE SET NULL,

  -- Metadata
  alerted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for alert history queries
CREATE INDEX IF NOT EXISTS idx_budget_alert_history_user_id ON budget_alert_history(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_alert_history_budget_id ON budget_alert_history(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_alert_history_alerted_at ON budget_alert_history(alerted_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_alert_history ENABLE ROW LEVEL SECURITY;

-- notification_preferences policies
CREATE POLICY "Users can view own notification preferences"
  ON notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences"
  ON notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences"
  ON notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin users can view all notification preferences"
  ON notification_preferences FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- email_templates policies (admin only)
CREATE POLICY "Admin users can manage email templates"
  ON email_templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- email_logs policies
CREATE POLICY "Users can view own email logs"
  ON email_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admin users can view all email logs"
  ON email_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- email_campaigns policies (admin only)
CREATE POLICY "Admin users can manage email campaigns"
  ON email_campaigns FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- budget_alert_history policies
CREATE POLICY "Users can view own budget alert history"
  ON budget_alert_history FOR SELECT
  USING (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp for notification_preferences
CREATE OR REPLACE FUNCTION update_notification_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notification_preferences_updated_at ON notification_preferences;
CREATE TRIGGER notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_preferences_updated_at();

-- Auto-update updated_at timestamp for email_templates
CREATE OR REPLACE FUNCTION update_email_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS email_templates_updated_at ON email_templates;
CREATE TRIGGER email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_email_templates_updated_at();

-- Auto-update updated_at timestamp for email_campaigns
CREATE OR REPLACE FUNCTION update_email_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS email_campaigns_updated_at ON email_campaigns;
CREATE TRIGGER email_campaigns_updated_at
  BEFORE UPDATE ON email_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_email_campaigns_updated_at();

-- Auto-create notification preferences for new users
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_notification_preferences_on_user_create ON users;
CREATE TRIGGER create_notification_preferences_on_user_create
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_notification_preferences();

-- =====================================================
-- SEED DATA: Default Email Templates
-- =====================================================

INSERT INTO email_templates (template_key, template_name, category, subject_template, template_type, template_path, variables)
VALUES
  ('welcome_email', 'Welcome Email', 'transactional', 'Welcome to OneLibro, {{user_name}}!', 'react', 'emails/templates/WelcomeEmail', '{"user_name": "string"}'),
  ('account_created_email', 'Account Created', 'transactional', 'Your OneLibro account is ready', 'react', 'emails/templates/AccountCreatedEmail', '{"user_name": "string"}'),
  ('password_reset_email', 'Password Reset', 'transactional', 'Reset your OneLibro password', 'react', 'emails/templates/PasswordResetEmail', '{"reset_link": "string", "user_name": "string"}'),
  ('plaid_item_error', 'Bank Connection Error', 'notification', 'Action needed: Reconnect your {{institution_name}} account', 'react', 'emails/templates/PlaidItemErrorEmail', '{"institution_name": "string", "consent_expiration_time": "string", "reconnect_link": "string", "user_name": "string"}'),
  ('invite_code_email', 'Invite Code', 'marketing', 'You''re invited to OneLibro Beta', 'react', 'emails/templates/InviteCodeEmail', '{"code": "string", "expires_at": "string", "recipient_name": "string"}'),
  ('budget_alert_email', 'Budget Alert', 'notification', 'Budget Alert: {{budget_name}}', 'react', 'emails/templates/BudgetAlertEmail', '{"user_name": "string", "budget_name": "string", "budget_category": "string", "budget_amount": "number", "spent_amount": "number", "threshold_percentage": "number", "period": "string", "days_remaining": "number"}')
ON CONFLICT (template_key) DO UPDATE
SET
  template_name = EXCLUDED.template_name,
  subject_template = EXCLUDED.subject_template,
  template_path = EXCLUDED.template_path,
  variables = EXCLUDED.variables,
  updated_at = NOW();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Phase 7 Email System tables created/updated successfully!';
  RAISE NOTICE 'Tables: notification_preferences, email_templates, email_logs, email_campaigns, budget_alert_history';
  RAISE NOTICE 'Default email templates seeded';
END $$;
