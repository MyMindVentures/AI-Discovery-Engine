import React from 'react';
import { Zap, Search, Activity, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Capability } from '../../types/auth';
import PermissionGuard from '../ui/PermissionGuard';

export type SearchMode = 'quick' | 'deep' | 'monitor';

interface SearchModeSelectorProps {
  onModeChange: (mode: SearchMode) => void;
  activeMode: SearchMode;
}

const modes: { id: SearchMode; name: string; icon: any; capability: Capability; description: string }[] = [
  { id: 'quick', name: 'Quick', icon: Search, capability: 'ai_search', description: 'Immediate web results' },
  { id: 'deep', name: 'Deep', icon: Zap, capability: 'deep_search', description: 'Full scraping & enrichment' },
  { id: 'monitor', name: 'Monitor', icon: Activity, capability: 'monitoring_jobs', description: 'Track changes over time' },
];

export default function SearchModeSelector({ onModeChange, activeMode }: SearchModeSelectorProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {modes.map(mode => (
        <PermissionGuard 
          key={mode.id} 
          capability={mode.capability}
          fallback={
            <div className="relative group grayscale cursor-not-allowed">
              <button
                disabled
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-500 text-xs font-bold transition-all"
              >
                <mode.icon className="w-4 h-4" />
                {mode.name}
                <Lock className="w-3 h-3 ml-1" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-zinc-800 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Upgrade to unlock {mode.name}
              </div>
            </div>
          }
        >
          <button
            onClick={() => onModeChange(mode.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border",
              activeMode === mode.id
                ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
            )}
          >
            <mode.icon className={cn("w-4 h-4", activeMode === mode.id ? "text-white" : "text-zinc-500")} />
            {mode.name}
          </button>
        </PermissionGuard>
      ))}
    </div>
  );
}
