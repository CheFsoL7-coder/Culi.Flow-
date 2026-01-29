import type { Employee, Shift, Schedule } from '../types';
import { createEmployee, createShift, createSchedule } from './db';
import { format, startOfWeek, addDays } from 'date-fns';

export async function seedSchedulingData(): Promise<void> {
  console.log('Seeding Main Building schedule data...');

  // Get current week start (Monday)
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekStartStr = format(weekStart, 'yyyy-MM-dd');
  const weekEndStr = format(addDays(weekStart, 6), 'yyyy-MM-dd');

  // Main Building Kitchen Staff
  const employees: Employee[] = [
    {
      id: 'emp-luis',
      name: 'LUIS',
      role: 'line-cook',
      certifications: ['ServSafe'],
      maxHoursPerWeek: 40,
      preferredStations: ['utility', 'hot-line'],
      hireDate: '2020-01-01',
      active: true,
    },
    {
      id: 'emp-taurino',
      name: 'TAURINO',
      role: 'line-cook',
      certifications: ['ServSafe'],
      maxHoursPerWeek: 40,
      preferredStations: ['central-production'],
      hireDate: '2020-01-01',
      active: true,
    },
    {
      id: 'emp-elio',
      name: 'ELIO',
      role: 'line-cook',
      certifications: ['ServSafe'],
      maxHoursPerWeek: 40,
      preferredStations: ['garde', 'hot-line'],
      hireDate: '2020-01-01',
      active: true,
    },
    {
      id: 'emp-ed',
      name: 'ED',
      role: 'line-cook',
      certifications: ['ServSafe'],
      maxHoursPerWeek: 40,
      preferredStations: ['hot-line'],
      hireDate: '2020-01-01',
      active: true,
    },
    {
      id: 'emp-joe',
      name: 'JOE',
      role: 'line-cook',
      certifications: ['ServSafe'],
      maxHoursPerWeek: 40,
      preferredStations: ['hot-line'],
      hireDate: '2020-01-01',
      active: true,
    },
    {
      id: 'emp-alex',
      name: 'ALEX',
      role: 'line-cook',
      certifications: ['ServSafe'],
      maxHoursPerWeek: 40,
      preferredStations: ['central-production'],
      hireDate: '2020-01-01',
      active: true,
    },
    {
      id: 'emp-miguel',
      name: 'MIGUEL',
      role: 'line-cook',
      certifications: ['ServSafe'],
      maxHoursPerWeek: 40,
      preferredStations: ['hot-line'],
      hireDate: '2020-01-01',
      active: true,
    },
    {
      id: 'emp-laura',
      name: 'LAURA',
      role: 'line-cook',
      certifications: ['ServSafe'],
      maxHoursPerWeek: 40,
      preferredStations: ['garde'],
      hireDate: '2020-01-01',
      active: true,
    },
    {
      id: 'emp-kenny',
      name: 'KENNY',
      role: 'line-cook',
      certifications: ['ServSafe'],
      maxHoursPerWeek: 40,
      preferredStations: ['hot-line'],
      hireDate: '2020-01-01',
      active: true,
    },
    {
      id: 'emp-nelly',
      name: 'NELLY',
      role: 'line-cook',
      certifications: ['ServSafe'],
      maxHoursPerWeek: 40,
      preferredStations: ['hot-line'],
      hireDate: '2020-01-01',
      active: true,
    },
    {
      id: 'emp-fernando',
      name: 'FERNANDO',
      role: 'line-cook',
      certifications: ['ServSafe'],
      maxHoursPerWeek: 40,
      preferredStations: ['garde'],
      hireDate: '2020-01-01',
      active: true,
    },
    {
      id: 'emp-scottie',
      name: 'SCOTTIE',
      role: 'line-cook',
      certifications: ['ServSafe'],
      maxHoursPerWeek: 40,
      preferredStations: ['hot-line'],
      hireDate: '2020-01-01',
      active: true,
    },
    {
      id: 'emp-michael',
      name: 'MICHAEL',
      role: 'line-cook',
      certifications: ['ServSafe'],
      maxHoursPerWeek: 40,
      preferredStations: ['hot-line'],
      hireDate: '2020-01-01',
      active: true,
    },
    {
      id: 'emp-lee',
      name: 'LEE',
      role: 'sous-chef',
      certifications: ['ServSafe', 'Food Safety Manager'],
      maxHoursPerWeek: 45,
      preferredStations: ['central-production', 'utility'],
      hireDate: '2020-01-01',
      active: true,
    },
    {
      id: 'emp-eyob',
      name: 'Eyob',
      role: 'sous-chef',
      certifications: ['ServSafe', 'Food Safety Manager'],
      maxHoursPerWeek: 45,
      preferredStations: ['hot-line', 'central-production'],
      hireDate: '2020-01-01',
      active: true,
    },
    // Utility/Dishwashers
    {
      id: 'emp-narine',
      name: 'NARINE',
      role: 'dishwasher',
      certifications: [],
      maxHoursPerWeek: 40,
      preferredStations: ['dish'],
      hireDate: '2020-01-01',
      active: true,
    },
    {
      id: 'emp-anna',
      name: 'ANNA',
      role: 'dishwasher',
      certifications: [],
      maxHoursPerWeek: 30,
      preferredStations: ['dish'],
      hireDate: '2020-01-01',
      active: true,
    },
    {
      id: 'emp-juan',
      name: 'JUAN',
      role: 'dishwasher',
      certifications: [],
      maxHoursPerWeek: 40,
      preferredStations: ['dish'],
      hireDate: '2020-01-01',
      active: true,
    },
    {
      id: 'emp-norberto',
      name: 'NORBERTO',
      role: 'dishwasher',
      certifications: [],
      maxHoursPerWeek: 40,
      preferredStations: ['dish'],
      hireDate: '2020-01-01',
      active: true,
    },
    {
      id: 'emp-dustin',
      name: 'DUSTIN',
      role: 'dishwasher',
      certifications: [],
      maxHoursPerWeek: 40,
      preferredStations: ['dish'],
      hireDate: '2020-01-01',
      active: true,
    },
    {
      id: 'emp-montrell',
      name: 'MONTRELL',
      role: 'dishwasher',
      certifications: [],
      maxHoursPerWeek: 30,
      preferredStations: ['utility'],
      hireDate: '2020-01-01',
      active: true,
    },
    {
      id: 'emp-jesus',
      name: 'JESUS',
      role: 'dishwasher',
      certifications: [],
      maxHoursPerWeek: 20,
      preferredStations: ['dish'],
      hireDate: '2020-01-01',
      active: true,
    },
  ];

  // Create employees
  for (const employee of employees) {
    await createEmployee(employee);
  }

  // Week 2 schedule data (based on 1/25-1/31/2026 pattern)
  const shifts: Shift[] = [];
  const shiftData = [
    // Sunday (day 0)
    { employeeId: 'emp-taurino', day: 0, startTime: '07:00', endTime: '15:00', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-ed', day: 0, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-joe', day: 0, startTime: '07:00', endTime: '15:00', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-laura', day: 0, startTime: '07:00', endTime: '15:00', station: 'garde' as const, location: 'main-building' as const, color: 'blue' as const },
    { employeeId: 'emp-fernando', day: 0, startTime: '07:00', endTime: '15:00', station: 'garde' as const, location: 'main-building' as const, color: 'blue' as const },
    { employeeId: 'emp-eyob', day: 0, startTime: '09:30', endTime: '17:30', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-norberto', day: 0, startTime: '08:00', endTime: '16:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-dustin', day: 0, startTime: '08:00', endTime: '16:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },

    // Monday (day 1)
    { employeeId: 'emp-luis', day: 1, startTime: '07:00', endTime: '15:00', station: 'utility' as const, location: 'main-building' as const, color: 'purple' as const, notes: 'Employee Meals' },
    { employeeId: 'emp-taurino', day: 1, startTime: '07:00', endTime: '15:00', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-ed', day: 1, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-joe', day: 1, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-alex', day: 1, startTime: '11:30', endTime: '19:30', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-miguel', day: 1, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'loons-nest' as const, color: 'yellow' as const },
    { employeeId: 'emp-nelly', day: 1, startTime: '07:00', endTime: '15:00', station: 'hot-line' as const, location: 'loons-nest' as const, color: 'yellow' as const },
    { employeeId: 'emp-fernando', day: 1, startTime: '10:00', endTime: '18:00', station: 'garde' as const, location: 'main-building' as const, color: 'blue' as const },
    { employeeId: 'emp-lee', day: 1, startTime: '09:00', endTime: '17:00', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-eyob', day: 1, startTime: '09:30', endTime: '17:30', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-narine', day: 1, startTime: '15:30', endTime: '21:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-anna', day: 1, startTime: '09:00', endTime: '15:30', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-juan', day: 1, startTime: '16:30', endTime: '21:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-dustin', day: 1, startTime: '08:00', endTime: '15:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },

    // Tuesday (day 2)
    { employeeId: 'emp-luis', day: 2, startTime: '07:00', endTime: '15:00', station: 'utility' as const, location: 'main-building' as const, color: 'purple' as const, notes: 'Employee Meals' },
    { employeeId: 'emp-taurino', day: 2, startTime: '07:00', endTime: '15:00', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-elio', day: 2, startTime: '10:00', endTime: '18:00', station: 'garde' as const, location: 'main-building' as const, color: 'blue' as const },
    { employeeId: 'emp-joe', day: 2, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-alex', day: 2, startTime: '11:30', endTime: '19:30', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-miguel', day: 2, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'loons-nest' as const, color: 'yellow' as const },
    { employeeId: 'emp-laura', day: 2, startTime: '10:00', endTime: '18:00', station: 'garde' as const, location: 'main-building' as const, color: 'blue' as const },
    { employeeId: 'emp-nelly', day: 2, startTime: '07:00', endTime: '15:00', station: 'hot-line' as const, location: 'loons-nest' as const, color: 'yellow' as const },
    { employeeId: 'emp-scottie', day: 2, startTime: '09:00', endTime: '17:00', station: 'hot-line' as const, location: 'oak-terrace' as const, color: 'purple' as const },
    { employeeId: 'emp-michael', day: 2, startTime: '09:00', endTime: '17:00', station: 'hot-line' as const, location: 'oak-terrace' as const, color: 'purple' as const },
    { employeeId: 'emp-lee', day: 2, startTime: '09:00', endTime: '17:00', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-narine', day: 2, startTime: '15:30', endTime: '21:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-juan', day: 2, startTime: '13:00', endTime: '21:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-dustin', day: 2, startTime: '08:00', endTime: '15:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },

    // Wednesday (day 3)
    { employeeId: 'emp-luis', day: 3, startTime: '10:00', endTime: '19:00', station: 'hot-line' as const, location: 'loons-nest' as const, color: 'yellow' as const },
    { employeeId: 'emp-taurino', day: 3, startTime: '07:00', endTime: '15:00', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-elio', day: 3, startTime: '07:00', endTime: '15:00', station: 'hot-line' as const, location: 'loons-nest' as const, color: 'yellow' as const },
    { employeeId: 'emp-ed', day: 3, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-joe', day: 3, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-laura', day: 3, startTime: '10:00', endTime: '18:00', station: 'garde' as const, location: 'main-building' as const, color: 'blue' as const },
    { employeeId: 'emp-kenny', day: 3, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-scottie', day: 3, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'oak-terrace' as const, color: 'purple' as const },
    { employeeId: 'emp-michael', day: 3, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'oak-terrace' as const, color: 'purple' as const },
    { employeeId: 'emp-lee', day: 3, startTime: '09:00', endTime: '17:00', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-eyob', day: 3, startTime: '09:30', endTime: '17:30', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-narine', day: 3, startTime: '15:30', endTime: '21:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-anna', day: 3, startTime: '09:00', endTime: '15:30', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-juan', day: 3, startTime: '16:30', endTime: '21:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-norberto', day: 3, startTime: '13:00', endTime: '21:00', station: 'dish' as const, location: 'oak-terrace' as const, color: 'purple' as const },

    // Thursday (day 4)
    { employeeId: 'emp-luis', day: 4, startTime: '10:00', endTime: '19:00', station: 'utility' as const, location: 'main-building' as const, color: 'purple' as const, notes: 'Employee Meals' },
    { employeeId: 'emp-taurino', day: 4, startTime: '07:00', endTime: '15:00', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-elio', day: 4, startTime: '11:30', endTime: '19:30', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-ed', day: 4, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-joe', day: 4, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-miguel', day: 4, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'loons-nest' as const, color: 'yellow' as const },
    { employeeId: 'emp-laura', day: 4, startTime: '10:00', endTime: '18:00', station: 'garde' as const, location: 'main-building' as const, color: 'blue' as const },
    { employeeId: 'emp-kenny', day: 4, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-nelly', day: 4, startTime: '07:00', endTime: '15:00', station: 'hot-line' as const, location: 'loons-nest' as const, color: 'yellow' as const },
    { employeeId: 'emp-fernando', day: 4, startTime: '10:00', endTime: '18:00', station: 'garde' as const, location: 'main-building' as const, color: 'blue' as const },
    { employeeId: 'emp-scottie', day: 4, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'oak-terrace' as const, color: 'purple' as const },
    { employeeId: 'emp-michael', day: 4, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'oak-terrace' as const, color: 'purple' as const },
    { employeeId: 'emp-lee', day: 4, startTime: '09:00', endTime: '17:00', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-eyob', day: 4, startTime: '09:30', endTime: '17:30', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-narine', day: 4, startTime: '15:30', endTime: '21:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-juan', day: 4, startTime: '16:30', endTime: '21:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-norberto', day: 4, startTime: '13:00', endTime: '21:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-dustin', day: 4, startTime: '08:00', endTime: '16:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },

    // Friday (day 5)
    { employeeId: 'emp-taurino', day: 5, startTime: '07:00', endTime: '15:00', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-joe', day: 5, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-alex', day: 5, startTime: '11:30', endTime: '19:30', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-miguel', day: 5, startTime: '10:00', endTime: '19:30', station: 'hot-line' as const, location: 'loons-nest' as const, color: 'yellow' as const },
    { employeeId: 'emp-laura', day: 5, startTime: '10:00', endTime: '18:00', station: 'garde' as const, location: 'main-building' as const, color: 'blue' as const },
    { employeeId: 'emp-kenny', day: 5, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-nelly', day: 5, startTime: '07:00', endTime: '15:00', station: 'hot-line' as const, location: 'loons-nest' as const, color: 'yellow' as const },
    { employeeId: 'emp-fernando', day: 5, startTime: '10:00', endTime: '18:00', station: 'garde' as const, location: 'main-building' as const, color: 'blue' as const },
    { employeeId: 'emp-scottie', day: 5, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'oak-terrace' as const, color: 'purple' as const },
    { employeeId: 'emp-michael', day: 5, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'oak-terrace' as const, color: 'purple' as const },
    { employeeId: 'emp-eyob', day: 5, startTime: '09:30', endTime: '17:30', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-narine', day: 5, startTime: '15:30', endTime: '21:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-anna', day: 5, startTime: '09:00', endTime: '15:30', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-norberto', day: 5, startTime: '13:00', endTime: '21:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-dustin', day: 5, startTime: '13:00', endTime: '21:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-jesus', day: 5, startTime: '13:00', endTime: '21:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },

    // Saturday (day 6)
    { employeeId: 'emp-taurino', day: 6, startTime: '07:00', endTime: '15:00', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-miguel', day: 6, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-alex', day: 6, startTime: '11:30', endTime: '19:30', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-kenny', day: 6, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'main-building' as const, color: 'red' as const },
    { employeeId: 'emp-nelly', day: 6, startTime: '07:00', endTime: '15:00', station: 'hot-line' as const, location: 'loons-nest' as const, color: 'yellow' as const },
    { employeeId: 'emp-fernando', day: 6, startTime: '10:00', endTime: '18:00', station: 'garde' as const, location: 'main-building' as const, color: 'blue' as const },
    { employeeId: 'emp-scottie', day: 6, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'oak-terrace' as const, color: 'purple' as const },
    { employeeId: 'emp-michael', day: 6, startTime: '11:30', endTime: '19:30', station: 'hot-line' as const, location: 'oak-terrace' as const, color: 'purple' as const },
    { employeeId: 'emp-lee', day: 6, startTime: '09:00', endTime: '17:00', station: 'central-production' as const, location: 'main-building' as const, color: 'purple' as const },
    { employeeId: 'emp-narine', day: 6, startTime: '06:00', endTime: '13:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-juan', day: 6, startTime: '16:30', endTime: '21:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-norberto', day: 6, startTime: '13:00', endTime: '21:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
    { employeeId: 'emp-jesus', day: 6, startTime: '13:00', endTime: '21:00', station: 'dish' as const, location: 'main-building' as const, color: 'yellow' as const },
  ];

  // Create shifts with actual dates
  for (const template of shiftData) {
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
      notes: template.notes,
    };
    shifts.push(shift);
    await createShift(shift);
    // Small delay to ensure unique IDs
    await new Promise(resolve => setTimeout(resolve, 1));
  }

  // Create the schedule container
  const schedule: Schedule = {
    id: `schedule-${Date.now()}`,
    weekStartDate: weekStartStr,
    weekEndDate: weekEndStr,
    shifts: shifts,
    status: 'published',
    publishedAt: new Date().toISOString(),
    publishedBy: 'Main Building Manager',
  };

  await createSchedule(schedule);

  console.log(`✓ Seeded ${employees.length} Main Building employees`);
  console.log(`✓ Seeded ${shifts.length} shifts for week of ${weekStartStr}`);
  console.log(`✓ Created schedule (${schedule.status})`);
}
