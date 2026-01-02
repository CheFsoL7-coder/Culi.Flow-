import { Link, useLocation } from 'react-router-dom';
import { Home, Flame, Package, Star, BarChart3, Calendar } from 'lucide-react';

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/', icon: <Home size={24} />, label: 'Home' },
  { path: '/service', icon: <Flame size={24} />, label: 'Service' },
  { path: '/production', icon: <Package size={24} />, label: 'Production' },
  { path: '/standards', icon: <Star size={24} />, label: 'Standards' },
  { path: '/schedule', icon: <Calendar size={24} />, label: 'Schedule' },
  { path: '/analytics', icon: <BarChart3 size={24} />, label: 'Analytics' },
];

export function LeftRail({ hidden = false }: { hidden?: boolean }) {
  const location = useLocation();

  if (hidden) {
    return null;
  }

  return (
    <nav className="fixed left-0 top-0 h-full w-20 bg-zinc-900 border-r border-glass-border no-print flex flex-col items-center py-6 gap-6 z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-flow
              ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-glass-bgHover'
              }
            `}
            title={item.label}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
