'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { EmployeeDashboard } from '@/components/dashboard/EmployeeDashboard';

export default function EmployeeDashboardPage() {
  return (
    <AppLayout allowedRoles={['employee']}>
      <EmployeeDashboard />
    </AppLayout>
  );
}
