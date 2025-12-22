/**
 * Welcome Email Template
 * Sent to new users after successful signup
 */

import * as React from 'react';
import { EmailLayout } from '../components/EmailLayout';
import { Button } from '../components/Button';
import { Text, Heading, Section } from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <EmailLayout preview="Welcome to OneLibro - Your Personal Finance Journey Starts Here">
      <Heading style={h1}>Welcome to OneLibro! 🎉</Heading>

      <Text style={text}>Hi {name},</Text>

      <Text style={text}>
        Welcome to OneLibro, your privacy-first personal finance platform! We're thrilled to have you on board.
      </Text>

      <Section style={featuresSection}>
        <Heading style={h2}>What You Can Do with OneLibro:</Heading>

        <Text style={feature}>
          <strong style={featureTitle}>🏦 Connect Your Banks</strong>
          <br />
          Securely link checking, savings, and credit card accounts from 10,000+ institutions via Plaid.
        </Text>

        <Text style={feature}>
          <strong style={featureTitle}>💸 Track Spending</strong>
          <br />
          Automatically categorize transactions and visualize your spending patterns over time.
        </Text>

        <Text style={feature}>
          <strong style={featureTitle}>🎯 Set Budgets</strong>
          <br />
          Create budgets for different categories and track your progress throughout the month.
        </Text>

        <Text style={feature}>
          <strong style={featureTitle}>📊 Smart Analytics</strong>
          <br />
          Get insights into your financial health with charts, trends, and spending breakdowns.
        </Text>
      </Section>

      <Section style={ctaSection}>
        <Text style={text}>Ready to get started?</Text>
        <Button href="https://finance.yatheeshnagella.com/finance/dashboard">
          Open Your Dashboard
        </Button>
      </Section>

      <Section style={tipsSection}>
        <Heading style={h2}>Getting Started Tips:</Heading>
        <Text style={tipText}>
          1. <strong>Connect Your First Account</strong> - Head to the Accounts page to securely link your bank
        </Text>
        <Text style={tipText}>
          2. <strong>Set Your Budgets</strong> - Create spending limits for categories that matter to you
        </Text>
        <Text style={tipText}>
          3. <strong>Review Your Dashboard</strong> - See all your financial data in one beautiful view
        </Text>
      </Section>

      <Text style={footerText}>
        If you have any questions, check out our{' '}
        <a href="https://yatheesh-nagella.github.io/OneLibro-DOCS/" style={link}>
          documentation
        </a>
        .
      </Text>

      <Text style={signatureText}>
        Happy tracking!
        <br />
        The OneLibro Team
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
  fontSize: '24px',
  fontWeight: '600',
  color: '#10b981',
  marginBottom: '16px',
  marginTop: '32px',
};

const text = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#e5e5e5',
  marginBottom: '16px',
};

const featuresSection = {
  marginTop: '32px',
  marginBottom: '32px',
};

const feature = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#e5e5e5',
  marginBottom: '20px',
  paddingLeft: '16px',
  borderLeft: '3px solid #10b981',
};

const featureTitle = {
  color: '#10b981',
  fontSize: '18px',
};

const ctaSection = {
  marginTop: '32px',
  marginBottom: '32px',
  textAlign: 'center' as const,
};

const tipsSection = {
  marginTop: '32px',
  backgroundColor: '#e5e5e5',
  padding: '24px',
  borderRadius: '8px',
  color: '#1a1a1a',
};

const tipText = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#1a1a1a',
  marginBottom: '12px',
};

const footerText = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#a3a3a3',
  marginTop: '32px',
};

const link = {
  color: '#10b981',
  textDecoration: 'underline',
};

const signatureText = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#e5e5e5',
  marginTop: '24px',
  fontStyle: 'italic',
};
