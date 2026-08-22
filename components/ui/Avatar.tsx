'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  initials?: string;
  name?: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
}

export function Avatar({
  className,
  initials,
  name,
  color,
  size = 'md',
  online,
  ...props
}: AvatarProps) {
  const displayInitials =
    initials ||
    (name
      ? name
          .split(' ')
          .map(n => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()
      : 'U');

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          'avatar rounded-full font-bold flex items-center justify-center text-white select-none shadow-sm',
          sizeClasses[size],
          className
        )}
        style={{
          background: color || 'var(--gradient-purple)',
        }}
        {...props}
      >
        {displayInitials}
      </div>
      {online !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-[#111827]',
            online ? 'bg-emerald-500' : 'bg-slate-500',
            size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'
          )}
        />
      )}
    </div>
  );
}
