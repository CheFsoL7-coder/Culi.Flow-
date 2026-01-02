import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { parseQuickAdd } from '../services/parser';
import type { Task } from '../types';
import { createTask } from '../services/db';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated?: (task: Task) => void;
}

export function QuickAddModal({ isOpen, onClose, onTaskCreated }: QuickAddModalProps) {
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState<ReturnType<typeof parseQuickAdd> | null>(null);

  useEffect(() => {
    if (input) {
      const result = parseQuickAdd(input);
      setParsed(result);
    } else {
      setParsed(null);
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !parsed) return;

    const task: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: parsed.title || input,
      type: parsed.type || 'prep',
      concept: parsed.conceptTags?.[0],
      station: parsed.station,
      owner: parsed.owner,
      priority: parsed.priority || 'medium',
      durationMinutes: parsed.duration,
      dueAt: parsed.due,
      status: 'backlog',
      complianceType: parsed.complianceTags?.[0],
      evidenceRequired: !!parsed.complianceTags?.length,
      evidence: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await createTask(task);
    onTaskCreated?.(task);
    setInput('');
    setParsed(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-start justify-center pt-32">
      <div className="glass-panel w-[700px] max-h-[600px] flex flex-col">
        <div className="p-6 border-b border-glass-border flex items-center justify-between">
          <h2 className="text-heading">Quick Add</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-glass-bgHover rounded transition-all duration-flow"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Enter task details
            </label>
            <input
              type="text"
              className="input"
              placeholder="prep 10 chicken stock 2gal @garde 9a #mike !critical /temp +oak"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
            <p className="text-xs text-zinc-500 mt-2">
              Syntax: [type] [duration] [title] [quantity] @station [time] #owner !priority /compliance +concept
            </p>
          </div>

          {parsed && (
            <div className="glass-panel p-4 space-y-2">
              <h3 className="text-sm font-semibold mb-3">Parsed Result</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {parsed.type && (
                  <div>
                    <span className="text-zinc-500">Type:</span>{' '}
                    <span className="text-blue-400">{parsed.type}</span>
                  </div>
                )}
                {parsed.duration && (
                  <div>
                    <span className="text-zinc-500">Duration:</span>{' '}
                    <span className="text-blue-400">{parsed.duration} min</span>
                  </div>
                )}
                {parsed.title && (
                  <div>
                    <span className="text-zinc-500">Title:</span>{' '}
                    <span className="text-blue-400">{parsed.title}</span>
                  </div>
                )}
                {parsed.quantity && (
                  <div>
                    <span className="text-zinc-500">Quantity:</span>{' '}
                    <span className="text-blue-400">{parsed.quantity}</span>
                  </div>
                )}
                {parsed.station && (
                  <div>
                    <span className="text-zinc-500">Station:</span>{' '}
                    <span className="text-green-400">{parsed.station}</span>
                  </div>
                )}
                {parsed.due && (
                  <div>
                    <span className="text-zinc-500">Due:</span>{' '}
                    <span className="text-yellow-400">
                      {new Date(parsed.due).toLocaleTimeString()}
                    </span>
                  </div>
                )}
                {parsed.owner && (
                  <div>
                    <span className="text-zinc-500">Owner:</span>{' '}
                    <span className="text-purple-400">{parsed.owner}</span>
                  </div>
                )}
                {parsed.priority && (
                  <div>
                    <span className="text-zinc-500">Priority:</span>{' '}
                    <span className="text-red-400">{parsed.priority}</span>
                  </div>
                )}
                {parsed.complianceTags && parsed.complianceTags.length > 0 && (
                  <div>
                    <span className="text-zinc-500">Compliance:</span>{' '}
                    <span className="text-orange-400">
                      {parsed.complianceTags.join(', ')}
                    </span>
                  </div>
                )}
                {parsed.conceptTags && parsed.conceptTags.length > 0 && (
                  <div>
                    <span className="text-zinc-500">Concept:</span>{' '}
                    <span className="text-cyan-400">
                      {parsed.conceptTags.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!input.trim()}>
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
