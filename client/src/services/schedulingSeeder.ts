import type { Employee, Shift, Schedule } from '../types';
import { createEmployee, createShift, createSchedule } from './db';
import { format, startOfWeek, addDays } from 'date-fns';

export async function seedSchedulingData(): Promise<void> {
  console.log('Seeding scheduling data...');

  // Get current week start (Monday)
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekStartStr = format(weekStart, 'yyyy-MM-dd');
  const weekEndStr = format(addDays(weekStart, 6), 'yyyy-MM-dd');

  // Create sample employees
  const employees: Employee[] = [
    {
      id: 'emp-001',
      name: 'Sarah Chen',
      role: 'exec-chef',
      certifications: ['ServSafe Manager', 'HACCP'],
      maxHoursPerWeek: 50,
      preferredStations: ['hot-line', 'garde'],
      hireDate: '2020-03-15',
      active: true,
    },
    {
      id: 'emp-002',
      name: 'Marcus Johnson',
      role: 'sous-chef',
      certifications: ['ServSafe', 'Pastry Level 2'],
      maxHoursPerWeek: 45,
      preferredStations: ['bakery', 'hot-line'],
      hireDate: '2021-06-01',
      active: true,
    },
    {
      id: 'emp-003',
      name: 'Emily Rodriguez',
      role: 'line-cook',
      certifications: ['ServSafe'],
      maxHoursPerWeek: 40,
      preferredStations: ['garde', 'hot-line'],
      hireDate: '2022-01-10',
      active: true,
    },
    {
      id: 'emp-004',
      name: 'James Park',
      role: 'line-cook',
      certifications: ['ServSafe'],
      maxHoursPerWeek: 40,
      preferredStations: ['hot-line', 'bakery'],
      hireDate: '2022-03-20',
      active: true,
    },
    {
      id: 'emp-005',
      name: 'Olivia Martinez',
      role: 'line-cook',
      certifications: ['ServSafe', 'Allergen Training'],
      maxHoursPerWeek: 40,
      preferredStations: ['garde', 'bakery'],
      hireDate: '2022-08-15',
      active: true,
    },
    {
      id: 'emp-006',
      name: 'David Thompson',
      role: 'line-cook',
      certifications: ['ServSafe'],
      maxHoursPerWeek: 32,
      preferredStations: ['hot-line'],
      hireDate: '2023-02-01',
      active: true,
    },
    {
      id: 'emp-007',
      name: 'Sophia Lee',
      role: 'dishwasher',
      certifications: [],
      maxHoursPerWeek: 35,
      preferredStations: ['dish', 'utility'],
      hireDate: '2023-05-10',
      active: true,
    },
    {
      id: 'emp-008',
      name: 'Carlos Ramirez',
      role: 'dishwasher',
      certifications: [],
      maxHoursPerWeek: 30,
      preferredStations: ['dish', 'utility'],
      hireDate: '2023-07-20',
      active: true,
    },
  ];

  // Create employees
  for (const employee of employees) {
    await createEmployee(employee);
  }

  // Create sample shifts for the week
  const shifts: Shift[] = [];
  const shiftTemplates = [
    // Monday
    { employeeId: 'emp-001', day: 0, startTime: '08:00', endTime: '17:00', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-003', day: 0, startTime: '09:00', endTime: '17:00', station: 'garde' as const, location: 'main-building' as const, color: 'blue' as const },
    { employeeId: 'emp-004', day: 0, startTime: '15:00', endTime: '23:00', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-007', day: 0, startTime: '08:00', endTime: '16:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },

    // Tuesday
    { employeeId: 'emp-001', day: 1, startTime: '08:00', endTime: '17:00', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-002', day: 1, startTime: '10:00', endTime: '18:00', station: 'bakery' as const, location: 'oak-terrace' as const, color: 'purple' as const },
    { employeeId: 'emp-003', day: 1, startTime: '09:00', endTime: '17:00', station: 'garde' as const, location: 'main-building' as const, color: 'blue' as const },
    { employeeId: 'emp-005', day: 1, startTime: '15:00', endTime: '23:00', station: 'garde' as const, location: 'loons-nest' as const, color: 'blue' as const },
    { employeeId: 'emp-007', day: 1, startTime: '08:00', endTime: '16:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-008', day: 1, startTime: '16:00', endTime: '22:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },

    // Wednesday
    { employeeId: 'emp-001', day: 2, startTime: '08:00', endTime: '17:00', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-002', day: 2, startTime: '10:00', endTime: '18:00', station: 'bakery' as const, location: 'oak-terrace' as const, color: 'purple' as const },
    { employeeId: 'emp-004', day: 2, startTime: '15:00', endTime: '23:00', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-005', day: 2, startTime: '09:00', endTime: '17:00', station: 'garde' as const, location: 'main-building' as const, color: 'blue' as const },
    { employeeId: 'emp-006', day: 2, startTime: '11:00', endTime: '19:00', station: 'hot-line' as const, location: 'loons-nest' as const, color: 'red' as const },
    { employeeId: 'emp-007', day: 2, startTime: '08:00', endTime: '16:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },

    // Thursday
    { employeeId: 'emp-001', day: 3, startTime: '08:00', endTime: '17:00', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-002', day: 3, startTime: '10:00', endTime: '18:00', station: 'bakery' as const, location: 'oak-terrace' as const, color: 'purple' as const },
    { employeeId: 'emp-003', day: 3, startTime: '15:00', endTime: '23:00', station: 'garde' as const, location: 'main-building' as const, color: 'blue' as const },
    { employeeId: 'emp-004', day: 3, startTime: '09:00', endTime: '17:00', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-006', day: 3, startTime: '11:00', endTime: '19:00', station: 'hot-line' as const, location: 'loons-nest' as const, color: 'red' as const },
    { employeeId: 'emp-008', day: 3, startTime: '14:00', endTime: '22:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },

    // Friday (busy day - more staff)
    { employeeId: 'emp-001', day: 4, startTime: '08:00', endTime: '17:00', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-002', day: 4, startTime: '07:00', endTime: '15:00', station: 'bakery' as const, location: 'oak-terrace' as const, color: 'purple' as const },
    { employeeId: 'emp-003', day: 4, startTime: '09:00', endTime: '17:00', station: 'garde' as const, location: 'main-building' as const, color: 'blue' as const },
    { employeeId: 'emp-004', day: 4, startTime: '15:00', endTime: '23:00', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-005', day: 4, startTime: '15:00', endTime: '23:00', station: 'garde' as const, location: 'loons-nest' as const, color: 'blue' as const },
    { employeeId: 'emp-006', day: 4, startTime: '11:00', endTime: '19:00', station: 'hot-line' as const, location: 'loons-nest' as const, color: 'red' as const },
    { employeeId: 'emp-007', day: 4, startTime: '08:00', endTime: '16:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-008', day: 4, startTime: '16:00', endTime: '00:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },

    // Saturday (busy day - more staff)
    { employeeId: 'emp-001', day: 5, startTime: '08:00', endTime: '17:00', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-002', day: 5, startTime: '07:00', endTime: '15:00', station: 'bakery' as const, location: 'oak-terrace' as const, color: 'purple' as const },
    { employeeId: 'emp-003', day: 5, startTime: '09:00', endTime: '17:00', station: 'garde' as const, location: 'main-building' as const, color: 'blue' as const },
    { employeeId: 'emp-004', day: 5, startTime: '15:00', endTime: '23:00', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-005', day: 5, startTime: '15:00', endTime: '23:00', station: 'garde' as const, location: 'loons-nest' as const, color: 'blue' as const },
    { employeeId: 'emp-006', day: 5, startTime: '11:00', endTime: '19:00', station: 'hot-line' as const, location: 'loons-nest' as const, color: 'red' as const },
    { employeeId: 'emp-007', day: 5, startTime: '08:00', endTime: '16:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-008', day: 5, startTime: '16:00', endTime: '00:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },

    // Sunday (lighter day)
    { employeeId: 'emp-002', day: 6, startTime: '08:00', endTime: '16:00', station: 'bakery' as const, location: 'oak-terrace' as const, color: 'purple' as const },
    { employeeId: 'emp-003', day: 6, startTime: '10:00', endTime: '18:00', station: 'garde' as const, location: 'main-building' as const, color: 'blue' as const },
    { employeeId: 'emp-004', day: 6, startTime: '10:00', endTime: '18:00', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-007', day: 6, startTime: '09:00', endTime: '17:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
  ];

  // Create shifts with actual dates
  for (const template of shiftTemplates) {
    const shiftDate = format(addDays(weekStart, template.day), 'yyyy-MM-dd');
    const shift: Shift = {
      id: `shift-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      employeeId: template.employeeId,
      date: shiftDate,
      startTime: template.startTime,
      endTime: template.endTime,
      station: template.station,
      location: template.location,
      color: template.color,
      status: 'published',
    };
    shifts.push(shift);
    await createShift(shift);
  }

  // Create the schedule container
  const schedule: Schedule = {
    id: `schedule-${Date.now()}`,
    weekStartDate: weekStartStr,
    weekEndDate: weekEndStr,
    shifts: shifts,
    status: 'published',
    publishedAt: new Date().toISOString(),
    publishedBy: 'Sarah Chen',
  };

  await createSchedule(schedule);

  console.log(`✓ Seeded ${employees.length} employees`);
  console.log(`✓ Seeded ${shifts.length} shifts for week of ${weekStartStr}`);
  console.log(`✓ Created schedule (${schedule.status})`);
}
