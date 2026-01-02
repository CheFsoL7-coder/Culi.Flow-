import type { Task } from '../types';
import { getAllTasks, getAllEvents } from './db';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

// Director Summary Generator
export interface DirectorSummary {
  date: string;
  overallStatus: 'on-track' | 'at-risk';
  missedCritical: Task[];
  missedCompliance: Task[];
  topMisses: string[];
  blockers: string[];
  decisionsNeeded: string[];
  nextShiftRisks: string[];
  generatedAt: string;
}

export async function generateDirectorSummary(): Promise<DirectorSummary> {
  const tasks = await getAllTasks();
  const today = format(new Date(), 'yyyy-MM-dd');

  const missedCritical = tasks.filter(
    (t) => t.priority === 'critical' && t.status !== 'done' && t.dueAt && t.dueAt < new Date().toISOString()
  );

  const missedCompliance = tasks.filter(
    (t) => t.complianceType && t.status !== 'done' && t.dueAt && t.dueAt < new Date().toISOString()
  );

  const overallStatus = missedCritical.length > 0 || missedCompliance.length > 0 ? 'at-risk' : 'on-track';

  // Analyze top recurring misses
  const topMisses = tasks
    .filter((t) => t.status !== 'done')
    .map((t) => t.title)
    .slice(0, 5);

  // Identify blockers
  const blockers = tasks
    .filter((t) => t.definitionOfDone?.includes('blocked'))
    .map((t) => t.title);

  // Next shift risks
  const upcomingCritical = tasks.filter(
    (t) => t.priority === 'critical' && t.status !== 'done'
  ).length;

  const nextShiftRisks = upcomingCritical > 3
    ? [`${upcomingCritical} critical tasks pending`]
    : [];

  return {
    date: today,
    overallStatus,
    missedCritical,
    missedCompliance,
    topMisses,
    blockers,
    decisionsNeeded: blockers.length > 0 ? ['Resolve blockers'] : [],
    nextShiftRisks,
    generatedAt: new Date().toISOString(),
  };
}

export function copyDirectorSummaryToClipboard(summary: DirectorSummary): void {
  const text = formatDirectorSummaryAsText(summary);
  navigator.clipboard.writeText(text);
}

export function formatDirectorSummaryAsText(summary: DirectorSummary): string {
  return `
DIRECTOR SUMMARY - ${summary.date}
Status: ${summary.overallStatus.toUpperCase()}

MISSED CRITICAL (${summary.missedCritical.length})
${summary.missedCritical.map((t) => `- ${t.title}`).join('\n')}

MISSED COMPLIANCE (${summary.missedCompliance.length})
${summary.missedCompliance.map((t) => `- ${t.title}`).join('\n')}

TOP MISSES
${summary.topMisses.map((m) => `- ${m}`).join('\n')}

BLOCKERS
${summary.blockers.length > 0 ? summary.blockers.map((b) => `- ${b}`).join('\n') : 'None'}

DECISIONS NEEDED
${summary.decisionsNeeded.length > 0 ? summary.decisionsNeeded.map((d) => `- ${d}`).join('\n') : 'None'}

NEXT SHIFT RISKS
${summary.nextShiftRisks.length > 0 ? summary.nextShiftRisks.map((r) => `- ${r}`).join('\n') : 'None'}

Generated: ${format(new Date(summary.generatedAt), 'PPpp')}
`.trim();
}

export function exportDirectorSummaryAsPDF(summary: DirectorSummary): void {
  const doc = new jsPDF();
  const text = formatDirectorSummaryAsText(summary);

  doc.setFontSize(16);
  doc.text('Director Summary', 20, 20);

  doc.setFontSize(10);
  const lines = text.split('\n');
  let y = 40;
  lines.forEach((line) => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 20, y);
    y += 7;
  });

  doc.save(`director-summary-${summary.date}.pdf`);
}

// Compliance Record Export
export interface ComplianceRecord {
  timestamp: string;
  actor: string;
  action: string;
  task: string;
  complianceType?: string;
  evidence: string;
}

