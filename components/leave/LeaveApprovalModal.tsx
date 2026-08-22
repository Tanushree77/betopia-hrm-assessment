'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import type { LeaveRequest } from '@/types/leave';
import { EMPLOYEES } from '@/data/employees';
import { LEAVE_TYPES } from '@/data/leaveTypes';
import { formatDate } from '@/lib/dateUtils';
import { CheckCircle2, XCircle, Calendar, FileText, AlertTriangle } from 'lucide-react';

interface ActionResult {
  success: boolean;
  error?: string;
}

interface LeaveApprovalModalProps {
  request: LeaveRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (requestId: string, note?: string) => ActionResult | void;
  onReject: (requestId: string, note?: string) => ActionResult | void;
}

export function LeaveApprovalModal({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: LeaveApprovalModalProps) {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNote('');
      setActionError(null);
    }
  }, [isOpen, request?.id]);

  if (!request) return null;

  const employee = EMPLOYEES.find(e => e.id === request.employeeId);
  const leaveType = LEAVE_TYPES.find(lt => lt.id === request.leaveTypeId);

  const handleAction = (type: 'approve' | 'reject') => {
    setIsSubmitting(true);
    setActionError(null);
    const result = type === 'approve' ? onApprove(request.id, note) : onReject(request.id, note);
    setIsSubmitting(false);

    if (result && result.success === false) {
      setActionError(result.error || `Failed to ${type} this request.`);
      return;
    }

    setNote('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Leave Application"
      description="Review employee leave request details before approving or declining."
      maxWidth="md"
      footer={
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2.5 w-full">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting} className="w-full sm:w-auto">
            Cancel
          </Button>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="danger"
              size="sm"
              isLoading={isSubmitting}
              leftIcon={<XCircle className="w-4 h-4" />}
              onClick={() => handleAction('reject')}
              className="flex-1 sm:flex-initial"
            >
              Reject
            </Button>
            <Button
              variant="success"
              size="sm"
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => handleAction('approve')}
              className="flex-1 sm:flex-initial"
            >
              Approve Request
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {actionError && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-600 dark:text-rose-400 text-xs">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{actionError}</span>
          </div>
        )}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-white/5">
          <Avatar
            initials={employee?.avatarInitials}
            name={employee ? `${employee.firstName} ${employee.lastName}` : ''}
            color={employee?.avatarColor}
            size="md"
          />
          <div className="truncate">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {employee ? `${employee.firstName} ${employee.lastName}` : request.employeeId}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {employee?.jobTitle} · {employee?.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Leave Category</span>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: leaveType?.color || '#3b82f6' }}
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {leaveType?.name || request.leaveTypeId}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Duration</span>
            <span className="text-xs font-bold text-blue-400">
              {request.totalDays} {request.totalDays === 1 ? 'Working Day' : 'Working Days'}
            </span>
          </div>

          <div className="col-span-1 sm:col-span-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
              <span>
                {formatDate(request.startDate, 'MMM d, yyyy')}
                {request.isHalfDayStart ? ' (Half Day)' : ''}
                {' → '}
                {formatDate(request.endDate, 'MMM d, yyyy')}
                {request.isHalfDayEnd ? ' (Half Day)' : ''}
              </span>
            </div>
            <Badge variant="leave" status={request.status} />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span className="font-medium">Reason for Request</span>
          </div>
          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">{request.reason}</p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
            Manager Review Comment (Optional)
          </label>
          <textarea
            rows={2}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add comments or justification for this decision..."
            className="input-base text-xs resize-none"
          />
        </div>
      </div>
    </Modal>
  );
}
