import React from 'react';
import { X, Search, MapPin, Building, Cpu, Globe } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FilterGroupProps {
  title: string;
  icon: any;
  options: string[];
  selectedOptions: string[];
  onToggle: (option: string) => void;
}

function FilterGroup({ title, icon: Icon, options, selectedOptions, onToggle }: FilterGroupProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-zinc-500">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map(option => {
          const isSelected = selectedOptions.includes(option);
          return (
            <button
              key={option}
              onClick={() => onToggle(option)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                isSelected
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    location: string[];
    industry: string[];
    tech: string[];
    size: string[];
  };
  onUpdateFilters: (key: string, value: string) => void;
}

export default function FilterPanel({ isOpen, onClose, filters, onUpdateFilters }: FilterPanelProps) {
  return (
    <div className={cn(
      "fixed inset-y-0 right-0 w-full sm:w-80 bg-zinc-950 border-l border-zinc-800 z-[100] transform transition-transform duration-300 ease-out p-6 shadow-2xl flex flex-col",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Search className="w-4 h-4 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Intelligence Filters</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pr-2">
        <FilterGroup 
          title="Industry Focus" 
          icon={Building}
          options={['AI', 'CleanTech', 'FinTech', 'BioTech', 'Software', 'Aerospace']}
          selectedOptions={filters.industry}
          onToggle={(val) => onUpdateFilters('industry', val)}
        />

        <FilterGroup 
          title="Geography" 
          icon={MapPin}
          options={['USA', 'Germany', 'UK', 'France', 'Nordics', 'Asia']}
          selectedOptions={filters.location}
          onToggle={(val) => onUpdateFilters('location', val)}
        />

        <FilterGroup 
          title="Technology Stack" 
          icon={Cpu}
          options={['React', 'Node.js', 'PyTorch', 'TensorFlow', 'PostgreSQL', 'AWS', 'Azure']}
          selectedOptions={filters.tech}
          onToggle={(val) => onUpdateFilters('tech', val)}
        />

        <FilterGroup 
          title="Organization Size" 
          icon={Globe}
          options={['1-10', '11-50', '51-200', '201-500', '500+']}
          selectedOptions={filters.size}
          onToggle={(val) => onUpdateFilters('size', val)}
        />
      </div>

      <div className="pt-6 border-t border-zinc-800">
        <button 
          onClick={() => {
            // Reset logic would go here
            onClose();
          }}
          className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20"
        >
          Apply Intelligence Layer
        </button>
      </div>
    </div>
  );
}
