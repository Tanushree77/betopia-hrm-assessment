import type { LeaveRequest, LeaveBalance, LeaveBalanceSummary } from '@/types/leave';
import type { Employee } from '@/types/employee';
import { LEAVE_TYPES } from '@/data/leaveTypes';
import { countWorkingDays, dateRangesOverlap, isWorkingDay } from '@/lib/dateUtils';

export function calculateLeaveDays(
  startDate: string,
  endDate: string,
  isHalfDayStart: boolean,
  isHalfDayEnd: boolean,
): number {
  const workingDays = countWorkingDays(startDate, endDate);
  if (workingDays === 0) return 0;
  let days = workingDays;
  if (startDate === endDate && isHalfDayStart) {
    return 0.5;
  }
  if (isHalfDayStart && isWorkingDay(startDate)) days -= 0.5;
  if (isHalfDayEnd && isWorkingDay(endDate) && endDate !== startDate) days -= 0.5;
  return Math.max(0, days);
}

export function detectOverlap(
  employeeId: string,
  startDate: string,
  endDate: string,
  existingRequests: LeaveRequest[],
  excludeRequestId?: string,
): LeaveRequest | null {
  const active = existingRequests.filter(
    r =>
      r.employeeId === employeeId &&
      (r.status === 'Pending' || r.status === 'Approved') &&
      r.id !== excludeRequestId,
  );
  for (const req of active) {
    if (dateRangesOverlap(startDate, endDate, req.startDate, req.endDate)) {
      return req;
    }
  }
  return null;
}
export function computeLeaveBalances(
  employee: Employee,
  allRequests: LeaveRequest[],
  year: number,
): LeaveBalanceSummary[] {
  const empRequests = allRequests.filter(
    r =>
      r.employeeId === employee.id &&
      new Date(r.startDate).getFullYear() === year,
  );
  return LEAVE_TYPES.map(lt => {
    const typeRequests = empRequests.filter(r => r.leaveTypeId === lt.id);
    const used = typeRequests
      .filter(r => r.status === 'Approved')
      .reduce((sum, r) => sum + r.totalDays, 0);
    const pending = typeRequests
      .filter(r => r.status === 'Pending')
      .reduce((sum, r) => sum + r.totalDays, 0);

    const balance: LeaveBalance = {
      employeeId: employee.id,
      leaveTypeId: lt.id,
      year,
      total: lt.totalDaysPerYear,
      used,
      pending,
      remaining: Math.max(0, lt.totalDaysPerYear - used - pending),
    };
    return { leaveType: lt, balance };
  });
}
export function validateLeaveRequest(params: {
  employee: Employee;
  startDate: string;
  endDate: string;
  leaveTypeId: string;
  isHalfDayStart: boolean;
  isHalfDayEnd: boolean;
  existingRequests: LeaveRequest[];
  excludeRequestId?: string;
}): string | null {
  const { employee, startDate, endDate, leaveTypeId, isHalfDayStart, isHalfDayEnd, existingRequests, excludeRequestId } = params;
  if (!startDate || !endDate) return 'Start date and end date are required.';
  if (startDate > endDate) return 'Start date must be before or equal to end date.';
  if (startDate < employee.joinDate) {
    return `Leave cannot start before your joining date (${employee.joinDate}).`;
  }
  if (employee.resignDate && endDate > employee.resignDate) {
    return `Leave cannot extend beyond your resignation date (${employee.resignDate}).`;
  }
  const days = calculateLeaveDays(startDate, endDate, isHalfDayStart, isHalfDayEnd);
  if (days <= 0) return 'Selected dates result in zero working days. Check for weekends/holidays.';
  const leaveType = LEAVE_TYPES.find(lt => lt.id === leaveTypeId);
  if (!leaveType) return 'Invalid leave type selected.';
  const balances = computeLeaveBalances(employee, existingRequests, new Date(startDate).getFullYear());
  const bal = balances.find(b => b.leaveType.id === leaveTypeId);
  if (bal && bal.balance.remaining < days) {
    return `Insufficient leave balance. You have ${bal.balance.remaining} day(s) remaining for ${leaveType.name}.`;
  }
  const overlap = detectOverlap(employee.id, startDate, endDate, existingRequests, excludeRequestId);
  if (overlap) {
    return `This overlaps with an existing ${overlap.status.toLowerCase()} leave request (${overlap.startDate} – ${overlap.endDate}).`;
  }
  return null;
}
export function validateStatusTransition(
  current: LeaveRequest['status'],
  next: LeaveRequest['status'],
): string | null {
  const allowed: Record<LeaveRequest['status'], LeaveRequest['status'][]> = {
    Pending: ['Approved', 'Rejected', 'Cancelled'],
    Approved: ['Cancelled'],
    Rejected: [],
    Cancelled: [],
  };
  if (!allowed[current].includes(next)) {
    return `Cannot transition from ${current} to ${next}.`;
  }
  return null;
}