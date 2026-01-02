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
  | 'issue_logged';

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
