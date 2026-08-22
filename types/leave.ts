
export type LeaveRequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

export interface LeaveType {
  id: string;
  name: string;
  totalDaysPerYear: number;
  color: string;
  description: string;
  isPaid: boolean;
  requiresDocument: boolean;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  isHalfDayStart: boolean;
  isHalfDayEnd: boolean;
  totalDays: number;
  status: LeaveRequestStatus;
  reason: string;
  attachmentUrl?: string;
  appliedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
  cancelledAt?: string;
}

export interface LeaveBalance {
  employeeId: string;
  leaveTypeId: string;
  year: number;
  total: number;
  used: number;
  pending: number;
  remaining: number;
}

export interface LeaveBalanceSummary {
  leaveType: LeaveType;
  balance: LeaveBalance;
}
