
export type AttendanceStatus =
  | 'Present'
  | 'Late'
  | 'Half Day'
  | 'Absent'
  | 'Leave'
  | 'Holiday'
  | 'Weekend';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  workHours?: number;
  notes?: string;
  leaveRequestId?: string;
}

export interface AttendanceSummary {
  employeeId: string;
  month: number;
  year: number;
  totalWorkingDays: number;
  present: number;
  late: number;
  halfDay: number;
  absent: number;
  leave: number;
  holiday: number;
  weekend: number;
  attendancePercentage: number;
}

export interface Holiday {
  id: string;
  date: string;
  name: string;
  type: 'National' | 'Optional' | 'Company';
}

export interface OfficeSettings {
  startTime: string;
  endTime: string;
  lateThresholdMinutes: number;
  weekendDays: number[];
  workHoursPerDay: number;
}
