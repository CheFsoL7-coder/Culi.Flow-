import { useEffect, useState } from 'react';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import type { Task, KPIData, TimelineBlock } from '../types';
import { getAllTasks, updateTask } from '../services/db';
import { format } from 'date-fns';

interface KPITileProps {
  title: string;
  value: number;
  target: number;
  unit: string;
  status: 'good' | 'watch' | 'risk';
  icon: React.ReactNode;
}

function KPITile({ title, value, target, unit, status, icon }: KPITileProps) {
  const statusClasses = {
    good: 'kpi-tile-good',
    watch: 'kpi-tile-watch',
    risk: 'kpi-tile-risk',
  };

  return (
    <div className={`${statusClasses[status]} p-6`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-zinc-400">{title}</h3>
        <div className="text-zinc-400">{icon}</div>
      </div>
      <div className="text-3xl font-bold mb-1">
        {value}
        <span className="text-lg text-zinc-400 ml-1">{unit}</span>
      </div>
      <div className="text-sm text-zinc-500">
        Target: {target}
        {unit}
      </div>
    </div>
  );
}

function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const priorityClasses = {
    critical: 'task-card-critical',
    high: 'task-card-high',
    medium: 'task-card-medium',
  };

  return (
    <div className={priorityClasses[task.priority]} onClick={onClick}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium">{task.title}</h4>
        <span className="text-xs px-2 py-1 bg-zinc-800 rounded">
          {task.station || task.type}
        </span>
      </div>
      <div className="text-sm text-zinc-400 flex items-center gap-3">
        {task.durationMinutes && (
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {task.durationMinutes}m
          </span>
        )}
        {task.dueAt && (
          <span>{format(new Date(task.dueAt), 'h:mm a')}</span>
        )}
        {task.owner && <span>@{task.owner}</span>}
      </div>
    </div>
  );
}

function TimelineBlockCard({ block }: { block: TimelineBlock }) {
  return (
    <div className="timeline-block">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium">{block.title}</h4>
        <span className="text-xs px-2 py-1 bg-blue-600 rounded">{block.concept}</span>
      </div>
      <div className="text-sm text-zinc-400">
        {format(new Date(block.startTime), 'h:mm a')} -{' '}
        {format(new Date(block.endTime), 'h:mm a')}
      </div>
      {block.covers && (
        <div className="text-sm text-zinc-500 mt-1">{block.covers} covers</div>
      )}
    </div>
  );
}

export function OpsHome() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [kpiData] = useState<KPIData>({
    ticketTime: { target: 12, actual: 14, status: 'watch' },
    prepCompletion: { target: 95, actual: 88, status: 'watch' },
    waste: { target: 3, actual: 2.5, status: 'good' },
    compliance: { target: 100, actual: 95, status: 'watch' },
  });

  const [timelineBlocks] = useState<TimelineBlock[]>([
    {
      id: 'lunch-oak',
      title: 'Lunch Service - Oak Terrace',
      startTime: new Date().setHours(11, 30, 0, 0).toString(),
      endTime: new Date().setHours(14, 0, 0, 0).toString(),
      concept: 'oak-terrace',
      covers: 120,
    },
    {
      id: 'dinner-elements',
      title: 'Dinner Service - Elements',
      startTime: new Date().setHours(17, 0, 0, 0).toString(),
      endTime: new Date().setHours(20, 30, 0, 0).toString(),
      concept: 'elements',
      covers: 85,
    },
  ]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const allTasks = await getAllTasks();
    const activeTasks = allTasks
      .filter((t) => t.status !== 'done')
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
      .slice(0, 5);
    setTasks(activeTasks);
  };

  const handleTaskComplete = async (task: Task) => {
    const updated = { ...task, status: 'done' as const, updatedAt: new Date().toISOString() };
    await updateTask(updated);
    loadTasks();
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-display mb-2">Ops Home</h1>
        <p className="text-zinc-400">One-glance readiness and next actions</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        <KPITile
          title="Ticket Time"
          value={kpiData.ticketTime.actual}
          target={kpiData.ticketTime.target}
          unit="min"
          status={kpiData.ticketTime.status}
          icon={<Clock size={20} />}
        />
        <KPITile
          title="Prep Completion"
          value={kpiData.prepCompletion.actual}
          target={kpiData.prepCompletion.target}
          unit="%"
          status={kpiData.prepCompletion.status}
          icon={<CheckCircle size={20} />}
        />
        <KPITile
          title="Waste Target"
          value={kpiData.waste.actual}
          target={kpiData.waste.target}
          unit="%"
          status={kpiData.waste.status}
          icon={<AlertTriangle size={20} />}
        />
        <KPITile
          title="Compliance"
          value={kpiData.compliance.actual}
          target={kpiData.compliance.target}
          unit="%"
          status={kpiData.compliance.status}
          icon={<CheckCircle size={20} />}
        />
      </div>

      {/* Now Lane */}
      <div className="glass-panel p-6">
        <h2 className="text-heading mb-4">Now</h2>
        <p className="text-sm text-zinc-400 mb-4">
          Next 5 tasks across modes, sorted by service risk
        </p>
        <div className="space-y-3">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => handleTaskComplete(task)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-zinc-500">
              No active tasks. Use Quick Add to create tasks.
            </div>
          )}
        </div>
      </div>

      {/* Today Timeline */}
      <div className="glass-panel p-6">
        <h2 className="text-heading mb-4">Today's Service Timeline</h2>
        <p className="text-sm text-zinc-400 mb-4">Run-of-show blocks</p>
        <div className="grid grid-cols-2 gap-4">
          {timelineBlocks.map((block) => (
            <TimelineBlockCard key={block.id} block={block} />
          ))}
        </div>
      </div>
    </div>
  );
}
