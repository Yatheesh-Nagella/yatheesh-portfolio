/* eslint-disable react/no-unescaped-entities */
'use client';

/**
 * SpendingChart Component - OneLibro
 * Dark sophisticated theme with premium design
 * Displays spending over time using a line chart
 */

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/supabase';

interface SpendingDataPoint {
  date: string;
  amount: number;
}

interface SpendingChartProps {
  data: SpendingDataPoint[];
  title?: string;
  loading?: boolean;
}

export default function SpendingChart({
  data,
  title = 'Spending Overview',
  loading = false,
}: SpendingChartProps) {
  /**
   * Custom tooltip component with proper types
   */
  interface CustomTooltipProps {
    active?: boolean;
    payload?: {
      value: number;
      payload: SpendingDataPoint;
    }[];
    label?: string;
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a1a]/95 backdrop-blur-sm px-4 py-3 rounded-xl border border-[#10b981]/40 shadow-xl">
          <p className="text-sm font-semibold text-[#e5e5e5] mb-1">
            {payload[0].payload.date}
          </p>
          <p className="text-xs text-[#a3a3a3]">
            Spent:{' '}
            <span className="font-bold text-[#10b981]">
              {formatCurrency(payload[0].value)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <h3 className="text-xl font-bold text-[#e5e5e5] mb-6">{title}</h3>
        <div className="h-72 bg-[#e5e5e5]/5 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div>
        <h3 className="text-xl font-bold text-[#e5e5e5] mb-6">{title}</h3>
        <div className="h-72 flex items-center justify-center rounded-xl bg-[#e5e5e5]/5 border border-[#a3a3a3]/10">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#10b981]/15 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-sm text-[#737373] mb-1">No spending data available</p>
            <p className="text-xs text-[#737373]/70">
              Connect a bank account to see your spending
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-[#e5e5e5] mb-6">{title}</h3>

      <div className="bg-[#0f0f0f] rounded-xl p-4 border border-[#a3a3a3]/10">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#a3a3a3"
              strokeOpacity={0.1}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="#a3a3a3"
              strokeOpacity={0.5}
              fontSize={11}
              tickLine={false}
              tick={{ fill: '#a3a3a3', opacity: 0.6 }}
            />
            <YAxis
              stroke="#a3a3a3"
              strokeOpacity={0.5}
              fontSize={11}
              tickLine={false}
              tick={{ fill: '#a3a3a3', opacity: 0.6 }}
              tickFormatter={(value) => `$${(value / 100).toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#10b981"
              strokeWidth={3}
              dot={{
                fill: '#10b981',
                r: 5,
                strokeWidth: 2,
                stroke: '#0f0f0f'
              }}
              activeDot={{
                r: 7,
                fill: '#10b981',
                strokeWidth: 2,
                stroke: '#e5e5e5'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
