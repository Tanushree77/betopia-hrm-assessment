'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { Employee, UserRole, EmployeeStatus, Gender } from '@/types/employee';
import { DEPARTMENTS } from '@/data/departments';
import { todayStr } from '@/lib/dateUtils';
import { generateId } from '@/lib/utils';
import { UserPlus, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SaveResult {
  success: boolean;
  error?: string;
}

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => SaveResult | void;
  initialData?: Employee | null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmployeeFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: EmployeeFormModalProps) {
  const isEditing = !!initialData;

  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || '');
  const [departmentId, setDepartmentId] = useState(initialData?.departmentId || DEPARTMENTS[0].id);
  const [role, setRole] = useState<UserRole>(initialData?.role || 'employee');
  const [status, setStatus] = useState<EmployeeStatus>(initialData?.status || 'Active');
  const [gender, setGender] = useState<Gender>(initialData?.gender || 'Male');
  const [joinDate, setJoinDate] = useState(initialData?.joinDate || todayStr());
  const [salary, setSalary] = useState(initialData?.salary ? String(initialData.salary) : '85000');
  const [address, setAddress] = useState(initialData?.address || '');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setFirstName(initialData?.firstName || '');
    setLastName(initialData?.lastName || '');
    setEmail(initialData?.email || '');
    setPhone(initialData?.phone || '');
    setJobTitle(initialData?.jobTitle || '');
    setDepartmentId(initialData?.departmentId || DEPARTMENTS[0].id);
    setRole(initialData?.role || 'employee');
    setStatus(initialData?.status || 'Active');
    setGender(initialData?.gender || 'Male');
    setJoinDate(initialData?.joinDate || todayStr());
    setSalary(initialData?.salary ? String(initialData.salary) : '85000');
    setAddress(initialData?.address || '');
    setFormError(null);
    setIsSuccess(false);
  }, [isOpen, initialData?.id]);

  const isValid =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    email.trim() !== '' &&
    phone.trim() !== '' &&
    jobTitle.trim() !== '' &&
    joinDate !== '' &&
    salary.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isValid) {
      setFormError('Please fill in all required fields.');
      return;
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setFormError('Please enter a valid work email address.');
      return;
    }
    if (Number(salary) <= 0) {
      setFormError('Annual salary must be greater than zero.');
      return;
    }

    const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'EM';
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4', '#ec4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const employee: Employee = {
      id: initialData?.id || generateId('emp'),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatarInitials: initialData?.avatarInitials || initials,
      avatarColor: initialData?.avatarColor || randomColor,
      departmentId,
      jobTitle: jobTitle.trim(),
      role,
      status,
      gender,
      joinDate,
      salary: Number(salary) || 0,
      address: address.trim(),
    };

    const result = onSave(employee);
    if (result && result.success === false) {
      setFormError(result.error || 'Failed to save employee.');
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Employee Profile' : 'Add New Employee'}
      description="Enter workforce member credentials and department assignment."
      maxWidth="lg"
      footer={
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5 w-full">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSuccess} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!isValid || isSuccess}
            className="w-full sm:w-auto"
            leftIcon={isEditing ? <Save className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          >
            {isEditing ? 'Save Changes' : 'Create Employee'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {formError && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-600 dark:text-rose-400 text-xs">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}
        {isSuccess && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-emerald-600 dark:text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{isEditing ? 'Employee profile updated successfully.' : 'Employee created successfully.'}</span>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />
          <Input
            label="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Work Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            label="Phone Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Job Title"
            value={jobTitle}
            onChange={e => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            required
          />
          <Select
            label="Department"
            value={departmentId}
            onChange={e => setDepartmentId(e.target.value)}
            options={DEPARTMENTS.map(d => ({ value: d.id, label: d.name }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Access Role"
            value={role}
            onChange={e => setRole(e.target.value as UserRole)}
            options={[
              { value: 'employee', label: 'Employee' },
              { value: 'admin', label: 'Administrator' },
            ]}
          />
          <Select
            label="Employment Status"
            value={status}
            onChange={e => setStatus(e.target.value as EmployeeStatus)}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'On Leave', label: 'On Leave' },
              { value: 'Resigned', label: 'Resigned' },
            ]}
          />
          <Select
            label="Gender"
            value={gender}
            onChange={e => setGender(e.target.value as Gender)}
            options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Join Date"
            type="date"
            value={joinDate}
            onChange={e => setJoinDate(e.target.value)}
            required
          />
          <Input
            label="Annual Salary ($)"
            type="number"
            value={salary}
            onChange={e => setSalary(e.target.value)}
            required
          />
        </div>

        <Input
          label="Residential Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="e.g. 123 Tech Lane, San Francisco, CA"
        />
      </form>
    </Modal>
  );
}
