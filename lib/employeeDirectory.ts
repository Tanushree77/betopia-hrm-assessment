export type EmployeeSortField = 'name' | 'joinDate' | 'status';
export type SortDirection = 'asc' | 'desc';

interface DirectoryEmployee {
  firstName: string;
  lastName: string;
  joinDate: string;
  status: string;
}

export function sortEmployees<T extends DirectoryEmployee>(
  employees: T[],
  field: EmployeeSortField,
  direction: SortDirection,
): T[] {
  const multiplier = direction === 'asc' ? 1 : -1;

  return [...employees].sort((first, second) => {
    const firstValue = field === 'name'
      ? `${first.firstName} ${first.lastName}`
      : first[field];
    const secondValue = field === 'name'
      ? `${second.firstName} ${second.lastName}`
      : second[field];

    return firstValue.localeCompare(secondValue) * multiplier;
  });
}

export function paginateEmployees<T>(items: T[], requestedPage: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page,
    totalPages,
  };
}
