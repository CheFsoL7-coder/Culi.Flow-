import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type {
  Task,
  EventLog,
  DailySummary,
  TaskStatus,
  TaskType,
  Priority,
  EventAction,
  Employee,
  Shift,
  Schedule,
  ConflictAlert,
  EmployeeRole,
  ShiftLocation,
  ScheduleStatus
} from '../types';

interface CuliFlowDB extends DBSchema {
  tasks: {
    key: string;
    value: Task;
    indexes: {
      'by-status': TaskStatus;
      'by-type': TaskType;
      'by-priority': Priority;
      'by-due': string;
    };
  };
  events: {
    key: string;
    value: EventLog;
    indexes: {
      'by-ts': string;
      'by-action': EventAction;
      'by-task': string;
    };
  };
  summaries: {
    key: string;
    value: DailySummary;
    indexes: {
      'by-date': string;
    };
  };
  employees: {
    key: string;
    value: Employee;
    indexes: {
      'by-role': EmployeeRole;
    };
  };
  shifts: {
    key: string;
    value: Shift;
    indexes: {
      'by-employee': string;
      'by-date': string;
      'by-location': ShiftLocation;
    };
  };
  schedules: {
    key: string;
    value: Schedule;
    indexes: {
      'by-week': string;
      'by-status': ScheduleStatus;
    };
  };
  conflicts: {
    key: string;
    value: ConflictAlert;
    indexes: {
      'by-employee': string;
      'by-severity': string;
    };
  };
}

const DB_NAME = 'culiflow-v1';
const DB_VERSION = 2;

let dbInstance: IDBPDatabase<CuliFlowDB> | null = null;

export async function initDB(): Promise<IDBPDatabase<CuliFlowDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<CuliFlowDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Tasks store
      if (!db.objectStoreNames.contains('tasks')) {
        const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
        taskStore.createIndex('by-status', 'status');
        taskStore.createIndex('by-type', 'type');
        taskStore.createIndex('by-priority', 'priority');
        taskStore.createIndex('by-due', 'dueAt');
      }

      // Events store
      if (!db.objectStoreNames.contains('events')) {
        const eventStore = db.createObjectStore('events', { keyPath: 'id' });
        eventStore.createIndex('by-ts', 'ts');
        eventStore.createIndex('by-action', 'action');
        eventStore.createIndex('by-task', 'taskId');
      }

      // Summaries store
      if (!db.objectStoreNames.contains('summaries')) {
        const summaryStore = db.createObjectStore('summaries', { keyPath: 'date' });
        summaryStore.createIndex('by-date', 'date');
      }

      // V1.2 Scheduling stores
      // Employees store
      if (!db.objectStoreNames.contains('employees')) {
        const employeeStore = db.createObjectStore('employees', { keyPath: 'id' });
        employeeStore.createIndex('by-role', 'role');
      }

      // Shifts store
      if (!db.objectStoreNames.contains('shifts')) {
        const shiftStore = db.createObjectStore('shifts', { keyPath: 'id' });
        shiftStore.createIndex('by-employee', 'employeeId');
        shiftStore.createIndex('by-date', 'date');
        shiftStore.createIndex('by-location', 'location');
      }

      // Schedules store
      if (!db.objectStoreNames.contains('schedules')) {
        const scheduleStore = db.createObjectStore('schedules', { keyPath: 'id' });
        scheduleStore.createIndex('by-week', 'weekStartDate');
        scheduleStore.createIndex('by-status', 'status');
      }

      // Conflicts store
      if (!db.objectStoreNames.contains('conflicts')) {
        const conflictStore = db.createObjectStore('conflicts', { keyPath: 'id' });
        conflictStore.createIndex('by-employee', 'employeeId');
        conflictStore.createIndex('by-severity', 'severity');
      }
    },
  });

  return dbInstance;
}

// Task operations
export async function createTask(task: Task): Promise<Task> {
  const db = await initDB();
  await db.add('tasks', task);
  await logEvent({
    action: 'task_created',
    actor: 'current-user',
    taskId: task.id,
    payload: { task },
  });
  return task;
}

export async function updateTask(task: Task): Promise<Task> {
  const db = await initDB();
  await db.put('tasks', task);
  await logEvent({
    action: 'status_changed',
    actor: 'current-user',
    taskId: task.id,
    payload: { task },
  });
  return task;
}

export async function getTask(id: string): Promise<Task | undefined> {
  const db = await initDB();
  return db.get('tasks', id);
}

export async function getAllTasks(): Promise<Task[]> {
  const db = await initDB();
  return db.getAll('tasks');
}

