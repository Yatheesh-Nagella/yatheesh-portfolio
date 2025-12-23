/**
 * Account Card Skeleton
 * Loading skeleton for account cards
 */

import React from 'react';
import Skeleton from './Skeleton';

export default function AccountCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton circle width={40} height={40} />
          <div>
            <Skeleton width="120px" height="16px" className="mb-2" />
            <Skeleton width="80px" height="12px" />
          </div>
        </div>
        <Skeleton width="60px" height="20px" rounded="full" />
      </div>

      <div className="mb-4">
        <Skeleton width="60px" height="12px" className="mb-2" />
        <Skeleton width="140px" height="28px" />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <Skeleton width="80px" height="32px" rounded="lg" />
        <Skeleton width="80px" height="32px" rounded="lg" />
      </div>
    </div>
  );
}
