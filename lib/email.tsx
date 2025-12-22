// lib/email.ts
/**
 * Email Service Abstraction Layer
 * Handles all email operations using Resend and React Email
 * Pattern: Similar to lib/plaid.ts for external service integration
 */

import { Resend } from 'resend';
import { render } from '@react-email/render';
import { env } from '@/lib/env';
import { createClient } from '@supabase/supabase-js';

// Initialize Resend client
const resend = new Resend(env.email.apiKey);

// Create Supabase client with service role for database operations
const supabase = createClient(
  env.supabase.url,
  env.supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Email categories for permission checking
 */
export type EmailCategory = 'transactional' | 'marketing' | 'notification' | 'system';

/**
 * Options for sending an email
 */
export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  templateKey: string;
  templateProps: Record<string, any>;
  userId?: string;
  category?: EmailCategory;
  replyTo?: string;
}

/**
 * Email template from database
 */
interface EmailTemplate {
  id: string;
  template_key: string;
  template_name: string;
  category: string;
  subject_template: string;
  template_type: 'react' | 'html';
  template_path: string | null;
  html_content: string | null;
  variables: Record<string, any>;
  is_active: boolean;
}

/**
 * Result of email send operation
 */
export interface EmailResult {
  success: boolean;
  emailId?: string;
  error?: string;
}

/**
 * Check if user can receive emails of a given category
 * @param userId - User ID to check
 * @param category - Email category
 * @returns true if user can receive emails, false otherwise
 */
export async function canSendEmail(
  userId: string,
  category: EmailCategory
): Promise<boolean> {
  // Always allow transactional and system emails
  if (category === 'transactional' || category === 'system') {
    return true;
  }

  // Get user notification preferences
  const { data: prefs, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  // If no preferences found, default to enabled
  if (error || !prefs) {
    return true;
  }

  // Check global email_enabled
  if (!prefs.email_enabled) {
    return false;
  }

  // Check category-specific preferences
  if (category === 'marketing') {
    return prefs.marketing_emails;
  }

  if (category === 'notification') {
    // Check if any notification type is enabled
    return prefs.budget_alerts || prefs.transaction_alerts || prefs.weekly_summary;
  }

  return true;
}

/**
 * Get email template from database
 * @param templateKey - Template key to fetch
 * @returns Email template or null if not found
 */
export async function getTemplate(templateKey: string): Promise<EmailTemplate | null> {
  const { data, error } = await supabase
    .from('email_templates')
    .select('*')
    .eq('template_key', templateKey)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    console.error(`Template not found: ${templateKey}`, error);
    return null;
  }

  return data as EmailTemplate;
}

/**
 * Render email template with variables
 * @param template - Email template
 * @param props - Template properties
 * @returns Rendered HTML string
 */
async function renderTemplate(
  template: EmailTemplate,
  props: Record<string, any>
): Promise<string> {
  // For React templates, dynamically import and render
  if (template.template_type === 'react' && template.template_path) {
    try {
      // Dynamically import the template component
      const templateModule = await import(`@/${template.template_path}`);
      const TemplateComponent = templateModule.default;

      // Render React Email component to HTML
      const html = await render(<TemplateComponent {...props} />);
      return html;
    } catch (error) {
      console.error(`Failed to render React template: ${template.template_path}`, error);
      throw new Error(`Failed to render email template: ${template.template_key}`);
    }
  }

  // For HTML templates, return the HTML content directly
  if (template.template_type === 'html' && template.html_content) {
    // Simple variable replacement for HTML templates
    let html = template.html_content;
    for (const [key, value] of Object.entries(props)) {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }
    return html;
  }

  throw new Error(`Invalid template configuration: ${template.template_key}`);
}

/**
 * Replace variables in subject template
 * @param subject - Subject template with {{variables}}
 * @param props - Template properties
 * @returns Subject with variables replaced
 */
function renderSubject(subject: string, props: Record<string, any>): string {
  let rendered = subject;
  for (const [key, value] of Object.entries(props)) {
    rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }
  return rendered;
}

/**
 * Log email to database
 * @param options - Email options
 * @param status - Email status
 * @param resendEmailId - Resend email ID
 * @param errorMessage - Error message if failed
 */
async function logEmail(
  options: SendEmailOptions,
  status: 'pending' | 'sent' | 'failed',
  resendEmailId?: string,
  errorMessage?: string
): Promise<void> {
  const recipientEmail = Array.isArray(options.to) ? options.to[0] : options.to;

  await supabase.from('email_logs').insert({
    user_id: options.userId || null,
    recipient_email: recipientEmail,
    template_key: options.templateKey,
    subject: options.subject,
    category: options.category || 'notification',
    resend_email_id: resendEmailId || null,
    status,
    error_message: errorMessage || null,
    sent_at: status === 'sent' ? new Date().toISOString() : null,
    metadata: options.templateProps,
  });

  // Update template last used timestamp
  // Note: total_sent counter can be updated via database trigger or RPC function
  await supabase
    .from('email_templates')
    .update({
      last_used_at: new Date().toISOString(),
    })
    .eq('template_key', options.templateKey);
}

