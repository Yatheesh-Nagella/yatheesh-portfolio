/**
 * Base Skeleton Component
 * Reusable skeleton loader with shimmer animation
 */

import React from 'react';

interface SkeletonProps {
  /**
   * Width of the skeleton
   * Can be any valid CSS width value
   */
  width?: string | number;

  /**
   * Height of the skeleton
   * Can be any valid CSS height value
   */
  height?: string | number;

  /**
   * Border radius
   * Default: 'md' (0.375rem)
   */
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Whether this is a circle (for avatars, etc.)
   */
  circle?: boolean;
}

const roundedClasses = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

/**
 * Skeleton loader with shimmer animation
 *
 * @example
 * ```tsx
 * <Skeleton width="100%" height="20px" />
 * <Skeleton width={200} height={40} rounded="lg" />
 * <Skeleton circle width={48} height={48} />
 * ```
 */
export default function Skeleton({
  width = '100%',
  height = '1rem',
  rounded = 'md',
  className = '',
  circle = false,
}: SkeletonProps) {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const roundedClass = circle ? 'rounded-full' : roundedClasses[rounded];

  return (
    <div
      className={`
        bg-gray-200 dark:bg-gray-700
        ${roundedClass}
        ${className}
        animate-pulse
      `}
      style={style}
      aria-hidden="true"
    />
  );
}
