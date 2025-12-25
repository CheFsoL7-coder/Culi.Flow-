import { createEvents } from 'ics';
import type { DateArray, EventAttributes } from 'ics';
import { getAllTasks } from './db';
import { format } from 'date-fns';

export async function exportTasksToCalendar(): Promise<void> {
  const tasks = await getAllTasks();

  // Filter tasks with due dates
  const tasksWithDates = tasks.filter((t) => t.dueAt && t.status !== 'done');

  const events: EventAttributes[] = tasksWithDates.map((task) => {
    const dueDate = new Date(task.dueAt!);
    const dateArray: DateArray = [
      dueDate.getFullYear(),
      dueDate.getMonth() + 1,
      dueDate.getDate(),
      dueDate.getHours(),
      dueDate.getMinutes(),
    ];

    // Calculate end time based on duration
    const endDate = new Date(dueDate);
    if (task.durationMinutes) {
      endDate.setMinutes(endDate.getMinutes() + task.durationMinutes);
    } else {
      endDate.setMinutes(endDate.getMinutes() + 30); // Default 30 min
    }

    const endArray: DateArray = [
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      endDate.getDate(),
      endDate.getHours(),
      endDate.getMinutes(),
    ];

    let description = `Priority: ${task.priority}\n`;
    if (task.station) description += `Station: ${task.station}\n`;
    if (task.owner) description += `Owner: ${task.owner}\n`;
    if (task.concept) description += `Concept: ${task.concept}\n`;
    if (task.complianceType) description += `Compliance: ${task.complianceType}\n`;
    if (task.definitionOfDone) description += `\nDefinition of Done:\n${task.definitionOfDone}`;

    return {
      title: task.title,
      description: description.trim(),
      start: dateArray,
      end: endArray,
      status: task.status === 'in_progress' ? 'CONFIRMED' : 'TENTATIVE',
      busyStatus: task.priority === 'critical' ? 'BUSY' : 'FREE',
      categories: [task.type, task.priority],
      location: task.station || undefined,
    };
  });

  const { error, value } = createEvents(events);

  if (error) {
    console.error('Failed to create calendar:', error);
    throw new Error('Failed to generate calendar file');
  }

  // Download the .ics file
  const blob = new Blob([value!], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `culiflow-tasks-${format(new Date(), 'yyyy-MM-dd')}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

// Export specific date range
export async function exportTasksToCalendarByDateRange(
  startDate: Date,
  endDate: Date
): Promise<void> {
  const tasks = await getAllTasks();

  const tasksInRange = tasks.filter((t) => {
    if (!t.dueAt || t.status === 'done') return false;
    const dueDate = new Date(t.dueAt);
    return dueDate >= startDate && dueDate <= endDate;
  });

  const events: EventAttributes[] = tasksInRange.map((task) => {
    const dueDate = new Date(task.dueAt!);
    const dateArray: DateArray = [
      dueDate.getFullYear(),
      dueDate.getMonth() + 1,
      dueDate.getDate(),
      dueDate.getHours(),
      dueDate.getMinutes(),
    ];

    const endDate = new Date(dueDate);
    if (task.durationMinutes) {
      endDate.setMinutes(endDate.getMinutes() + task.durationMinutes);
    } else {
      endDate.setMinutes(endDate.getMinutes() + 30);
    }

    const endArray: DateArray = [
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      endDate.getDate(),
      endDate.getHours(),
      endDate.getMinutes(),
    ];

    return {
      title: `${task.title}${task.station ? ` (@${task.station})` : ''}`,
      description: `Priority: ${task.priority}`,
      start: dateArray,
      end: endArray,
      status: task.status === 'in_progress' ? 'CONFIRMED' : 'TENTATIVE',
      categories: [task.type, task.priority],
    };
  });

  const { error, value } = createEvents(events);

  if (error) {
    throw new Error('Failed to generate calendar file');
  }

  const blob = new Blob([value!], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `culiflow-tasks-${format(startDate, 'yyyy-MM-dd')}-to-${format(endDate, 'yyyy-MM-dd')}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
