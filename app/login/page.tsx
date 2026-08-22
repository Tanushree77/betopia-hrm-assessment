'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, MOCK_USERS } from '@/store/authStore';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { EMPLOYEES } from '@/data/employees';
import { Sparkles, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const handleSelectUser = (employeeId: string, role: string) => {
    login(employeeId);
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080c14] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 mx-auto">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Betopia HRMS Portal
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Select an employee persona to log in and test the system with preconfigured roles and permissions.
          </p>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Available Test Accounts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MOCK_USERS.map(user => {
              const emp = EMPLOYEES.find(e => e.id === user.employeeId);
              if (!emp) return null;

              return (
                <button
                  key={user.employeeId}
                  onClick={() => handleSelectUser(user.employeeId, user.role)}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-slate-800/60 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Avatar
                      initials={emp.avatarInitials}
                      name={`${emp.firstName} ${emp.lastName}`}
                      color={emp.avatarColor}
                      size="sm"
                    />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {emp.firstName} {emp.lastName}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{emp.jobTitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <Badge variant="role" status={user.role} className="scale-90">
                      {user.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                      {user.role}
                    </Badge>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Demo HRMS environment · Powered by Next.js & Tailwind CSS
        </p>
      </div>
    </div>
  );
}
