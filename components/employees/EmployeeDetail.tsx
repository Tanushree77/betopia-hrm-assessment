'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { LeaveBalanceCards } from '@/components/leave/LeaveBalanceCards';
import { LeaveRequestList } from '@/components/leave/LeaveRequestList';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';
import { AttendanceStats } from '@/components/attendance/AttendanceStats';
import { EmployeeFormModal } from './EmployeeFormModal';
import type { Employee } from '@/types/employee';
import type { AttendanceRecord } from '@/types/attendance';
import type { LeaveRequest } from '@/types/leave';
import { DEPARTMENTS } from '@/data/departments';
import { useEmployeeStore } from '@/store/employeeStore';
import { useAttendanceStore } from '@/store/attendanceStore';
import { useAuthStore } from '@/store/authStore';
import { computeLeaveBalances } from '@/lib/leaveCalculator';
import { computeAttendanceSummary } from '@/lib/attendanceCalculator';
import { formatDate } from '@/lib/dateUtils';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ShieldCheck,
  User,
  Edit,
} from 'lucide-react';

interface EmployeeDetailProps {
  initialEmployee: Employee;
  allAttendance: AttendanceRecord[];
  allRequests: LeaveRequest[];
}

export function EmployeeDetail({
  initialEmployee,
  allAttendance,
  allRequests,
}: EmployeeDetailProps) {
  const { updateEmployee } = useEmployeeStore();
  const { settings } = useAttendanceStore();
  const { session } = useAuthStore();
  const [employee, setEmployee] = useState<Employee>(initialEmployee);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleSaveEmployee = (updated: Employee) => {
    if (!session) return { success: false, error: 'No active session.' };
    const result = updateEmployee(updated, session.role);
    if (result.success) {
      setEmployee(updated);
    }
    return result;
  };

  const department = DEPARTMENTS.find(d => d.id === employee.departmentId);
  const employeeAttendance = allAttendance.filter(a => a.employeeId === employee.id);
  const employeeRequests = allRequests.filter(r => r.employeeId === employee.id);

  const balances = computeLeaveBalances(employee, allRequests, 2025);
  const attendanceSummary = computeAttendanceSummary(employee.id, 2025, 3, allAttendance, settings);

  const tabs = [
    { id: 'overview', label: 'Overview & Profile' },
    { id: 'leaves', label: 'Leave Balances', count: balances.length },
    { id: 'requests', label: 'Leave Applications', count: employeeRequests.length },
    { id: 'attendance', label: 'Attendance Records', count: employeeAttendance.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/employees"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsEditOpen(true)}
          leftIcon={<Edit className="w-3.5 h-3.5" />}
        >
          Edit Profile
        </Button>
      </div>

      <Card className="p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Avatar
              initials={employee.avatarInitials}
              name={`${employee.firstName} ${employee.lastName}`}
              color={employee.avatarColor}
              size="xl"
              online={employee.status === 'Active'}
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {employee.firstName} {employee.lastName}
                </h2>
                <Badge variant="employee" status={employee.status} />
                <Badge variant="role" status={employee.role}>
                  {employee.role === 'admin' ? (
                    <ShieldCheck className="w-3 h-3" />
                  ) : (
                    <User className="w-3 h-3" />
                  )}
                  {employee.role}
                </Badge>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">{employee.jobTitle}</p>

              {department && (
                <span
                  className="inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${department.color}15`,
                    color: department.color,
                    border: `1px solid ${department.color}30`,
                  }}
                >
                  {department.name}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2.5 text-xs text-slate-600 dark:text-slate-300 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-white/10 pt-4 sm:pt-0 sm:pl-6">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{employee.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>{employee.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Joined {formatDate(employee.joinDate, 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-emerald-400">
                ${employee.salary.toLocaleString()}/yr
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal & Employment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Employee ID</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{employee.id}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Gender</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.gender}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Address</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {employee.address || '123 Tech Lane, San Francisco, CA'}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Emergency Contact</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {employee.emergencyContact || 'Available on request'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <AttendanceStats summary={attendanceSummary} />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Leave Quick Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {balances.map(b => (
                  <div
                    key={b.leaveType.id}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                        {b.leaveType.name}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {b.balance.used} used of {b.balance.total} days
                      </span>
                    </div>
                    <span className="text-sm font-bold text-blue-400 font-mono">
                      {b.balance.remaining} left
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'leaves' && (
        <LeaveBalanceCards balances={balances} />
      )}

      {activeTab === 'requests' && (
        <LeaveRequestList requests={employeeRequests} isAdmin />
      )}

      {activeTab === 'attendance' && (
        <AttendanceTable records={employeeAttendance} showEmployeeColumn={false} />
      )}

      <EmployeeFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialData={employee}
        onSave={handleSaveEmployee}
      />
    </div>
  );
}
