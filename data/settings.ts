import type { Holiday, OfficeSettings } from '@/types/attendance';

export const HOLIDAYS: Holiday[] = [
  { id: 'h1',  date: '2025-01-01', name: "New Year's Day",         type: 'National' },
  { id: 'h2',  date: '2025-01-20', name: 'Martin Luther King Day', type: 'National' },
  { id: 'h3',  date: '2025-02-17', name: "Presidents' Day",        type: 'National' },
  { id: 'h4',  date: '2025-05-26', name: 'Memorial Day',           type: 'National' },
  { id: 'h5',  date: '2025-06-19', name: 'Juneteenth',             type: 'National' },
  { id: 'h6',  date: '2025-07-04', name: 'Independence Day',       type: 'National' },
  { id: 'h7',  date: '2025-09-01', name: 'Labor Day',              type: 'National' },
  { id: 'h8',  date: '2025-11-27', name: 'Thanksgiving Day',       type: 'National' },
  { id: 'h9',  date: '2025-12-25', name: 'Christmas Day',          type: 'National' },
  { id: 'h10', date: '2025-03-14', name: 'Company Foundation Day', type: 'Company'  },
  { id: 'h11', date: '2025-10-31', name: 'Company Offsite',        type: 'Company'  },
];

export const OFFICE_SETTINGS: OfficeSettings = {
  startTime: '09:00',
  endTime: '18:00',
  lateThresholdMinutes: 15,
  weekendDays: [0, 6],
  workHoursPerDay: 8,
};
