'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { EmployeeCard } from './EmployeeCard';
import { EmployeeFormModal } from './EmployeeFormModal';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { Employee } from '@/types/employee';
import { DEPARTMENTS } from '@/data/departments';
import { formatDate } from '@/lib/dateUtils';
import { paginateEmployees, sortEmployees, type EmployeeSortField, type SortDirection } from '@/lib/employeeDirectory';
import { useEmployeeStore } from '@/store/employeeStore';
import { useAuthStore } from '@/store/authStore';
import { Search, LayoutGrid, List, UserPlus, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export function EmployeeList() {
  const pageSize = 8;
  const { employees, addEmployee } = useEmployeeStore();
  const { session } = useAuthStore();
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState<EmployeeSortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const departmentMap = new Map(DEPARTMENTS.map(d => [d.id, d]));

  const filteredEmployees = useMemo(() => employees.filter(emp => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const matchesSearch =
      search === '' ||
      fullName.includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(search.toLowerCase());

    const matchesDept = departmentFilter === 'ALL' || emp.departmentId === departmentFilter;
    const matchesStatus = statusFilter === 'ALL' || emp.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  }), [employees, search, departmentFilter, statusFilter]);

  const sortedEmployees = useMemo(
    () => sortEmployees(filteredEmployees, sortField, sortDirection),
    [filteredEmployees, sortField, sortDirection],
  );

  const paginatedEmployees = paginateEmployees(sortedEmployees, currentPage, pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, departmentFilter, statusFilter, sortField, sortDirection]);

  const handleAddEmployee = (newEmp: Employee) => {
    if (!session) return { success: false, error: 'No active session.' };
    const result = addEmployee(newEmp, session.role);
    if (result.success) {
      setCurrentPage(1);
    }
    return result;
  };

  const columns: Column<Employee>[] = [
    {
      key: 'name',
      header: 'Employee',
      render: emp => (
        <div className="flex items-center gap-3">
          <Avatar
            initials={emp.avatarInitials}
            name={`${emp.firstName} ${emp.lastName}`}
            color={emp.avatarColor}
            size="sm"
            online={emp.status === 'Active'}
          />
          <div>
            <Link
              href={`/admin/employees/${emp.id}`}
              className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-400 text-xs block"
            >
              {emp.firstName} {emp.lastName}
            </Link>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{emp.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'jobTitle',
      header: 'Designation',
      render: emp => <span className="text-xs text-slate-800 dark:text-slate-200">{emp.jobTitle}</span>,
    },
    {
      key: 'department',
      header: 'Department',
      render: emp => {
        const dept = departmentMap.get(emp.departmentId);
        if (!dept) return <span className="text-xs text-slate-500 dark:text-slate-400">—</span>;
        return (
          <span
            className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${dept.color}15`,
              color: dept.color,
              border: `1px solid ${dept.color}30`,
            }}
          >
            {dept.name}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: emp => <Badge variant="employee" status={emp.status} />,
    },
    {
      key: 'role',
      header: 'Role',
      render: emp => <Badge variant="role" status={emp.role} />,
    },
    {
      key: 'joinDate',
      header: 'Join Date',
      render: emp => (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {formatDate(emp.joinDate, 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      key: 'action',
      header: '',
      align: 'right',
      render: emp => (
        <Link
          href={`/admin/employees/${emp.id}`}
          className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-[#111827] p-3.5 rounded-xl border border-slate-200 dark:border-white/5">
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2 flex-1">
          <Input
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="w-full sm:w-64 h-9 text-xs"
          />

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2 w-full">
            <div className="w-full sm:w-40 flex-shrink-0">
              <Select
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                className="w-full h-9 text-xs"
                options={[
                  { value: 'ALL', label: 'All Departments' },
                  ...DEPARTMENTS.map(d => ({ value: d.id, label: d.name })),
                ]}
              />
            </div>

            <div className="w-full sm:w-32 flex-shrink-0">
              <Select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full h-9 text-xs"
                options={[
                  { value: 'ALL', label: 'All Statuses' },
                  { value: 'Active', label: 'Active' },
                  { value: 'On Leave', label: 'On Leave' },
                  { value: 'Resigned', label: 'Resigned' },
                ]}
              />
            </div>

            <div className="w-full sm:w-56 flex-shrink-0">
              <Select
                aria-label="Sort employees"
                value={`${sortField}-${sortDirection}`}
                onChange={e => {
                  const [field, direction] = e.target.value.split('-') as [EmployeeSortField, SortDirection];
                  setSortField(field);
                  setSortDirection(direction);
                }}
                className="w-full h-9 text-xs"
                options={[
                  { value: 'name-asc', label: 'Name: A to Z' },
                  { value: 'name-desc', label: 'Name: Z to A' },
                  { value: 'joinDate-desc', label: 'Newest joined' },
                  { value: 'joinDate-asc', label: 'Longest tenure' },
                  { value: 'status-asc', label: 'Status: A to Z' },
                  { value: 'status-desc', label: 'Status: Z to A' },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-white/5">
          <div className="flex items-center bg-slate-100 dark:bg-[#0d1422] p-1 rounded-lg border border-slate-200 dark:border-white/5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Grid View"
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Table View"
              aria-label="Table view"
              aria-pressed={viewMode === 'table'}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Add Member
          </Button>
        </div>
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 text-xs">
          No employees match the specified criteria.
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedEmployees.items.map(emp => (
            <EmployeeCard key={emp.id} employee={emp} />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginatedEmployees.items}
          keyExtractor={emp => emp.id}
        />
      )}

      {filteredEmployees.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p>
            Showing {((paginatedEmployees.page - 1) * pageSize) + 1}–{Math.min(paginatedEmployees.page * pageSize, sortedEmployees.length)} of {sortedEmployees.length} employees
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={paginatedEmployees.page === 1}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>
            <span className="min-w-20 text-center">Page {paginatedEmployees.page} of {paginatedEmployees.totalPages}</span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setCurrentPage(page => Math.min(paginatedEmployees.totalPages, page + 1))}
              disabled={paginatedEmployees.page === paginatedEmployees.totalPages}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <EmployeeFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddEmployee}
      />
    </div>
  );
}
