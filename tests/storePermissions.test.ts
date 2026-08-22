import assert from 'node:assert/strict';
import test from 'node:test';
import { useLeaveStore } from '../store/leaveStore.ts';
import { useAttendanceStore } from '../store/attendanceStore.ts';
import { useEmployeeStore } from '../store/employeeStore.ts';
import type { Employee } from '../types/employee.ts';

test('leaveStore.updateStatus rejects a non-admin actor and leaves the request untouched', () => {
  const before = useLeaveStore.getState().requests.find(r => r.id === 'lr11');
  assert.equal(before?.status, 'Pending');

  const result = useLeaveStore.getState().updateStatus('lr11', 'Approved', 'employee');

  assert.deepEqual(result, { success: false, error: 'Unauthorized.' });
  const after = useLeaveStore.getState().requests.find(r => r.id === 'lr11');
  assert.equal(after?.status, 'Pending');
});

test('leaveStore.updateStatus allows an admin actor to approve a pending request', () => {
  const result = useLeaveStore.getState().updateStatus('lr12', 'Approved', 'admin', 'e1', 'Looks good');

  assert.deepEqual(result, { success: true });
  const after = useLeaveStore.getState().requests.find(r => r.id === 'lr12');
  assert.equal(after?.status, 'Approved');
  assert.equal(after?.reviewedBy, 'e1');
});

test('leaveStore.updateStatus still enforces valid status transitions for admins', () => {
  const result = useLeaveStore.getState().updateStatus('lr16', 'Approved', 'admin');
  assert.equal(result.success, false);
  assert.match(result.error ?? '', /Cannot transition/);
});

test('leaveStore.submitRequest rejects a request whose employeeId does not match the requester', () => {
  const before = useLeaveStore.getState().requests.length;

  const result = useLeaveStore.getState().submitRequest(
    {
      employeeId: 'e2',
      leaveTypeId: 'lt1',
      startDate: '2025-07-07',
      endDate: '2025-07-07',
      isHalfDayStart: false,
      isHalfDayEnd: false,
      totalDays: 1,
      reason: 'Spoofed request.',
    },
    'e3',
  );

  assert.deepEqual(result, { success: false, error: 'Unauthorized.' });
  assert.equal(useLeaveStore.getState().requests.length, before);
});

test('leaveStore.submitRequest rejects a request from an employeeId that does not exist', () => {
  const before = useLeaveStore.getState().requests.length;

  const result = useLeaveStore.getState().submitRequest(
    {
      employeeId: 'e_does_not_exist',
      leaveTypeId: 'lt1',
      startDate: '2025-07-08',
      endDate: '2025-07-08',
      isHalfDayStart: false,
      isHalfDayEnd: false,
      totalDays: 1,
      reason: 'Ghost employee.',
    },
    'e_does_not_exist',
  );

  assert.deepEqual(result, { success: false, error: 'Employee not found.' });
  assert.equal(useLeaveStore.getState().requests.length, before);
});

test('leaveStore.submitRequest allows an employee to submit a request for themselves', () => {
  const before = useLeaveStore.getState().requests.length;

  const result = useLeaveStore.getState().submitRequest(
    {
      employeeId: 'e3',
      leaveTypeId: 'lt1',
      startDate: '2025-07-09',
      endDate: '2025-07-09',
      isHalfDayStart: false,
      isHalfDayEnd: false,
      totalDays: 1,
      reason: 'Legit request.',
    },
    'e3',
  );

  assert.equal(result.success, true);
  assert.equal(useLeaveStore.getState().requests.length, before + 1);
});

test('attendanceStore.updateSettings rejects a non-admin actor and leaves settings untouched', () => {
  const before = useAttendanceStore.getState().settings;

  const result = useAttendanceStore.getState().updateSettings(
    { ...before, startTime: '10:00' },
    'employee',
  );

  assert.deepEqual(result, { success: false, error: 'Unauthorized.' });
  assert.equal(useAttendanceStore.getState().settings.startTime, before.startTime);
});

test('attendanceStore.updateSettings allows an admin actor to update settings', () => {
  const before = useAttendanceStore.getState().settings;

  const result = useAttendanceStore.getState().updateSettings(
    { ...before, startTime: '08:30' },
    'admin',
  );

  assert.deepEqual(result, { success: true });
  assert.equal(useAttendanceStore.getState().settings.startTime, '08:30');
});

function makeEmployee(overrides: Partial<Employee> = {}): Employee {
  return {
    id: 'e_new_1',
    firstName: 'New',
    lastName: 'Hire',
    email: 'new.hire@betopia.com',
    phone: '+1-555-0111',
    avatarInitials: 'NH',
    avatarColor: '#10b981',
    departmentId: 'd1',
    jobTitle: 'Associate Engineer',
    role: 'employee',
    status: 'Active',
    gender: 'Other',
    joinDate: '2026-01-05',
    salary: 70000,
    ...overrides,
  };
}

test('employeeStore.addEmployee rejects a non-admin actor and does not add the employee', () => {
  const before = useEmployeeStore.getState().employees.length;

  const result = useEmployeeStore.getState().addEmployee(makeEmployee({ id: 'e_rejected' }), 'employee');

  assert.deepEqual(result, { success: false, error: 'Unauthorized.' });
  assert.equal(useEmployeeStore.getState().employees.length, before);
  assert.equal(useEmployeeStore.getState().getById('e_rejected'), undefined);
});

test('employeeStore.addEmployee allows an admin actor to add a new employee', () => {
  const before = useEmployeeStore.getState().employees.length;
  const newEmployee = makeEmployee({ id: 'e_added' });

  const result = useEmployeeStore.getState().addEmployee(newEmployee, 'admin');

  assert.deepEqual(result, { success: true });
  assert.equal(useEmployeeStore.getState().employees.length, before + 1);
  assert.deepEqual(useEmployeeStore.getState().getById('e_added'), newEmployee);
});

test('employeeStore.updateEmployee rejects a non-admin actor and leaves the profile untouched', () => {
  useEmployeeStore.getState().addEmployee(makeEmployee({ id: 'e_update_target', jobTitle: 'Original Title' }), 'admin');

  const result = useEmployeeStore.getState().updateEmployee(
    makeEmployee({ id: 'e_update_target', jobTitle: 'Hacked Title' }),
    'employee',
  );

  assert.deepEqual(result, { success: false, error: 'Unauthorized.' });
  assert.equal(useEmployeeStore.getState().getById('e_update_target')?.jobTitle, 'Original Title');
});

test('employeeStore.updateEmployee allows an admin actor to update an existing employee', () => {
  useEmployeeStore.getState().addEmployee(makeEmployee({ id: 'e_update_target_2', jobTitle: 'Original Title' }), 'admin');

  const result = useEmployeeStore.getState().updateEmployee(
    makeEmployee({ id: 'e_update_target_2', jobTitle: 'Promoted Title' }),
    'admin',
  );

  assert.deepEqual(result, { success: true });
  assert.equal(useEmployeeStore.getState().getById('e_update_target_2')?.jobTitle, 'Promoted Title');
});

test('employeeStore.updateEmployee rejects updates to an employee id that does not exist, even for an admin', () => {
  const result = useEmployeeStore.getState().updateEmployee(makeEmployee({ id: 'e_does_not_exist' }), 'admin');

  assert.deepEqual(result, { success: false, error: 'Employee not found.' });
});
