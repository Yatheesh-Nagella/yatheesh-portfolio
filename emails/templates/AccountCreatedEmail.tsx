/**
 * Account Created Email Template
 * Confirmation email sent after account creation
 */

import * as React from 'react';
import { EmailLayout } from '../components/EmailLayout';
import { Button } from '../components/Button';
import { Text, Heading, Section, Hr } from '@react-email/components';

interface AccountCreatedEmailProps {
  name: string;
  email: string;
}

export default function AccountCreatedEmail({ name, email }: AccountCreatedEmailProps) {
  return (
    <EmailLayout
      preview="Your OneLibro account has been created successfully"
      category="transactional"
    >
      <Heading style={h1}>Account Created Successfully ✅</Heading>

      <Text style={text}>Hi {name},</Text>

      <Text style={text}>
        Your OneLibro account has been created and is ready to use!
      </Text>

      <Section style={detailsBox}>
        <Text style={detailsTitle}>Account Details:</Text>
        <Text style={detailItem}>
          <strong>Email:</strong> {email}
        </Text>
        <Text style={detailItem}>
          <strong>Account Type:</strong> Personal Finance Management
        </Text>
        <Text style={detailItem}>
          <strong>Status:</strong> <span style={activeStatus}>Active</span>
        </Text>
      </Section>

      <Hr style={divider} />

      <Section style={securitySection}>
        <Heading style={h2}>🔒 Security Tips</Heading>
        <Text style={text}>
          Your account security is our top priority. Here are some tips to keep your account safe:
        </Text>
        <Text style={securityTip}>
          • Use a strong, unique password for your OneLibro account
        </Text>
        <Text style={securityTip}>
          • Never share your password with anyone
        </Text>
        <Text style={securityTip}>
          • We'll never ask for your password via email
        </Text>
        <Text style={securityTip}>
          • Your bank credentials are never stored - we use Plaid's secure connection
        </Text>
      </Section>

      <Section style={ctaSection}>
        <Button href="https://finance.yatheeshnagella.com/finance/dashboard">
          Go to Dashboard
        </Button>
      </Section>

      <Text style={footerText}>
        If you didn't create this account, please contact us immediately.
      </Text>
    </EmailLayout>
  );
}

// Styles - Light theme
const h1 = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#1f2937',
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
  color: '#4b5563',
  marginBottom: '16px',
};

const detailsBox = {
  backgroundColor: '#f3f4f6',
  padding: '24px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  marginTop: '24px',
  marginBottom: '24px',
};

const detailsTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#1f2937',
  marginBottom: '16px',
  marginTop: '0',
};

const detailItem = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#1f2937',
  marginBottom: '8px',
};

const activeStatus = {
  color: '#10b981',
  fontWeight: '600',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const securitySection = {
  marginTop: '24px',
  marginBottom: '24px',
};

const securityTip = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#4b5563',
  marginBottom: '8px',
  paddingLeft: '8px',
};

const ctaSection = {
  marginTop: '32px',
  marginBottom: '32px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#6b7280',
  marginTop: '32px',
  fontStyle: 'italic',
};
