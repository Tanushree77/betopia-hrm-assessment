import assert from 'node:assert/strict';
import test from 'node:test';
import { useLeaveStore } from '../store/leaveStore.ts';
import { useAttendanceStore } from '../store/attendanceStore.ts';

test('approving a leave request marks the requested working days Leave in attendanceStore, skipping weekends', () => {
  const submit = useLeaveStore.getState().submitRequest(
    {
      employeeId: 'e3',
      leaveTypeId: 'lt1',
      startDate: '2025-05-05',
      endDate: '2025-05-11',
      isHalfDayStart: false,
      isHalfDayEnd: false,
      totalDays: 5,
      reason: 'Vacation.',
    },
    'e3',
  );
  assert.equal(submit.success, true);
  const requestId = submit.id!;

  const result = useLeaveStore.getState().updateStatus(requestId, 'Approved', 'admin');
  assert.deepEqual(result, { success: true });

  const records = useAttendanceStore.getState().getEmployeeRecords('e3');
  const leaveRecords = records.filter(r => r.leaveRequestId === requestId);
  const leaveDates = leaveRecords.map(r => r.date).sort();

  assert.deepEqual(leaveDates, ['2025-05-05', '2025-05-06', '2025-05-07', '2025-05-08', '2025-05-09']);
  assert.ok(leaveRecords.every(r => r.status === 'Leave'));

  assert.equal(records.some(r => r.date === '2025-05-10' && r.leaveRequestId === requestId), false);
  assert.equal(records.some(r => r.date === '2025-05-11' && r.leaveRequestId === requestId), false);
});

test('cancelling an approved leave request reverts its Leave attendance records', () => {
  const submit = useLeaveStore.getState().submitRequest(
    {
      employeeId: 'e6',
      leaveTypeId: 'lt1',
      startDate: '2025-06-02',
      endDate: '2025-06-03',
      isHalfDayStart: false,
      isHalfDayEnd: false,
      totalDays: 2,
      reason: 'Short trip.',
    },
    'e6',
  );
  const requestId = submit.id!;

  useLeaveStore.getState().updateStatus(requestId, 'Approved', 'admin');
  assert.equal(
    useAttendanceStore.getState().records.filter(r => r.leaveRequestId === requestId).length,
    2,
  );

  const cancelResult = useLeaveStore.getState().cancelRequest(requestId, 'e6');
  assert.deepEqual(cancelResult, { success: true });

  assert.equal(
    useAttendanceStore.getState().records.filter(r => r.leaveRequestId === requestId).length,
    0,
  );
});

test('rejecting a pending leave request does not create any attendance records', () => {
  const submit = useLeaveStore.getState().submitRequest(
    {
      employeeId: 'e7',
      leaveTypeId: 'lt1',
      startDate: '2025-06-09',
      endDate: '2025-06-09',
      isHalfDayStart: false,
      isHalfDayEnd: false,
      totalDays: 1,
      reason: 'Personal.',
    },
    'e7',
  );
  const requestId = submit.id!;

  const result = useLeaveStore.getState().updateStatus(requestId, 'Rejected', 'admin');
  assert.deepEqual(result, { success: true });

  assert.equal(
    useAttendanceStore.getState().records.some(r => r.leaveRequestId === requestId),
    false,
  );
});

test('overwriting an existing attendance record with a Leave record replaces the prior status for that date', () => {
  const before = useAttendanceStore.getState().getEmployeeRecords('e1').find(r => r.date === '2025-01-02');
  assert.equal(before?.status, 'Present');

  const submit = useLeaveStore.getState().submitRequest(
    {
      employeeId: 'e1',
      leaveTypeId: 'lt1',
      startDate: '2025-01-02',
      endDate: '2025-01-02',
      isHalfDayStart: false,
      isHalfDayEnd: false,
      totalDays: 1,
      reason: 'Retroactive correction.',
    },
    'e1',
  );
  const requestId = submit.id!;
  useLeaveStore.getState().updateStatus(requestId, 'Approved', 'admin');

  const after = useAttendanceStore.getState().getEmployeeRecords('e1').find(r => r.date === '2025-01-02');
  assert.equal(after?.status, 'Leave');
  assert.equal(after?.leaveRequestId, requestId);
});
