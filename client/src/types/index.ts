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

// ============================================================================
// MENU CYCLE TRACKING TYPES
// ============================================================================

export type MenuWeek = 1 | 2 | 3 | 4 | 5;

export type MenuDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type MenuCategory =
  | 'soup'
  | 'salad'
  | 'entree1'
  | 'entree2'
  | 'entree3'
  | 'veg1'
  | 'veg2'
  | 'starch1'
  | 'starch2'
  | 'dessert';

export interface MenuWeekConfig {
  week: MenuWeek;
  color: string;
  colorLight: string;
  emoji: string;
  label: string;
}

export const MENU_WEEK_CONFIGS: Record<MenuWeek, MenuWeekConfig> = {
  1: { week: 1, color: '#228B22', colorLight: '#EBFAEB', emoji: '🟢', label: 'Green' },
  2: { week: 2, color: '#800080', colorLight: '#F5EBFA', emoji: '🟣', label: 'Purple' },
  3: { week: 3, color: '#FF8C00', colorLight: '#FFF5EB', emoji: '🟠', label: 'Orange' },
  4: { week: 4, color: '#1E5AB4', colorLight: '#EBF5FF', emoji: '🔵', label: 'Blue' },
  5: { week: 5, color: '#DAA520', colorLight: '#FFFAEB', emoji: '🟡', label: 'Gold' },
};

export const MENU_CATEGORIES: { key: MenuCategory; label: string; emoji: string }[] = [
  { key: 'soup', label: 'Soup du Jour', emoji: '🍲' },
  { key: 'salad', label: 'Market Salad', emoji: '🥗' },
  { key: 'entree1', label: 'Entrée 1 (Chef\'s Feature)', emoji: '🥘' },
  { key: 'entree2', label: 'Entrée 2 (Comfort Classic)', emoji: '🧆' },
  { key: 'entree3', label: 'Entrée 3 (Lighter Option)', emoji: '🍱' },
  { key: 'veg1', label: 'Vegetable 1', emoji: '🥕' },
  { key: 'veg2', label: 'Vegetable 2', emoji: '🌽' },
  { key: 'starch1', label: 'Starch 1', emoji: '🥔' },
  { key: 'starch2', label: 'Starch 2', emoji: '🍚' },
  { key: 'dessert', label: 'Dessert Feature', emoji: '🍮' },
];

export interface MenuItemCapture {
  id: string;
  week: MenuWeek;
  day: MenuDay;
  category: MenuCategory;
  dishName: string;
  chef?: string;
  station?: string;
  photoUrl?: string;
  googlePhotosLink?: string;
  qualityChecks: {
    temperatureCorrect: boolean;
    rimClean: boolean;
    freshGarnish: boolean;
  };
  critique?: string;
  capturedAt: string;
  capturedBy?: string;
}

export interface MenuCycleAlbum {
  id: string;
  week: MenuWeek;
  day: MenuDay;
  date?: string;
  googlePhotosAlbumUrl?: string;
  items: MenuItemCapture[];
  status: 'draft' | 'complete' | 'approved';
  createdAt: string;
  updatedAt: string;
}
