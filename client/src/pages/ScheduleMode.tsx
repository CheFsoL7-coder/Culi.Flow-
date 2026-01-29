import { useState, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import type { Schedule, Employee, Shift, ShiftColor, EmployeeRole } from '../types';
import { getAllEmployees, getAllShifts, getScheduleByWeek } from '../services/db';
import { format, startOfWeek, addDays, isToday } from 'date-fns';

// Color mapping for shift badges
const COLOR_CLASSES: Record<ShiftColor, { bg: string; border: string; label: string }> = {
  red: { bg: 'bg-red-500/20', border: 'border-red-500/40', label: 'Hot-line' },
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/40', label: 'Garde' },
  yellow: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', label: 'Dish' },
  purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/40', label: 'Bakery' },
};

// Role hierarchy for sorting
const ROLE_ORDER: Record<EmployeeRole, number> = {
  'exec-chef': 1,
  'sous-chef': 2,
  'line-cook': 3,
  'dishwasher': 4,
};

// Helper to calculate shift duration in hours
function calculateShiftHours(shift: Shift): number {
  const start = new Date(`2000-01-01T${shift.startTime}`);
  const end = new Date(`2000-01-01T${shift.endTime}`);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

export function ScheduleMode() {
  const [currentWeekStart, setCurrentWeekStart] = useState<string>('');
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

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

    // Sort employees by role hierarchy, then by name
    const sortedEmployees = employeeData.sort((a, b) => {
      const roleCompare = ROLE_ORDER[a.role] - ROLE_ORDER[b.role];
      if (roleCompare !== 0) return roleCompare;
      return a.name.localeCompare(b.name);
    });
    setEmployees(sortedEmployees);

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

      {/* Color Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="text-sm text-gray-400">Station Colors:</div>
        {(Object.entries(COLOR_CLASSES) as [ShiftColor, typeof COLOR_CLASSES[ShiftColor]][]).map(([color, { bg, border, label }]) => (
          <div key={color} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${bg} border ${border}`}></div>
            <span className="text-sm text-gray-300">{label}</span>
          </div>
        ))}
      </div>

      {/* Schedule Grid */}
      <div className="glass-panel p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left py-3 px-4 text-gray-300 font-medium">
                  Employee
                </th>
                {weekDays.map((day) => {
                  const isTodayColumn = isToday(new Date(day.date));
                  return (
                    <th
                      key={day.date}
                      className={`text-center py-3 px-2 text-gray-300 font-medium ${
                        isTodayColumn ? 'bg-blue-500/10 border-l-2 border-r-2 border-blue-500/40' : ''
                      }`}
                    >
                      {day.label}
                      {isTodayColumn && <div className="text-[10px] text-blue-400 mt-1">TODAY</div>}
                    </th>
                  );
                })}
                <th className="text-center py-3 px-4 text-gray-300 font-medium">
                  Total Hrs
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
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

                  // Calculate total hours for this employee
                  const totalHours = employeeShifts.reduce(
                    (sum, shift) => sum + calculateShiftHours(shift),
                    0
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
                        const isTodayColumn = isToday(new Date(day.date));

                        return (
                          <td
                            key={day.date}
                            className={`py-3 px-2 text-center ${
                              isTodayColumn ? 'bg-blue-500/5 border-l-2 border-r-2 border-blue-500/40' : ''
                            }`}
                          >
                            {dayShift ? (
                              <div
                                onClick={() => {
                                  setSelectedShift(dayShift);
                                  setSelectedEmployee(employee);
                                }}
                                className={`text-xs p-2 rounded ${COLOR_CLASSES[dayShift.color].bg} border ${COLOR_CLASSES[dayShift.color].border} cursor-pointer hover:opacity-80 transition-opacity`}
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
                      <td className="py-3 px-4 text-center">
                        <div className="text-white font-bold">{totalHours.toFixed(1)}</div>
                        <div className={`text-[10px] mt-1 ${
                          totalHours > employee.maxHoursPerWeek
                            ? 'text-status-risk'
                            : totalHours > employee.maxHoursPerWeek * 0.9
                            ? 'text-status-watch'
                            : 'text-gray-500'
                        }`}>
                          / {employee.maxHoursPerWeek}
                        </div>
                      </td>
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
            {shifts.reduce((total, shift) => total + calculateShiftHours(shift), 0).toFixed(1)}
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="text-sm text-gray-400">Coverage Gaps</div>
          <div className="text-2xl font-bold text-status-watch mt-1">0</div>
        </div>
      </div>

      {/* Shift Details Modal */}
      {selectedShift && selectedEmployee && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => {
            setSelectedShift(null);
            setSelectedEmployee(null);
          }}
        >
          <div
            className="glass-panel p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Shift Details</h2>
              <button
                onClick={() => {
                  setSelectedShift(null);
                  setSelectedEmployee(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Employee Info */}
              <div>
                <div className="text-sm text-gray-400">Employee</div>
                <div className="text-white font-medium">{selectedEmployee.name}</div>
                <div className="text-sm text-gray-500">{selectedEmployee.role}</div>
              </div>

              {/* Shift Date */}
              <div>
                <div className="text-sm text-gray-400">Date</div>
                <div className="text-white font-medium">
                  {format(new Date(selectedShift.date), 'EEEE, MMMM d, yyyy')}
                </div>
              </div>

              {/* Time */}
              <div>
                <div className="text-sm text-gray-400">Time</div>
                <div className="text-white font-medium">
                  {selectedShift.startTime} - {selectedShift.endTime}
                </div>
                <div className="text-sm text-gray-500">
                  {calculateShiftHours(selectedShift).toFixed(1)} hours
                </div>
              </div>

              {/* Station */}
              <div>
                <div className="text-sm text-gray-400">Station</div>
                <div className="text-white font-medium">{selectedShift.station}</div>
              </div>

              {/* Location */}
              <div>
                <div className="text-sm text-gray-400">Location</div>
                <div className="text-white font-medium">{selectedShift.location}</div>
              </div>

              {/* Color/Type */}
              <div>
                <div className="text-sm text-gray-400">Type</div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${COLOR_CLASSES[selectedShift.color].bg} border ${COLOR_CLASSES[selectedShift.color].border}`}></div>
                  <span className="text-white font-medium">{COLOR_CLASSES[selectedShift.color].label}</span>
                </div>
              </div>

              {/* Status */}
              <div>
                <div className="text-sm text-gray-400">Status</div>
                <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  selectedShift.status === 'published'
                    ? 'bg-status-good/20 text-status-good'
                    : selectedShift.status === 'draft'
                    ? 'bg-status-watch/20 text-status-watch'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {selectedShift.status.toUpperCase()}
                </div>
              </div>

              {/* Notes */}
              {selectedShift.notes && (
                <div>
                  <div className="text-sm text-gray-400">Notes</div>
                  <div className="text-white">{selectedShift.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
