import type { AttendanceRecord } from '@/types/attendance';

const aid = (emp: string, date: string) => `att_${emp}_${date.replace(/-/g, '')}`;

const JAN_2025: AttendanceRecord[] = [
  { id: aid('e1','2025-01-01'), employeeId:'e1', date:'2025-01-01', status:'Holiday' },
  { id: aid('e1','2025-01-02'), employeeId:'e1', date:'2025-01-02', status:'Present', checkIn:'08:52', checkOut:'18:05', workHours:9.1 },
  { id: aid('e1','2025-01-03'), employeeId:'e1', date:'2025-01-03', status:'Present', checkIn:'08:58', checkOut:'18:00', workHours:9.0 },
  { id: aid('e1','2025-01-04'), employeeId:'e1', date:'2025-01-04', status:'Weekend' },
  { id: aid('e1','2025-01-05'), employeeId:'e1', date:'2025-01-05', status:'Weekend' },
  { id: aid('e1','2025-01-06'), employeeId:'e1', date:'2025-01-06', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e1','2025-01-07'), employeeId:'e1', date:'2025-01-07', status:'Present', checkIn:'08:45', checkOut:'18:30', workHours:9.7 },
  { id: aid('e1','2025-01-08'), employeeId:'e1', date:'2025-01-08', status:'Present', checkIn:'09:10', checkOut:'18:00', workHours:8.8 },
  { id: aid('e1','2025-01-09'), employeeId:'e1', date:'2025-01-09', status:'Present', checkIn:'08:55', checkOut:'17:55', workHours:9.0 },
  { id: aid('e1','2025-01-10'), employeeId:'e1', date:'2025-01-10', status:'Late',    checkIn:'09:35', checkOut:'18:00', workHours:8.4 },
  { id: aid('e1','2025-01-11'), employeeId:'e1', date:'2025-01-11', status:'Weekend' },
  { id: aid('e1','2025-01-12'), employeeId:'e1', date:'2025-01-12', status:'Weekend' },
  { id: aid('e1','2025-01-13'), employeeId:'e1', date:'2025-01-13', status:'Present', checkIn:'08:58', checkOut:'18:05', workHours:9.1 },
  { id: aid('e1','2025-01-14'), employeeId:'e1', date:'2025-01-14', status:'Present', checkIn:'08:50', checkOut:'18:00', workHours:9.1 },
  { id: aid('e1','2025-01-15'), employeeId:'e1', date:'2025-01-15', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e1','2025-01-16'), employeeId:'e1', date:'2025-01-16', status:'Present', checkIn:'09:02', checkOut:'18:00', workHours:9.0 },
  { id: aid('e1','2025-01-17'), employeeId:'e1', date:'2025-01-17', status:'Absent',  notes:'No call no show' },
  { id: aid('e1','2025-01-18'), employeeId:'e1', date:'2025-01-18', status:'Weekend' },
  { id: aid('e1','2025-01-19'), employeeId:'e1', date:'2025-01-19', status:'Weekend' },
  { id: aid('e1','2025-01-20'), employeeId:'e1', date:'2025-01-20', status:'Holiday' },
  { id: aid('e1','2025-01-21'), employeeId:'e1', date:'2025-01-21', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e1','2025-01-22'), employeeId:'e1', date:'2025-01-22', status:'Present', checkIn:'08:55', checkOut:'18:00', workHours:9.1 },
  { id: aid('e1','2025-01-23'), employeeId:'e1', date:'2025-01-23', status:'Present', checkIn:'09:00', checkOut:'17:30', workHours:8.5 },
  { id: aid('e1','2025-01-24'), employeeId:'e1', date:'2025-01-24', status:'Present', checkIn:'08:48', checkOut:'18:00', workHours:9.2 },
  { id: aid('e1','2025-01-25'), employeeId:'e1', date:'2025-01-25', status:'Weekend' },
  { id: aid('e1','2025-01-26'), employeeId:'e1', date:'2025-01-26', status:'Weekend' },
  { id: aid('e1','2025-01-27'), employeeId:'e1', date:'2025-01-27', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e1','2025-01-28'), employeeId:'e1', date:'2025-01-28', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e1','2025-01-29'), employeeId:'e1', date:'2025-01-29', status:'Present', checkIn:'09:05', checkOut:'18:00', workHours:8.9 },
  { id: aid('e1','2025-01-30'), employeeId:'e1', date:'2025-01-30', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e1','2025-01-31'), employeeId:'e1', date:'2025-01-31', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },

  { id: aid('e2','2025-01-01'), employeeId:'e2', date:'2025-01-01', status:'Holiday' },
  { id: aid('e2','2025-01-02'), employeeId:'e2', date:'2025-01-02', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e2','2025-01-03'), employeeId:'e2', date:'2025-01-03', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e2','2025-01-04'), employeeId:'e2', date:'2025-01-04', status:'Weekend' },
  { id: aid('e2','2025-01-05'), employeeId:'e2', date:'2025-01-05', status:'Weekend' },
  { id: aid('e2','2025-01-06'), employeeId:'e2', date:'2025-01-06', status:'Leave', leaveRequestId:'lr1' },
  { id: aid('e2','2025-01-07'), employeeId:'e2', date:'2025-01-07', status:'Leave', leaveRequestId:'lr1' },
  { id: aid('e2','2025-01-08'), employeeId:'e2', date:'2025-01-08', status:'Leave', leaveRequestId:'lr1' },
  { id: aid('e2','2025-01-09'), employeeId:'e2', date:'2025-01-09', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e2','2025-01-10'), employeeId:'e2', date:'2025-01-10', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e2','2025-01-11'), employeeId:'e2', date:'2025-01-11', status:'Weekend' },
  { id: aid('e2','2025-01-12'), employeeId:'e2', date:'2025-01-12', status:'Weekend' },
  { id: aid('e2','2025-01-13'), employeeId:'e2', date:'2025-01-13', status:'Present', checkIn:'09:18', checkOut:'18:00', workHours:8.7, notes:'Late arrival' },
  { id: aid('e2','2025-01-14'), employeeId:'e2', date:'2025-01-14', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e2','2025-01-15'), employeeId:'e2', date:'2025-01-15', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e2','2025-01-16'), employeeId:'e2', date:'2025-01-16', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e2','2025-01-17'), employeeId:'e2', date:'2025-01-17', status:'Present', checkIn:'08:55', checkOut:'18:00', workHours:9.1 },
  { id: aid('e2','2025-01-18'), employeeId:'e2', date:'2025-01-18', status:'Weekend' },
  { id: aid('e2','2025-01-19'), employeeId:'e2', date:'2025-01-19', status:'Weekend' },
  { id: aid('e2','2025-01-20'), employeeId:'e2', date:'2025-01-20', status:'Holiday' },
  { id: aid('e2','2025-01-21'), employeeId:'e2', date:'2025-01-21', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e2','2025-01-22'), employeeId:'e2', date:'2025-01-22', status:'Half Day', checkIn:'09:00', checkOut:'13:00', workHours:4.0 },
  { id: aid('e2','2025-01-23'), employeeId:'e2', date:'2025-01-23', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e2','2025-01-24'), employeeId:'e2', date:'2025-01-24', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e2','2025-01-25'), employeeId:'e2', date:'2025-01-25', status:'Weekend' },
  { id: aid('e2','2025-01-26'), employeeId:'e2', date:'2025-01-26', status:'Weekend' },
  { id: aid('e2','2025-01-27'), employeeId:'e2', date:'2025-01-27', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e2','2025-01-28'), employeeId:'e2', date:'2025-01-28', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e2','2025-01-29'), employeeId:'e2', date:'2025-01-29', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e2','2025-01-30'), employeeId:'e2', date:'2025-01-30', status:'Absent', notes:'Unexcused' },
  { id: aid('e2','2025-01-31'), employeeId:'e2', date:'2025-01-31', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },

  { id: aid('e3','2025-01-01'), employeeId:'e3', date:'2025-01-01', status:'Holiday' },
  { id: aid('e3','2025-01-02'), employeeId:'e3', date:'2025-01-02', status:'Present', checkIn:'09:10', checkOut:'18:00', workHours:8.8 },
  { id: aid('e3','2025-01-03'), employeeId:'e3', date:'2025-01-03', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e3','2025-01-04'), employeeId:'e3', date:'2025-01-04', status:'Weekend' },
  { id: aid('e3','2025-01-05'), employeeId:'e3', date:'2025-01-05', status:'Weekend' },
  { id: aid('e3','2025-01-06'), employeeId:'e3', date:'2025-01-06', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e3','2025-01-07'), employeeId:'e3', date:'2025-01-07', status:'Late',    checkIn:'09:45', checkOut:'18:00', workHours:8.2 },
  { id: aid('e3','2025-01-08'), employeeId:'e3', date:'2025-01-08', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e3','2025-01-09'), employeeId:'e3', date:'2025-01-09', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e3','2025-01-10'), employeeId:'e3', date:'2025-01-10', status:'Present', checkIn:'08:50', checkOut:'18:00', workHours:9.2 },
  { id: aid('e3','2025-01-11'), employeeId:'e3', date:'2025-01-11', status:'Weekend' },
  { id: aid('e3','2025-01-12'), employeeId:'e3', date:'2025-01-12', status:'Weekend' },
  { id: aid('e3','2025-01-13'), employeeId:'e3', date:'2025-01-13', status:'Leave',   leaveRequestId:'lr2' },
  { id: aid('e3','2025-01-14'), employeeId:'e3', date:'2025-01-14', status:'Leave',   leaveRequestId:'lr2' },
  { id: aid('e3','2025-01-15'), employeeId:'e3', date:'2025-01-15', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e3','2025-01-16'), employeeId:'e3', date:'2025-01-16', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e3','2025-01-17'), employeeId:'e3', date:'2025-01-17', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e3','2025-01-18'), employeeId:'e3', date:'2025-01-18', status:'Weekend' },
  { id: aid('e3','2025-01-19'), employeeId:'e3', date:'2025-01-19', status:'Weekend' },
  { id: aid('e3','2025-01-20'), employeeId:'e3', date:'2025-01-20', status:'Holiday' },
  { id: aid('e3','2025-01-21'), employeeId:'e3', date:'2025-01-21', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e3','2025-01-22'), employeeId:'e3', date:'2025-01-22', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e3','2025-01-23'), employeeId:'e3', date:'2025-01-23', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e3','2025-01-24'), employeeId:'e3', date:'2025-01-24', status:'Absent',  notes:'Unnotified absence' },
  { id: aid('e3','2025-01-25'), employeeId:'e3', date:'2025-01-25', status:'Weekend' },
  { id: aid('e3','2025-01-26'), employeeId:'e3', date:'2025-01-26', status:'Weekend' },
  { id: aid('e3','2025-01-27'), employeeId:'e3', date:'2025-01-27', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e3','2025-01-28'), employeeId:'e3', date:'2025-01-28', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e3','2025-01-29'), employeeId:'e3', date:'2025-01-29', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e3','2025-01-30'), employeeId:'e3', date:'2025-01-30', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },
  { id: aid('e3','2025-01-31'), employeeId:'e3', date:'2025-01-31', status:'Present', checkIn:'09:00', checkOut:'18:00', workHours:9.0 },

  ...generateMonthAttendance('e4', 2025, 1, { presentRate: 0.85, lateRate: 0.1, absentRate: 0.05 }),
  ...generateMonthAttendance('e5', 2025, 1, { presentRate: 0,    leaveRate: 1.0 }),
  ...generateMonthAttendance('e6', 2025, 1, { presentRate: 0.9,  lateRate: 0.05, absentRate: 0.05 }),
  ...generateMonthAttendance('e7', 2025, 1, { presentRate: 0.88, lateRate: 0.07, absentRate: 0.05 }),
  ...generateMonthAttendance('e8', 2025, 1, { presentRate: 0.92, lateRate: 0.04, absentRate: 0.04 }),
  ...generateMonthAttendance('e9', 2025, 1, { presentRate: 0.9,  lateRate: 0.05, absentRate: 0.05 }),
  ...generateMonthAttendance('e10',2025, 1, { presentRate: 0.87, lateRate: 0.08, absentRate: 0.05 }),
  ...generateMonthAttendance('e12',2025, 1, { presentRate: 0.91, lateRate: 0.05, absentRate: 0.04 }),
  ...generateMonthAttendance('e13',2025, 1, { presentRate: 0.85, lateRate: 0.1,  absentRate: 0.05 }),
  ...generateMonthAttendance('e14',2025, 1, { presentRate: 0.89, lateRate: 0.06, absentRate: 0.05 }),
  ...generateMonthAttendance('e15',2025, 1, { presentRate: 0.95, lateRate: 0.03, absentRate: 0.02 }),
  ...generateMonthAttendance('e16',2025, 1, { presentRate: 0.88, lateRate: 0.07, absentRate: 0.05 }),
  ...generateMonthAttendance('e17',2025, 1, { presentRate: 0.86, lateRate: 0.09, absentRate: 0.05 }),
  ...generateMonthAttendance('e18',2025, 1, { presentRate: 0.93, lateRate: 0.04, absentRate: 0.03 }),
  ...generateMonthAttendance('e19',2025, 1, { presentRate: 0.9,  lateRate: 0.05, absentRate: 0.05 }),
  ...generateMonthAttendance('e20',2025, 1, { presentRate: 0.88, lateRate: 0.07, absentRate: 0.05 }),
  ...generateMonthAttendance('e21',2025, 1, { presentRate: 0.9,  lateRate: 0.05, absentRate: 0.05 }),
  ...generateMonthAttendance('e22',2025, 1, { presentRate: 0.87, lateRate: 0.08, absentRate: 0.05 }),
];

const FEB_2025: AttendanceRecord[] = [
  ...generateMonthAttendance('e1', 2025, 2, { presentRate: 0.91, lateRate: 0.05, absentRate: 0.04 }),
  ...generateMonthAttendance('e2', 2025, 2, { presentRate: 0.87, lateRate: 0.05, absentRate: 0.04, leaveRate: 0.04 }, [
    { date: '2025-02-03', status: 'Leave', leaveRequestId: 'lr5' } as Partial<AttendanceRecord>,
  ]),
  { id: aid('e2','2025-02-10'), employeeId:'e2', date:'2025-02-10', status:'Leave', leaveRequestId:'lr6' },
  { id: aid('e2','2025-02-11'), employeeId:'e2', date:'2025-02-11', status:'Leave', leaveRequestId:'lr6' },
  { id: aid('e2','2025-02-12'), employeeId:'e2', date:'2025-02-12', status:'Leave', leaveRequestId:'lr6' },
  ...generateMonthAttendance('e3', 2025, 2, { presentRate: 0.9,  lateRate: 0.05, absentRate: 0.05 }),
  ...generateMonthAttendance('e4', 2025, 2, { presentRate: 0.82, lateRate: 0.09, absentRate: 0.09 }),
  ...generateMonthAttendance('e5', 2025, 2, { presentRate: 0,    leaveRate: 1.0 }),
  ...generateMonthAttendance('e6', 2025, 2, { presentRate: 0.92, lateRate: 0.04, absentRate: 0.04 }),
  ...generateMonthAttendance('e7', 2025, 2, { presentRate: 0.9,  lateRate: 0.06, absentRate: 0.04 }),
  ...generateMonthAttendance('e8', 2025, 2, { presentRate: 0.89, lateRate: 0.06, absentRate: 0.05 }),
  ...generateMonthAttendance('e9', 2025, 2, { presentRate: 0.91, lateRate: 0.05, absentRate: 0.04 }),
  ...generateMonthAttendance('e10',2025, 2, { presentRate: 0.88, lateRate: 0.07, absentRate: 0.05 }),
  ...generateMonthAttendance('e12',2025, 2, { presentRate: 0.9,  lateRate: 0.05, absentRate: 0.05 }),
  ...generateMonthAttendance('e13',2025, 2, { presentRate: 0.86, lateRate: 0.06, absentRate: 0.04, leaveRate: 0.04 }),
  ...generateMonthAttendance('e14',2025, 2, { presentRate: 0.88, lateRate: 0.07, absentRate: 0.05 }),
  ...generateMonthAttendance('e15',2025, 2, { presentRate: 0.94, lateRate: 0.03, absentRate: 0.03 }),
  ...generateMonthAttendance('e16',2025, 2, { presentRate: 0.88, lateRate: 0.07, absentRate: 0.05 }),
  ...generateMonthAttendance('e17',2025, 2, { presentRate: 0.87, lateRate: 0.08, absentRate: 0.05 }),
  ...generateMonthAttendance('e18',2025, 2, { presentRate: 0.92, lateRate: 0.04, absentRate: 0.04 }),
  ...generateMonthAttendance('e19',2025, 2, { presentRate: 0.9,  lateRate: 0.05, absentRate: 0.05 }),
  ...generateMonthAttendance('e20',2025, 2, { presentRate: 0.88, lateRate: 0.07, absentRate: 0.05 }),
  ...generateMonthAttendance('e21',2025, 2, { presentRate: 0.91, lateRate: 0.05, absentRate: 0.04 }),
  ...generateMonthAttendance('e22',2025, 2, { presentRate: 0.88, lateRate: 0.08, absentRate: 0.04 }),
];

const MAR_2025: AttendanceRecord[] = [
  ...generateMonthAttendance('e1', 2025, 3, { presentRate: 0.9,  lateRate: 0.05, absentRate: 0.05 }),
  ...generateMonthAttendance('e2', 2025, 3, { presentRate: 0.9,  lateRate: 0.05, leaveRate: 0.05 }),
  ...generateMonthAttendance('e3', 2025, 3, { presentRate: 0.88, lateRate: 0.07, absentRate: 0.05 }),
  ...generateMonthAttendance('e4', 2025, 3, { presentRate: 0.87, lateRate: 0.08, absentRate: 0.05 }),
  ...generateMonthAttendance('e5', 2025, 3, { presentRate: 0,    leaveRate: 1.0 }),
  ...generateMonthAttendance('e6', 2025, 3, { presentRate: 0.93, lateRate: 0.04, absentRate: 0.03 }),
  ...generateMonthAttendance('e7', 2025, 3, { presentRate: 0.88, lateRate: 0.07, absentRate: 0.05 }),
  ...generateMonthAttendance('e8', 2025, 3, { presentRate: 0.9,  lateRate: 0.05, absentRate: 0.05 }),
  ...generateMonthAttendance('e9', 2025, 3, { presentRate: 0.91, lateRate: 0.05, absentRate: 0.04 }),
  ...generateMonthAttendance('e10',2025, 3, { presentRate: 0.87, lateRate: 0.08, absentRate: 0.05 }),
  ...generateMonthAttendance('e12',2025, 3, { presentRate: 0.91, lateRate: 0.05, absentRate: 0.04 }),
  ...generateMonthAttendance('e13',2025, 3, { presentRate: 0.87, lateRate: 0.08, absentRate: 0.05 }),
  ...generateMonthAttendance('e14',2025, 3, { presentRate: 0.89, lateRate: 0.06, absentRate: 0.05 }),
  ...generateMonthAttendance('e15',2025, 3, { presentRate: 0.95, lateRate: 0.03, absentRate: 0.02 }),
  ...generateMonthAttendance('e16',2025, 3, { presentRate: 0.88, lateRate: 0.07, absentRate: 0.05 }),
  ...generateMonthAttendance('e17',2025, 3, { presentRate: 0.88, lateRate: 0.07, absentRate: 0.05 }),
  ...generateMonthAttendance('e18',2025, 3, { presentRate: 0.93, lateRate: 0.04, absentRate: 0.03 }),
  ...generateMonthAttendance('e19',2025, 3, { presentRate: 0.9,  lateRate: 0.05, leaveRate: 0.05 }),
  ...generateMonthAttendance('e20',2025, 3, { presentRate: 0.89, lateRate: 0.06, absentRate: 0.05 }),
  ...generateMonthAttendance('e21',2025, 3, { presentRate: 0.9,  lateRate: 0.05, absentRate: 0.05 }),
  ...generateMonthAttendance('e22',2025, 3, { presentRate: 0.88, lateRate: 0.07, absentRate: 0.05 }),
];

function generateMonthAttendance(
  employeeId: string,
  year: number,
  month: number,
  rates: {
    presentRate?: number;
    lateRate?: number;
    halfDayRate?: number;
    absentRate?: number;
    leaveRate?: number;
  },
  overrides: Partial<AttendanceRecord>[] = []
): AttendanceRecord[] {
  const HOLIDAYS_DATES: Record<string, boolean> = {
    '2025-01-01': true, '2025-01-20': true, '2025-02-17': true,
    '2025-05-26': true, '2025-06-19': true, '2025-07-04': true,
    '2025-09-01': true, '2025-11-27': true, '2025-12-25': true,
    '2025-03-14': true,
  };

  const daysInMonth = new Date(year, month, 0).getDate();
  const records: AttendanceRecord[] = [];
  const overrideMap: Map<string, Partial<AttendanceRecord>> = new Map(
    overrides.map(o => [o.date!, o])
  );

  let seed = employeeId.charCodeAt(1) + month * 31 + year;
  const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return Math.abs(seed) / 0xffffffff; };

  const { presentRate = 0.88, lateRate = 0.05, halfDayRate = 0.02, leaveRate = 0 } = rates;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month - 1, day);
    const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const dayOfWeek = dateObj.getDay();
    const id = aid(employeeId, dateStr);

    if (overrideMap.has(dateStr)) {
      const ov = overrideMap.get(dateStr)!;
      records.push({ id, employeeId, date: dateStr, status: 'Present', ...ov } as AttendanceRecord);
      continue;
    }

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      records.push({ id, employeeId, date: dateStr, status: 'Weekend' });
      continue;
    }
    if (HOLIDAYS_DATES[dateStr]) {
      records.push({ id, employeeId, date: dateStr, status: 'Holiday' });
      continue;
    }

    if (leaveRate >= 1) {
      records.push({ id, employeeId, date: dateStr, status: 'Leave' });
      continue;
    }

    const r = rand();
    let status: AttendanceRecord['status'];
    const cumPresent = presentRate;
    const cumLate = cumPresent + lateRate;
    const cumHalf = cumLate + halfDayRate;
    const cumLeave = cumHalf + leaveRate;

    if (r < cumPresent) status = 'Present';
    else if (r < cumLate)   status = 'Late';
    else if (r < cumHalf)   status = 'Half Day';
    else if (r < cumLeave)  status = 'Leave';
    else                    status = 'Absent';

    const checkInHour = status === 'Late' ? `${9 + Math.floor(rand() * 2)}:${20 + Math.floor(rand() * 30)}` :
                        status === 'Present' ? `08:${45 + Math.floor(rand() * 20)}` :
                        status === 'Half Day' ? '09:00' : undefined;
    const checkOutHour = status === 'Half Day' ? '13:00' :
                         checkInHour ? '18:00' : undefined;
    const workHours = status === 'Half Day' ? 4 :
                      checkInHour ? parseFloat((9 - (rand() * 0.5)).toFixed(1)) : undefined;

    records.push({
      id,
      employeeId,
      date: dateStr,
      status,
      ...(checkInHour ? { checkIn: checkInHour } : {}),
      ...(checkOutHour ? { checkOut: checkOutHour } : {}),
      ...(workHours !== undefined ? { workHours } : {}),
    });
  }

  return records;
}

function dedup(records: AttendanceRecord[]): AttendanceRecord[] {
  const seen = new Set<string>();
  return records.filter(r => {
    const key = `${r.employeeId}_${r.date}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const ATTENDANCE_RECORDS: AttendanceRecord[] = dedup([
  ...JAN_2025,
  ...FEB_2025,
  ...MAR_2025,
]);
