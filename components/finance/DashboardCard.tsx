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
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

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
  // Variant styles
  const variantStyles = {
    default: 'bg-blue-50 text-blue-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-yellow-50 text-yellow-600',
    danger: 'bg-red-50 text-red-600',
  };

  const iconBgClass = variantStyles[variant];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        <div className={`p-3 rounded-lg ${iconBgClass}`}>
          {icon}
        </div>

        {/* Trend Indicator */}
        {trend !== undefined && !loading && (
          <div
            className={`flex items-center text-sm font-medium ${
              trend >= 0 ? 'text-green-600' : 'text-red-600'
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
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>

      {/* Value */}
      {loading ? (
        <div className="h-8 bg-gray-200 rounded animate-pulse w-2/3"></div>
      ) : (
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      )}

      {/* Subtitle */}
      {subtitle && !loading && (
        <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
      )}
    </div>
  );
}