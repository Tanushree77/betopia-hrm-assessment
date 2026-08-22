import type { Employee, UserRole } from './employee';

export interface AuthSession {
  employeeId: string;
  role: UserRole;
  employee: Employee;
}

export interface MockUser {
  employeeId: string;
  role: UserRole;
  label: string;
}
