/**
 * Plaid Item Error Email Template
 * Sent when there's an issue with a connected bank account
 */

import * as React from 'react';
import { EmailLayout } from '../components/EmailLayout';
import { Button } from '../components/Button';
import { Text, Heading, Section } from '@react-email/components';

interface PlaidItemErrorEmailProps {
  institution_name: string;
  error_message: string;
  reconnect_link: string;
}

export default function PlaidItemErrorEmail({
  institution_name,
  error_message,
  reconnect_link,
}: PlaidItemErrorEmailProps) {
  return (
    <EmailLayout
      preview={`Action needed: Reconnect your ${institution_name} account`}
      category="notification"
    >
      <Heading style={h1}>Action Required: Bank Connection Issue ⚠️</Heading>

      <Text style={text}>Hello,</Text>

      <Text style={text}>
        We're having trouble connecting to your <strong>{institution_name}</strong> account.
        Your financial data may not be up to date until you reconnect.
      </Text>

      <Section style={errorBox}>
        <Text style={errorTitle}>❌ Connection Error</Text>
        <Text style={errorMessage}>{error_message}</Text>
      </Section>

      <Section style={reasonsSection}>
        <Heading style={h2}>Common Reasons for Connection Issues:</Heading>
        <Text style={reason}>
          <strong>🔐 Changed Password</strong> - You recently updated your bank password
        </Text>
        <Text style={reason}>
          <strong>🔒 Security Settings</strong> - Your bank requires re-authorization
        </Text>
        <Text style={reason}>
          <strong>⏰ Expired Consent</strong> - Your connection consent has expired (typically after 90 days)
        </Text>
        <Text style={reason}>
          <strong>🏦 Bank Maintenance</strong> - Temporary maintenance by your financial institution
        </Text>
      </Section>

      <Text style={text}>
        <strong>Don't worry!</strong> This is easy to fix. Simply reconnect your account to continue tracking your finances.
      </Text>

      <Section style={ctaSection}>
        <Button href={reconnect_link}>
          Reconnect {institution_name}
        </Button>
      </Section>

      <Section style={infoBox}>
        <Heading style={h3}>🔒 Your Data is Safe</Heading>
        <Text style={infoText}>
          • Your financial data remains secure and encrypted
          <br />
          • No transactions have been lost
          <br />
          • Once reconnected, we'll automatically sync your latest transactions
        </Text>
      </Section>

      <Text style={footerText}>
        If you continue to experience issues, please contact your bank's support team or{' '}
        <a href="https://yatheesh-nagella.github.io/OneLibro-DOCS/" style={link}>
          check our documentation
        </a>{' '}
        for troubleshooting tips.
      </Text>

      <Text style={footerText}>
        If you no longer use this account, you can remove it from your{' '}
        <a href={reconnect_link} style={link}>
          account settings
        </a>
        .
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

const h3 = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#10b981',
  marginBottom: '12px',
  marginTop: '0',
};

const text = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#e5e5e5',
  marginBottom: '16px',
};

const errorBox = {
  backgroundColor: '#fef2f2',
  border: '2px solid #ef4444',
  padding: '20px',
  borderRadius: '8px',
  marginTop: '24px',
  marginBottom: '24px',
};

const errorTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#991b1b',
  marginBottom: '8px',
  marginTop: '0',
};

const errorMessage = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#7f1d1d',
  margin: '0',
  fontFamily: 'monospace',
};

const reasonsSection = {
  marginTop: '24px',
  marginBottom: '24px',
};

const reason = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#e5e5e5',
  marginBottom: '12px',
  paddingLeft: '12px',
  borderLeft: '3px solid #10b981',
};

const ctaSection = {
  marginTop: '32px',
  marginBottom: '32px',
  textAlign: 'center' as const,
};

const infoBox = {
  backgroundColor: '#e5e5e5',
  padding: '20px',
  borderRadius: '8px',
  marginTop: '24px',
  marginBottom: '24px',
};

const infoText = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#1a1a1a',
  margin: '0',
};

const footerText = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#a3a3a3',
  marginTop: '16px',
  marginBottom: '8px',
};

const link = {
  color: '#10b981',
  textDecoration: 'underline',
};
