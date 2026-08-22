import type { AttendanceRecord, AttendanceStatus, AttendanceSummary, OfficeSettings } from '@/types/attendance';
import { getDaysInMonth, isWeekendDate, isHolidayDate, isLateArrival } from '@/lib/dateUtils';
import { OFFICE_SETTINGS } from '@/data/settings';

export function getEffectiveStatus(record: AttendanceRecord, settings: OfficeSettings): AttendanceStatus {
  if ((record.status === 'Present' || record.status === 'Late') && record.checkIn) {
    return isLateArrival(record.checkIn, settings) ? 'Late' : 'Present';
  }
  return record.status;
}
export function computeAttendanceSummary(
  employeeId: string,
  year: number,
  month: number,
  records: AttendanceRecord[],
  settings: OfficeSettings = OFFICE_SETTINGS,
): AttendanceSummary {
  const days = getDaysInMonth(year, month);
  const empRecords = new Map(
    records
      .filter(r => r.employeeId === employeeId)
      .map(r => [r.date, r]),
  );
  let present = 0, late = 0, halfDay = 0, absent = 0, leave = 0, holiday = 0, weekend = 0;
  let totalWorkingDays = 0;
  for (const day of days) {
    const rec = empRecords.get(day);
    const status = rec
      ? getEffectiveStatus(rec, settings)
      : (isWeekendDate(day, settings.weekendDays) ? 'Weekend' : isHolidayDate(day) ? 'Holiday' : 'Absent');
    switch (status) {
      case 'Present':  present++;  totalWorkingDays++; break;
      case 'Late':     late++;     totalWorkingDays++; break;
      case 'Half Day': halfDay++;  totalWorkingDays++; break;
      case 'Absent':   absent++;   totalWorkingDays++; break;
      case 'Leave':    leave++;    totalWorkingDays++; break;
      case 'Holiday':  holiday++;  break;
      case 'Weekend':  weekend++;  break;
    }
  }
  const attendanceDays = present + late + halfDay * 0.5;
  const attendancePercentage = totalWorkingDays > 0
    ? parseFloat(((attendanceDays / totalWorkingDays) * 100).toFixed(1))
    : 0;
  return {
    employeeId,
    month,
    year,
    totalWorkingDays,
    present,
    late,
    halfDay,
    absent,
    leave,
    holiday,
    weekend,
    attendancePercentage,
  };
}
export function getAvailableMonths(records: AttendanceRecord[]): { year: number; month: number }[] {
  const set = new Set(records.map(r => r.date.substring(0, 7)));
  return Array.from(set)
    .sort()
    .map(ym => {
      const [y, m] = ym.split('-').map(Number);
      return { year: y, month: m };
    });
}