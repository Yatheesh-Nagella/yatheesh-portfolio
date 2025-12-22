/**
 * Custom database type definitions
 * These types represent the structure of data from Supabase tables
 * Updated to match the actual database schema
 */

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean | null;
  account_status: string | null;
  invite_code: string | null;
  invited_by: string | null;
  invite_expires_at: string | null;
  created_at: string | null;
  last_login_at: string | null;
}

export interface Account {
  id: string;
  user_id: string | null;
  plaid_item_id: string | null;
  plaid_account_id: string;
  account_name: string | null;
  account_type: string | null;
  current_balance: number | null;
  available_balance: number | null;
  currency: string | null;
  is_hidden: boolean | null;
  created_at: string | null;
  // Joined data from plaid_items (optional)
  plaid_items?: {
    institution_name: string | null;
    status: string | null;
    last_synced_at: string | null;
  } | null;
}

export interface Transaction {
  id: string;
  user_id: string | null;
  account_id: string | null;
  plaid_transaction_id: string;
  amount: number;
  transaction_date: string;
  merchant_name: string | null;
  category: string | null;
  is_pending: boolean | null;
  is_hidden: boolean | null;
  user_notes: string | null;
  currency: string | null;
  created_at: string | null;
}

export interface Budget {
  id: string;
  user_id: string | null;
  name: string;
  category: string;
  amount: number;
  spent_amount: number | null;
  period: string | null;
  is_active: boolean | null;
  created_at: string | null;
}

export interface InviteCode {
  id: string;
  code: string;
  created_by: string | null;
  expires_at: string;
  used_count: number | null;
  max_uses: number | null;
  is_active: boolean | null;
  created_at: string | null;
}

export interface PlaidItem {
  id: string;
  user_id: string | null;
  plaid_item_id: string;
  access_token: string;
  institution_id: string | null;
  institution_name: string | null;
  status: string | null;
  error_message: string | null;
  last_synced_at: string | null;
  created_at: string | null;
}

// =====================================================
// Phase 7: Email & Marketing System Types
// =====================================================

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_enabled: boolean | null;
  marketing_emails: boolean | null;
  budget_alerts: boolean | null;
  transaction_alerts: boolean | null;
  weekly_summary: boolean | null;
  account_security: boolean | null;
  budget_alert_threshold: number | null;
  large_transaction_threshold: number | null;
  alert_frequency: 'immediate' | 'daily_digest' | 'weekly_digest' | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface EmailTemplate {
  id: string;
  template_key: string;
  template_name: string;
  category: 'transactional' | 'marketing' | 'notification' | 'system';
  subject_template: string;
  template_type: 'react' | 'html' | null;
  template_path: string | null;
  html_content: string | null;
  variables: Record<string, any> | null;
  is_active: boolean | null;
  version: number | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  last_used_at: string | null;
  total_sent: number | null;
}

export interface EmailLog {
  id: string;
  user_id: string | null;
  recipient_email: string;
  template_key: string | null;
  subject: string;
  category: 'transactional' | 'marketing' | 'notification' | 'system';
  resend_email_id: string | null;
  status: 'pending' | 'sent' | 'delivered' | 'bounced' | 'failed' | 'complained' | null;
  error_message: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  bounced_at: string | null;
  metadata: Record<string, any> | null;
  created_at: string | null;
}

export interface BudgetAlertHistory {
  id: string;
  user_id: string;
  budget_id: string;
  threshold_percentage: number;
  spent_amount: number;
  budget_amount: number;
  period: string;
  email_log_id: string | null;
  alerted_at: string | null;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  template_key: string | null;
  target_audience: Record<string, any> | null;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled' | null;
  scheduled_at: string | null;
  sent_at: string | null;
  total_recipients: number | null;
  total_sent: number | null;
  total_delivered: number | null;
  total_opened: number | null;
  total_clicked: number | null;
  total_bounced: number | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}
