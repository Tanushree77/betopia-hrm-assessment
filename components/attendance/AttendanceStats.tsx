'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import type { AttendanceSummary } from '@/types/attendance';
import { CalendarCheck, AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface AttendanceStatsProps {
  summary: AttendanceSummary;
}

export function AttendanceStats({ summary }: AttendanceStatsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Attendance Rate"
          value={`${summary.attendancePercentage}%`}
          icon={CalendarCheck}
          accentColor="blue"
          trend={{
            value: summary.attendancePercentage >= 90 ? 'Excellent' : 'Needs Attention',
            isPositive: summary.attendancePercentage >= 90,
          }}
          subtitle={`${summary.present + summary.late} / ${summary.totalWorkingDays} working days`}
        />

        <StatCard
          title="Present & On-Time"
          value={summary.present}
          icon={CheckCircle}
          accentColor="emerald"
          subtitle="Full day recorded"
        />

        <StatCard
          title="Late Arrivals"
          value={summary.late}
          icon={Clock}
          accentColor="amber"
          subtitle="After 09:30 AM"
        />

        <StatCard
          title="Absences"
          value={summary.absent}
          icon={AlertCircle}
          accentColor="rose"
          subtitle={`${summary.leave} approved leaves`}
        />
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span>Monthly Working Days Breakdown</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">{summary.totalWorkingDays} Total Work Days</span>
        </div>
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
          {summary.present > 0 && (
            <div
              style={{ width: `${(summary.present / summary.totalWorkingDays) * 100}%` }}
              className="bg-emerald-500 hover:opacity-90 transition-all"
              title={`Present: ${summary.present} days`}
            />
          )}
          {summary.late > 0 && (
            <div
              style={{ width: `${(summary.late / summary.totalWorkingDays) * 100}%` }}
              className="bg-amber-500 hover:opacity-90 transition-all"
              title={`Late: ${summary.late} days`}
            />
          )}
          {summary.halfDay > 0 && (
            <div
              style={{ width: `${(summary.halfDay / summary.totalWorkingDays) * 100}%` }}
              className="bg-purple-500 hover:opacity-90 transition-all"
              title={`Half Day: ${summary.halfDay} days`}
            />
          )}
          {summary.leave > 0 && (
            <div
              style={{ width: `${(summary.leave / summary.totalWorkingDays) * 100}%` }}
              className="bg-blue-500 hover:opacity-90 transition-all"
              title={`Leave: ${summary.leave} days`}
            />
          )}
          {summary.absent > 0 && (
            <div
              style={{ width: `${(summary.absent / summary.totalWorkingDays) * 100}%` }}
              className="bg-rose-500 hover:opacity-90 transition-all"
              title={`Absent: ${summary.absent} days`}
            />
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Present ({summary.present})
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Late ({summary.late})
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Half Day ({summary.halfDay})
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Leave ({summary.leave})
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Absent ({summary.absent})
          </div>
        </div>
      </Card>
    </div>
  );
}
