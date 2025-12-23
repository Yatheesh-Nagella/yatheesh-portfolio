/**
 * EmailLayout Component
 * Base layout for all OneLibro emails
 * Includes header, content area, and footer
 */

import * as React from 'react';
import { Html, Head, Body, Container, Section } from '@react-email/components';
import { Header } from './Header';
import { Footer } from './Footer';

interface EmailLayoutProps {
  children: React.ReactNode;
  preview?: string;
  userId?: string;
  category?: 'transactional' | 'marketing' | 'notification' | 'system';
}

export function EmailLayout({ children, preview, userId, category }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      {preview && <meta name="description" content={preview} />}
      <Body style={main}>
        <Container style={container}>
          {/* Header with OneLibro logo */}
          <Header />

          {/* Main content */}
          <Section style={content}>{children}</Section>

          {/* Footer with unsubscribe link */}
          <Footer userId={userId} category={category} />
        </Container>
      </Body>
    </Html>
  );
}

// Styles - Light theme for maximum email client compatibility
const main = {
  backgroundColor: '#f3f4f6',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
};

const content = {
  padding: '40px 30px',
  backgroundColor: '#ffffff',
  color: '#1f2937',
};
