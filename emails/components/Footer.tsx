/**
 * Footer Component for Emails
 * Includes unsubscribe link and social links
 */

import * as React from 'react';
import { Section, Text, Link, Hr } from '@react-email/components';

interface FooterProps {
  userId?: string;
  category?: 'transactional' | 'marketing' | 'notification' | 'system';
}

export function Footer({ userId, category }: FooterProps) {
  // Generate unsubscribe URL (will be replaced with token-based URL in production)
  const unsubscribeUrl = userId && category && (category === 'marketing' || category === 'notification')
    ? `https://finance.yatheeshnagella.com/api/notifications/unsubscribe?userId=${userId}&category=${category}`
    : null;

  return (
    <Section style={footer}>
      <Hr style={hr} />

      <Text style={text}>
        OneLibro · Personal Finance Management
      </Text>

      <Text style={text}>
        <Link href="https://finance.yatheeshnagella.com" style={link}>
          Dashboard
        </Link>
        {' · '}
        <Link href="https://yatheesh-nagella.github.io/OneLibro-DOCS/" style={link}>
          Documentation
        </Link>
        {' · '}
        <Link href="https://finance.yatheeshnagella.com/finance/settings" style={link}>
          Settings
        </Link>
      </Text>

      {unsubscribeUrl && (
        <Text style={unsubscribeText}>
          Don't want these emails?{' '}
          <Link href={unsubscribeUrl} style={link}>
            Unsubscribe
          </Link>
        </Text>
      )}

      <Text style={copyrightText}>
        © 2025 OneLibro by Yatheesh Nagella. All rights reserved.
      </Text>

      <Text style={addressText}>
        finance.yatheeshnagella.com
      </Text>
    </Section>
  );
}

// Styles
const footer = {
  padding: '30px 30px 20px',
  backgroundColor: '#1a1a1a',
  borderTop: '1px solid #a3a3a3',
  textAlign: 'center' as const,
};

const hr = {
  border: 'none',
  borderTop: '1px solid #a3a3a3',
  margin: '20px 0',
};

const text = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#a3a3a3',
  margin: '8px 0',
};

const link = {
  color: '#10b981',
  textDecoration: 'none',
};

const unsubscribeText = {
  fontSize: '12px',
  lineHeight: '20px',
  color: '#737373',
  margin: '16px 0 8px',
};

const copyrightText = {
  fontSize: '12px',
  lineHeight: '20px',
  color: '#737373',
  margin: '8px 0',
};

const addressText = {
  fontSize: '11px',
  lineHeight: '18px',
  color: '#737373',
  margin: '4px 0',
};