export async function getTasksByStatus(status: TaskStatus): Promise<Task[]> {
  const db = await initDB();
  return db.getAllFromIndex('tasks', 'by-status', status);
}

export async function deleteTask(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('tasks', id);
}

// Event log operations
export async function logEvent(
  event: Omit<EventLog, 'id' | 'ts'>
): Promise<EventLog> {
  const db = await initDB();
  const fullEvent: EventLog = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ts: new Date().toISOString(),
    ...event,
  };
  await db.add('events', fullEvent);
  return fullEvent;
}

export async function getAllEvents(): Promise<EventLog[]> {
  const db = await initDB();
  return db.getAll('events');
}

export async function getEventsByDateRange(
  startDate: string,
  endDate: string
): Promise<EventLog[]> {
  const db = await initDB();
  const allEvents = await db.getAll('events');
  return allEvents.filter(
    (event) => event.ts >= startDate && event.ts <= endDate
  );
}

export async function getEventsByTask(taskId: string): Promise<EventLog[]> {
  const db = await initDB();
  return db.getAllFromIndex('events', 'by-task', taskId);
}

// Summary operations
export async function saveSummary(summary: DailySummary): Promise<DailySummary> {
  const db = await initDB();
  await db.put('summaries', summary);
  return summary;
}

export async function getSummary(date: string): Promise<DailySummary | undefined> {
  const db = await initDB();
  return db.get('summaries', date);
}

export async function getAllSummaries(): Promise<DailySummary[]> {
  const db = await initDB();
  return db.getAll('summaries');
}

// LocalStorage cache for fast boot
export function cacheToLocalStorage(tasks: Task[]): void {
  try {
    const cache = {
      tasks: tasks.filter(t => t.status !== 'done').slice(0, 20),
      lastUpdate: new Date().toISOString(),
    };
    localStorage.setItem('culiflow-cache', JSON.stringify(cache));
  } catch (error) {
    console.error('Failed to cache to localStorage:', error);
  }
}

export function loadFromLocalStorageCache(): { tasks: Task[]; lastUpdate: string } | null {
  try {
    const cached = localStorage.getItem('culiflow-cache');
    if (!cached) return null;
    return JSON.parse(cached);
  } catch (error) {
    console.error('Failed to load from localStorage cache:', error);
    return null;
  }
}

// V1.2 Scheduling operations

// Employee operations
export async function createEmployee(employee: Employee): Promise<Employee> {
  const db = await initDB();
  await db.add('employees', employee);
  await logEvent({
    action: 'shift_created',
    actor: 'current-user',
    payload: { employee },
  });
  return employee;
}

export async function updateEmployee(employee: Employee): Promise<Employee> {
  const db = await initDB();
  await db.put('employees', employee);
  return employee;
}

export async function getEmployee(id: string): Promise<Employee | undefined> {
  const db = await initDB();
  return db.get('employees', id);
}

export async function getAllEmployees(): Promise<Employee[]> {
  const db = await initDB();
  return db.getAll('employees');
}

export async function getActiveEmployees(): Promise<Employee[]> {
  const db = await initDB();
  const allEmployees = await db.getAll('employees');
  return allEmployees.filter(emp => emp.active);
}

export async function deleteEmployee(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('employees', id);
}

// Shift operations
export async function createShift(shift: Shift): Promise<Shift> {
  const db = await initDB();
  await db.add('shifts', shift);
  await logEvent({
    action: 'shift_created',
    actor: 'current-user',
    payload: { shift },
  });

  // Detect and create conflicts
  const detectedConflicts = await detectConflictsForShift(shift);
  for (const conflict of detectedConflicts) {
    await createConflict(conflict);
  }

  return shift;
}

export async function updateShift(shift: Shift): Promise<Shift> {
  const db = await initDB();
  await db.put('shifts', shift);
  await logEvent({
    action: 'shift_updated',
    actor: 'current-user',
    payload: { shift },
  });

  // Clear old conflicts involving this shift
  const allConflicts = await getAllConflicts();
  for (const conflict of allConflicts) {
    if (conflict.shiftIds.includes(shift.id) && !conflict.resolvedAt) {
      await deleteConflict(conflict.id);
    }
  }

  // Detect and create new conflicts
  const detectedConflicts = await detectConflictsForShift(shift);
  for (const conflict of detectedConflicts) {
    await createConflict(conflict);
  }

  return shift;
}

export async function getShift(id: string): Promise<Shift | undefined> {
  const db = await initDB();
  return db.get('shifts', id);
}

