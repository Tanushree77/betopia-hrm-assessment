'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { EmployeeDetail } from '@/components/employees/EmployeeDetail';
import { useAttendanceStore } from '@/store/attendanceStore';
import { useLeaveStore } from '@/store/leaveStore';
import { useEmployeeStore } from '@/store/employeeStore';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { records } = useAttendanceStore();
  const { requests } = useLeaveStore();
  const { employees } = useEmployeeStore();

  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const employee = employees.find(e => e.id === id);

  if (!employee) {
    return (
      <AppLayout allowedRoles={['admin']}>
        <div className="text-center py-24 space-y-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm">Employee not found.</p>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => router.push('/admin/employees')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Directory
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout allowedRoles={['admin']}>
      <EmployeeDetail
        initialEmployee={employee}
        allAttendance={records}
        allRequests={requests}
      />
    </AppLayout>
  );
}
