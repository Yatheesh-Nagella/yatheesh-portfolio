/**
 * Dashboard Skeleton
 * Loading skeleton for the dashboard page
 * Shows the layout structure while data is loading
 */

import React from 'react';
import Skeleton from './Skeleton';

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Skeleton width="60%" height="14px" className="mb-3" />
                <Skeleton width="80%" height="28px" className="mb-2" />
                <Skeleton width="50%" height="12px" />
              </div>
              <Skeleton circle width={48} height={48} />
            </div>
          </div>
        ))}
      </div>

      {/* Spending Chart Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <Skeleton width="40%" height="20px" className="mb-4" />
        <div className="h-64 flex items-end justify-between gap-2">
          {[...Array(30)].map((_, i) => (
            <Skeleton
              key={i}
              width="100%"
              height={`${Math.random() * 80 + 20}%`}
              rounded="sm"
            />
          ))}
        </div>
      </div>

      {/* Recent Transactions Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton width="200px" height="20px" />
          <Skeleton width="80px" height="36px" rounded="lg" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3 flex-1">
                <Skeleton circle width={40} height={40} />
                <div className="flex-1">
                  <Skeleton width="60%" height="16px" className="mb-2" />
                  <Skeleton width="40%" height="12px" />
                </div>
              </div>
              <Skeleton width="80px" height="20px" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <Skeleton width="150px" height="20px" className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
            >
              <Skeleton width={24} height={24} className="mb-2" />
              <Skeleton width="70%" height="16px" className="mb-2" />
              <Skeleton width="90%" height="12px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
