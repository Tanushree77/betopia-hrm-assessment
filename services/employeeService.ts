import { DEPARTMENTS } from '@/data/departments';
import { useEmployeeStore } from '@/store/employeeStore';
import type { Employee } from '@/types/employee';
import type { Department } from '@/types/employee';

async function delay<T>(data: T, ms = 80): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}

function getEmployees(): Employee[] {
  return useEmployeeStore.getState().employees;
}
export const employeeService = {
  getAll: (): Promise<Employee[]> =>
    delay([...getEmployees()]),
  getById: (id: string): Promise<Employee | null> =>
    delay(getEmployees().find(e => e.id === id) ?? null),
  getByDepartment: (departmentId: string): Promise<Employee[]> =>
    delay(getEmployees().filter(e => e.departmentId === departmentId)),
  getActive: (): Promise<Employee[]> =>
    delay(getEmployees().filter(e => e.status === 'Active')),
  getDepartments: (): Promise<Department[]> =>
    delay([...DEPARTMENTS]),
  getDepartmentById: (id: string): Promise<Department | null> =>
    delay(DEPARTMENTS.find(d => d.id === id) ?? null),

  search: (query: string): Promise<Employee[]> => {
    const q = query.toLowerCase();
    const deptMatch = DEPARTMENTS.filter(d => d.name.toLowerCase().includes(q)).map(d => d.id);
    return delay(
      getEmployees().filter(
        e =>
          `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.jobTitle.toLowerCase().includes(q) ||
          deptMatch.includes(e.departmentId),
      ),
    );
  },
};