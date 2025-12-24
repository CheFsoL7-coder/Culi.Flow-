import { useState } from 'react';
import { Search, Plus, Bell, User } from 'lucide-react';

interface CommandBarProps {
  hidden?: boolean;
  onQuickAddClick?: () => void;
  onSearchClick?: () => void;
}

export function CommandBar({ hidden = false, onQuickAddClick, onSearchClick }: CommandBarProps) {
  const [notificationCount] = useState(3);

  if (hidden) {
    return null;
  }

  return (
    <div className="fixed top-0 left-20 right-0 h-16 bg-zinc-900 border-b border-glass-border no-print flex items-center justify-between px-6 z-40">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onSearchClick}
          className="flex items-center gap-3 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all duration-flow w-96"
        >
          <Search size={18} className="text-zinc-400" />
          <span className="text-zinc-400 text-sm">
            Search or press <kbd className="px-2 py-1 bg-zinc-900 rounded text-xs">⌘K</kbd>
          </span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onQuickAddClick}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Quick Add</span>
        </button>

        <button className="relative p-2 hover:bg-glass-bgHover rounded-lg transition-all duration-flow">
          <Bell size={20} />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>

        <button className="p-2 hover:bg-glass-bgHover rounded-lg transition-all duration-flow">
          <User size={20} />
        </button>
      </div>
    </div>
  );
}
