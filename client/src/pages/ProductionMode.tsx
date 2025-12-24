import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Task, Station } from '../types';
import { getAllTasks, updateTask } from '../services/db';

const STATIONS: { id: Station; label: string }[] = [
  { id: 'hot-line', label: 'Hot Line' },
  { id: 'garde', label: 'Garde' },
  { id: 'bakery', label: 'Bakery' },
  { id: 'dish', label: 'Dish' },
  { id: 'utility', label: 'Utility' },
  { id: 'central-production', label: 'Central Production' },
];

const PREP_COLUMNS = [
  { id: 'backlog', title: 'Backlog', status: 'backlog' as const },
  { id: 'in_progress', title: 'In Progress', status: 'in_progress' as const },
  { id: 'ready', title: 'Ready', status: 'ready' as const },
  { id: 'verified', title: 'Verified', status: 'verified' as const },
];

function RecipeDrawer({
  task,
  onClose,
}: {
  task: Task;
  onClose: () => void;
}) {
  return (
    <div className="drawer-panel drawer-panel-open">
      <div className="p-6 border-b border-glass-border flex items-center justify-between">
        <h2 className="text-heading">{task.title}</h2>
        <button onClick={onClose} className="p-2 hover:bg-glass-bgHover rounded">
          <X size={20} />
        </button>
      </div>
      <div className="p-6 space-y-6 overflow-y-auto">
        <div>
          <h3 className="text-sm font-semibold text-zinc-400 mb-2">Station</h3>
          <p>{task.station || 'Not assigned'}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-400 mb-2">Owner</h3>
          <p>{task.owner || 'Unassigned'}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-400 mb-2">Duration</h3>
          <p>{task.durationMinutes ? `${task.durationMinutes} minutes` : 'Not specified'}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-400 mb-2">Recipe Link</h3>
          <p className="text-blue-400 cursor-pointer">View recipe →</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-400 mb-2">Yields</h3>
          <p>2 gallons (16 portions)</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-400 mb-2">Allergens</h3>
          <div className="flex gap-2 flex-wrap">
            <span className="px-2 py-1 bg-orange-600 rounded text-sm">Dairy</span>
            <span className="px-2 py-1 bg-orange-600 rounded text-sm">Gluten</span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-400 mb-2">Holding Notes</h3>
          <p className="text-sm">Store at 165°F or higher. Label and date.</p>
        </div>
      </div>
    </div>
  );
}

export function ProductionMode() {
  const [selectedStation, setSelectedStation] = useState<Station>('hot-line');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, [selectedStation]);

  const loadTasks = async () => {
    const allTasks = await getAllTasks();
    const prepTasks = allTasks.filter(
      (t) => t.type === 'prep' && t.station === selectedStation
    );
    setTasks(prepTasks);
  };

  const handleTaskMove = async (task: Task, newStatus: Task['status']) => {
    const updated = { ...task, status: newStatus, updatedAt: new Date().toISOString() };
    await updateTask(updated);
    loadTasks();
  };

  return (
    <div className="p-6 h-full flex gap-6">
      {/* Stations List */}
      <div className="w-64 glass-panel p-4">
        <h2 className="text-heading mb-4">Stations</h2>
        <div className="space-y-2">
          {STATIONS.map((station) => (
            <button
              key={station.id}
              onClick={() => setSelectedStation(station.id)}
              className={`
                w-full text-left px-4 py-3 rounded-lg transition-all duration-flow
                ${
                  selectedStation === station.id
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-glass-bgHover'
                }
              `}
            >
              {station.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prep Board */}
      <div className="flex-1 flex gap-4 overflow-x-auto">
        {PREP_COLUMNS.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.status);
          return (
            <div key={column.id} className="board-column flex-1 min-w-[250px]">
              <h3 className="text-xl font-bold mb-1">{column.title}</h3>
              <span className="text-sm text-zinc-500 mb-4 block">
                {columnTasks.length} tasks
              </span>
              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className="task-card"
                    onClick={() => setSelectedTask(task)}
                  >
                    <h4 className="font-medium mb-2">{task.title}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const currentIndex = PREP_COLUMNS.findIndex(
                          (c) => c.status === task.status
                        );
                        if (currentIndex < PREP_COLUMNS.length - 1) {
                          handleTaskMove(task, PREP_COLUMNS[currentIndex + 1].status);
                        }
                      }}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Move →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recipe Drawer */}
      {selectedTask && (
        <RecipeDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