export async function getAllShifts(): Promise<Shift[]> {
  const db = await initDB();
  return db.getAll('shifts');
}

export async function getShiftsByEmployee(employeeId: string): Promise<Shift[]> {
  const db = await initDB();
  return db.getAllFromIndex('shifts', 'by-employee', employeeId);
}

export async function getShiftsByDate(date: string): Promise<Shift[]> {
  const db = await initDB();
  return db.getAllFromIndex('shifts', 'by-date', date);
}

export async function deleteShift(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('shifts', id);
  await logEvent({
    action: 'shift_deleted',
    actor: 'current-user',
    payload: { shiftId: id },
  });

  // Clear conflicts involving this shift
  const allConflicts = await getAllConflicts();
  for (const conflict of allConflicts) {
    if (conflict.shiftIds.includes(id)) {
      await deleteConflict(conflict.id);
    }
  }
}

// Schedule operations
export async function createSchedule(schedule: Schedule): Promise<Schedule> {
  const db = await initDB();
  await db.add('schedules', schedule);
  return schedule;
}

export async function updateSchedule(schedule: Schedule): Promise<Schedule> {
  const db = await initDB();
  await db.put('schedules', schedule);
  return schedule;
}

export async function publishSchedule(scheduleId: string, publishedBy: string): Promise<Schedule> {
  const db = await initDB();
  const schedule = await db.get('schedules', scheduleId);
  if (!schedule) throw new Error('Schedule not found');

  const publishedSchedule: Schedule = {
    ...schedule,
    status: 'published',
    publishedAt: new Date().toISOString(),
    publishedBy,
  };

  await db.put('schedules', publishedSchedule);
  await logEvent({
    action: 'schedule_published',
    actor: publishedBy,
    payload: { schedule: publishedSchedule },
  });

  return publishedSchedule;
}

export async function getSchedule(id: string): Promise<Schedule | undefined> {
  const db = await initDB();
  return db.get('schedules', id);
}

export async function getAllSchedules(): Promise<Schedule[]> {
  const db = await initDB();
  return db.getAll('schedules');
}

export async function getScheduleByWeek(weekStartDate: string): Promise<Schedule | undefined> {
  const db = await initDB();
  const schedules = await db.getAllFromIndex('schedules', 'by-week', weekStartDate);
  return schedules[0];
}

export async function deleteSchedule(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('schedules', id);
}

// Conflict detection utilities
function calculateShiftHours(shift: Shift): number {
  const start = new Date(`2000-01-01T${shift.startTime}`);
  const end = new Date(`2000-01-01T${shift.endTime}`);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

function shiftsOverlap(shift1: Shift, shift2: Shift): boolean {
  if (shift1.date !== shift2.date) return false;

  const start1 = new Date(`2000-01-01T${shift1.startTime}`);
  const end1 = new Date(`2000-01-01T${shift1.endTime}`);
  const start2 = new Date(`2000-01-01T${shift2.startTime}`);
  const end2 = new Date(`2000-01-01T${shift2.endTime}`);

  return start1 < end2 && start2 < end1;
}

function getWeekBounds(date: string): { start: string; end: string } {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday

  const monday = new Date(d.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0]
  };
}

