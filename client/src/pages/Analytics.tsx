import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { subDays, format } from 'date-fns';

interface TrendData {
  date: string;
  value: number;
}

interface DecisionPanel {
  title: string;
  question: string;
  current: number;
  target: number;
  trend: TrendData[];
  exceptions: string[];
  status: 'good' | 'watch' | 'risk';
}

function DecisionPanelCard({ panel }: { panel: DecisionPanel }) {
  const delta = panel.current - panel.target;
  const isPositiveTrend = delta <= 0;

  return (
    <div className="glass-panel p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-1">{panel.title}</h3>
        <p className="text-sm text-zinc-400">{panel.question}</p>
      </div>

      <div className="flex items-end gap-4 mb-6">
        <div>
          <div className="text-4xl font-bold">{panel.current}</div>
          <div className="text-sm text-zinc-500">Current</div>
        </div>
        <div className="mb-2">
          <div className="flex items-center gap-1 text-sm">
            {isPositiveTrend ? (
              <TrendingDown className="text-green-400" size={16} />
            ) : (
              <TrendingUp className="text-red-400" size={16} />
            )}
            <span className={isPositiveTrend ? 'text-green-400' : 'text-red-400'}>
              {Math.abs(delta)} vs target
            </span>
          </div>
        </div>
      </div>

      {/* 14-day trend chart (simplified) */}
      <div className="mb-6">
        <div className="flex items-end gap-1 h-24">
          {panel.trend.map((point, i) => (
            <div
              key={i}
              className="flex-1 bg-blue-600 rounded-t"
              style={{
                height: `${(point.value / Math.max(...panel.trend.map((p) => p.value))) * 100}%`,
              }}
              title={`${format(new Date(point.date), 'MMM d')}: ${point.value}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-zinc-500 mt-2">
          <span>14 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Top Exceptions */}
      <div>
        <h4 className="text-sm font-semibold mb-2">Top Exceptions</h4>
        <div className="space-y-1">
          {panel.exceptions.slice(0, 3).map((exception, i) => (
            <div
              key={i}
              className="text-sm text-zinc-400 hover:text-white cursor-pointer transition-colors"
            >
              • {exception}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Analytics() {
  const [panels, setPanels] = useState<DecisionPanel[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    // Generate 14-day trend data
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = subDays(new Date(), 13 - i);
      return {
        date: date.toISOString(),
        value: Math.floor(Math.random() * 20) + 10,
      };
    });

    setPanels([
      {
        title: 'Ticket Time',
        question: 'Are we hitting ticket time targets?',
        current: 14,
        target: 12,
        trend: last14Days,
        exceptions: [
          'Saturday dinner service: 18 min average',
          'Oak Terrace lunch: 15 min average',
          'Elements dinner: 16 min average',
        ],
        status: 'watch',
      },
      {
        title: 'Waste',
        question: 'Is waste within target?',
        current: 2.5,
        target: 3,
        trend: last14Days.map((d) => ({ ...d, value: Math.random() * 5 })),
        exceptions: [
          'Garde station: 4% waste',
          'Bakery overproduction',
          'Hot line portion control',
        ],
        status: 'good',
      },
      {
        title: 'Compliance',
        question: 'Are we meeting compliance standards?',
        current: 95,
        target: 100,
        trend: last14Days.map((d) => ({ ...d, value: 85 + Math.random() * 15 })),
        exceptions: [
          'Missed temp logs: 3 instances',
          'Late test meals: 2 instances',
          'Incomplete meal rounds: 1 instance',
        ],
        status: 'watch',
      },
      {
        title: 'Standards',
        question: 'Are plating standards being maintained?',
        current: 88,
        target: 95,
        trend: last14Days.map((d) => ({ ...d, value: 80 + Math.random() * 20 })),
        exceptions: [
          'Missing garnish on ribeye',
          'Inconsistent plating on salmon',
          'Sauce portions varying',
        ],
        status: 'watch',
      },
    ]);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-display mb-2">Analytics</h1>
        <p className="text-zinc-400">Decisions only - 14-day trends and exceptions</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {panels.map((panel, i) => (
          <DecisionPanelCard key={i} panel={panel} />
        ))}
      </div>

      <div className="glass-panel p-6">
        <h2 className="text-heading mb-4">Week-over-Week Deltas</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 border border-glass-border rounded">
            <div className="text-sm text-zinc-400 mb-1">Critical Completion</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">-8%</span>
              <TrendingDown className="text-green-400" size={20} />
            </div>
          </div>
          <div className="p-4 border border-glass-border rounded">
            <div className="text-sm text-zinc-400 mb-1">Compliance Completion</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">+3%</span>
              <TrendingUp className="text-green-400" size={20} />
            </div>
          </div>
          <div className="p-4 border border-glass-border rounded">
            <div className="text-sm text-zinc-400 mb-1">Prep Throughput</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">+12%</span>
              <TrendingUp className="text-green-400" size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
