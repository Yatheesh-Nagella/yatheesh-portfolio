/**
 * Button Component for Emails
 * CTA button with OneLibro styling
 */

import * as React from 'react';
import { Button as EmailButton } from '@react-email/components';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ href, children, variant = 'primary' }: ButtonProps) {
  const style = variant === 'primary' ? primaryButton : secondaryButton;

  return (
    <EmailButton href={href} style={style}>
      {children}
    </EmailButton>
  );
}

// Styles
const primaryButton = {
  backgroundColor: '#10b981',
  color: '#1a1a1a',
  fontWeight: '600',
  fontSize: '16px',
  padding: '14px 32px',
  borderRadius: '12px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  margin: '20px 0',
  transition: 'all 0.2s',
};

const secondaryButton = {
  backgroundColor: 'transparent',
  color: '#10b981',
  fontWeight: '600',
  fontSize: '16px',
  padding: '14px 32px',
  borderRadius: '12px',
  border: '1px solid #10b981',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  margin: '20px 0',
};
