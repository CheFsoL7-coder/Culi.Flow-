import { useEffect, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import type { Task } from '../types';
import { getAllTasks, updateTask } from '../services/db';
import { format } from 'date-fns';

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', status: 'backlog' as const },
  { id: 'firing', title: 'Firing', status: 'in_progress' as const },
  { id: 'plating', title: 'Plating', status: 'ready' as const },
  { id: 'running', title: 'Running', status: 'verified' as const },
  { id: 'done', title: 'Done', status: 'done' as const },
];

function BigClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <div className="service-big-type font-mono">
        {format(time, 'HH:mm:ss')}
      </div>
      <div className="text-xl text-zinc-400 mt-2">
        {format(time, 'EEEE, MMMM d')}
      </div>
    </div>
  );
}

function TaskCard({ task, onMove }: { task: Task; onMove: (newStatus: Task['status']) => void }) {
  const priorityColors = {
    critical: 'border-l-priority-critical',
    high: 'border-l-priority-high',
    medium: 'border-l-priority-medium',
  };

  return (
    <div
      className={`glass-panel-hover p-4 mb-3 border-l-4 ${priorityColors[task.priority]} cursor-pointer`}
      onClick={() => {
        const currentIndex = COLUMNS.findIndex((c) => c.status === task.status);
        if (currentIndex < COLUMNS.length - 1) {
          onMove(COLUMNS[currentIndex + 1].status);
        }
      }}
    >
      <h4 className="font-semibold mb-2 text-lg">{task.title}</h4>
      <div className="text-sm text-zinc-400 space-y-1">
        {task.station && (
          <div className="px-2 py-1 bg-zinc-800 rounded inline-block">
            {task.station}
          </div>
        )}
        {task.durationMinutes && (
          <div className="mt-2">{task.durationMinutes} minutes</div>
        )}
        {task.owner && <div>@{task.owner}</div>}
      </div>
    </div>
  );
}

function BoardColumn({
  title,
  tasks,
  onTaskMove,
}: {
  title: string;
  tasks: Task[];
  onTaskMove: (task: Task, newStatus: Task['status']) => void;
}) {
  return (
    <div className="board-column flex-1">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <span className="text-sm text-zinc-500">{tasks.length} tasks</span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onMove={(newStatus) => onTaskMove(task, newStatus)}
          />
        ))}
      </div>
    </div>
  );
}

export function ServiceMode() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const allTasks = await getAllTasks();
    const serviceTasks = allTasks.filter((t) => t.type === 'service' || t.type === 'prep');
    setTasks(serviceTasks);
  };

  const handleTaskMove = async (task: Task, newStatus: Task['status']) => {
    const updated = { ...task, status: newStatus, updatedAt: new Date().toISOString() };
    await updateTask(updated);
    loadTasks();
  };

  return (
    <div className={`h-full ${focusMode ? 'p-0' : 'p-6'}`}>
      <div className={`mb-6 ${focusMode ? 'px-6 pt-6' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-display mb-2">Service Mode</h1>
            <p className="text-zinc-400">Expo board under pressure</p>
          </div>
          <button
            onClick={() => setFocusMode(!focusMode)}
            className="btn-secondary flex items-center gap-2"
          >
            {focusMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            {focusMode ? 'Exit Focus' : 'Focus Mode'}
          </button>
        </div>

        {focusMode && <BigClock />}
      </div>

      <div className={`flex gap-4 ${focusMode ? 'px-6 pb-6' : ''} overflow-x-auto`}>
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.status);
          return (
            <BoardColumn
              key={column.id}
              title={column.title}
              tasks={columnTasks}
              onTaskMove={handleTaskMove}
            />
          );
        })}
      </div>

      {!focusMode && (
        <div className="mt-6 text-center text-sm text-zinc-500">
          Click any task to move it to the next column. Use Focus Mode for distraction-free work.
        </div>
      )}
    </div>
  );
}
