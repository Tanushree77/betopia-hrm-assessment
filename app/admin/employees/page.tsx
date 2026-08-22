'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { EmployeeList } from '@/components/employees/EmployeeList';

export default function AdminEmployeesPage() {
  return (
    <AppLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Staff & Workforce Directory</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage organization members, assignments, roles, and profiles.
          </p>
        </div>
        <EmployeeList />
      </div>
    </AppLayout>
  );
}
