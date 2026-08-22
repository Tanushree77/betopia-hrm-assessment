import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { AttendanceStatus } from '@/types/attendance';
import type { LeaveRequestStatus } from '@/types/leave';
import type { EmployeeStatus } from '@/types/employee';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ATTENDANCE_STATUS_CLASS: Record<AttendanceStatus, string> = {
  Present:   'status-present',
  Late:      'status-late',
  'Half Day':'status-halfday',
  Absent:    'status-absent',
  Leave:     'status-leave',
  Holiday:   'status-holiday',
  Weekend:   'status-weekend',
};

export const LEAVE_STATUS_CLASS: Record<LeaveRequestStatus, string> = {
  Pending:   'req-pending',
  Approved:  'req-approved',
  Rejected:  'req-rejected',
  Cancelled: 'req-cancelled',
};

export const EMPLOYEE_STATUS_CLASS: Record<EmployeeStatus, string> = {
  Active:     'emp-active',
  Resigned:   'emp-resigned',
  'On Leave': 'emp-on-leave',
};

export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
