import { format, parseISO, differenceInCalendarDays, addDays, isBefore, isAfter } from 'date-fns';
import { HOLIDAYS } from '@/data/settings';
import { OFFICE_SETTINGS } from '@/data/settings';

export const HOLIDAY_SET: Set<string> = new Set(HOLIDAYS.map(h => h.date));

export function formatDate(date: string, fmt = 'MMM d, yyyy'): string {
  return format(parseISO(date), fmt);
}

export function formatDateTime(dt: string): string {
  return format(parseISO(dt), 'MMM d, yyyy · h:mm a');
}

export function isWeekendDate(date: string, weekendDays: number[] = OFFICE_SETTINGS.weekendDays): boolean {
  const d = parseISO(date);
  return weekendDays.includes(d.getDay());
}
export function isHolidayDate(date: string): boolean {
  return HOLIDAY_SET.has(date);
}

export function isWorkingDay(date: string, weekendDays: number[] = OFFICE_SETTINGS.weekendDays): boolean {
  return !isWeekendDate(date, weekendDays) && !isHolidayDate(date);
}

export function countWorkingDays(
  startDate: string,
  endDate: string,
  weekendDays: number[] = OFFICE_SETTINGS.weekendDays,
): number {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  if (isAfter(start, end)) return 0;
  let count = 0;
  let current = start;
  while (!isAfter(current, end)) {
    const dateStr = format(current, 'yyyy-MM-dd');
    if (isWorkingDay(dateStr, weekendDays)) count++;
    current = addDays(current, 1);
  }
  return count;
}
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}
export function isLateArrival(
  checkIn: string,
  officeHours: Pick<import('@/types/attendance').OfficeSettings, 'startTime' | 'lateThresholdMinutes'> = OFFICE_SETTINGS,
): boolean {
  const start = timeToMinutes(officeHours.startTime);
  const threshold = start + officeHours.lateThresholdMinutes;
  return timeToMinutes(checkIn) > threshold;
}
export function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd');
}
export function currentYear(): number {
  return new Date().getFullYear();
}

export function currentMonth(): number {
  return new Date().getMonth() + 1;
}

export function getDaysInMonth(year: number, month: number): string[] {
  const days: string[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(`${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`);
  }
  return days;
}

export function dateRangesOverlap(
  start1: string, end1: string,
  start2: string, end2: string,
): boolean {
  const s1 = parseISO(start1), e1 = parseISO(end1);
  const s2 = parseISO(start2), e2 = parseISO(end2);
  return !isAfter(s1, e2) && !isBefore(e1, s2);
}

export function isBeforeDate(a: string, b: string): boolean {
  return isBefore(parseISO(a), parseISO(b));
}
export function isAfterDate(a: string, b: string): boolean {
  return isAfter(parseISO(a), parseISO(b));
}

export function getMonthName(month: number, year: number): string {
  return format(new Date(year, month - 1, 1), 'MMMM yyyy');
}

export function getShortMonthName(month: number): string {
  return format(new Date(2025, month - 1, 1), 'MMM');
}

export function relativeTime(isoDate: string): string {
  const diff = differenceInCalendarDays(new Date(), parseISO(isoDate));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
  return formatDate(isoDate);
}
