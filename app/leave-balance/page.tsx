'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { LeaveBalanceCards } from '@/components/leave/LeaveBalanceCards';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useLeaveStore } from '@/store/leaveStore';
import { LEAVE_TYPES } from '@/data/leaveTypes';
import { computeLeaveBalances } from '@/lib/leaveCalculator';
import { PlusCircle, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LeaveBalancePage() {
  const router = useRouter();
  const { session } = useAuthStore();
  const { requests } = useLeaveStore();

  const employee = session?.employee;
  const balances = employee ? computeLeaveBalances(employee, requests, 2025) : [];

  return (
    <AppLayout allowedRoles={['employee']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Leave Balance & Allowances</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review your annual paid time off allocations, used days, and remaining balances for 2025.
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

        <LeaveBalanceCards
          balances={balances}
          onSelectType={() => router.push('/leave-requests/new')}
        />

        <Card>
          <CardHeader>
            <CardTitle>
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>Leave Policy Guidelines</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LEAVE_TYPES.map(lt => (
                <div
                  key={lt.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{lt.name}</span>
                    <span className="text-xs font-mono font-bold text-blue-400">
                      {lt.totalDaysPerYear} Days/Year
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{lt.description}</p>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{lt.isPaid ? '• Paid Leave' : '• Unpaid Leave'}</span>
                    {lt.requiresDocument && <span>• Supporting Document Required</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
