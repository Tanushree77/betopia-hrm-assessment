'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAuthStore } from '@/store/authStore';
import type { UserRole } from '@/types/employee';

interface AppLayoutProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const emptySubscribe = () => () => {};

function homeRouteFor(role: UserRole) {
  return role === 'admin' ? '/admin/dashboard' : '/dashboard';
}

export function AppLayout({ children, allowedRoles }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();
  const { session } = useAuthStore();
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isAuthorized = !!session && (!allowedRoles || allowedRoles.includes(session.role));

  useEffect(() => {
    if (!isMounted) return;

    if (!session) {
      router.replace('/login');
      return;
    }

    if (allowedRoles && !allowedRoles.includes(session.role)) {
      router.replace(homeRouteFor(session.role));
    }
  }, [isMounted, session, allowedRoles, router]);

  if (!isMounted || !isAuthorized) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#080c14] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <span className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
          <span className="text-sm font-medium">Initializing Betopia HRMS...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#080c14] text-slate-900 dark:text-slate-100 flex flex-col">
      <Sidebar
        isMobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen transition-all duration-300">
        <Navbar onOpenMobileSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
