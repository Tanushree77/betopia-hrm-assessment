'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAttendanceStore } from '@/store/attendanceStore';
import { useAuthStore } from '@/store/authStore';
import { HOLIDAYS } from '@/data/settings';
import { LEAVE_TYPES } from '@/data/leaveTypes';
import { formatDate } from '@/lib/dateUtils';
import { Clock, Calendar, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useAttendanceStore();
  const { session } = useAuthStore();
  const [startTime, setStartTime] = useState(settings.startTime);
  const [endTime, setEndTime] = useState(settings.endTime);
  const [lateThreshold, setLateThreshold] = useState(String(settings.lateThresholdMinutes));
  const [workHours, setWorkHours] = useState(String(settings.workHoursPerDay));
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    if (!session) {
      setSaveError('No active session.');
      return;
    }
    const result = updateSettings(
      {
        startTime,
        endTime,
        lateThresholdMinutes: Number(lateThreshold) || 30,
        workHoursPerDay: Number(workHours) || 8,
        weekendDays: [0, 6],
      },
      session.role,
    );
    if (result.success) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } else {
      setSaveError(result.error || 'Failed to save settings.');
    }
  };

  return (
    <AppLayout allowedRoles={['admin']}>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">System & Policy Settings</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure default working hours, attendance rules, official calendar holidays, and leave allowances.
          </p>
        </div>

        <form onSubmit={handleSave}>
          <Card>
            <CardHeader>
              <CardTitle>
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Working Hours & Punch Rules</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Office Start Time"
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  required
                />
                <Input
                  label="Office End Time"
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  required
                />
                <Input
                  label="Late Arrival Grace Threshold (Minutes)"
                  type="number"
                  value={lateThreshold}
                  onChange={e => setLateThreshold(e.target.value)}
                  helperText="Arrival after this threshold is marked as 'Late'"
                  required
                />
                <Input
                  label="Standard Work Hours Per Day"
                  type="number"
                  step="0.5"
                  value={workHours}
                  onChange={e => setWorkHours(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/5">
                {isSaved ? (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Settings updated successfully
                  </span>
                ) : saveError ? (
                  <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> {saveError}
                  </span>
                ) : (
                  <span />
                )}
                <Button type="submit" variant="primary" size="sm">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        <Card>
          <CardHeader>
            <CardTitle>
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Leave Allocation Policies (2025)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LEAVE_TYPES.map(lt => (
                <div
                  key={lt.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: lt.color }}
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">{lt.name}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{lt.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-blue-400 font-mono">
                      {lt.totalDaysPerYear}
                    </span>
                    <span className="text-[10px] text-slate-500 block">days/yr</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Official Public Holidays (2025)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HOLIDAYS.map(h => (
                <div
                  key={h.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{h.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{formatDate(h.date, 'EEEE, MMMM d, yyyy')}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {h.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
