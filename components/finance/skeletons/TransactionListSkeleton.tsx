/**
 * Transaction List Skeleton
 * Loading skeleton for transaction lists
 */

import React from 'react';
import Skeleton from './Skeleton';

interface TransactionListSkeletonProps {
  /**
   * Number of skeleton items to show
   * Default: 5
   */
  count?: number;
}

export default function TransactionListSkeleton({ count = 5 }: TransactionListSkeletonProps) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          {/* Left side: Icon + Details */}
          <div className="flex items-center gap-3 flex-1">
            <Skeleton circle width={40} height={40} />
            <div className="flex-1">
              <Skeleton width="60%" height="16px" className="mb-2" />
              <Skeleton width="40%" height="12px" />
            </div>
          </div>

          {/* Right side: Amount + Status */}
          <div className="flex items-center gap-3">
            <Skeleton width="80px" height="20px" />
            <Skeleton width="60px" height="24px" rounded="full" />
          </div>
        </div>
      ))}
    </div>
  );
}
