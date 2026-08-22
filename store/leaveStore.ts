'use client';
import { create } from 'zustand';
import type { LeaveRequest, LeaveRequestStatus } from '@/types/leave';
import { LEAVE_REQUESTS } from '@/data/leaveRequests';
import { validateStatusTransition } from '@/lib/leaveCalculator';
import { generateId } from '@/lib/utils';
import { useAttendanceStore } from '@/store/attendanceStore';
import { useEmployeeStore } from '@/store/employeeStore';
import type { UserRole } from '@/types/employee';

interface LeaveStore {
  requests: LeaveRequest[];

  submitRequest: (
    req: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'>,
    requesterId: string,
  ) => { success: boolean; error?: string; id?: string };
  updateStatus: (
    requestId: string,
    status: LeaveRequestStatus,
    actorRole: UserRole,
    reviewedBy?: string,
    reviewNote?: string,
  ) => { success: boolean; error?: string };
  cancelRequest: (requestId: string, employeeId: string) => { success: boolean; error?: string };
  getEmployeeRequests: (employeeId: string) => LeaveRequest[];

  getPendingRequests: () => LeaveRequest[];
}
export const useLeaveStore = create<LeaveStore>()((set, get) => ({
  requests: [...LEAVE_REQUESTS],
  submitRequest: (req, requesterId) => {
    if (req.employeeId !== requesterId) return { success: false, error: 'Unauthorized.' };
    if (!useEmployeeStore.getState().getById(requesterId)) {
      return { success: false, error: 'Employee not found.' };
    }

    const id = generateId('lr');
    const newReq: LeaveRequest = {
      ...req,
      id,
      status: 'Pending',
      appliedAt: new Date().toISOString(),
    };
    set(state => ({ requests: [newReq, ...state.requests] }));
    return { success: true, id };
  },
  updateStatus: (requestId, status, actorRole, reviewedBy, reviewNote) => {
    if (actorRole !== 'admin') return { success: false, error: 'Unauthorized.' };
    const { requests } = get();
    const req = requests.find(r => r.id === requestId);
    if (!req) return { success: false, error: 'Request not found.' };
    const err = validateStatusTransition(req.status, status);
    if (err) return { success: false, error: err };
    set(state => ({
      requests: state.requests.map(r =>
        r.id === requestId
          ? {
              ...r,
              status,
              reviewedBy: reviewedBy ?? r.reviewedBy,
              reviewedAt: new Date().toISOString(),
              reviewNote: reviewNote ?? r.reviewNote,
              ...(status === 'Cancelled' ? { cancelledAt: new Date().toISOString() } : {}),
            }
          : r,
      ),
    }));
    if (status === 'Approved') {
      useAttendanceStore.getState().syncLeaveRecords(req.employeeId, req.startDate, req.endDate, req.id, 'apply');
    } else if (status === 'Rejected' || status === 'Cancelled') {
      useAttendanceStore.getState().syncLeaveRecords(req.employeeId, req.startDate, req.endDate, req.id, 'revert');
    }
    return { success: true };
  },
  cancelRequest: (requestId, employeeId) => {
    const { requests } = get();
    const req = requests.find(r => r.id === requestId);
    if (!req) return { success: false, error: 'Request not found.' };
    if (req.employeeId !== employeeId) return { success: false, error: 'Unauthorized.' };

    const err = validateStatusTransition(req.status, 'Cancelled');
    if (err) return { success: false, error: err };
    set(state => ({
      requests: state.requests.map(r =>
        r.id === requestId
          ? { ...r, status: 'Cancelled', cancelledAt: new Date().toISOString() }
          : r,
      ),
    }));
    useAttendanceStore.getState().syncLeaveRecords(req.employeeId, req.startDate, req.endDate, req.id, 'revert');
    return { success: true };
  },

  getEmployeeRequests: (employeeId) =>
    get().requests.filter(r => r.employeeId === employeeId),

  getPendingRequests: () =>
    get().requests.filter(r => r.status === 'Pending'),
}));