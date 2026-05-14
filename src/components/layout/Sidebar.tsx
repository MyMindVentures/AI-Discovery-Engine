import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  ListOrdered, 
  Activity, 
  Download, 
  CreditCard, 
  Settings, 
  ShieldCheck,
  ChevronRight,
  Database,
  Terminal
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { Capability } from '../../types/auth';

const navItems: { name: string; path: string; icon: any; capability: Capability }[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, capability: 'ai_search' },
  { name: 'AI Search', path: '/search', icon: Search, capability: 'ai_search' },
  { name: 'Results', path: '/results', icon: Database, capability: 'ai_search' },
  { name: 'Lists', path: '/lists', icon: ListOrdered, capability: 'ai_search' },
  { name: 'Monitoring', path: '/monitoring', icon: Activity, capability: 'monitoring_jobs' },
  { name: 'Exports', path: '/exports', icon: Download, capability: 'exports' },
  { name: 'Billing', path: '/billing', icon: CreditCard, capability: 'billing' },
  { name: 'Settings', path: '/settings', icon: Settings, capability: 'ai_search' },
  { name: 'Developer', path: '/developer', icon: Terminal, capability: 'ai_search' },
  { name: 'Admin', path: '/admin', icon: ShieldCheck, capability: 'admin_access' },
];

export default function Sidebar() {
  const location = useLocation();
  const { hasCapability, user } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-zinc-950 border-r border-zinc-800 h-screen sticky top-0">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Search className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">AI Discovery</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.filter(item => hasCapability(item.capability)).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-indigo-600/10 text-indigo-400" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-white truncate">{user?.name || 'Guest User'}</span>
            <span className="text-[10px] uppercase font-black text-indigo-400 truncate tracking-widest">{user?.role.replace('_', ' ')} Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
