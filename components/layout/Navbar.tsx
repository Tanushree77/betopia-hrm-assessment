'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore, MOCK_USERS } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import {
  Menu,
  Calendar,
  UserCheck,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { formatDate, todayStr } from '@/lib/dateUtils';

interface NavbarProps {
  onOpenMobileSidebar: () => void;
}

export function Navbar({ onOpenMobileSidebar }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, login } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);

  const getPageTitle = (path: string) => {
    if (path.includes('/admin/dashboard') || path === '/admin') return 'Admin Dashboard';
    if (path.includes('/admin/employees')) return 'Employee Directory';
    if (path.includes('/admin/attendance')) return 'Company Attendance';
    if (path.includes('/admin/leave-requests')) return 'Leave Management';
    if (path.includes('/admin/settings')) return 'System Settings';
    if (path.includes('/dashboard')) return 'Employee Dashboard';
    if (path.includes('/attendance')) return 'My Attendance Log';
    if (path.includes('/leave-balance')) return 'Leave Balances';
    if (path.includes('/leave-requests/new')) return 'Apply for Leave';
    if (path.includes('/leave-requests')) return 'My Leave Requests';
    return 'Betopia HRMS';
  };

  useEffect(() => {
    if (!showSwitchMenu) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSwitchMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSwitchMenu]);

  const handleSwitchUser = (empId: string) => {
    login(empId);
    setShowSwitchMenu(false);
    const targetUser = MOCK_USERS.find(u => u.employeeId === empId);
    if (targetUser?.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-[#080c14]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
            {getPageTitle(pathname)}
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
            Empowering modern workforce operations
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          <span>{formatDate(todayStr(), 'EEEE, MMMM d, yyyy')}</span>
        </div>

        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle color theme"
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-blue-500/40 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowSwitchMenu(!showSwitchMenu)}
            aria-haspopup="true"
            aria-expanded={showSwitchMenu}
            aria-label="Switch persona"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 hover:border-blue-500/40 text-xs text-slate-600 dark:text-slate-200 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden sm:inline">
              Switch Persona: <strong className="text-slate-900 dark:text-white font-medium">{session?.employee?.firstName || 'Select'}</strong>
            </span>
            <span className="sm:hidden font-medium text-slate-900 dark:text-white">
              {session?.employee?.firstName || 'Switch'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>

          {showSwitchMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowSwitchMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-[calc(100vw-32px)] sm:w-72 max-w-sm bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-2xl z-50 p-2 py-2.5 animate-fade-in">
                <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-white/5 mb-1.5">
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Quick Persona Switcher
                  </p>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {MOCK_USERS.map(u => {
                    const isSelected = session?.employeeId === u.employeeId;
                    return (
                      <button
                        key={u.employeeId}
                        onClick={() => handleSwitchUser(u.employeeId)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-blue-600/20 text-blue-700 dark:text-blue-300 font-medium'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="truncate font-medium">{u.label.split('—')[0].trim()}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{u.label.split('—')[1]?.trim()}</p>
                        </div>
                        <Badge
                          variant="role"
                          status={u.role}
                          className="scale-90 flex-shrink-0"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {session && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/10">
            <Avatar
              name={`${session.employee.firstName} ${session.employee.lastName}`}
              initials={session.employee.avatarInitials}
              color={session.employee.avatarColor}
              size="sm"
            />
          </div>
        )}
      </div>
    </header>
  );
}
