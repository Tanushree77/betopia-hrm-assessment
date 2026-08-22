'use client';
import { create } from 'zustand';
import type { Employee, UserRole } from '@/types/employee';
import { EMPLOYEES } from '@/data/employees';

interface EmployeeStore {
  employees: Employee[];

  getAll: () => Employee[];

  getById: (id: string) => Employee | undefined;

  addEmployee: (employee: Employee, actorRole: UserRole) => { success: boolean; error?: string };

  updateEmployee: (employee: Employee, actorRole: UserRole) => { success: boolean; error?: string };
}

export const useEmployeeStore = create<EmployeeStore>()((set, get) => ({
  employees: [...EMPLOYEES],

  getAll: () => get().employees,

  getById: (id) => get().employees.find(e => e.id === id),

  addEmployee: (employee, actorRole) => {
    if (actorRole !== 'admin') return { success: false, error: 'Unauthorized.' };

    set(state => ({ employees: [employee, ...state.employees] }));
    return { success: true };
  },

  updateEmployee: (employee, actorRole) => {
    if (actorRole !== 'admin') return { success: false, error: 'Unauthorized.' };

    const exists = get().employees.some(e => e.id === employee.id);
    if (!exists) return { success: false, error: 'Employee not found.' };

    set(state => ({
      employees: state.employees.map(e => (e.id === employee.id ? employee : e)),
    }));
    return { success: true };
  },
}));
