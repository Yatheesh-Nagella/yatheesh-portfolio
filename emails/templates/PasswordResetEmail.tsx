/**
 * Password Reset Email Template
 * Sent when user requests a password reset
 */

import * as React from 'react';
import { EmailLayout } from '../components/EmailLayout';
import { Button } from '../components/Button';
import { Text, Heading, Section } from '@react-email/components';

interface PasswordResetEmailProps {
  name: string;
  reset_link: string;
}

export default function PasswordResetEmail({ name, reset_link }: PasswordResetEmailProps) {
  return (
    <EmailLayout
      preview="Reset your OneLibro password"
      category="transactional"
    >
      <Heading style={h1}>Reset Your Password 🔐</Heading>

      <Text style={text}>Hi {name},</Text>

      <Text style={text}>
        We received a request to reset the password for your OneLibro account.
      </Text>

      <Section style={warningBox}>
        <Text style={warningText}>
          ⏰ <strong>This link expires in 1 hour</strong> for your security.
        </Text>
      </Section>

      <Text style={text}>
        Click the button below to create a new password:
      </Text>

      <Section style={ctaSection}>
        <Button href={reset_link}>
          Reset Password
        </Button>
      </Section>

      <Text style={linkText}>
        Or copy and paste this link into your browser:
      </Text>
      <Text style={linkUrl}>
        {reset_link}
      </Text>

      <Section style={securityBox}>
        <Heading style={h2}>🛡️ Security Notice</Heading>
        <Text style={securityText}>
          <strong>Didn't request this?</strong>
          <br />
          If you didn't ask to reset your password, you can safely ignore this email.
          Your password won't be changed.
        </Text>
        <Text style={securityText}>
          <strong>Keep your account secure:</strong>
          <br />
          • Never share your password with anyone
          <br />
          • We'll never ask for your password via email
          <br />
          • Always verify the sender's email address
        </Text>
      </Section>

      <Text style={footerText}>
        If you're having trouble with the button above, you can also reset your password by visiting
        your account settings in the OneLibro dashboard.
      </Text>
    </EmailLayout>
  );
}

// Styles
const h1 = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#e5e5e5',
  marginBottom: '24px',
  marginTop: '0',
};

const h2 = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#10b981',
  marginBottom: '16px',
  marginTop: '0',
};

const text = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#e5e5e5',
  marginBottom: '16px',
};

const warningBox = {
  backgroundColor: '#fef3c7',
  border: '2px solid #f59e0b',
  padding: '16px',
  borderRadius: '8px',
  marginTop: '24px',
  marginBottom: '24px',
};

const warningText = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#78350f',
  margin: '0',
  textAlign: 'center' as const,
};

const ctaSection = {
  marginTop: '32px',
  marginBottom: '32px',
  textAlign: 'center' as const,
};

const linkText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#a3a3a3',
  marginBottom: '8px',
};

const linkUrl = {
  fontSize: '13px',
  lineHeight: '20px',
  color: '#10b981',
  wordBreak: 'break-all' as const,
  marginBottom: '24px',
};

const securityBox = {
  backgroundColor: '#e5e5e5',
  padding: '24px',
  borderRadius: '8px',
  marginTop: '32px',
  marginBottom: '24px',
};

const securityText = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#1a1a1a',
  marginBottom: '16px',
};

const footerText = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#a3a3a3',
  marginTop: '32px',
  fontStyle: 'italic',
};
