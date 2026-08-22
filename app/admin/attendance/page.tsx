'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';
import { AttendanceCalendar } from '@/components/attendance/AttendanceCalendar';
import { AttendanceStats } from '@/components/attendance/AttendanceStats';
import { Select } from '@/components/ui/Select';
import { useAttendanceStore } from '@/store/attendanceStore';
import { computeAttendanceSummary } from '@/lib/attendanceCalculator';
import { EMPLOYEES } from '@/data/employees';
import { List, CalendarDays } from 'lucide-react';

export default function AdminAttendancePage() {
  const { records, settings } = useAttendanceStore();
  const [selectedMonth, setSelectedMonth] = useState<number>(3);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');

  const year = 2025;
  const monthPrefix = `${year}-${String(selectedMonth).padStart(2, '0')}`;

  const monthRecords = records.filter(r => {
    const matchesMonth = r.date.startsWith(monthPrefix);
    const matchesEmp = selectedEmployeeId === 'ALL' || r.employeeId === selectedEmployeeId;
    return matchesMonth && matchesEmp;
  });

  const overallSummary = computeAttendanceSummary(
    selectedEmployeeId === 'ALL' ? 'ALL' : selectedEmployeeId,
    year,
    selectedMonth,
    records,
    settings
  );

  return (
    <AppLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Organization Attendance Log</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review daily punch logs, monthly summaries, and attendance compliance across all staff.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full md:w-auto">
            <Select
              value={String(selectedMonth)}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="w-full sm:w-36 h-9 text-xs"
              options={[
                { value: '1', label: 'January 2025' },
                { value: '2', label: 'February 2025' },
                { value: '3', label: 'March 2025' },
              ]}
            />

            <Select
              value={selectedEmployeeId}
              onChange={e => setSelectedEmployeeId(e.target.value)}
              className="w-full sm:w-48 h-9 text-xs"
              options={[
                { value: 'ALL', label: 'All Employees' },
                ...EMPLOYEES.map(emp => ({
                  value: emp.id,
                  label: `${emp.firstName} ${emp.lastName}`,
                })),
              ]}
            />

            <div className="col-span-2 sm:col-span-1 flex items-center justify-center sm:justify-start bg-slate-100 dark:bg-[#0d1422] p-1 rounded-lg border border-slate-200 dark:border-white/5">
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
            </div>
          </div>
        </div>

        <AttendanceStats summary={overallSummary} />

        {viewMode === 'table' ? (
          <AttendanceTable
            records={monthRecords}
            showEmployeeColumn={selectedEmployeeId === 'ALL'}
          />
        ) : (
          <AttendanceCalendar
            year={year}
            month={selectedMonth}
            records={monthRecords}
          />
        )}
      </div>
    </AppLayout>
  );
}
