/**
 * Export Utilities
 * Functions for exporting data to various formats (CSV, Excel, etc.)
 */

import { type Transaction } from './supabase';
import { formatDate, formatCurrency } from './supabase';

/**
 * Export transactions to CSV
 * @param transactions - Array of transactions to export
 * @param filename - Optional filename (defaults to transactions-{date}.csv)
 */
export function exportTransactionsToCSV(
  transactions: Transaction[],
  filename?: string
): void {
  // Define CSV headers
  const headers = [
    'Date',
    'Merchant',
    'Category',
    'Amount',
    'Status',
    'Account',
    'Notes',
  ];

  // Convert transactions to CSV rows
  const rows = transactions.map((tx) => {
    // Type assertion for joined data
    type TransactionWithAccount = Transaction & {
      accounts?: { account_name?: string };
      notes?: string;
    };
    const txWithAccount = tx as TransactionWithAccount;

    return [
      formatDate(tx.transaction_date),
      escapeCSVValue(tx.merchant_name || 'Unknown'),
      escapeCSVValue(tx.category || 'Uncategorized'),
      formatCurrency(tx.amount),
      tx.is_pending ? 'Pending' : 'Posted',
      escapeCSVValue(txWithAccount.accounts?.account_name || 'N/A'),
      escapeCSVValue(tx.user_notes || txWithAccount.notes || ''),
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download =
    filename || `transactions-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Escape CSV values that contain commas, quotes, or newlines
 * @param value - The value to escape
 * @returns Escaped value suitable for CSV
 */
function escapeCSVValue(value: string | number): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Export transactions summary to CSV
 * @param summary - Summary data to export
 * @param filename - Optional filename
 */
export function exportSummaryToCSV(
  summary: {
    totalTransactions: number;
    totalSpent: number;
    totalIncome: number;
    netCashFlow: number;
    categories: { category: string; amount: number; count: number }[];
  },
  filename?: string
): void {
  const headers = ['Metric', 'Value'];

  const rows = [
    ['Total Transactions', summary.totalTransactions.toString()],
    ['Total Spent', formatCurrency(summary.totalSpent)],
    ['Total Income', formatCurrency(summary.totalIncome)],
    ['Net Cash Flow', formatCurrency(summary.netCashFlow)],
    [''],
    ['Category Breakdown', ''],
    ['Category', 'Amount'],
    ...summary.categories.map((cat) => [
      cat.category,
      formatCurrency(cat.amount),
    ]),
  ];

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join(
    '\n'
  );

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download =
    filename || `transaction-summary-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
