'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LEAVE_TYPES } from '@/data/leaveTypes';
import { useLeaveStore } from '@/store/leaveStore';
import { useAuthStore } from '@/store/authStore';
import { calculateLeaveDays, validateLeaveRequest, computeLeaveBalances } from '@/lib/leaveCalculator';
import { todayStr } from '@/lib/dateUtils';
import { Calendar, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LeaveRequestForm() {
  const router = useRouter();
  const { session } = useAuthStore();
  const { requests, submitRequest } = useLeaveStore();

  const [leaveTypeId, setLeaveTypeId] = useState<string>(LEAVE_TYPES[0].id);
  const [startDate, setStartDate] = useState<string>(todayStr());
  const [endDate, setEndDate] = useState<string>(todayStr());
  const [isHalfDayStart, setIsHalfDayStart] = useState<boolean>(false);
  const [isHalfDayEnd, setIsHalfDayEnd] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const employee = session?.employee;

  const calculatedDays = useMemo(() => {
    if (!startDate || !endDate || startDate > endDate) return 0;
    return calculateLeaveDays(startDate, endDate, isHalfDayStart, isHalfDayEnd);
  }, [startDate, endDate, isHalfDayStart, isHalfDayEnd]);

  const remainingDays = useMemo(() => {
    if (!employee) return 0;
    const balances = computeLeaveBalances(employee, requests, new Date(startDate || todayStr()).getFullYear());
    const bal = balances.find(b => b.leaveType.id === leaveTypeId);
    return bal ? bal.balance.remaining : 0;
  }, [employee, requests, leaveTypeId, startDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) {
      setFormError('No active user session.');
      return;
    }
    if (!reason.trim()) {
      setFormError('Please provide a reason for the leave.');
      return;
    }

    const validationError = validateLeaveRequest({
      employee,
      startDate,
      endDate,
      leaveTypeId,
      isHalfDayStart,
      isHalfDayEnd,
      existingRequests: requests,
    });

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError(null);
    const res = submitRequest(
      {
        employeeId: employee.id,
        leaveTypeId,
        startDate,
        endDate,
        isHalfDayStart,
        isHalfDayEnd,
        totalDays: calculatedDays,
        reason: reason.trim(),
      },
      employee.id,
    );

    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/leave-requests');
      }, 1500);
    } else {
      setFormError(res.error || 'Failed to submit request.');
    }
  };

  if (isSuccess) {
    return (
      <Card className="p-8 bg-white dark:bg-[#111827] text-center border-emerald-500/30">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Leave Application Submitted!</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
          Your request for {calculatedDays} day(s) has been sent to management for review.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Calendar className="w-4 h-4 text-blue-400" />
          <span>New Leave Application</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-400 text-xs">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Leave Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LEAVE_TYPES.map(lt => {
                const isSelected = lt.id === leaveTypeId;
                return (
                  <button
                    key={lt.id}
                    type="button"
                    onClick={() => setLeaveTypeId(lt.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-white'
                        : 'border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: lt.color }}
                      />
                      <span className="text-xs font-semibold">{lt.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{lt.totalDaysPerYear} days/year</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
              />
              <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHalfDayStart}
                  onChange={e => setIsHalfDayStart(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-900"
                />
                <span>Half Day on Start Date</span>
              </label>
            </div>

            <div className="space-y-2">
              <Input
                label="End Date"
                type="date"
                value={endDate}
                min={startDate}
                onChange={e => setEndDate(e.target.value)}
                required
              />
              <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHalfDayEnd}
                  onChange={e => setIsHalfDayEnd(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-900"
                />
                <span>Half Day on End Date</span>
              </label>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Total Working Days</span>
              <span className="text-lg font-bold text-blue-400 font-mono">
                {calculatedDays} {calculatedDays === 1 ? 'day' : 'days'}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                (Weekends & public holidays automatically excluded)
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Remaining Balance</span>
              <span
                className={`text-sm font-bold ${
                  remainingDays < calculatedDays ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {remainingDays} days left
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Reason for Absence
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Please explain the purpose of your leave..."
              className="input-base text-xs resize-none"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-white/5 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={<Send className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Submit Application
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
