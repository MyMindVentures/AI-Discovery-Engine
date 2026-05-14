import React, { useEffect, useState } from 'react';
import { Activity, Terminal, RefreshCcw, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface QueueStatus {
  name: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  offline?: boolean;
}

export default function QueueMonitor() {
  const [queues, setQueues] = useState<Record<string, QueueStatus>>({});
  const [loading, setLoading] = useState(true);

  const fetchQueues = async () => {
    try {
      // Mock data for infrastructure status
      const data = {
        'extraction_engine': { name: 'extraction_engine', waiting: 12, active: 4, completed: 4200, failed: 24, delayed: 2 },
        'neural_synthesis': { name: 'neural_synthesis', waiting: 0, active: 1, completed: 12400, failed: 5, delayed: 0 },
        'export_pipeline': { name: 'export_pipeline', waiting: 2, active: 0, completed: 850, failed: 1, delayed: 1 }
      };
      setQueues(data);
    } catch (err) {
      console.error("Failed to fetch queue stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();
    const interval = setInterval(fetchQueues, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && Object.keys(queues).length === 0) {
    return (
      <div className="flex items-center justify-center p-20">
        <RefreshCcw className="w-8 h-8 text-zinc-800 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(queues).map(([key, q]) => (
          <div key={key} className="p-6 rounded-[2.5rem] bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden relative group">
            <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:scale-125 transition-all duration-500 text-indigo-400">
               <Activity className="w-20 h-20" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400">{key.replace('_', ' ')}</h4>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  q.offline ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                )} />
              </div>

              {q.offline ? (
                <div className="py-4 text-center">
                  <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">Redis Offline<br/><span className="text-[10px] font-mono lowercase tracking-normal">Jobs running in legacy mode</span></p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Active / Waiting</span>
                    <div className="text-xl font-black text-white flex items-center gap-2">
                       <Activity className={cn("w-4 h-4 text-indigo-400", q.active > 0 && "animate-pulse")} />
                       {q.active} <span className="text-zinc-700 text-lg">/</span> {q.waiting}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Completed</span>
                    <div className="text-xl font-black text-emerald-400 flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4" />
                       {q.completed}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Failed</span>
                    <div className="text-xl font-black text-rose-500 flex items-center gap-2">
                       <AlertTriangle className="w-4 h-4" />
                       {q.failed}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Delayed</span>
                    <div className="text-xl font-black text-amber-500 flex items-center gap-2">
                       <Clock className="w-4 h-4" />
                       {q.delayed}
                    </div>
                  </div>
                </div>
              )}

              {!q.offline && (
                <div className="mt-6 pt-6 border-t border-zinc-800 flex items-center justify-between">
                   <button 
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-rose-400 transition-colors"
                    onClick={() => {}} // TODO: Add clean queue
                   >
                     Purge Failed
                   </button>
                   <button className="p-2 rounded-lg bg-zinc-800 text-zinc-600 hover:text-white transition-all">
                     <Terminal className="w-3.5 h-3.5" />
                   </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-10 rounded-[2.5rem] bg-zinc-950/50 border border-zinc-800 border-dashed">
         <div className="flex items-center gap-4 text-zinc-500">
            <Terminal className="w-5 h-5" />
            <p className="text-xs font-mono italic">"The background job system leverages BullMQ for priority-based execution, reliable retries, and real-time observability."</p>
         </div>
      </div>
    </div>
  );
}
