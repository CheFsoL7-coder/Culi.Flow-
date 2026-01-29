import { useState, useEffect } from 'react';
import { Calendar, X, Search, Filter, Plus, Edit2, Trash2 } from 'lucide-react';
import type { Schedule, Employee, Shift, ShiftColor, EmployeeRole, ShiftLocation, Station } from '../types';
import { getAllEmployees, getAllShifts, getScheduleByWeek, createShift, updateShift, deleteShift } from '../services/db';
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

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<ShiftLocation | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<EmployeeRole | 'all'>('all');

  // Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [formData, setFormData] = useState<{
    employeeId: string;
    date: string;
    startTime: string;
    endTime: string;
    station: Station;
    location: ShiftLocation;
    color: ShiftColor;
    notes: string;
  }>({
    employeeId: '',
    date: '',
    startTime: '06:00',
    endTime: '14:00',
    station: 'hot-line',
    location: 'main-building',
    color: 'red',
    notes: '',
  });

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

  function openCreateShiftModal(employeeId: string, date: string) {
    setEditingShift(null);
    setFormData({
      employeeId,
      date,
      startTime: '06:00',
      endTime: '14:00',
      station: 'hot-line',
      location: 'main-building',
      color: 'red',
      notes: '',
    });
    setIsEditModalOpen(true);
  }

  function openEditShiftModal(shift: Shift) {
    setEditingShift(shift);
    setFormData({
      employeeId: shift.employeeId,
      date: shift.date,
      startTime: shift.startTime,
      endTime: shift.endTime,
      station: shift.station,
      location: shift.location,
      color: shift.color,
      notes: shift.notes || '',
    });
    setIsEditModalOpen(true);
    setSelectedShift(null);
    setSelectedEmployee(null);
  }

  async function handleSaveShift() {
    try {
      // Validation
      if (!formData.employeeId || !formData.date || !formData.startTime || !formData.endTime) {
        alert('Please fill in all required fields');
        return;
      }

      // Time validation
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      if (end <= start) {
        alert('End time must be after start time');
        return;
      }

      if (editingShift) {
        // Update existing shift
        const updatedShift: Shift = {
          ...editingShift,
          ...formData,
        };
        await updateShift(updatedShift);
      } else {
        // Create new shift
        const newShift: Shift = {
          id: `shift-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...formData,
          status: 'draft',
        };
        await createShift(newShift);
      }

      // Reload data and close modal
      await loadScheduleData(currentWeekStart);
      setIsEditModalOpen(false);
      setEditingShift(null);
    } catch (error) {
      console.error('Failed to save shift:', error);
      alert('Failed to save shift. Please try again.');
    }
  }

  async function handleDeleteShift(shiftId: string) {
    if (!confirm('Are you sure you want to delete this shift?')) {
      return;
    }

    try {
      await deleteShift(shiftId);
      await loadScheduleData(currentWeekStart);
      setIsEditModalOpen(false);
      setEditingShift(null);
    } catch (error) {
      console.error('Failed to delete shift:', error);
      alert('Failed to delete shift. Please try again.');
    }
  }

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(currentWeekStart), i);
    return {
      date: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEE d'),
    };
  });

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter((employee) => {
    // Search filter
    if (searchQuery && !employee.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Role filter
    if (roleFilter !== 'all' && employee.role !== roleFilter) {
      return false;
    }

    // Location filter - check if employee has any shifts at this location
    if (locationFilter !== 'all') {
      const employeeShifts = shifts.filter(s => s.employeeId === employee.id);
      const hasLocationShift = employeeShifts.some(s => s.location === locationFilter);
      if (!hasLocationShift) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="text-blue-400" size={28} />
          <h1 className="text-2xl font-bold text-white">Weekly Schedule</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
          <button
            onClick={goToPreviousWeek}
            className="px-3 md:px-4 py-2 text-sm md:text-base glass-panel hover:bg-glass-bg-hover transition-colors"
          >
            ← Prev
          </button>
          <div className="text-white font-medium text-sm md:text-base">
            Week of {format(new Date(currentWeekStart), 'MMM d, yyyy')}
          </div>
          <button
            onClick={goToNextWeek}
            className="px-3 md:px-4 py-2 text-sm md:text-base glass-panel hover:bg-glass-bg-hover transition-colors"
          >
            Next →
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

      {/* Filters Bar */}
      <div className="glass-panel p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2 md:hidden">
            <Filter size={18} className="text-blue-400" />
            <span className="text-sm text-gray-400 font-medium">Filters</span>
          </div>

          <Filter size={20} className="text-blue-400 hidden md:block" />

          <div className="flex flex-col md:flex-row gap-3 md:gap-4 flex-1">
            {/* Search */}
            <div className="flex-1 md:min-w-[200px] md:max-w-xs relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-glass-border rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm md:text-base"
              />
            </div>

            <div className="flex gap-2 md:gap-4">
              {/* Location Filter */}
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value as ShiftLocation | 'all')}
                className="flex-1 md:flex-initial px-3 md:px-4 py-2 bg-zinc-800 border border-glass-border rounded text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer text-sm md:text-base"
              >
                <option value="all">All Locations</option>
                <option value="main-building">Main Building</option>
                <option value="loons-nest">Loons Nest</option>
                <option value="oak-terrace">Oak Terrace</option>
              </select>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as EmployeeRole | 'all')}
                className="flex-1 md:flex-initial px-3 md:px-4 py-2 bg-zinc-800 border border-glass-border rounded text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer text-sm md:text-base"
              >
                <option value="all">All Roles</option>
                <option value="sous-chef">Sous Chefs</option>
                <option value="line-cook">Line Cooks</option>
                <option value="dishwasher">Dishwashers</option>
              </select>
            </div>
          </div>

          {/* Clear Filters & Results Count */}
          <div className="flex items-center justify-between md:justify-end gap-4">
            {(searchQuery || locationFilter !== 'all' || roleFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setLocationFilter('all');
                  setRoleFilter('all');
                }}
                className="px-3 py-1.5 text-xs md:text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Clear Filters
              </button>
            )}

            {/* Results Count */}
            <div className="text-xs md:text-sm text-gray-400">
              {filteredEmployees.length} of {employees.length}
            </div>
          </div>
        </div>
      </div>

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
      <div className="glass-panel p-3 md:p-6">
        <div className="overflow-x-auto -mx-3 md:mx-0 px-3 md:px-0 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left py-2 md:py-3 px-2 md:px-4 text-gray-300 font-medium text-sm md:text-base sticky left-0 bg-zinc-900/95 backdrop-blur-sm z-10">
                  Employee
                </th>
                {weekDays.map((day) => {
                  const isTodayColumn = isToday(new Date(day.date));
                  return (
                    <th
                      key={day.date}
                      className={`text-center py-2 md:py-3 px-1 md:px-2 text-gray-300 font-medium text-xs md:text-base min-w-[90px] md:min-w-[120px] ${
                        isTodayColumn ? 'bg-blue-500/10 border-l-2 border-r-2 border-blue-500/40' : ''
                      }`}
                    >
                      {day.label}
                      {isTodayColumn && <div className="text-[10px] text-blue-400 mt-1">TODAY</div>}
                    </th>
                  );
                })}
                <th className="text-center py-2 md:py-3 px-2 md:px-4 text-gray-300 font-medium text-xs md:text-base sticky right-0 bg-zinc-900/95 backdrop-blur-sm z-10 min-w-[80px]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-8 text-gray-400 italic"
                  >
                    {employees.length === 0
                      ? 'No employees found. Add employees to start scheduling.'
                      : 'No employees match the current filters.'}
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => {
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
                      <td className="py-2 md:py-3 px-2 md:px-4 sticky left-0 bg-zinc-900/95 backdrop-blur-sm z-10">
                        <div className="text-white font-medium text-sm md:text-base">
                          {employee.name}
                        </div>
                        <div className="text-xs md:text-sm text-gray-400">
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
                            className={`py-2 md:py-3 px-1 md:px-2 text-center ${
                              isTodayColumn ? 'bg-blue-500/5 border-l-2 border-r-2 border-blue-500/40' : ''
                            }`}
                          >
                            {dayShift ? (
                              <div
                                onClick={() => {
                                  setSelectedShift(dayShift);
                                  setSelectedEmployee(employee);
                                }}
                                className={`text-xs p-1.5 md:p-2 rounded ${COLOR_CLASSES[dayShift.color].bg} border ${COLOR_CLASSES[dayShift.color].border} cursor-pointer active:opacity-70 md:hover:opacity-80 transition-opacity min-h-[60px] md:min-h-[70px] flex flex-col justify-center`}
                              >
                                <div className="font-medium text-white text-[10px] md:text-xs whitespace-nowrap">
                                  {dayShift.startTime} - {dayShift.endTime}
                                </div>
                                <div className="text-gray-400 mt-1 text-[9px] md:text-[10px] truncate">
                                  {dayShift.station}
                                </div>
                                <div className="text-gray-500 text-[9px] md:text-[10px] truncate hidden md:block">
                                  {dayShift.location}
                                </div>
                              </div>
                            ) : (
                              <div
                                onClick={() => openCreateShiftModal(employee.id, day.date)}
                                className="text-gray-600 text-sm md:text-base cursor-pointer hover:text-blue-400 hover:bg-blue-500/10 rounded p-2 transition-colors group"
                                title="Click to add shift"
                              >
                                <Plus size={16} className="mx-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            )}
                          </td>
                        );
                      })}
                      <td className="py-2 md:py-3 px-2 md:px-4 text-center sticky right-0 bg-zinc-900/95 backdrop-blur-sm z-10">
                        <div className="text-white font-bold text-sm md:text-base">{totalHours.toFixed(1)}</div>
                        <div className={`text-[9px] md:text-[10px] mt-1 ${
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

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-glass-border">
              <button
                onClick={() => openEditShiftModal(selectedShift)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                <Edit2 size={16} />
                Edit Shift
              </button>
              <button
                onClick={() => {
                  if (selectedShift) {
                    handleDeleteShift(selectedShift.id);
                    setSelectedShift(null);
                    setSelectedEmployee(null);
                  }
                }}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Shift Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => {
            setIsEditModalOpen(false);
            setEditingShift(null);
          }}
        >
          <div
            className="glass-panel p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingShift ? 'Edit Shift' : 'Add New Shift'}
              </h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingShift(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Employee */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Employee <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-glass-border rounded text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">Select employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-glass-border rounded text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Start Time <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-glass-border rounded text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    End Time <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-glass-border rounded text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Station */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Station <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.station}
                  onChange={(e) => setFormData({ ...formData, station: e.target.value as Station })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-glass-border rounded text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="hot-line">Hot Line</option>
                  <option value="garde">Garde/Salad</option>
                  <option value="bakery">Bakery</option>
                  <option value="dish">Dish</option>
                  <option value="utility">Utility/Prep</option>
                  <option value="central-production">Central Production</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Location <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value as ShiftLocation })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-glass-border rounded text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="main-building">Main Building</option>
                  <option value="loons-nest">Loons Nest</option>
                  <option value="oak-terrace">Oak Terrace</option>
                </select>
              </div>

              {/* Color/Type */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Color/Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(COLOR_CLASSES) as [ShiftColor, typeof COLOR_CLASSES[ShiftColor]][]).map(([color, { bg, border, label }]) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`px-4 py-3 rounded border-2 transition-all ${
                        formData.color === color
                          ? `${bg} ${border} border-opacity-100`
                          : 'bg-zinc-800 border-glass-border hover:bg-zinc-700'
                      }`}
                    >
                      <div className="text-white font-medium text-sm">{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Optional notes about this shift..."
                  className="w-full px-4 py-2 bg-zinc-800 border border-glass-border rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-glass-border">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingShift(null);
                }}
                className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveShift}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors font-medium"
              >
                {editingShift ? 'Save Changes' : 'Create Shift'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
