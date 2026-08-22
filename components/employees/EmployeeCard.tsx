'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import type { Employee } from '@/types/employee';
import { DEPARTMENTS } from '@/data/departments';
import { Mail, Phone, Calendar, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';

interface EmployeeCardProps {
  employee: Employee;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  const department = DEPARTMENTS.find(d => d.id === employee.departmentId);

  return (
    <Card className="p-5 flex flex-col justify-between hover:border-slate-700 transition-all group">
      <div>
        <div className="flex items-start justify-between gap-3">
          <Avatar
            initials={employee.avatarInitials}
            name={`${employee.firstName} ${employee.lastName}`}
            color={employee.avatarColor}
            size="lg"
            online={employee.status === 'Active'}
          />
          <div className="flex flex-col items-end gap-1.5">
            <Badge variant="employee" status={employee.status} />
            <Badge variant="role" status={employee.role} className="scale-90 origin-right">
              {employee.role === 'admin' ? (
                <ShieldCheck className="w-3 h-3" />
              ) : (
                <User className="w-3 h-3" />
              )}
              {employee.role}
            </Badge>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {employee.firstName} {employee.lastName}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">{employee.jobTitle}</p>
          {department && (
            <span
              className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
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

        <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/5 pt-3">
          <div className="flex items-center gap-2 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="truncate">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <Phone className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span>{employee.phone}</span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span>Joined {formatDate(employee.joinDate, 'MMM yyyy')}</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-white/5 mt-4">
        <Link
          href={`/admin/employees/${employee.id}`}
          className="flex items-center justify-between text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>View Detailed Profile</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </Card>
  );
}
