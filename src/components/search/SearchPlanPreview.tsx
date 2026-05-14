import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Loader2, Sparkles, ArrowRight, Database, Search, UserCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface PlanStep {
  id: string;
  title: string;
  status: 'pending' | 'active' | 'completed';
  type: 'search' | 'scraping' | 'enrichment' | 'validation';
}

interface SearchPlanPreviewProps {
  steps: PlanStep[];
  query: string;
  isExecuting?: boolean;
}

const typeIcons = {
  search: Search,
  scraping: Database,
  enrichment: Sparkles,
  validation: UserCheck,
};

export default function SearchPlanPreview({ steps, query, isExecuting = false }: SearchPlanPreviewProps) {
  return (
    <div className="w-full max-w-2xl bg-zinc-950/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
      <div className="p-6 border-b border-zinc-800 bg-zinc-900/30">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-black uppercase tracking-widest text-white leading-none">AI Search Plan</h3>
        </div>
        <p className="text-zinc-500 text-xs italic line-clamp-1">"{query}"</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          {steps.map((step, i) => {
            const Icon = typeIcons[step.type];
            return (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={step.id} 
                className={cn(
                  "flex items-center gap-4 transition-opacity",
                  step.status === 'pending' ? "opacity-40" : "opacity-100"
                )}
              >
                <div className="relative">
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 bg-zinc-950 rounded-full" />
                  ) : step.status === 'active' ? (
                    <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-700" />
                  )}
                  {i < steps.length - 1 && (
                    <div className={cn(
                      "absolute top-5 left-2.5 w-px h-6 -translate-x-1/2",
                      step.status === 'completed' ? "bg-emerald-500/30" : "bg-zinc-800"
                    )} />
                  )}
                </div>
                
                <div className="flex flex-1 items-center gap-3 bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/50">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center border",
                    step.status === 'active' ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" : "bg-zinc-800 border-zinc-700 text-zinc-500"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={cn(
                    "text-xs font-bold transition-colors",
                    step.status === 'active' ? "text-white" : "text-zinc-400"
                  )}>
                    {step.title}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {isExecuting && (
          <div className="pt-4 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Global Progress</span>
              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">
                {Math.round((steps.filter(s => s.status === 'completed').length / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
