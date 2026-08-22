import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateLeaveDays,
  detectOverlap,
  validateStatusTransition,
  validateLeaveRequest,
} from '../lib/leaveCalculator.ts';
import type { LeaveRequest } from '../types/leave.ts';
import type { Employee } from '../types/employee.ts';

const MON = '2025-06-02';
const TUE = '2025-06-03';
const WED = '2025-06-04';
const SAT = '2025-06-07';

function makeEmployee(overrides: Partial<Employee> = {}): Employee {
  return {
    id: 'e_test',
    firstName: 'Test',
    lastName: 'User',
    email: 'test.user@betopia.com',
    phone: '+1-555-0000',
    avatarInitials: 'TU',
    avatarColor: '#3b82f6',
    departmentId: 'd1',
    jobTitle: 'QA Engineer',
    role: 'employee',
    status: 'Active',
    gender: 'Other',
    joinDate: '2020-01-01',
    salary: 60000,
    ...overrides,
  };
}

function makeRequest(overrides: Partial<LeaveRequest> = {}): LeaveRequest {
  return {
    id: 'lr_test',
    employeeId: 'e_test',
    leaveTypeId: 'lt1',
    startDate: MON,
    endDate: WED,
    isHalfDayStart: false,
    isHalfDayEnd: false,
    totalDays: 3,
    status: 'Pending',
    reason: 'Test leave',
    appliedAt: new Date().toISOString(),
    ...overrides,
  };
}

test('calculateLeaveDays counts a full working-day range with no half days', () => {
  assert.equal(calculateLeaveDays(MON, WED, false, false), 3);
});

test('calculateLeaveDays subtracts half a day when the start day is a half day', () => {
  assert.equal(calculateLeaveDays(MON, WED, true, false), 2.5);
});

test('calculateLeaveDays subtracts half a day when the end day is a half day', () => {
  assert.equal(calculateLeaveDays(MON, WED, false, true), 2.5);
});

test('calculateLeaveDays treats a single half day as 0.5 days', () => {
  assert.equal(calculateLeaveDays(MON, MON, true, false), 0.5);
});

test('calculateLeaveDays returns 0 for a range with no working days (weekend only)', () => {
  assert.equal(calculateLeaveDays(SAT, SAT, false, false), 0);
});

test('detectOverlap finds an overlapping Approved or Pending request for the same employee', () => {
  const existing = [
    makeRequest({ id: 'lr_a', employeeId: 'e_test', startDate: TUE, endDate: WED, status: 'Approved' }),
  ];
  const overlap = detectOverlap('e_test', MON, TUE, existing);
  assert.equal(overlap?.id, 'lr_a');
});

test('detectOverlap ignores requests for a different employee', () => {
  const existing = [
    makeRequest({ id: 'lr_a', employeeId: 'someone_else', startDate: TUE, endDate: WED, status: 'Approved' }),
  ];
  assert.equal(detectOverlap('e_test', MON, TUE, existing), null);
});

test('detectOverlap ignores Rejected and Cancelled requests', () => {
  const existing = [
    makeRequest({ id: 'lr_a', employeeId: 'e_test', startDate: MON, endDate: WED, status: 'Rejected' }),
    makeRequest({ id: 'lr_b', employeeId: 'e_test', startDate: MON, endDate: WED, status: 'Cancelled' }),
  ];
  assert.equal(detectOverlap('e_test', MON, WED, existing), null);
});

test('detectOverlap excludes the request being edited via excludeRequestId', () => {
  const existing = [
    makeRequest({ id: 'lr_self', employeeId: 'e_test', startDate: MON, endDate: WED, status: 'Pending' }),
  ];
  assert.equal(detectOverlap('e_test', MON, WED, existing, 'lr_self'), null);
});

test('validateStatusTransition allows the documented Pending transitions', () => {
  assert.equal(validateStatusTransition('Pending', 'Approved'), null);
  assert.equal(validateStatusTransition('Pending', 'Rejected'), null);
  assert.equal(validateStatusTransition('Pending', 'Cancelled'), null);
});

