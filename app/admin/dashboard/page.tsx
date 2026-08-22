'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';

export default function AdminDashboardPage() {
  return (
    <AppLayout allowedRoles={['admin']}>
      <AdminDashboard />
    </AppLayout>
  );
}
