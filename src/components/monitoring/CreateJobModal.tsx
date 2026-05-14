import React, { useState } from 'react';
import { X, Activity, Search, Clock, Database, Send, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MonitoringJob } from '../../lib/mock-data';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (job: Omit<MonitoringJob, 'id' | 'lastRun' | 'nextRun' | 'resultsChange' | 'createdAt' | 'status'>) => void;
}

export default function CreateJobModal({ isOpen, onClose, onCreate }: CreateJobModalProps) {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [sources, setSources] = useState<string[]>(['LinkedIn', 'Crunchbase']);

  const availableSources = ['LinkedIn', 'Crunchbase', 'GitHub', 'Pitchbook', 'News APIs', 'Web Scraping', 'Twitter/X'];

  const toggleSource = (source: string) => {
    setSources(prev => prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Activity className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Initialize Monitor</h2>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-0.5">Recurring Intelligence Protocol</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] px-1">
                <Activity className="w-3 h-3" /> Job Designation
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., European AI Talent Watch"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] px-1">
                <Search className="w-3 h-3" /> Search Parameters
              </label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what the AI protocol should monitor..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-zinc-700 min-h-[100px] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] px-1">
                  <Clock className="w-3 h-3" /> Pulse Frequency
                </label>
                <div className="flex flex-col gap-2">
                  {(['daily', 'weekly', 'monthly'] as const).map(freq => (
                    <button
                      key={freq}
                      onClick={() => setFrequency(freq)}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold transition-all capitalize",
                        frequency === freq 
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                          : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                      )}
                    >
                      {freq} {frequency === freq && <CheckCircle className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] px-1">
                  <Database className="w-3 h-3" /> Data Nodes
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSources.map(source => (
                    <button
                      key={source}
                      onClick={() => toggleSource(source)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all",
                        sources.includes(source)
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-400"
                      )}
                    >
                      {source}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-xs hover:border-zinc-700 hover:text-white transition-all uppercase tracking-[0.2em]"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                if (name && prompt && sources.length > 0) {
                  onCreate({ name, prompt, frequency, sources } as any);
                }
              }}
              className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 uppercase tracking-[0.2em]"
            >
              Deploy Agent <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
