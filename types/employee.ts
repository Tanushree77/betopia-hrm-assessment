
export type EmployeeStatus = 'Active' | 'Resigned' | 'On Leave';
export type UserRole = 'admin' | 'employee';
export type Gender = 'Male' | 'Female' | 'Other';

export interface Department {
  id: string;
  name: string;
  headId: string;
  color: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  avatarInitials: string;
  avatarColor: string;
  departmentId: string;
  jobTitle: string;
  role: UserRole;
  status: EmployeeStatus;
  gender: Gender;
  joinDate: string;
  resignDate?: string;
  salary: number;
  managerId?: string;
  address?: string;
  emergencyContact?: string;
}

export type EmployeeSummary = Pick<Employee,
  'id' | 'firstName' | 'lastName' | 'email' | 'avatarInitials' | 'avatarColor' |
  'departmentId' | 'jobTitle' | 'role' | 'status' | 'joinDate'
>;
