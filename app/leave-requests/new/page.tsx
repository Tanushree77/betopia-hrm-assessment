'use client';

import React from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { LeaveRequestForm } from '@/components/leave/LeaveRequestForm';
import { ArrowLeft } from 'lucide-react';

export default function NewLeaveRequestPage() {
  return (
    <AppLayout allowedRoles={['employee']}>
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href="/leave-requests"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Requests</span>
        </Link>

        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Apply for Leave</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Submit a time-off application. Days will be automatically calculated excluding weekends and holidays.
          </p>
        </div>

        <LeaveRequestForm />
      </div>
    </AppLayout>
  );
}
