import React from 'react';
import { cn } from '../../lib/utils';
import { Globe, Database, Users, Building2, Search as SearchIcon, Mail, Laptop } from 'lucide-react';

export type SearchSource = 'google' | 'apify' | 'firecrawl' | 'phantom' | 'crunchbase' | 'pdl' | 'hunter' | 'wappalyzer';

interface Source {
  id: SearchSource;
  name: string;
  icon: any;
  color: string;
}

const sources: Source[] = [
  { id: 'google', name: 'Google Places', icon: Globe, color: 'text-blue-400' },
  { id: 'apify', name: 'Apify', icon: SearchIcon, color: 'text-orange-400' },
  { id: 'firecrawl', name: 'Firecrawl', icon: Laptop, color: 'text-rose-400' },
  { id: 'phantom', name: 'PhantomBuster', icon: Database, color: 'text-indigo-400' },
  { id: 'crunchbase', name: 'Crunchbase', icon: Building2, color: 'text-emerald-400' },
  { id: 'pdl', name: 'People Data Labs', icon: Users, color: 'text-purple-400' },
  { id: 'hunter', name: 'Hunter.io', icon: Mail, color: 'text-amber-400' },
  { id: 'wappalyzer', name: 'Wappalyzer', icon: Laptop, color: 'text-zinc-400' },
];

interface SourceSelectorProps {
  selectedSources: SearchSource[];
  onToggleSource: (id: SearchSource) => void;
}

export default function SourceSelector({ selectedSources, onToggleSource }: SourceSelectorProps) {
  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Intelligence Sources</span>
        <button 
          onClick={() => sources.forEach(s => !selectedSources.includes(s.id) && onToggleSource(s.id))}
          className="text-[10px] font-bold text-indigo-400 hover:underline"
        >
          Select All
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map(source => {
          const isSelected = selectedSources.includes(source.id);
          return (
            <button
              key={source.id}
              onClick={() => onToggleSource(source.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all",
                isSelected
                  ? "bg-zinc-800 border-zinc-700 text-white shadow-sm"
                  : "bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400"
              )}
            >
              <source.icon className={cn("w-3.5 h-3.5", isSelected ? source.color : "text-zinc-600")} />
              {source.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