/**
 * Send an email using Resend
 * @param options - Email options
 * @returns Email result
 */
export async function sendEmail(options: SendEmailOptions): Promise<EmailResult> {
  try {
    // 1. Check if user can receive this type of email
    if (options.userId && options.category) {
      const canSend = await canSendEmail(options.userId, options.category);
      if (!canSend) {
        console.log(`User ${options.userId} has opted out of ${options.category} emails`);
        return {
          success: false,
          error: 'User has opted out of this email category',
        };
      }
    }

    // 2. Get template from database
    const template = await getTemplate(options.templateKey);
    if (!template) {
      throw new Error(`Email template not found: ${options.templateKey}`);
    }

    // 3. Render email HTML
    const html = await renderTemplate(template, options.templateProps);

    // 4. Render subject (allow override from options or use template)
    const subject = options.subject || renderSubject(template.subject_template, options.templateProps);

    // 5. Send email via Resend
    const { data, error } = await resend.emails.send({
      from: `${env.email.fromName} <${env.email.fromEmail}>`,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject,
      html,
      replyTo: options.replyTo,
      headers: {
        // Add List-Unsubscribe header for compliance
        ...(options.category === 'marketing' || options.category === 'notification'
          ? {
              'List-Unsubscribe': `<${env.app.url}/api/notifications/unsubscribe>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            }
          : {}),
      },
    });

    if (error) {
      // Log failure
      await logEmail(options, 'failed', undefined, error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    // 6. Log successful send
    await logEmail(options, 'sent', data?.id);

    return {
      success: true,
      emailId: data?.id,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Email send error:', errorMessage, error);

    // Log failure
    await logEmail(options, 'failed', undefined, errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Send multiple emails in bulk with rate limiting
 * @param emails - Array of email options
 * @param batchSize - Number of emails to send per batch (default: 50)
 * @param delayMs - Delay between batches in milliseconds (default: 100ms)
 * @returns Array of email results
 */
export async function sendBulkEmails(
  emails: SendEmailOptions[],
  batchSize: number = 50,
  delayMs: number = 100
): Promise<EmailResult[]> {
  const results: EmailResult[] = [];

  // Split into batches
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);

    // Send batch in parallel
    const batchResults = await Promise.all(
      batch.map((emailOptions) => sendEmail(emailOptions))
    );

    results.push(...batchResults);

    // Delay between batches to respect rate limits
    if (i + batchSize < emails.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

/**
 * Update email status from webhook
 * @param resendEmailId - Resend email ID
 * @param status - New status
 * @param timestamp - Event timestamp
 */
export async function updateEmailStatus(
  resendEmailId: string,
  status: 'delivered' | 'bounced' | 'complained' | 'opened' | 'clicked',
  timestamp?: Date
): Promise<void> {
  const updates: Record<string, any> = { status };

  // Set appropriate timestamp field
  if (status === 'delivered') {
    updates.delivered_at = timestamp?.toISOString() || new Date().toISOString();
  } else if (status === 'bounced') {
    updates.bounced_at = timestamp?.toISOString() || new Date().toISOString();
  } else if (status === 'opened') {
    updates.opened_at = timestamp?.toISOString() || new Date().toISOString();
  } else if (status === 'clicked') {
    updates.clicked_at = timestamp?.toISOString() || new Date().toISOString();
  }

  await supabase
    .from('email_logs')
    .update(updates)
    .eq('resend_email_id', resendEmailId);
}

/**
 * Get user notification preferences
 * @param userId - User ID
 * @returns Notification preferences or null
 */
export async function getUserNotificationPreferences(userId: string) {
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Failed to get notification preferences:', error);
    return null;
  }

  return data;
}

/**
 * Update user notification preferences
 * @param userId - User ID
 * @param preferences - Preferences to update
 * @returns Updated preferences or null
 */
export async function updateUserNotificationPreferences(
  userId: string,
  preferences: Partial<{
    email_enabled: boolean;
    marketing_emails: boolean;
    budget_alerts: boolean;
    transaction_alerts: boolean;
    weekly_summary: boolean;
    budget_alert_threshold: number;
    large_transaction_threshold: number;
    alert_frequency: 'immediate' | 'daily_digest' | 'weekly_digest';
  }>
) {
  const { data, error } = await supabase
    .from('notification_preferences')
    .update(preferences)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Failed to update notification preferences:', error);
    return null;
  }

  return data;
}

/**
 * Helper function to format currency for emails
 * @param cents - Amount in cents
 * @returns Formatted currency string
 */
export function formatCurrencyForEmail(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

/**
 * Helper function to format date for emails
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDateForEmail(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}
