import { EMPLOYEES } from '@/data/employees';
import { DEPARTMENTS } from '@/data/departments';
import type { LeaveRequest } from '@/types/leave';
import type { AttendanceRecord, OfficeSettings } from '@/types/attendance';
import { computeAttendanceSummary } from '@/lib/attendanceCalculator';
import { OFFICE_SETTINGS } from '@/data/settings';
import { LEAVE_TYPES } from '@/data/leaveTypes';

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveToday: number;
  pendingLeaveRequests: number;
  attendanceRateToday: number;
  departmentBreakdown: { name: string; count: number; color: string }[];
  attendanceTrend: { month: string; present: number; absent: number; late: number }[];
  leaveDistribution: { name: string; value: number; color: string }[];
  recentLeaveRequests: LeaveRequest[];
  topAbsentees: { employeeId: string; name: string; absences: number }[];
}

export async function getDashboardStats(
  allAttendance: AttendanceRecord[],
  allRequests: LeaveRequest[],
  settings: OfficeSettings = OFFICE_SETTINGS,
): Promise<DashboardStats> {
  const activeEmployees = EMPLOYEES.filter(e => e.status === 'Active');
  const onLeaveToday = EMPLOYEES.filter(e => e.status === 'On Leave').length;
  const pendingLeaveRequests = allRequests.filter(r => r.status === 'Pending').length;

  const departmentBreakdown = DEPARTMENTS.map(d => ({
    name: d.name,
    count: EMPLOYEES.filter(e => e.departmentId === d.id && e.status === 'Active').length,
    color: d.color,
  })).filter(d => d.count > 0);

  const months = [
    { month: 'Jan', year: 2025, m: 1 },
    { month: 'Feb', year: 2025, m: 2 },
    { month: 'Mar', year: 2025, m: 3 },
  ];
  const attendanceTrend = months.map(({ month, year, m }) => {
    const summaries = activeEmployees.map(e =>
      computeAttendanceSummary(e.id, year, m, allAttendance, settings),
    );
    const present = Math.round(summaries.reduce((s, x) => s + x.present + x.late, 0) / summaries.length);
    const absent  = Math.round(summaries.reduce((s, x) => s + x.absent, 0) / summaries.length);
    const late    = Math.round(summaries.reduce((s, x) => s + x.late, 0) / summaries.length);
    return { month, present, absent, late };
  });

  const marSummaries = activeEmployees.map(e =>
    computeAttendanceSummary(e.id, 2025, 3, allAttendance, settings),
  );
  const attendanceRateToday = parseFloat(
    (marSummaries.reduce((s, x) => s + x.attendancePercentage, 0) / marSummaries.length).toFixed(1),
  );

  const leaveDistribution = LEAVE_TYPES.map(lt => ({
    name: lt.name,
    value: allRequests.filter(r => r.leaveTypeId === lt.id && r.status === 'Approved').length,
    color: lt.color,
  })).filter(l => l.value > 0);

  const recentLeaveRequests = [...allRequests]
    .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt))
    .slice(0, 6);

  const topAbsentees = marSummaries
    .sort((a, b) => b.absent - a.absent)
    .slice(0, 5)
    .map(s => {
      const emp = EMPLOYEES.find(e => e.id === s.employeeId)!;
      return { employeeId: s.employeeId, name: `${emp.firstName} ${emp.lastName}`, absences: s.absent };
    })
    .filter(a => a.absences > 0);

  return {
    totalEmployees: EMPLOYEES.length,
    activeEmployees: activeEmployees.length,
    onLeaveToday,
    pendingLeaveRequests,
    attendanceRateToday,
    departmentBreakdown,
    attendanceTrend,
    leaveDistribution,
    recentLeaveRequests,
    topAbsentees,
  };
}
