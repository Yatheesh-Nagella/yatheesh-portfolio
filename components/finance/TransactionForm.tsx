'use client';

/**
 * TransactionForm Component
 * Form for creating/editing manual transactions
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, dollarsToCents } from '@/lib/supabase';
import toast from 'react-hot-toast';
import {
  DollarSign,
  Store,
  Tag,
  Calendar,
  FileText,
  Loader2,
  ArrowUpCircle,
  ArrowDownCircle,
} from 'lucide-react';

// Predefined categories (matching Plaid categories)
const CATEGORIES = [
  'Food and Drink',
  'Groceries',
  'Shopping',
  'Transportation',
  'Travel',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Personal Care',
  'Education',
  'Gifts & Donations',
  'Home',
  'Income',
  'Transfer',
  'Other',
];

interface TransactionFormProps {
  onSuccess?: () => void;
  initialData?: {
    id?: string;
    merchantName?: string;
    amount?: number;
    category?: string;
    transactionDate?: string;
    notes?: string;
    isExpense?: boolean;
  };
  isEditing?: boolean;
}

export default function TransactionForm({
  onSuccess,
  initialData,
  isEditing = false,
}: TransactionFormProps) {
  const router = useRouter();

  // Form state
  const [merchantName, setMerchantName] = useState(initialData?.merchantName || '');
  const [amount, setAmount] = useState(
    initialData?.amount ? Math.abs(initialData.amount / 100).toString() : ''
  );
  const [category, setCategory] = useState(initialData?.category || '');
  const [transactionDate, setTransactionDate] = useState(
    initialData?.transactionDate || new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [isExpense, setIsExpense] = useState(initialData?.isExpense ?? true);
  const [loading, setLoading] = useState(false);

  /**
   * Handle form submission
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!merchantName.trim()) {
      toast.error('Please enter a merchant name');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!transactionDate) {
      toast.error('Please select a date');
      return;
    }

    // Don't allow future dates
    if (new Date(transactionDate) > new Date()) {
      toast.error('Transaction date cannot be in the future');
      return;
    }

    setLoading(true);

    try {
      // Get auth session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Please log in to continue');
        router.push('/finance/login');
        return;
      }

      // Convert to cents (positive for expenses, negative for income)
      const amountInCents = dollarsToCents(amountNum) * (isExpense ? 1 : -1);

      const endpoint = isEditing
        ? '/api/transactions/update'
        : '/api/transactions/create';

      const method = isEditing ? 'PUT' : 'POST';

      const body = {
        ...(isEditing && initialData?.id && { id: initialData.id }),
        merchantName: merchantName.trim(),
        amount: amountInCents,
        category: category || null,
        transactionDate,
        notes: notes.trim() || null,
      };

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save transaction');
      }

      toast.success(isEditing ? 'Transaction updated!' : 'Transaction added!');

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/finance/transactions');
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Transaction Type Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Transaction Type
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setIsExpense(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
              isExpense
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <ArrowUpCircle className="w-5 h-5" />
            Expense
          </button>
          <button
            type="button"
            onClick={() => setIsExpense(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
              !isExpense
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <ArrowDownCircle className="w-5 h-5" />
            Income
          </button>
        </div>
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="w-4 h-4 inline mr-1" />
          Amount *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Merchant Name */}
      <div>
        <label htmlFor="merchantName" className="block text-sm font-medium text-gray-700 mb-2">
          <Store className="w-4 h-4 inline mr-1" />
          Merchant Name *
        </label>
        <input
          id="merchantName"
          type="text"
          placeholder="e.g., Starbucks, Amazon, Rent Payment"
          value={merchantName}
          onChange={(e) => setMerchantName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          <Tag className="w-4 h-4 inline mr-1" />
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4 inline mr-1" />
          Date *
        </label>
        <input
          id="transactionDate"
          type="date"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-1" />
          Notes (optional)
        </label>
        <textarea
          id="notes"
          placeholder="Add any additional details..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : isEditing ? (
            'Update Transaction'
          ) : (
            'Add Transaction'
          )}
        </button>
      </div>
    </form>
  );
}
