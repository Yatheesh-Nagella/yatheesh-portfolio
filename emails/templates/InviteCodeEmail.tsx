/**
 * Invite Code Email Template
 * Sent to users with invite codes for beta access
 */

import * as React from 'react';
import { EmailLayout } from '../components/EmailLayout';
import { Button } from '../components/Button';
import { Text, Heading, Section } from '@react-email/components';

interface InviteCodeEmailProps {
  code: string;
  expires_at: string;
  recipient_name?: string;
  invited_by?: string;
}

export default function InviteCodeEmail({
  code,
  expires_at,
  recipient_name,
  invited_by,
}: InviteCodeEmailProps) {
  // Format expiration date
  const expirationDate = new Date(expires_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <EmailLayout
      preview={`Your OneLibro invite code: ${code}`}
      category="marketing"
    >
      <Heading style={h1}>You're Invited to OneLibro! 🎉</Heading>

      <Text style={text}>
        {recipient_name ? `Hi ${recipient_name},` : 'Hi there,'}
      </Text>

      <Text style={text}>
        {invited_by
          ? `${invited_by} has invited you to join OneLibro, the privacy-first personal finance platform.`
          : "You've been invited to join OneLibro, the privacy-first personal finance platform."}
      </Text>

      <Section style={codeBox}>
        <Text style={codeLabel}>Your Invite Code</Text>
        <Text style={codeText}>{code}</Text>
        <Text style={expirationText}>Expires: {expirationDate}</Text>
      </Section>

      <Section style={featuresSection}>
        <Heading style={h2}>What You'll Get with OneLibro:</Heading>

        <Text style={feature}>
          <strong>🏦 Bank Account Integration</strong>
          <br />
          Connect 10,000+ financial institutions securely via Plaid
        </Text>

        <Text style={feature}>
          <strong>📊 Real-Time Transaction Tracking</strong>
          <br />
          Automatic categorization and spending insights
        </Text>

        <Text style={feature}>
          <strong>💰 Smart Budgeting</strong>
          <br />
          Set budgets by category and get alerts when approaching limits
        </Text>

        <Text style={feature}>
          <strong>🔒 Privacy-First Design</strong>
          <br />
          Your financial data is encrypted and never shared
        </Text>

        <Text style={feature}>
          <strong>📱 Beautiful Dashboard</strong>
          <br />
          Clean, modern interface to track your financial health
        </Text>
      </Section>

      <Section style={ctaSection}>
        <Button href="https://finance.yatheeshnagella.com/finance/login">
          Create Your Account
        </Button>
      </Section>

      <Section style={infoBox}>
        <Text style={infoText}>
          <strong>How to Get Started:</strong>
          <br />
          1. Click the button above to visit the signup page
          <br />
          2. Enter your email and create a password
          <br />
          3. Use your invite code: <strong>{code}</strong>
          <br />
          4. Start connecting your bank accounts!
        </Text>
      </Section>

      <Text style={footerText}>
        This is an exclusive invite to join our beta program. We're building OneLibro to help
        people take control of their finances with privacy and simplicity in mind.
      </Text>

      <Text style={footerText}>
        Questions? Check out our{' '}
        <a href="https://yatheesh-nagella.github.io/OneLibro-DOCS/" style={link}>
          documentation
        </a>{' '}
        or reply to this email.
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

const codeBox = {
  backgroundColor: '#1a1a1a',
  border: '2px solid #10b981',
  padding: '32px 24px',
  borderRadius: '12px',
  marginTop: '32px',
  marginBottom: '32px',
  textAlign: 'center' as const,
};

const codeLabel = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#a3a3a3',
  marginBottom: '12px',
  marginTop: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const codeText = {
  fontSize: '42px',
  fontWeight: '700',
  color: '#10b981',
  marginBottom: '16px',
  marginTop: '0',
  letterSpacing: '6px',
  fontFamily: 'monospace',
};

const expirationText = {
  fontSize: '14px',
  color: '#a3a3a3',
  margin: '0',
};

const featuresSection = {
  marginTop: '32px',
  marginBottom: '32px',
};

const feature = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#e5e5e5',
  marginBottom: '16px',
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
