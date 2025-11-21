'use client';

/**
 * Transactions Page
 * Displays all user transactions with filters and search
 * Mobile responsive with table view (desktop) and card view (mobile)
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserTransactions } from '@/lib/supabase';
import type { Transaction } from '@/lib/supabase';
import { formatCurrency, formatDate } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { exportTransactionsToCSV } from '@/lib/export';
import toast from 'react-hot-toast';
import {
  Search,
  Filter,
  Calendar,
  Tag,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ChevronDown,
  Download,
  PlusCircle,
} from 'lucide-react';

type DateFilter = '7d' | '30d' | '90d' | '365d' | 'all';

const DATE_FILTERS: { value: DateFilter; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '365d', label: 'Last year' },
  { value: 'all', label: 'All time' },
];

export default function TransactionsPage() {
  const router = useRouter();
  const { user } = useAuth();

  // State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('30d');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  /**
   * Fetch transactions from database
   */
  useEffect(() => {
    async function fetchTransactions() {
      if (!user) {
        router.push('/finance/login');
        return;
      }

      try {
        setLoading(true);

        // Calculate date range
        const endDate = new Date().toISOString();
        let startDate: string | undefined;

        if (dateFilter !== 'all') {
          const daysAgo = parseInt(dateFilter);
          const date = new Date();
          date.setDate(date.getDate() - daysAgo);
          startDate = date.toISOString();
        }

        // Fetch transactions
        const data = await getUserTransactions(user.id, {
          limit: 500,
          startDate,
          endDate,
        });

        setTransactions(data);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map((tx) => tx.category || 'Uncategorized'))
        ).sort();
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [user, dateFilter, router]);

  /**
   * Filter transactions by search and category
   */
  useEffect(() => {
    let filtered = [...transactions];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((tx) =>
        (tx.merchant_name?.toLowerCase() || '').includes(query)
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(
        (tx) => (tx.category || 'Uncategorized') === categoryFilter
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, categoryFilter]);

  /**
   * Handle export transactions to CSV
   */
  function handleExport() {
    try {
      if (filteredTransactions.length === 0) {
        toast.error('No transactions to export');
        return;
      }

      exportTransactionsToCSV(filteredTransactions);
      toast.success(`Exported ${filteredTransactions.length} transactions`);
    } catch (error) {
      console.error('Error exporting transactions:', error);
      toast.error('Failed to export transactions');
    }
  }

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  /**
   * Render empty state
   */
  if (transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/finance/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Transactions
            </h1>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No transactions yet
            </h2>
            <p className="text-gray-600 mb-6">
              Connect a bank account or add transactions manually.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push('/finance/transactions/add')}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                Add Transaction
              </button>
              <button
                onClick={() => router.push('/finance/dashboard')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Connect Bank
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/finance/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Transactions
              </h1>
              <p className="text-gray-600 mt-2">
                {filteredTransactions.length} of {transactions.length} transactions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/finance/transactions/add')}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </button>
              <button
                onClick={handleExport}
                disabled={filteredTransactions.length === 0}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          {/* Mobile: Show/Hide Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-4"
          >
            <span className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                showFilters ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Filters Content */}
          <div
            className={`space-y-4 ${
              showFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by merchant name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date and Category Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date Filter */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date Range
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {DATE_FILTERS.map((filter) => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 mr-2" />
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table (Desktop) */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No transactions found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search query.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Merchant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.transaction_date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.merchant_name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {transaction.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                        transaction.amount > 0
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      {transaction.amount > 0 ? '-' : '+'}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {transaction.is_pending ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          Pending
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Posted
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Transactions Cards (Mobile) */}
        <div className="md:hidden space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No transactions found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search query.
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {transaction.merchant_name || 'Unknown'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(transaction.transaction_date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        transaction.amount > 0
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      {transaction.amount > 0 ? '-' : '+'}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {transaction.category || 'Uncategorized'}
                  </span>
                  {transaction.is_pending ? (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      Pending
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Posted
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
