'use client';

import React, { useState } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Avatar } from '@/components/ui/Avatar';
import { LeaveApprovalModal } from './LeaveApprovalModal';
import type { LeaveRequest } from '@/types/leave';
import { EMPLOYEES } from '@/data/employees';
import { LEAVE_TYPES } from '@/data/leaveTypes';
import { formatDate } from '@/lib/dateUtils';
import { Check, X, Ban, AlertTriangle } from 'lucide-react';

interface ActionResult {
  success: boolean;
  error?: string;
}

interface LeaveRequestListProps {
  requests: LeaveRequest[];
  isAdmin?: boolean;
  onApprove?: (id: string, note?: string) => ActionResult | void;
  onReject?: (id: string, note?: string) => ActionResult | void;
  onCancel?: (id: string) => ActionResult | void;
}

export function LeaveRequestList({
  requests,
  isAdmin = false,
  onApprove,
  onReject,
  onCancel,
}: LeaveRequestListProps) {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [reviewingRequest, setReviewingRequest] = useState<LeaveRequest | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const employeeMap = new Map(EMPLOYEES.map(e => [e.id, e]));
  const leaveTypeMap = new Map(LEAVE_TYPES.map(lt => [lt.id, lt]));

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'ALL') return true;
    return req.status === activeTab;
  });

  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const approvedCount = requests.filter(r => r.status === 'Approved').length;
  const rejectedCount = requests.filter(r => r.status === 'Rejected').length;

  const tabs = [
    { id: 'ALL', label: 'All Applications', count: requests.length },
    { id: 'Pending', label: 'Pending', count: pendingCount },
    { id: 'Approved', label: 'Approved', count: approvedCount },
    { id: 'Rejected', label: 'Rejected', count: rejectedCount },
  ];

  const columns: Column<LeaveRequest>[] = [
    ...(isAdmin
      ? [
          {
            key: 'employee',
            header: 'Applicant',
            render: (req: LeaveRequest) => {
              const emp = employeeMap.get(req.employeeId);
              if (!emp) return <span className="text-slate-500 dark:text-slate-400">{req.employeeId}</span>;
              return (
                <div className="flex items-center gap-2.5">
                  <Avatar
                    initials={emp.avatarInitials}
                    name={`${emp.firstName} ${emp.lastName}`}
                    color={emp.avatarColor}
                    size="xs"
                  />
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">
                      {emp.firstName} {emp.lastName}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{emp.jobTitle}</p>
                  </div>
                </div>
              );
            },
          },
        ]
      : []),
    {
      key: 'leaveType',
      header: 'Leave Type',
      render: req => {
        const lt = leaveTypeMap.get(req.leaveTypeId);
        return (
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: lt?.color || '#3b82f6' }}
            />
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
              {lt?.name || req.leaveTypeId}
            </span>
          </div>
        );
      },
    },
    {
      key: 'dates',
      header: 'Duration',
      render: req => (
        <div className="space-y-0.5">
          <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
            {formatDate(req.startDate, 'MMM d')} – {formatDate(req.endDate, 'MMM d, yyyy')}
          </p>
          <p className="text-[10px] text-blue-400 font-semibold">
            {req.totalDays} {req.totalDays === 1 ? 'day' : 'days'}
            {(req.isHalfDayStart || req.isHalfDayEnd) && ' (Half day)'}
          </p>
        </div>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: req => (
        <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px] block" title={req.reason}>
          {req.reason}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: req => <Badge variant="leave" status={req.status} />,
    },
    {
      key: 'appliedAt',
      header: 'Submitted',
      render: req => (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {formatDate(req.appliedAt, 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: req => {
        if (isAdmin && req.status === 'Pending') {
          return (
            <div className="flex items-center justify-end gap-1.5">
              <Button
                size="xs"
                variant="success"
                onClick={e => {
                  e.stopPropagation();
                  setActionError(null);
                  if (onApprove) {
                    const result = onApprove(req.id);
                    if (result && result.success === false) {
                      setActionError(result.error || 'Failed to approve this request.');
                    }
                  } else {
                    setReviewingRequest(req);
                  }
                }}
                title="Approve"
              >
                <Check className="w-3.5 h-3.5" /> Approve
              </Button>
              <Button
                size="xs"
                variant="danger"
                onClick={e => {
                  e.stopPropagation();
                  setActionError(null);
                  setReviewingRequest(req);
                }}
                title="Reject"
              >
                <X className="w-3.5 h-3.5" /> Reject
              </Button>
            </div>
          );
        }

        if (!isAdmin && req.status === 'Pending' && onCancel) {
          return (
            <Button
              size="xs"
              variant="outline"
              onClick={e => {
                e.stopPropagation();
                setActionError(null);
                const result = onCancel(req.id);
                if (result && result.success === false) {
                  setActionError(result.error || 'Failed to cancel this request.');
                }
              }}
              leftIcon={<Ban className="w-3 h-3" />}
            >
              Cancel
            </Button>
          );
        }

        return <span className="text-xs text-slate-500">—</span>;
      },
    },
  ];

  return (
    <div className="space-y-4">
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {actionError && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-600 dark:text-rose-400 text-xs">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{actionError}</span>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredRequests}
        keyExtractor={r => r.id}
        emptyMessage="No leave requests found in this category."
      />

      {reviewingRequest && (
        <LeaveApprovalModal
          isOpen={!!reviewingRequest}
          request={reviewingRequest}
          onClose={() => setReviewingRequest(null)}
          onApprove={(id, note) => onApprove?.(id, note) ?? { success: true }}
          onReject={(id, note) => onReject?.(id, note) ?? { success: true }}
        />
      )}
    </div>
  );
}