test('validateStatusTransition allows Approved to Cancelled', () => {
  assert.equal(validateStatusTransition('Approved', 'Cancelled'), null);
});

test('validateStatusTransition rejects re-approving or re-rejecting an Approved request', () => {
  assert.match(validateStatusTransition('Approved', 'Approved') ?? '', /Cannot transition/);
  assert.match(validateStatusTransition('Approved', 'Rejected') ?? '', /Cannot transition/);
});

test('validateStatusTransition rejects any transition out of a terminal Rejected or Cancelled state', () => {
  assert.match(validateStatusTransition('Rejected', 'Approved') ?? '', /Cannot transition/);
  assert.match(validateStatusTransition('Rejected', 'Pending') ?? '', /Cannot transition/);
  assert.match(validateStatusTransition('Cancelled', 'Approved') ?? '', /Cannot transition/);
});

test('validateLeaveRequest rejects a start date before the employee joined', () => {
  const employee = makeEmployee({ joinDate: '2025-06-03' });
  const error = validateLeaveRequest({
    employee,
    startDate: MON,
    endDate: WED,
    leaveTypeId: 'lt1',
    isHalfDayStart: false,
    isHalfDayEnd: false,
    existingRequests: [],
  });
  assert.match(error ?? '', /joining date/);
});

test('validateLeaveRequest rejects a range extending beyond the resignation date', () => {
  const employee = makeEmployee({ resignDate: TUE });
  const error = validateLeaveRequest({
    employee,
    startDate: MON,
    endDate: WED,
    leaveTypeId: 'lt1',
    isHalfDayStart: false,
    isHalfDayEnd: false,
    existingRequests: [],
  });
  assert.match(error ?? '', /resignation date/);
});

test('validateLeaveRequest rejects a range with zero working days', () => {
  const employee = makeEmployee();
  const error = validateLeaveRequest({
    employee,
    startDate: SAT,
    endDate: SAT,
    leaveTypeId: 'lt1',
    isHalfDayStart: false,
    isHalfDayEnd: false,
    existingRequests: [],
  });
  assert.match(error ?? '', /zero working days/);
});

test('validateLeaveRequest rejects a request that exceeds the remaining balance', () => {
  const employee = makeEmployee();
  const existingRequests: LeaveRequest[] = [
    makeRequest({
      id: 'lr_used',
      leaveTypeId: 'lt1',
      status: 'Approved',
      totalDays: 19,
      startDate: '2025-01-06',
      endDate: '2025-01-24',
    }),
  ];
  const error = validateLeaveRequest({
    employee,
    startDate: MON,
    endDate: WED,
    leaveTypeId: 'lt1',
    isHalfDayStart: false,
    isHalfDayEnd: false,
    existingRequests,
  });
  assert.match(error ?? '', /Insufficient leave balance/);
});

test('validateLeaveRequest rejects a request overlapping an existing active request', () => {
  const employee = makeEmployee();
  const existingRequests: LeaveRequest[] = [
    makeRequest({ id: 'lr_existing', startDate: TUE, endDate: WED, status: 'Pending', totalDays: 2 }),
  ];
  const error = validateLeaveRequest({
    employee,
    startDate: MON,
    endDate: TUE,
    leaveTypeId: 'lt1',
    isHalfDayStart: false,
    isHalfDayEnd: false,
    existingRequests,
  });
  assert.match(error ?? '', /overlaps/);
});

test('validateLeaveRequest returns null for a valid, non-overlapping request within balance', () => {
  const employee = makeEmployee();
  const error = validateLeaveRequest({
    employee,
    startDate: MON,
    endDate: WED,
    leaveTypeId: 'lt1',
    isHalfDayStart: false,
    isHalfDayEnd: false,
    existingRequests: [],
  });
  assert.equal(error, null);
});
