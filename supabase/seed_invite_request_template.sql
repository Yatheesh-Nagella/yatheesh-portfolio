-- Seed Invite Request Confirmation Email Template
-- Run this after the main email system migration

INSERT INTO email_templates (template_key, template_name, category, subject_template, template_type, template_path, variables, is_active)
VALUES (
  'invite_request_confirmation',
  'Invite Request Confirmation',
  'transactional',
  'Thank you for requesting access to OneLibro',
  'react',
  'emails/templates/InviteRequestConfirmationEmail',
  '{"name": "string"}',
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

-- Verify the template was inserted
SELECT template_key, template_name, category, is_active, created_at
FROM email_templates
WHERE template_key = 'invite_request_confirmation';
