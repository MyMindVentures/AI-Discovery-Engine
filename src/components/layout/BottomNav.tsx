import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  ListOrdered, 
  Settings,
  Database
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { Capability } from '../../types/auth';

const mobileNavItems: { name: string; path: string; icon: any; capability: Capability }[] = [
  { name: 'Home', path: '/dashboard', icon: LayoutDashboard, capability: 'ai_search' },
  { name: 'Search', path: '/search', icon: Search, capability: 'ai_search' },
  { name: 'Results', path: '/results', icon: Database, capability: 'ai_search' },
  { name: 'Lists', path: '/lists', icon: ListOrdered, capability: 'ai_search' },
  { name: 'Settings', path: '/settings', icon: Settings, capability: 'ai_search' },
];

export default function BottomNav() {
  const location = useLocation();
  const { hasCapability } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-lg border-t border-zinc-800 px-6 py-3 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {mobileNavItems.filter(item => hasCapability(item.capability)).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
