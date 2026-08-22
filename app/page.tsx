'use client';

import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { EmployeeDashboard } from '@/components/dashboard/EmployeeDashboard';

export default function Home() {
  const { session } = useAuthStore();
  const role = session?.role || 'admin';

  return (
    <AppLayout>
      {role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}
    </AppLayout>
  );
}