export async function generateComplianceRecord(): Promise<ComplianceRecord[]> {
  const events = await getAllEvents();
  const tasks = await getAllTasks();
  const taskMap = new Map(tasks.map((t) => [t.id, t]));

  const complianceEvents = events.filter((e) => {
    const task = taskMap.get(e.taskId || '');
    return task?.complianceType;
  });

  return complianceEvents.map((event) => {
    const task = taskMap.get(event.taskId || '');
    return {
      timestamp: event.ts,
      actor: event.actor,
      action: event.action,
      task: task?.title || 'Unknown',
      complianceType: task?.complianceType,
      evidence: task?.evidence.join(', ') || 'None',
    };
  });
}

export async function exportComplianceRecordAsCSV(): Promise<void> {
  const records = await generateComplianceRecord();

  const csv = [
    ['Timestamp', 'Actor', 'Action', 'Task', 'Compliance Type', 'Evidence'].join(','),
    ...records.map((r) =>
      [
        r.timestamp,
        r.actor,
        r.action,
        `"${r.task}"`,
        r.complianceType || '',
        `"${r.evidence}"`,
      ].join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `compliance-record-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportComplianceRecordAsPDF(): Promise<void> {
  const records = await generateComplianceRecord();
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Compliance Record', 20, 20);
  doc.setFontSize(8);

  let y = 35;
  records.forEach((record) => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }

    doc.text(`[${format(new Date(record.timestamp), 'PPpp')}]`, 20, y);
    y += 5;
    doc.text(`${record.actor} - ${record.action}`, 20, y);
    y += 5;
    doc.text(`Task: ${record.task}`, 20, y);
    y += 5;
    if (record.complianceType) {
      doc.text(`Type: ${record.complianceType}`, 20, y);
      y += 5;
    }
    doc.text(`Evidence: ${record.evidence}`, 20, y);
    y += 10;
  });

  doc.save(`compliance-record-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

// Evidence Pack Export
export async function exportEvidencePack(): Promise<void> {
  const summary = await generateDirectorSummary();
  const complianceRecords = await generateComplianceRecord();
  const tasks = await getAllTasks();

  const exceptions = tasks.filter(
    (t) => t.status !== 'done' && (t.priority === 'critical' || t.complianceType)
  );

  const doc = new jsPDF();

  // Page 1: Director Summary
  doc.setFontSize(16);
  doc.text('Evidence Pack', 20, 20);
  doc.setFontSize(12);
  doc.text(`Generated: ${format(new Date(), 'PPpp')}`, 20, 30);

  doc.setFontSize(14);
  doc.text('Director Summary', 20, 45);
  doc.setFontSize(10);
  const summaryText = formatDirectorSummaryAsText(summary);
  const summaryLines = summaryText.split('\n');
  let y = 55;
  summaryLines.forEach((line) => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 20, y);
    y += 6;
  });

  // Page 2: Compliance Records
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Compliance Records', 20, 20);
  doc.setFontSize(8);
  y = 30;
  complianceRecords.slice(0, 30).forEach((record) => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(`${format(new Date(record.timestamp), 'PPp')} - ${record.task}`, 20, y);
    y += 5;
  });

  // Page 3: Exceptions
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Exceptions List', 20, 20);
  doc.setFontSize(10);
  y = 30;
  exceptions.forEach((task) => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(`[${task.priority.toUpperCase()}] ${task.title}`, 20, y);
    y += 5;
    doc.text(`Status: ${task.status} | Due: ${task.dueAt ? format(new Date(task.dueAt), 'PPp') : 'No due date'}`, 25, y);
    y += 8;
  });

  doc.save(`evidence-pack-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

// Event log export
export async function exportEventLogAsCSV(): Promise<void> {
  const events = await getAllEvents();

  const csv = [
    ['Timestamp', 'Actor', 'Action', 'Task ID', 'Payload'].join(','),
    ...events.map((e) =>
      [
        e.ts,
        e.actor,
        e.action,
        e.taskId || '',
        `"${JSON.stringify(e.payload)}"`,
      ].join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `event-log-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
