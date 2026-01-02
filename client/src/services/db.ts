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
