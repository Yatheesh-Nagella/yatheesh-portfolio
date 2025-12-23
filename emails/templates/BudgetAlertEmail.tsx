/**
 * Budget Alert Email Template
 * Sent when user approaches or exceeds budget threshold
 */

import * as React from 'react';
import { EmailLayout } from '../components/EmailLayout';
import { Button } from '../components/Button';
import { Text, Heading, Section } from '@react-email/components';

interface BudgetAlertEmailProps {
  user_name: string;
  budget_name: string;
  budget_category: string;
  budget_amount: number; // in dollars
  spent_amount: number; // in dollars
  threshold_percentage: number;
  period: 'weekly' | 'monthly' | 'yearly';
  days_remaining?: number;
}

export default function BudgetAlertEmail({
  user_name,
  budget_name,
  budget_category,
  budget_amount,
  spent_amount,
  threshold_percentage,
  period,
  days_remaining,
}: BudgetAlertEmailProps) {
  const percentageUsed = Math.round((spent_amount / budget_amount) * 100);
  const remaining = budget_amount - spent_amount;
  const isOverBudget = percentageUsed >= 100;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <EmailLayout
      preview={`${isOverBudget ? 'Budget exceeded' : 'Budget alert'}: ${budget_name}`}
      category="notification"
    >
      <Heading style={h1}>
        {isOverBudget ? '⚠️ Budget Exceeded' : '⚠️ Budget Alert'}
      </Heading>

      <Text style={text}>Hi {user_name},</Text>

      <Text style={text}>
        {isOverBudget
          ? `You've exceeded your budget for ${budget_name}. Here's a summary of your spending:`
          : `You're approaching your spending limit for ${budget_name}. Here's where you stand:`}
      </Text>

      {/* Budget Summary Card */}
      <Section style={summaryCard}>
        <Text style={budgetTitle}>{budget_name}</Text>
        <Text style={budgetCategory}>{budget_category}</Text>

        <div style={progressContainer}>
          <div style={progressBar}>
            <div
              style={{
                ...progressFill,
                width: `${Math.min(percentageUsed, 100)}%`,
                backgroundColor: percentageUsed >= 100 ? '#ef4444' : percentageUsed >= threshold_percentage ? '#f59e0b' : '#10b981',
              }}
            />
          </div>
          <Text style={percentageText}>
            <strong>{percentageUsed}%</strong> of budget used
          </Text>
        </div>

        <div style={amountGrid}>
          <div>
            <Text style={amountLabel}>Spent</Text>
            <Text style={amountValue}>{formatCurrency(spent_amount)}</Text>
          </div>
          <div>
            <Text style={amountLabel}>Budget</Text>
            <Text style={amountValue}>{formatCurrency(budget_amount)}</Text>
          </div>
          <div>
            <Text style={amountLabel}>{isOverBudget ? 'Over by' : 'Remaining'}</Text>
            <Text style={{
              ...amountValue,
              color: isOverBudget ? '#ef4444' : '#10b981',
            }}>
              {formatCurrency(Math.abs(remaining))}
            </Text>
          </div>
        </div>

        {days_remaining && !isOverBudget && (
          <Text style={daysRemaining}>
            {days_remaining} days remaining in this {period} period
          </Text>
        )}
      </Section>

      {/* Action Items */}
      <Section style={actionSection}>
        <Heading style={h2}>What You Can Do:</Heading>

        {isOverBudget ? (
          <>
            <Text style={actionItem}>
              <strong>📊 Review Your Spending</strong>
              <br />
              Check recent transactions to see where you went over budget
            </Text>
            <Text style={actionItem}>
              <strong>💰 Adjust Your Budget</strong>
              <br />
              If needed, increase your budget limit or reallocate funds
            </Text>
            <Text style={actionItem}>
              <strong>✂️ Cut Back</strong>
              <br />
              Look for areas to reduce spending for the rest of the {period}
            </Text>
          </>
        ) : (
          <>
            <Text style={actionItem}>
              <strong>👀 Monitor Closely</strong>
              <br />
              Keep an eye on spending in this category
            </Text>
            <Text style={actionItem}>
              <strong>🎯 Stay on Track</strong>
              <br />
              Try to limit spending to {formatCurrency(remaining)} for the remaining {days_remaining || 0} days
            </Text>
            <Text style={actionItem}>
              <strong>📝 Review Transactions</strong>
              <br />
              Check if any large purchases can be delayed or adjusted
            </Text>
          </>
        )}
      </Section>

      {/* CTA */}
      <Section style={ctaSection}>
        <Button href="https://finance.yatheeshnagella.com/finance/budgets">
          View Budget Details
        </Button>
      </Section>

      {/* Tips Section */}
      <Section style={tipsBox}>
        <Heading style={h3}>💡 Budget Tips</Heading>
        <Text style={tipText}>
          • Set up multiple budgets to track different spending categories
          <br />
          • Review your budgets weekly to stay on track
          <br />
          • Adjust alert thresholds in settings (currently at {threshold_percentage}%)
          <br />
          • Use transaction categories to see where your money goes
        </Text>
      </Section>

      <Text style={footerText}>
        You're receiving this because you have budget alerts enabled for this category.
        You can adjust your notification preferences in{' '}
        <a href="https://finance.yatheeshnagella.com/finance/settings/notifications" style={link}>
          settings
        </a>
        .
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
  color: '#4b5563',
  marginBottom: '16px',
};

const summaryCard = {
  backgroundColor: '#f9fafb',
  border: '2px solid #e5e7eb',
  padding: '24px',
  borderRadius: '12px',
  marginTop: '24px',
  marginBottom: '24px',
};

const budgetTitle = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#10b981',
  marginBottom: '4px',
  marginTop: '0',
};

const budgetCategory = {
  fontSize: '14px',
  color: '#6b7280',
  marginBottom: '20px',
  marginTop: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const progressContainer = {
  marginBottom: '20px',
};

const progressBar = {
  width: '100%',
  height: '12px',
  backgroundColor: '#e5e7eb',
  borderRadius: '6px',
  overflow: 'hidden',
  marginBottom: '8px',
};

const progressFill = {
  height: '100%',
  transition: 'width 0.3s ease',
  borderRadius: '6px',
};

const percentageText = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0',
};

const amountGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '16px',
  marginTop: '20px',
};

const amountLabel = {
  fontSize: '12px',
  color: '#6b7280',
  marginBottom: '4px',
  marginTop: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const amountValue = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0',
};

const daysRemaining = {
  fontSize: '14px',
  color: '#6b7280',
  marginTop: '16px',
  marginBottom: '0',
  textAlign: 'center' as const,
};

const actionSection = {
  marginTop: '32px',
  marginBottom: '32px',
};

const actionItem = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#4b5563',
  marginBottom: '16px',
  paddingLeft: '12px',
  borderLeft: '3px solid #10b981',
};

const ctaSection = {
  marginTop: '32px',
  marginBottom: '32px',
  textAlign: 'center' as const,
};

const tipsBox = {
  backgroundColor: '#f3f4f6',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  marginTop: '24px',
  marginBottom: '24px',
};

const tipText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#1f2937',
  margin: '0',
};

const footerText = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#6b7280',
  marginTop: '24px',
  marginBottom: '8px',
};

const link = {
  color: '#10b981',
  textDecoration: 'underline',
};
