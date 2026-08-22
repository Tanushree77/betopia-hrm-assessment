'use client';

import React from 'react';
import Link from 'next/link';
import { PunchWidget } from '@/components/attendance/PunchWidget';
import { LeaveBalanceCards } from '@/components/leave/LeaveBalanceCards';
import { AttendanceStats } from '@/components/attendance/AttendanceStats';
import { LeaveRequestList } from '@/components/leave/LeaveRequestList';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useLeaveStore } from '@/store/leaveStore';
import { useAttendanceStore } from '@/store/attendanceStore';
import { computeLeaveBalances } from '@/lib/leaveCalculator';
import { computeAttendanceSummary } from '@/lib/attendanceCalculator';
import { PlusCircle, FileText, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function EmployeeDashboard() {
  const router = useRouter();
  const { session } = useAuthStore();
  const { requests, cancelRequest } = useLeaveStore();
  const { records, settings } = useAttendanceStore();

  const employee = session?.employee;

  if (!employee) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500 dark:text-slate-400 text-xs">
        No employee session active. Please switch persona or log in.
      </div>
    );
  }

  const balances = computeLeaveBalances(employee, requests, 2025);
  const attendanceSummary = computeAttendanceSummary(employee.id, 2025, 3, records, settings);
  const myRequests = requests.filter(r => r.employeeId === employee.id);

  const handleCancel = (requestId: string) => {
    cancelRequest(requestId, employee.id);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-blue-50/60 to-white dark:from-blue-950/40 dark:via-slate-900/60 dark:to-[#111827] border border-blue-200 dark:border-blue-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Self-Service Employee Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Welcome back, {employee.firstName}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-lg leading-relaxed">
              Track your attendance, monitor annual leave allocations, and submit time-off applications seamlessly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-white/5 relative z-10">
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push('/leave-requests/new')}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Apply for Leave
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push('/attendance')}
              leftIcon={<FileText className="w-4 h-4" />}
            >
              View Full Attendance Log
            </Button>
          </div>
        </div>

        <PunchWidget />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Your Leave Balances</h3>
          <Link
            href="/leave-balance"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
          >
            Detailed Policy <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <LeaveBalanceCards
          balances={balances}
          onSelectType={() => router.push('/leave-requests/new')}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">March 2025 Attendance Overview</h3>
        <AttendanceStats summary={attendanceSummary} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Recent Time-Off Applications</h3>
          <Link
            href="/leave-requests"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
          >
            View All Requests <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <LeaveRequestList
          requests={myRequests.slice(0, 5)}
          isAdmin={false}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
