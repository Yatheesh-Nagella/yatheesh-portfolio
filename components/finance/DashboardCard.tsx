'use client';

/**
 * DashboardCard Component
 * Displays a stat card with icon, title, and value
 * 
 * Usage:
 * <DashboardCard
 *   title="Total Balance"
 *   value="$1,234.56"
 *   icon={<DollarSign />}
 *   trend={+5.2}
 * />
 */

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: number; // Percentage change (positive or negative)
  loading?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export default function DashboardCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  loading = false,
  variant = 'default',
}: DashboardCardProps) {
  // Variant styles with dark mode
  const variantStyles = {
    default: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    success: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    danger: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  };

  const iconBgClass = variantStyles[variant];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        <div className={`p-3 rounded-lg ${iconBgClass}`}>
          {icon}
        </div>

        {/* Trend Indicator */}
        {trend !== undefined && !loading && (
          <div
            className={`flex items-center text-sm font-medium ${
              trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{title}</h3>

      {/* Value */}
      {loading ? (
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
      ) : (
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      )}

      {/* Subtitle */}
      {subtitle && !loading && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{subtitle}</p>
      )}
    </div>
  );
}