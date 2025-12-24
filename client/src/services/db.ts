import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Task, EventLog, DailySummary, TaskStatus, TaskType, Priority, EventAction } from '../types';

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
}

const DB_NAME = 'culiflow-v1';
const DB_VERSION = 1;

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

// Clear all data (for testing)
export async function clearAllData(): Promise<void> {
  const db = await initDB();
  await db.clear('tasks');
  await db.clear('events');
  await db.clear('summaries');
  localStorage.removeItem('culiflow-cache');
}
