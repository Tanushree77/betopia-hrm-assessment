'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { LeaveRequestList } from '@/components/leave/LeaveRequestList';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useLeaveStore } from '@/store/leaveStore';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmployeeLeaveRequestsPage() {
  const router = useRouter();
  const { session } = useAuthStore();
  const { requests, cancelRequest } = useLeaveStore();

  const employee = session?.employee;
  const myRequests = requests.filter(r => r.employeeId === employee?.id);

  const handleCancel = (requestId: string) => {
    if (employee) {
      cancelRequest(requestId, employee.id);
    }
  };

  return (
    <AppLayout allowedRoles={['employee']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">My Leave Applications</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Track the status of your submitted time-off requests or submit a new application.
            </p>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => router.push('/leave-requests/new')}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Apply for Leave
          </Button>
        </div>

        <LeaveRequestList
          requests={myRequests}
          isAdmin={false}
          onCancel={handleCancel}
        />
      </div>
    </AppLayout>
  );
}
