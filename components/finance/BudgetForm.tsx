'use client';

/**
 * BudgetForm Component
 * Form for creating/editing budgets
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, dollarsToCents } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  DollarSign,
  Tag,
  Calendar,
  FileText,
  Loader2,
} from 'lucide-react';

// Budget categories (matching common Plaid categories)
const BUDGET_CATEGORIES = [
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
  'Home',
  'Other',
];

const PERIODS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

interface BudgetFormProps {
  onSuccess?: () => void;
  initialData?: {
    id?: string;
    name?: string;
    category?: string;
    amount?: number;
    period?: string;
  };
  isEditing?: boolean;
}

export default function BudgetForm({
  onSuccess,
  initialData,
  isEditing = false,
}: BudgetFormProps) {
  const router = useRouter();
  const { user } = useAuth();

  // Form state
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [amount, setAmount] = useState(
    initialData?.amount ? (initialData.amount / 100).toString() : ''
  );
  const [period, setPeriod] = useState(initialData?.period || 'monthly');
  const [loading, setLoading] = useState(false);

  /**
   * Handle form submission
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to continue');
      router.push('/finance/login');
      return;
    }

    // Validation
    if (!name.trim()) {
      toast.error('Please enter a budget name');
      return;
    }

    if (!category) {
      toast.error('Please select a category');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const amountInCents = dollarsToCents(amountNum);

      if (isEditing && initialData?.id) {
        // Update existing budget
        const { error } = await supabase
          .from('budgets')
          .update({
            name: name.trim(),
            category,
            amount: amountInCents,
            period,
          })
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success('Budget updated!');
      } else {
        // Create new budget
        const { error } = await supabase
          .from('budgets')
          .insert({
            user_id: user.id,
            name: name.trim(),
            category,
            amount: amountInCents,
            period,
            is_active: true,
          });

        if (error) throw error;
        toast.success('Budget created!');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/finance/budgets');
      }
    } catch (error) {
      console.error('Error saving budget:', error);
      toast.error('Failed to save budget');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Budget Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-1" />
          Budget Name *
        </label>
        <input
          id="name"
          type="text"
          placeholder="e.g., Monthly Groceries, Entertainment"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          <Tag className="w-4 h-4 inline mr-1" />
          Category *
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          required
        >
          <option value="">Select a category</option>
          {BUDGET_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Transactions with matching categories will be tracked against this budget
        </p>
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="w-4 h-4 inline mr-1" />
          Budget Amount *
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

      {/* Period */}
      <div>
        <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4 inline mr-1" />
          Budget Period *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPeriod(p.value)}
              className={`py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                period === p.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {period === 'weekly' && 'Budget resets every Monday'}
          {period === 'monthly' && 'Budget resets on the 1st of each month'}
          {period === 'yearly' && 'Budget resets on January 1st'}
        </p>
      </div>

      {/* Suggested Amounts */}
      {!isEditing && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Quick amounts:</p>
          <div className="flex flex-wrap gap-2">
            {[50, 100, 200, 500, 1000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt.toString())}
                className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                ${amt}
              </button>
            ))}
          </div>
        </div>
      )}

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
            'Update Budget'
          ) : (
            'Create Budget'
          )}
        </button>
      </div>
    </form>
  );
}
