import { useEffect, useState } from 'react';
import {
  Plus,
  Play,
  UserPlus,
  AlertCircle,
  FileText,
  Calendar,
  Download,
  Package,
} from 'lucide-react';

interface Command {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickAdd?: () => void;
  onGenerateDirectorSummary?: () => void;
  onExportCompliance?: () => void;
  onExportEvidence?: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onQuickAdd,
  onGenerateDirectorSummary,
  onExportCompliance,
  onExportEvidence,
}: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = [
    {
      id: 'quick-add',
      label: 'Add prep task',
      icon: <Plus size={18} />,
      action: () => {
        onQuickAdd?.();
        onClose();
      },
      keywords: ['add', 'new', 'task', 'prep'],
    },
    {
      id: 'start-batch',
      label: 'Start batch',
      icon: <Play size={18} />,
      action: () => {
        console.log('Start batch');
        onClose();
      },
      keywords: ['start', 'batch', 'begin'],
    },
    {
      id: 'assign-owner',
      label: 'Assign owner',
      icon: <UserPlus size={18} />,
      action: () => {
        console.log('Assign owner');
        onClose();
      },
      keywords: ['assign', 'owner', 'delegate'],
    },
    {
      id: 'log-issue',
      label: 'Log issue',
      icon: <AlertCircle size={18} />,
      action: () => {
        console.log('Log issue');
        onClose();
      },
      keywords: ['issue', 'problem', 'blocker'],
    },
    {
      id: 'add-note',
      label: 'Add plating note',
      icon: <FileText size={18} />,
      action: () => {
        console.log('Add note');
        onClose();
      },
      keywords: ['note', 'plating', 'comment'],
    },
    {
      id: 'jump-week',
      label: 'Jump to week',
      icon: <Calendar size={18} />,
      action: () => {
        console.log('Jump to week');
        onClose();
      },
      keywords: ['week', 'jump', 'navigate'],
    },
    {
      id: 'director-summary',
      label: 'Generate director summary',
      icon: <FileText size={18} />,
      action: () => {
        onGenerateDirectorSummary?.();
        onClose();
      },
      keywords: ['director', 'summary', 'generate', 'report'],
    },
    {
      id: 'export-compliance',
      label: 'Export compliance record',
      icon: <Download size={18} />,
      action: () => {
        onExportCompliance?.();
        onClose();
      },
      keywords: ['export', 'compliance', 'record', 'audit'],
    },
    {
      id: 'export-evidence',
      label: 'Export evidence pack',
      icon: <Package size={18} />,
      action: () => {
        onExportEvidence?.();
        onClose();
      },
      keywords: ['export', 'evidence', 'pack', 'bundle'],
    },
  ];

  const filteredCommands = commands.filter((cmd) => {
    const searchLower = search.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(searchLower) ||
      cmd.keywords.some((kw) => kw.includes(searchLower))
    );
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filteredCommands[selectedIndex]?.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-start justify-center pt-32">
      <div className="glass-panel w-[600px] max-h-[500px] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-glass-border">
          <input
            type="text"
            className="input"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="overflow-y-auto flex-1">
          {filteredCommands.map((cmd, index) => (
            <button
              key={cmd.id}
              onClick={cmd.action}
              className={`
                w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-flow
                ${
                  index === selectedIndex
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-glass-bgHover'
                }
              `}
            >
              {cmd.icon}
              <span>{cmd.label}</span>
            </button>
          ))}

          {filteredCommands.length === 0 && (
            <div className="px-4 py-8 text-center text-zinc-500">
              No commands found
            </div>
          )}
        </div>

        <div className="p-3 border-t border-glass-border text-xs text-zinc-500 flex items-center gap-4">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
