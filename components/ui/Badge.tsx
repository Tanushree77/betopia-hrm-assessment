'use client';

import React from 'react';
import { cn, ATTENDANCE_STATUS_CLASS, LEAVE_STATUS_CLASS, EMPLOYEE_STATUS_CLASS } from '@/lib/utils';
import type { AttendanceStatus } from '@/types/attendance';
import type { LeaveRequestStatus } from '@/types/leave';
import type { EmployeeStatus, UserRole } from '@/types/employee';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'attendance' | 'leave' | 'employee' | 'role';
  status?: AttendanceStatus | LeaveRequestStatus | EmployeeStatus | UserRole | string;
  dot?: boolean;
}

export function Badge({
  className,
  variant = 'default',
  status,
  dot = false,
  children,
  ...props
}: BadgeProps) {
  let statusClass = 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  if (variant === 'attendance' && status) {
    statusClass = ATTENDANCE_STATUS_CLASS[status as AttendanceStatus] || statusClass;
  } else if (variant === 'leave' && status) {
    statusClass = LEAVE_STATUS_CLASS[status as LeaveRequestStatus] || statusClass;
  } else if (variant === 'employee' && status) {
    statusClass = EMPLOYEE_STATUS_CLASS[status as EmployeeStatus] || statusClass;
  } else if (variant === 'role') {
    statusClass = status === 'admin'
      ? 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30'
      : 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30';
  } else if (variant === 'outline') {
    statusClass = 'bg-transparent text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600';
  }

  return (
    <span
      className={cn(
        'badge inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusClass,
        className
      )}
      {...props}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      )}
      {children || status}
    </span>
  );
}
