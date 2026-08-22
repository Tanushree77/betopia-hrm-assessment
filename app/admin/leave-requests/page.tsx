'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { LeaveRequestList } from '@/components/leave/LeaveRequestList';
import { useLeaveStore } from '@/store/leaveStore';
import { useAuthStore } from '@/store/authStore';

export default function AdminLeaveRequestsPage() {
  const { requests, updateStatus } = useLeaveStore();
  const { session } = useAuthStore();

  const handleApprove = (requestId: string, note?: string) => {
    if (!session) return { success: false, error: 'No active session.' };
    return updateStatus(requestId, 'Approved', session.role, session.employeeId, note);
  };

  const handleReject = (requestId: string, note?: string) => {
    if (!session) return { success: false, error: 'No active session.' };
    return updateStatus(requestId, 'Rejected', session.role, session.employeeId, note);
  };

  return (
    <AppLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Leave Management & Approvals</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review time-off submissions, approve vacation requests, and manage workforce leave records.
          </p>
        </div>

        <LeaveRequestList
          requests={requests}
          isAdmin
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </AppLayout>
  );
}
