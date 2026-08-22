'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileText,
  Sliders,
  LogOut,
  Sparkles,
  PieChart,
  PlusCircle,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, logout } = useAuthStore();

  const role = session?.role || 'admin';
  const employee = session?.employee;

  const adminNavItems = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Employees', href: '/admin/employees', icon: Users },
    { label: 'Attendance', href: '/admin/attendance', icon: CalendarCheck },
    { label: 'Leave Requests', href: '/admin/leave-requests', icon: FileText },
    { label: 'Settings', href: '/admin/settings', icon: Sliders },
  ];

  const employeeNavItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Attendance', href: '/attendance', icon: CalendarCheck },
    { label: 'Leave Balance', href: '/leave-balance', icon: PieChart },
    { label: 'My Requests', href: '/leave-requests', icon: FileText },
    { label: 'Apply for Leave', href: '/leave-requests/new', icon: PlusCircle },
  ];

  const navItems = role === 'admin' ? adminNavItems : employeeNavItems;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-[#090d16] border-r border-slate-200 dark:border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-white/5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Betopia <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30">HR</span>
              </span>
            </div>
          </Link>
        </div>

        <div className="px-5 py-3 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#0c121e]/50 flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Workspace</span>
          <div className="flex items-center gap-1.5">
            {role === 'admin' ? (
              <Badge variant="role" status="admin">
                <ShieldCheck className="w-3 h-3" /> Admin Portal
              </Badge>
            ) : (
              <Badge variant="role" status="employee">
                <UserCheck className="w-3 h-3" /> Staff Portal
              </Badge>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Main Navigation
          </p>
          {navItems.map(item => {
            const Icon = item.icon;
            const isExactActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href) && item.href !== '/leave-requests' && item.href !== '/admin/leave-requests');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`nav-item ${isExactActive ? 'active font-semibold' : ''}`}
              >
                <Icon className={`w-4 h-4 ${isExactActive ? 'text-blue-500 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-3 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#080c14]">
          {session ? (
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Avatar
                  name={`${employee?.firstName} ${employee?.lastName}`}
                  initials={employee?.avatarInitials}
                  color={employee?.avatarColor}
                  size="sm"
                  online
                />
                <div className="overflow-hidden text-left">
                  <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                    {employee ? `${employee.firstName} ${employee.lastName}` : 'Signed In User'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {employee?.jobTitle || (role === 'admin' ? 'Administrator' : 'Employee')}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                aria-label="Sign out"
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-medium text-blue-400 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 border border-blue-500/20 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
