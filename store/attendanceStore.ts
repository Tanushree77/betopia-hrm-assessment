'use client';
import { create } from 'zustand';
import { parseISO, addDays, isAfter, format } from 'date-fns';
import type { AttendanceRecord } from '@/types/attendance';
import { ATTENDANCE_RECORDS } from '@/data/attendance';
import { OFFICE_SETTINGS } from '@/data/settings';
import { isWorkingDay } from '@/lib/dateUtils';
import type { UserRole } from '@/types/employee';

interface AttendanceStore {
  records: AttendanceRecord[];
  settings: typeof OFFICE_SETTINGS;

  getEmployeeRecords: (employeeId: string) => AttendanceRecord[];

  getMonthRecords: (employeeId: string, year: number, month: number) => AttendanceRecord[];

  getAllMonthRecords: (year: number, month: number) => AttendanceRecord[];

  updateSettings: (settings: typeof OFFICE_SETTINGS, actorRole: UserRole) => { success: boolean; error?: string };

  syncLeaveRecords: (
    employeeId: string,
    startDate: string,
    endDate: string,
    leaveRequestId: string,
    action: 'apply' | 'revert',
    isHalfDayStart?: boolean,
    isHalfDayEnd?: boolean,
  ) => void;
}
export const useAttendanceStore = create<AttendanceStore>()((set, get) => ({
  records: [...ATTENDANCE_RECORDS],
  settings: OFFICE_SETTINGS,
  getEmployeeRecords: (employeeId) =>
    get().records.filter(r => r.employeeId === employeeId),
  getMonthRecords: (employeeId, year, month) => {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    return get().records.filter(
      r => r.employeeId === employeeId && r.date.startsWith(prefix),
    );
  },
  getAllMonthRecords: (year, month) => {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    return get().records.filter(r => r.date.startsWith(prefix));
  },
  updateSettings: (settings, actorRole) => {
    if (actorRole !== 'admin') return { success: false, error: 'Unauthorized.' };
    set({ settings });
    return { success: true };
  },

  syncLeaveRecords: (employeeId, startDate, endDate, leaveRequestId, action, isHalfDayStart, isHalfDayEnd) => {
    if (action === 'revert') {
      set(state => ({
        records: state.records.filter(r => r.leaveRequestId !== leaveRequestId),
      }));
      return;
    }
    const { settings } = get();
    const leaveDates: string[] = [];
    let current = parseISO(startDate);
    const end = parseISO(endDate);
    while (!isAfter(current, end)) {
      const dateStr = format(current, 'yyyy-MM-dd');
      if (isWorkingDay(dateStr, settings.weekendDays)) leaveDates.push(dateStr);
      current = addDays(current, 1);
    }
    const leaveDateSet = new Set(leaveDates);

    set(state => {
      const kept = state.records.filter(
        r => !(r.employeeId === employeeId && leaveDateSet.has(r.date)),
      );
      const newRecords: AttendanceRecord[] = leaveDates.map(date => ({
        id: `att_leave_${employeeId}_${date.replace(/-/g, '')}`,
        employeeId,
        date,
        status:
          (date === startDate && isHalfDayStart) || (date === endDate && isHalfDayEnd)
            ? 'Half Day'
            : 'Leave',
        leaveRequestId,
      }));
      return { records: [...kept, ...newRecords] };
    });
  },
}));