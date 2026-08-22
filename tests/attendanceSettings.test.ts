import assert from 'node:assert/strict';
import test from 'node:test';
import { isWeekendDate, isWorkingDay, isLateArrival } from '../lib/dateUtils.ts';
import { getEffectiveStatus, computeAttendanceSummary } from '../lib/attendanceCalculator.ts';
import type { AttendanceRecord, OfficeSettings } from '../types/attendance.ts';

const SAT = '2025-06-07';
const SUN = '2025-06-08';
const MON = '2025-06-09';

function makeSettings(overrides: Partial<OfficeSettings> = {}): OfficeSettings {
  return {
    startTime: '09:00',
    endTime: '18:00',
    lateThresholdMinutes: 15,
    weekendDays: [0, 6],
    workHoursPerDay: 8,
    ...overrides,
  };
}

test('isWeekendDate honors a custom weekendDays configuration instead of assuming Sat/Sun', () => {
  const defaultSettings = makeSettings();
  assert.equal(isWeekendDate(SAT, defaultSettings.weekendDays), true);
  assert.equal(isWeekendDate(MON, defaultSettings.weekendDays), false);

  const fridaySaturdayWeekend = [5, 6];
  assert.equal(isWeekendDate(SAT, fridaySaturdayWeekend), true);
  assert.equal(isWeekendDate(SUN, fridaySaturdayWeekend), false);
  assert.equal(isWorkingDay(SUN, fridaySaturdayWeekend), true);
});

test('getEffectiveStatus recomputes Late vs Present from the live lateThresholdMinutes, not the baked-in status', () => {
  const record: AttendanceRecord = {
    id: 'att_test_1',
    employeeId: 'e1',
    date: MON,
    status: 'Present',
    checkIn: '09:20',
    checkOut: '18:00',
    workHours: 8.7,
  };

  const strictSettings = makeSettings({ lateThresholdMinutes: 15 });
  assert.equal(isLateArrival('09:20', strictSettings), true);
  assert.equal(getEffectiveStatus(record, strictSettings), 'Late');

  const relaxedSettings = makeSettings({ lateThresholdMinutes: 30 });
  assert.equal(isLateArrival('09:20', relaxedSettings), false);
  assert.equal(getEffectiveStatus(record, relaxedSettings), 'Present');
});

test('getEffectiveStatus leaves non check-in statuses (Absent, Leave, Holiday, Weekend) untouched', () => {
  const leaveRecord: AttendanceRecord = {
    id: 'att_test_2', employeeId: 'e1', date: MON, status: 'Leave', leaveRequestId: 'lr1',
  };
  const settings = makeSettings({ lateThresholdMinutes: 0 });
  assert.equal(getEffectiveStatus(leaveRecord, settings), 'Leave');
});

test('computeAttendanceSummary reclassifies weekend/late counts when given custom settings', () => {
  const records: AttendanceRecord[] = [
    { id: 'a1', employeeId: 'e_sum', date: '2025-06-02', status: 'Present', checkIn: '09:20', checkOut: '18:00', workHours: 8.7 },
  ];

  const strict = computeAttendanceSummary('e_sum', 2025, 6, records, makeSettings({ lateThresholdMinutes: 15 }));
  assert.equal(strict.late, 1);
  assert.equal(strict.present, 0);

  const relaxed = computeAttendanceSummary('e_sum', 2025, 6, records, makeSettings({ lateThresholdMinutes: 30 }));
  assert.equal(relaxed.late, 0);
  assert.equal(relaxed.present, 1);
});
