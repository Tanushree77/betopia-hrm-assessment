'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { AttendanceRecord, AttendanceStatus } from '@/types/attendance';
import { getDaysInMonth, formatDate, isWeekendDate, isHolidayDate } from '@/lib/dateUtils';
import { getEffectiveStatus } from '@/lib/attendanceCalculator';
import { useAttendanceStore } from '@/store/attendanceStore';
import { parseISO, getDay, format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Info } from 'lucide-react';

interface AttendanceCalendarProps {
  year: number;
  month: number;
  records: AttendanceRecord[];
}

export function AttendanceCalendar({ year, month, records }: AttendanceCalendarProps) {
  const [selectedRecord, setSelectedRecord] = useState<{ date: string; record?: AttendanceRecord } | null>(null);
  const settings = useAttendanceStore(state => state.settings);

  const days = getDaysInMonth(year, month);
  const firstDayOfWeek = getDay(parseISO(days[0]));
  const recordMap = new Map<string, AttendanceRecord>(records.map(r => [r.date, r]));

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDayStatus = (dateStr: string): { status: AttendanceStatus; checkIn?: string; checkOut?: string } => {
    const record = recordMap.get(dateStr);
    if (record) {
      return { status: getEffectiveStatus(record, settings), checkIn: record.checkIn, checkOut: record.checkOut };
    }
    if (isHolidayDate(dateStr)) return { status: 'Holiday' };
    if (isWeekendDate(dateStr, settings.weekendDays)) return { status: 'Weekend' };
    return { status: 'Absent' };
  };

  return (
    <Card className="p-5">
      <CardHeader className="pb-3 border-b border-slate-200 dark:border-white/5">
        <CardTitle>
          <CalendarIcon className="w-4 h-4 text-blue-400" />
          <span>Monthly Attendance Grid</span>
        </CardTitle>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {format(new Date(year, month - 1, 1), 'MMMM yyyy')}
        </span>
      </CardHeader>

      <CardContent className="pt-2 overflow-x-auto touch-scroll">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
            {dayNames.map(day => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-20 rounded-lg bg-slate-100 dark:bg-slate-900/20 opacity-60 dark:opacity-30" />
          ))}

          {days.map(dateStr => {
            const dateObj = parseISO(dateStr);
            const dayNum = dateObj.getDate();
            const { status, checkIn, checkOut } = getDayStatus(dateStr);
            const record = recordMap.get(dateStr);

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedRecord({ date: dateStr, record })}
                role="button"
                tabIndex={0}
                aria-label={`View attendance details for ${formatDate(dateStr, 'MMMM d, yyyy')}`}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedRecord({ date: dateStr, record });
                  }
                }}
                className="h-20 p-2 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#0e1524] hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-[#131d31] transition-all cursor-pointer flex flex-col justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                    {dayNum}
                  </span>
                  <Badge
                    variant="attendance"
                    status={status}
                    className="text-[10px] px-1.5 py-0 scale-90 origin-right"
                  />
                </div>

                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {checkIn ? (
                    <span className="text-slate-600 dark:text-slate-300 font-mono">
                      {checkIn} {checkOut ? `– ${checkOut}` : ''}
                    </span>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400">{status}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </CardContent>

      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title={`Attendance Details · ${formatDate(selectedRecord.date, 'MMMM d, yyyy')}`}
          maxWidth="sm"
          footer={
            <Button size="sm" variant="secondary" onClick={() => setSelectedRecord(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-3 py-1">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
              <span className="text-xs text-slate-500 dark:text-slate-400">Status</span>
              <Badge
                variant="attendance"
                status={getDayStatus(selectedRecord.date).status}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Check In</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {selectedRecord.record?.checkIn || '—'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Check Out</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {selectedRecord.record?.checkOut || '—'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Total Work Hours</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {selectedRecord.record?.workHours ? `${selectedRecord.record.workHours} hours` : '0 hours'}
              </span>
            </div>

            {selectedRecord.record?.notes && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs text-blue-700 dark:text-blue-300">
                <div className="flex items-center gap-1.5 font-medium mb-1">
                  <Info className="w-3.5 h-3.5" /> Note
                </div>
                <p>{selectedRecord.record.notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </Card>
  );
}
