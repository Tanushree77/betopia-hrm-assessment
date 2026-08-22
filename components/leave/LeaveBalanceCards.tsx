'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import type { LeaveBalanceSummary } from '@/types/leave';
import { Umbrella, HeartPulse, Sparkles, AlertCircle } from 'lucide-react';

interface LeaveBalanceCardsProps {
  balances: LeaveBalanceSummary[];
  onSelectType?: (leaveTypeId: string) => void;
}

export function LeaveBalanceCards({ balances, onSelectType }: LeaveBalanceCardsProps) {
  const getIcon = (name: string) => {
    if (name.includes('Sick')) return HeartPulse;
    if (name.includes('Annual')) return Umbrella;
    if (name.includes('Casual')) return Sparkles;
    return AlertCircle;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {balances.map(({ leaveType, balance }) => {
        const Icon = getIcon(leaveType.name);
        const usedPercentage = Math.min(100, Math.round((balance.used / balance.total) * 100)) || 0;

        return (
          <Card
            key={leaveType.id}
            onClick={() => onSelectType && onSelectType(leaveType.id)}
            hoverEffect={!!onSelectType}
            className="p-5 relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-xl text-white shadow-sm flex items-center justify-center"
                    style={{ backgroundColor: `${leaveType.color}20`, color: leaveType.color, border: `1px solid ${leaveType.color}40` }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{leaveType.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{leaveType.description}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {balance.remaining}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5">days left</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {balance.used} used of {balance.total}
                </span>
              </div>

              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${usedPercentage}%`,
                    backgroundColor: leaveType.color,
                  }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-white/5 mt-4 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Allowance: {balance.total} days</span>
              {balance.pending > 0 && (
                <span className="text-amber-400 font-medium">
                  {balance.pending} pending approval
                </span>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
