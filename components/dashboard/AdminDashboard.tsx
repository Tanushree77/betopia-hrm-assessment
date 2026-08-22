'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LeaveRequestList } from '@/components/leave/LeaveRequestList';
import { useLeaveStore } from '@/store/leaveStore';
import { useAttendanceStore } from '@/store/attendanceStore';
import { useAuthStore } from '@/store/authStore';
import { getDashboardStats, DashboardStats } from '@/services/dashboardService';
import {
  Users,
  UserCheck,
  CalendarClock,
  FileCheck2,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  Building,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts';

export function AdminDashboard() {
  const { requests, updateStatus } = useLeaveStore();
  const { records, settings } = useAttendanceStore();
  const { session } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats(records, requests, settings).then(data => setStats(data));
  }, [records, requests, settings]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400">
        <span className="text-xs">Loading admin metrics...</span>
      </div>
    );
  }

  const handleApprove = (requestId: string, note?: string) => {
    if (!session) return { success: false, error: 'No active session.' };
    return updateStatus(requestId, 'Approved', session.role, session.employeeId, note);
  };

  const handleReject = (requestId: string, note?: string) => {
    if (!session) return { success: false, error: 'No active session.' };
    return updateStatus(requestId, 'Rejected', session.role, session.employeeId, note);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Total Workforce"
          value={stats.totalEmployees}
          icon={Users}
          accentColor="blue"
          subtitle="Registered staff"
        />

        <StatCard
          title="Active Today"
          value={stats.activeEmployees}
          icon={UserCheck}
          accentColor="emerald"
          trend={{ value: '100% Active', isPositive: true }}
        />

        <StatCard
          title="On Leave"
          value={stats.onLeaveToday}
          icon={CalendarClock}
          accentColor="cyan"
          subtitle="Approved absences"
        />

        <StatCard
          title="Pending Requests"
          value={stats.pendingLeaveRequests}
          icon={FileCheck2}
          accentColor="amber"
          trend={{
            value: stats.pendingLeaveRequests > 0 ? 'Requires Action' : 'All Clear',
            isPositive: stats.pendingLeaveRequests === 0,
          }}
        />

        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRateToday}%`}
          icon={TrendingUp}
          accentColor="purple"
          trend={{ value: '+2.4% vs last mo', isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>Attendance & Absence Trends</span>
            </CardTitle>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Q1 2025 (Jan – Mar)</span>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d1422',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="present" name="Present (avg)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="late" name="Late Arrivals" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" name="Absences" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Building className="w-4 h-4 text-purple-400" />
              <span>Department Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.departmentBreakdown}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {stats.departmentBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d1422',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-2 max-h-32 overflow-y-auto pr-1">
              {stats.departmentBreakdown.map(d => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{d.name}</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 font-mono font-semibold">{d.count} staff</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <span>Pending Leave Approvals</span>
            </h3>
            <Link
              href="/admin/leave-requests"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <LeaveRequestList
            requests={stats.recentLeaveRequests}
            isAdmin
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Monthly Absence Watchlist</span>
          </h3>

          <Card className="p-4">
            {stats.topAbsentees.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">No high absenteeism recorded.</p>
            ) : (
              <div className="space-y-3">
                {stats.topAbsentees.map(a => (
                  <div
                    key={a.employeeId}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{a.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">ID: {a.employeeId}</p>
                    </div>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      {a.absences} absences
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
