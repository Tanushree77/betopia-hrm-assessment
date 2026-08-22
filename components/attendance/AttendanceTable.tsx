'use client';

import React, { useState } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Avatar } from '@/components/ui/Avatar';
import type { AttendanceRecord } from '@/types/attendance';
import { EMPLOYEES } from '@/data/employees';
import { formatDate } from '@/lib/dateUtils';
import { getEffectiveStatus } from '@/lib/attendanceCalculator';
import { useAttendanceStore } from '@/store/attendanceStore';
import { Search, Download } from 'lucide-react';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  showEmployeeColumn?: boolean;
}

export function AttendanceTable({ records, showEmployeeColumn = true }: AttendanceTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const settings = useAttendanceStore(state => state.settings);

  const employeeMap = new Map(EMPLOYEES.map(e => [e.id, e]));

  const filteredRecords = records.filter(record => {
    const emp = employeeMap.get(record.employeeId);
    const matchesSearch =
      search === '' ||
      record.date.includes(search) ||
      (emp && `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search.toLowerCase())) ||
      (record.notes && record.notes.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || getEffectiveStatus(record, settings) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['Date', 'Employee ID', 'Employee Name', 'Status', 'Check In', 'Check Out', 'Hours', 'Notes'];
    const rows = filteredRecords.map(r => {
      const emp = employeeMap.get(r.employeeId);
      return [
        r.date,
        r.employeeId,
        emp ? `"${emp.firstName} ${emp.lastName}"` : '',
        getEffectiveStatus(r, settings),
        r.checkIn || '',
        r.checkOut || '',
        r.workHours || '',
        `"${r.notes || ''}"`,
      ].join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `attendance_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: Column<AttendanceRecord>[] = [
    {
      key: 'date',
      header: 'Date',
      render: r => (
        <span className="font-medium text-slate-800 dark:text-slate-200">
          {formatDate(r.date, 'MMM d, yyyy')}
        </span>
      ),
    },
    ...(showEmployeeColumn
      ? [
          {
            key: 'employee',
            header: 'Employee',
            render: (r: AttendanceRecord) => {
              const emp = employeeMap.get(r.employeeId);
              if (!emp) return <span className="text-slate-500 dark:text-slate-400">{r.employeeId}</span>;
              return (
                <div className="flex items-center gap-2.5">
                  <Avatar
                    initials={emp.avatarInitials}
                    name={`${emp.firstName} ${emp.lastName}`}
                    color={emp.avatarColor}
                    size="xs"
                  />
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">{emp.firstName} {emp.lastName}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{emp.jobTitle}</p>
                  </div>
                </div>
              );
            },
          },
        ]
      : []),
    {
      key: 'status',
      header: 'Status',
      render: r => <Badge variant="attendance" status={getEffectiveStatus(r, settings)} />,
    },
    {
      key: 'checkIn',
      header: 'Check In',
      render: r => (
        <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
          {r.checkIn || '—'}
        </span>
      ),
    },
    {
      key: 'checkOut',
      header: 'Check Out',
      render: r => (
        <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
          {r.checkOut || '—'}
        </span>
      ),
    },
    {
      key: 'workHours',
      header: 'Work Hours',
      render: r => (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
          {r.workHours ? `${r.workHours}h` : '—'}
        </span>
      ),
    },
    {
      key: 'notes',
      header: 'Remarks',
      render: r => (
        <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px] block">
          {r.notes || '—'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-white/5">
        <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search by name, date or notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="w-full sm:w-72 h-9 text-xs"
          />

          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full sm:w-36 h-9 text-xs"
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'Present', label: 'Present' },
              { value: 'Late', label: 'Late' },
              { value: 'Half Day', label: 'Half Day' },
              { value: 'Absent', label: 'Absent' },
              { value: 'Leave', label: 'Leave' },
            ]}
          />
        </div>

        <div className="flex items-center justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-white/5">
          <Button
            size="sm"
            variant="outline"
            onClick={exportCSV}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredRecords}
        keyExtractor={r => r.id}
        emptyMessage="No attendance records match your filter criteria."
      />
    </div>
  );
}
