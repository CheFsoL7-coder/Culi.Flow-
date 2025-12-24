import { useState } from 'react';
import { ChevronLeft, ChevronRight, Camera, Star, Upload, CheckCircle } from 'lucide-react';
import { addWeeks, startOfWeek, format } from 'date-fns';

const LANES = [
  { id: 'shoot', title: 'Shoot', icon: <Camera size={20} /> },
  { id: 'star', title: 'Star', icon: <Star size={20} /> },
  { id: 'sync', title: 'Sync', icon: <Upload size={20} /> },
  { id: 'review', title: 'Review Monday', icon: <CheckCircle size={20} /> },
];

export function StandardsMode() {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [plates] = useState([
    { id: '1', name: 'Ribeye with Chimichurri', concept: 'oak-terrace', lane: 'shoot', starred: false },
    { id: '2', name: 'Salmon Nicoise', concept: 'elements', lane: 'star', starred: true },
    { id: '3', name: 'Chicken Piccata', concept: 'loons-nest', lane: 'sync', starred: false },
  ]);

  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const prevWeek = () => setCurrentWeek(addWeeks(currentWeek, -1));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-display mb-2">Standards Mode</h1>
        <p className="text-zinc-400">Guided plating portfolio workflow</p>
      </div>

      {/* Week Selector */}
      <div className="glass-panel p-4 flex items-center justify-between">
        <button onClick={prevWeek} className="btn-ghost">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <div className="text-xl font-bold">
            Week of {format(currentWeek, 'MMMM d, yyyy')}
          </div>
          <div className="text-sm text-zinc-400">Sunday start (locked)</div>
        </div>
        <button onClick={nextWeek} className="btn-ghost">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Intake Lanes */}
      <div className="grid grid-cols-4 gap-4">
        {LANES.map((lane) => {
          const lanePlates = plates.filter((p) => p.lane === lane.id);
          return (
            <div key={lane.id} className="glass-panel p-4">
              <div className="flex items-center gap-2 mb-4">
                {lane.icon}
                <h3 className="font-bold">{lane.title}</h3>
              </div>
              <div className="text-sm text-zinc-400 mb-4">
                {lanePlates.length} plates
              </div>
              <div className="space-y-2">
                {lanePlates.map((plate) => (
                  <div
                    key={plate.id}
                    className="glass-panel-hover p-3 rounded cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-sm">{plate.name}</div>
                        <div className="text-xs text-zinc-500 mt-1">{plate.concept}</div>
                      </div>
                      {plate.starred && (
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Album Indicators */}
      <div className="glass-panel p-6">
        <h2 className="text-heading mb-4">Album Status</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-red-900 bg-opacity-20 border border-red-500 rounded">
            <div className="text-2xl font-bold mb-1">3</div>
            <div className="text-sm text-zinc-400">Missing Plates</div>
          </div>
          <div className="p-4 bg-yellow-900 bg-opacity-20 border border-yellow-500 rounded">
            <div className="text-2xl font-bold mb-1">2</div>
            <div className="text-sm text-zinc-400">Late Uploads</div>
          </div>
          <div className="p-4 bg-blue-900 bg-opacity-20 border border-blue-500 rounded">
            <div className="text-2xl font-bold mb-1">5</div>
            <div className="text-sm text-zinc-400">Review Due</div>
          </div>
        </div>
      </div>

      {/* Review Packet Generator */}
      <div className="glass-panel p-6">
        <h2 className="text-heading mb-4">Review Packet Generator</h2>
        <div className="flex gap-4">
          <button className="btn-primary">Generate Top Misses Report</button>
          <button className="btn-primary">Generate Best Plates Album</button>
          <button className="btn-primary">Export Fix List</button>
        </div>
      </div>
    </div>
  );
}