export async function detectConflictsForShift(shift: Shift): Promise<ConflictAlert[]> {
  const conflicts: ConflictAlert[] = [];

  // Get employee for max hours check
  const employee = await getEmployee(shift.employeeId);
  if (!employee) return conflicts;

  // Get all shifts for this employee
  const employeeShifts = await getShiftsByEmployee(shift.employeeId);

  // Check for double-booking (overlapping shifts)
  for (const existingShift of employeeShifts) {
    if (existingShift.id !== shift.id && shiftsOverlap(shift, existingShift)) {
      conflicts.push({
        id: `conflict-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'double-booking',
        severity: 'critical',
        shiftIds: [shift.id, existingShift.id],
        employeeId: shift.employeeId,
        message: `${employee.name} has overlapping shifts on ${shift.date}: ${shift.startTime}-${shift.endTime} conflicts with ${existingShift.startTime}-${existingShift.endTime}`,
      });
    }
  }

  // Check for overtime (exceeding max hours per week)
  const weekBounds = getWeekBounds(shift.date);
  const weekShifts = employeeShifts.filter(
    s => s.date >= weekBounds.start && s.date <= weekBounds.end && s.id !== shift.id
  );

  // Add current shift hours
  const totalHours = weekShifts.reduce((sum, s) => sum + calculateShiftHours(s), 0) + calculateShiftHours(shift);

  if (totalHours > employee.maxHoursPerWeek) {
    conflicts.push({
      id: `conflict-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'overtime',
      severity: 'warning',
      shiftIds: [shift.id],
      employeeId: shift.employeeId,
      message: `${employee.name} would exceed max hours (${totalHours.toFixed(1)}h / ${employee.maxHoursPerWeek}h) for week of ${weekBounds.start}`,
    });
  }

  // Check for clopen (closing shift followed by opening shift with <8 hours rest)
  const shiftDate = new Date(shift.date);
  const nextDay = new Date(shiftDate);
  nextDay.setDate(nextDay.getDate() + 1);
  const prevDay = new Date(shiftDate);
  prevDay.setDate(prevDay.getDate() - 1);

  const nextDayStr = nextDay.toISOString().split('T')[0];
  const prevDayStr = prevDay.toISOString().split('T')[0];

  // Check if current shift ends late (after 8pm) and next day has early shift (before 10am)
  const currentEnd = new Date(`2000-01-01T${shift.endTime}`);
  if (currentEnd.getHours() >= 20) {
    const nextDayShifts = employeeShifts.filter(s => s.date === nextDayStr);
    for (const nextShift of nextDayShifts) {
      const nextStart = new Date(`2000-01-01T${nextShift.startTime}`);
      if (nextStart.getHours() < 10) {
        // Calculate hours between shifts
        const hoursBetween = 24 - currentEnd.getHours() + nextStart.getHours();
        if (hoursBetween < 8) {
          conflicts.push({
            id: `conflict-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'clopen',
            severity: 'warning',
            shiftIds: [shift.id, nextShift.id],
            employeeId: shift.employeeId,
            message: `${employee.name} has insufficient rest between shifts (${hoursBetween}h): ${shift.date} ${shift.endTime} to ${nextShift.date} ${nextShift.startTime}`,
          });
        }
      }
    }
  }

  // Check if previous day has late shift
  const currentStart = new Date(`2000-01-01T${shift.startTime}`);
  if (currentStart.getHours() < 10) {
    const prevDayShifts = employeeShifts.filter(s => s.date === prevDayStr);
    for (const prevShift of prevDayShifts) {
      const prevEnd = new Date(`2000-01-01T${prevShift.endTime}`);
      if (prevEnd.getHours() >= 20) {
        const hoursBetween = 24 - prevEnd.getHours() + currentStart.getHours();
        if (hoursBetween < 8) {
          conflicts.push({
            id: `conflict-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'clopen',
            severity: 'warning',
            shiftIds: [prevShift.id, shift.id],
            employeeId: shift.employeeId,
            message: `${employee.name} has insufficient rest between shifts (${hoursBetween}h): ${prevShift.date} ${prevShift.endTime} to ${shift.date} ${shift.startTime}`,
          });
        }
      }
    }
  }

  return conflicts;
}

// Conflict operations
export async function createConflict(conflict: ConflictAlert): Promise<ConflictAlert> {
  const db = await initDB();
  await db.add('conflicts', conflict);
  await logEvent({
    action: 'conflict_detected',
    actor: 'system',
    payload: { conflict },
  });
  return conflict;
}

export async function resolveConflict(conflictId: string): Promise<ConflictAlert> {
  const db = await initDB();
  const conflict = await db.get('conflicts', conflictId);
  if (!conflict) throw new Error('Conflict not found');

  const resolvedConflict: ConflictAlert = {
    ...conflict,
    resolvedAt: new Date().toISOString(),
  };

  await db.put('conflicts', resolvedConflict);
  await logEvent({
    action: 'conflict_resolved',
    actor: 'current-user',
    payload: { conflict: resolvedConflict },
  });

  return resolvedConflict;
}

export async function getAllConflicts(): Promise<ConflictAlert[]> {
  const db = await initDB();
  return db.getAll('conflicts');
}

export async function getActiveConflicts(): Promise<ConflictAlert[]> {
  const db = await initDB();
  const allConflicts = await db.getAll('conflicts');
  return allConflicts.filter(c => !c.resolvedAt);
}

export async function deleteConflict(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('conflicts', id);
}

// Clear all data (for testing)
export async function clearAllData(): Promise<void> {
  const db = await initDB();
  await db.clear('tasks');
  await db.clear('events');
  await db.clear('summaries');
  await db.clear('employees');
  await db.clear('shifts');
  await db.clear('schedules');
  await db.clear('conflicts');
  localStorage.removeItem('culiflow-cache');
}
