'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Clock, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export function PunchWidget() {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(true);
  const [checkInTime, setCheckInTime] = useState<string>('09:05 AM');
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(format(now, 'hh:mm:ss a'));
      setDate(format(now, 'EEEE, MMMM d, yyyy'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePunch = () => {
    const now = format(new Date(), 'hh:mm a');
    if (isCheckedIn) {
      setCheckOutTime(now);
      setIsCheckedIn(false);
    } else {
      setCheckInTime(now);
      setCheckOutTime(null);
      setIsCheckedIn(true);
    }
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-[#111827] dark:via-[#0e1626] dark:to-[#131f37] border-blue-500/20">
      <CardHeader>
        <CardTitle>
          <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          <span>Real-time Attendance Punch</span>
        </CardTitle>
        <Badge
          variant="attendance"
          status={isCheckedIn ? 'Present' : 'Absent'}
        >
          {isCheckedIn ? 'On Duty' : 'Off Duty'}
        </Badge>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
              {time || '--:--:-- --'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{date}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant={isCheckedIn ? 'danger' : 'success'}
              size="md"
              onClick={handlePunch}
              leftIcon={isCheckedIn ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            >
              {isCheckedIn ? 'Clock Out' : 'Clock In'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-white/5 mt-2">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Check In Time</span>
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {checkInTime || '—'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Check Out Time</span>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mt-0.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              {checkOutTime || 'In Progress'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
