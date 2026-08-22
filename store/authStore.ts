'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthSession, MockUser } from '@/types/auth';
import { EMPLOYEES } from '@/data/employees';

export const MOCK_USERS: MockUser[] = [
  { employeeId: 'e1', role: 'admin', label: 'Tanusree Sen — Engineering Manager (Admin)' },
  { employeeId: 'e15', role: 'admin', label: 'Sadia Islam — HR Manager (Admin)' },
  { employeeId: 'e6', role: 'admin', label: 'Sultana Razia — Head of Product (Admin)' },
  { employeeId: 'e2', role: 'employee', label: 'Nusrat Jahan — Senior Engineer (Employee)' },
  { employeeId: 'e3', role: 'employee', label: 'Rakibul Islam — Software Engineer (Employee)' },
  { employeeId: 'e10', role: 'employee', label: 'Nayeem Chowdhury — UI/UX Designer (Employee)' },
  { employeeId: 'e7', role: 'employee', label: 'Tanvir Ahmed — Product Manager (Employee)' },
  { employeeId: 'e19', role: 'employee', label: 'Rima Sultana — Financial Analyst (Employee)' },
];

interface AuthStore {
  session: AuthSession | null;
  login: (employeeId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: null,

      login: (employeeId: string) => {
        const employee = EMPLOYEES.find(e => e.id === employeeId);
        if (!employee) return;
        set({
          session: {
            employeeId: employee.id,
            role: employee.role,
            employee,
          },
        });
      },

      logout: () => set({ session: null }),
    }),
    { name: 'hrm-auth-session' },
  ),
);
