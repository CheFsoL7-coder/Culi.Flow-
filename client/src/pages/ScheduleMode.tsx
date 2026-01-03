import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import type { Schedule, Employee, Shift, ShiftColor } from '../types';
import { getAllEmployees, getAllShifts, getScheduleByWeek } from '../services/db';
import { format, startOfWeek, addDays } from 'date-fns';

// Color mapping for shift badges
const COLOR_CLASSES: Record<ShiftColor, { bg: string; border: string }> = {
  red: { bg: 'bg-red-500/20', border: 'border-red-500/40' },
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/40' },
  yellow: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/40' },
  purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/40' },
};

export function ScheduleMode() {
  const [currentWeekStart, setCurrentWeekStart] = useState<string>('');
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    // Initialize to current week
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekStartStr = format(weekStart, 'yyyy-MM-dd');
    setCurrentWeekStart(weekStartStr);

    // Load data
    loadScheduleData(weekStartStr);
  }, []);

  async function loadScheduleData(weekStartDate: string) {
    const [scheduleData, employeeData, shiftData] = await Promise.all([
      getScheduleByWeek(weekStartDate),
      getAllEmployees(),
      getAllShifts(),
    ]);

    setSchedule(scheduleData || null);
    setEmployees(employeeData);

    // Filter shifts for current week
    const weekEnd = format(addDays(new Date(weekStartDate), 6), 'yyyy-MM-dd');
    const weekShifts = shiftData.filter(
      (shift) => shift.date >= weekStartDate && shift.date <= weekEnd
    );
    setShifts(weekShifts);
  }

  function goToPreviousWeek() {
    const prevWeek = format(addDays(new Date(currentWeekStart), -7), 'yyyy-MM-dd');
    setCurrentWeekStart(prevWeek);
    loadScheduleData(prevWeek);
  }

  function goToNextWeek() {
    const nextWeek = format(addDays(new Date(currentWeekStart), 7), 'yyyy-MM-dd');
    setCurrentWeekStart(nextWeek);
    loadScheduleData(nextWeek);
  }

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(currentWeekStart), i);
    return {
      date: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEE d'),
    };
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="text-blue-400" size={28} />
          <h1 className="text-2xl font-bold text-white">Weekly Schedule</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousWeek}
            className="px-4 py-2 glass-panel hover:bg-glass-bg-hover transition-colors"
          >
            ← Previous Week
          </button>
          <div className="text-white font-medium">
            Week of {format(new Date(currentWeekStart), 'MMM d, yyyy')}
          </div>
          <button
            onClick={goToNextWeek}
            className="px-4 py-2 glass-panel hover:bg-glass-bg-hover transition-colors"
          >
            Next Week →
          </button>
        </div>
      </div>

      {/* Schedule Status */}
      {schedule && (
        <div className="glass-panel p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-400">Status: </span>
              <span
                className={`font-medium ${
                  schedule.status === 'published'
                    ? 'text-status-good'
                    : schedule.status === 'draft'
                    ? 'text-status-watch'
                    : 'text-gray-400'
                }`}
              >
                {schedule.status.toUpperCase()}
              </span>
            </div>
            {schedule.publishedAt && (
              <div className="text-sm text-gray-400">
                Published by {schedule.publishedBy} on{' '}
                {format(new Date(schedule.publishedAt), 'MMM d, h:mm a')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Schedule Grid */}
      <div className="glass-panel p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left py-3 px-4 text-gray-300 font-medium">
                  Employee
                </th>
                {weekDays.map((day) => (
                  <th
                    key={day.date}
                    className="text-center py-3 px-2 text-gray-300 font-medium"
                  >
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-8 text-gray-400 italic"
                  >
                    No employees found. Add employees to start scheduling.
                  </td>
                </tr>
              ) : (
                employees.map((employee) => {
                  const employeeShifts = shifts.filter(
                    (shift) => shift.employeeId === employee.id
                  );

                  return (
                    <tr
                      key={employee.id}
                      className="border-b border-glass-border hover:bg-glass-bg transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="text-white font-medium">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {employee.role}
                        </div>
                      </td>
                      {weekDays.map((day) => {
                        const dayShift = employeeShifts.find(
                          (shift) => shift.date === day.date
                        );

                        return (
                          <td
                            key={day.date}
                            className="py-3 px-2 text-center"
                          >
                            {dayShift ? (
                              <div
                                className={`text-xs p-2 rounded ${COLOR_CLASSES[dayShift.color].bg} border ${COLOR_CLASSES[dayShift.color].border}`}
                              >
                                <div className="font-medium text-white">
                                  {dayShift.startTime} - {dayShift.endTime}
                                </div>
                                <div className="text-gray-400 mt-1 text-[10px]">
                                  {dayShift.station}
                                </div>
                                <div className="text-gray-500 text-[10px]">
                                  {dayShift.location}
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-600">—</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-panel p-4">
          <div className="text-sm text-gray-400">Total Employees</div>
          <div className="text-2xl font-bold text-white mt-1">
            {employees.length}
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="text-sm text-gray-400">Shifts This Week</div>
          <div className="text-2xl font-bold text-white mt-1">
            {shifts.length}
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="text-sm text-gray-400">Total Hours</div>
          <div className="text-2xl font-bold text-white mt-1">
            {shifts.reduce((total, shift) => {
              const start = new Date(`2000-01-01T${shift.startTime}`);
              const end = new Date(`2000-01-01T${shift.endTime}`);
              const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
              return total + hours;
            }, 0).toFixed(1)}
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="text-sm text-gray-400">Coverage Gaps</div>
          <div className="text-2xl font-bold text-status-watch mt-1">0</div>
        </div>
      </div>
    </div>
  );
}
