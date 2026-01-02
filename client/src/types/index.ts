// Core data model for V1.1 Cockpit

export type TaskType = 'service' | 'prep' | 'admin' | 'standards' | 'compliance';

export type Concept = 'oak-terrace' | 'elements' | 'loons-nest' | 'central-production';

export type Station = 'hot-line' | 'garde' | 'bakery' | 'dish' | 'utility' | 'central-production';

export type Priority = 'critical' | 'high' | 'medium';

export type TaskStatus = 'backlog' | 'in_progress' | 'ready' | 'verified' | 'done';

export type ComplianceType = 'temp_log' | 'test_meal' | 'meal_round' | 'fifo' | 'other';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  concept?: Concept;
  station?: Station;
  owner?: string;
  priority: Priority;
  durationMinutes?: number;
  dueAt?: string;
  status: TaskStatus;
  definitionOfDone?: string;
  complianceType?: ComplianceType;
  evidenceRequired: boolean;
  evidence: string[];
  createdAt: string;
  updatedAt: string;
}

export type EventAction =
  | 'task_created'
  | 'task_completed'
  | 'task_uncompleted'
  | 'status_changed'
  | 'assigned'
  | 'note_added'
  | 'evidence_added'
  | 'issue_logged'
  | 'shift_created'
  | 'shift_updated'
  | 'shift_deleted'
  | 'schedule_published'
  | 'conflict_detected'
  | 'conflict_resolved';

export interface EventLog {
  id: string;
  ts: string;
  actor: string;
  action: EventAction;
  taskId?: string;
  payload: Record<string, any>;
}

export interface DailySummary {
  date: string;
  missedCritical: string[];
  missedCompliance: string[];
  blockers: string[];
  wins: string[];
  risksNextShift: string[];
  generatedAt: string;
  generatedBy: string;
}

export interface KPIData {
  ticketTime: {
    target: number;
    actual: number;
    status: 'good' | 'watch' | 'risk';
  };
  prepCompletion: {
    target: number;
    actual: number;
    status: 'good' | 'watch' | 'risk';
  };
  waste: {
    target: number;
    actual: number;
    status: 'good' | 'watch' | 'risk';
  };
  compliance: {
    target: number;
    actual: number;
    status: 'good' | 'watch' | 'risk';
  };
}

export interface TimelineBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  concept: Concept;
  covers?: number;
  notes?: string;
}

export interface QuickAddInput {
  raw: string;
  parsed: {
    type?: TaskType;
    duration?: number;
    title?: string;
    quantity?: string;
    station?: Station;
    due?: string;
    owner?: string;
    priority?: Priority;
    complianceTags?: ComplianceType[];
    conceptTags?: Concept[];
  };
}

// V1.2 Workforce Scheduling Types

export type EmployeeRole = 'line-cook' | 'sous-chef' | 'exec-chef' | 'dishwasher';

export type ShiftLocation = 'main-building' | 'loons-nest' | 'oak-terrace';

export type ShiftColor = 'red' | 'blue' | 'yellow' | 'purple';

export type ShiftStatus = 'draft' | 'published' | 'completed';

export type ScheduleStatus = 'draft' | 'published' | 'archived';

export type ConflictType = 'double-booking' | 'overtime' | 'coverage-gap' | 'clopen' | 'cert-mismatch';

export type ConflictSeverity = 'critical' | 'warning' | 'info';

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  certifications: string[];
  maxHoursPerWeek: number;
  preferredStations: Station[];
  hireDate: string;
  active: boolean;
}

export interface Shift {
  id: string;
  employeeId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  station: Station;
  location: ShiftLocation;
  color: ShiftColor;
  notes?: string;
  status: ShiftStatus;
}

export interface Schedule {
  id: string;
  weekStartDate: string; // ISO date string (YYYY-MM-DD)
  weekEndDate: string; // ISO date string (YYYY-MM-DD)
  shifts: Shift[];
  publishedAt?: string; // ISO timestamp
  publishedBy?: string;
  status: ScheduleStatus;
  notes?: string;
}

export interface ConflictAlert {
  id: string;
  type: ConflictType;
  severity: ConflictSeverity;
  shiftIds: string[];
  employeeId?: string;
  message: string;
  resolvedAt?: string; // ISO timestamp
}
