import assert from 'node:assert/strict';
import test from 'node:test';
import { paginateEmployees, sortEmployees } from '../lib/employeeDirectory.ts';

const employees = [
  { id: 'e1', firstName: 'Zara', lastName: 'Ali', joinDate: '2023-05-01', status: 'Active' },
  { id: 'e2', firstName: 'Amir', lastName: 'Khan', joinDate: '2021-01-15', status: 'Resigned' },
  { id: 'e3', firstName: 'Bella', lastName: 'Chen', joinDate: '2022-09-30', status: 'On Leave' },
];

test('sortEmployees orders names alphabetically and reverses them for descending order', () => {
  assert.deepEqual(
    sortEmployees(employees, 'name', 'asc').map(employee => employee.id),
    ['e2', 'e3', 'e1'],
  );
  assert.deepEqual(
    sortEmployees(employees, 'name', 'desc').map(employee => employee.id),
    ['e1', 'e3', 'e2'],
  );
});

test('sortEmployees orders join dates newest first', () => {
  assert.deepEqual(
    sortEmployees(employees, 'joinDate', 'desc').map(employee => employee.id),
    ['e1', 'e3', 'e2'],
  );
});

test('paginateEmployees returns only the requested page and reports total pages', () => {
  const result = paginateEmployees(employees, 2, 2);

  assert.deepEqual(result.items.map(employee => employee.id), ['e3']);
  assert.equal(result.page, 2);
  assert.equal(result.totalPages, 2);
});

test('paginateEmployees clamps an out-of-range page to the last available page', () => {
  const result = paginateEmployees(employees, 9, 2);

  assert.deepEqual(result.items.map(employee => employee.id), ['e3']);
  assert.equal(result.page, 2);
});
