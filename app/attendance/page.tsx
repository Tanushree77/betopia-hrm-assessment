'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';
import { AttendanceCalendar } from '@/components/attendance/AttendanceCalendar';
import { AttendanceStats } from '@/components/attendance/AttendanceStats';
import { Select } from '@/components/ui/Select';
import { useAuthStore } from '@/store/authStore';
import { useAttendanceStore } from '@/store/attendanceStore';
import { computeAttendanceSummary } from '@/lib/attendanceCalculator';
import { List, CalendarDays } from 'lucide-react';

export default function EmployeeAttendancePage() {
  const { session } = useAuthStore();
  const { records, settings } = useAttendanceStore();
  const [selectedMonth, setSelectedMonth] = useState<number>(3);
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar');

  const employee = session?.employee;
  const year = 2025;
  const monthPrefix = `${year}-${String(selectedMonth).padStart(2, '0')}`;

  const employeeRecords = records.filter(
    r => r.employeeId === employee?.id && r.date.startsWith(monthPrefix)
  );

  const summary = computeAttendanceSummary(
    employee?.id || 'e1',
    year,
    selectedMonth,
    records,
    settings
  );

  return (
    <AppLayout allowedRoles={['employee']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">My Attendance History</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review your daily punch logs, monthly attendance rate, and working hours.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <Select
              value={String(selectedMonth)}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="flex-1 sm:flex-initial sm:w-36 h-9 text-xs"
              options={[
                { value: '1', label: 'January 2025' },
                { value: '2', label: 'February 2025' },
                { value: '3', label: 'March 2025' },
              ]}
            />

            <div className="flex items-center bg-slate-100 dark:bg-[#0d1422] p-1 rounded-lg border border-slate-200 dark:border-white/5">
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-white'
                }`}
                title="Calendar View"
                aria-label="Calendar view"
                aria-pressed={viewMode === 'calendar'}
              >
                <CalendarDays className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-white'
                }`}
                title="Table View"
                aria-label="Table view"
                aria-pressed={viewMode === 'table'}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <AttendanceStats summary={summary} />

        {viewMode === 'calendar' ? (
          <AttendanceCalendar
            year={year}
            month={selectedMonth}
            records={employeeRecords}
          />
        ) : (
          <AttendanceTable
            records={employeeRecords}
            showEmployeeColumn={false}
          />
        )}
      </div>
    </AppLayout>
  );
}
