/**
 * Header Component for Emails
 * Displays OneLibro logo and branding
 */

import * as React from 'react';
import { Section, Img, Text } from '@react-email/components';

export function Header() {
  return (
    <Section style={header}>
      <Img
        src="https://finance.yatheeshnagella.com/oneLibro-logo.png"
        alt="OneLibro"
        width="160"
        height="40"
        style={logo}
      />
    </Section>
  );
}

// Styles
const header = {
  padding: '20px 30px',
  borderBottom: '1px solid #a3a3a3',
  textAlign: 'center' as const,
  backgroundColor: '#1a1a1a',
};

const logo = {
  display: 'block',
  margin: '0 auto',
};

const brandName = {
  display: 'inline-block',
  verticalAlign: 'middle',
  fontSize: '20px',
  fontWeight: '700',
  color: '#e5e5e5',
  letterSpacing: '0.05em',
  margin: 0,
};
