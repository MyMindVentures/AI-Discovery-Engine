import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Settings2, 
  Play, 
  History as HistoryIcon, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Zap, 
  ChevronRight, 
  ExternalLink,
  Code2,
  AlertCircle,
  Activity,
  BarChart3,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import AiFunctionEditor from './AiFunctionEditor';
import { aiFunctionService } from '../../services/aiFunctionService';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function AiFunctionManager() {
  const [functions, setFunctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  const fetchFunctions = async () => {
    try {
      setLoading(true);
      const [fData, sData] = await Promise.all([
        aiFunctionService.getConfigs(),
        aiFunctionService.getStats()
      ]);
      setFunctions(fData);
      setStats(sData);
    } catch (err) {
      console.error("Failed to fetch AI functions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunctions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Bot className="w-8 h-8 text-indigo-500 animate-pulse" />
      </div>
    );
  }

  if (selectedKey) {
    return (
      <AiFunctionEditor 
        functionKey={selectedKey} 
        onBack={() => {
          setSelectedKey(null);
          fetchFunctions();
        }} 
      />
    );
  }

  return (
    <div className="space-y-10">
      {/* AI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-[2rem] bg-zinc-900 border border-zinc-800 shadow-xl">
           <Zap className="w-5 h-5 text-amber-400 mb-4" />
           <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-1">Total Executions</span>
           <div className="text-3xl font-black text-white">
             {stats?.totalRuns?.toLocaleString() || 0}
           </div>
        </div>
        <div className="p-6 rounded-[2rem] bg-zinc-900 border border-zinc-800 shadow-xl">
           <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-4" />
           <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-1">Success Rate</span>
           <div className="text-3xl font-black text-emerald-400">
             {stats?.successRate?.toFixed(1) || 0}%
           </div>
        </div>
        <div className="p-6 rounded-[2rem] bg-zinc-900 border border-zinc-800 shadow-xl">
           <Activity className="w-5 h-5 text-indigo-400 mb-4" />
           <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-1">Avg Latency</span>
           <div className="text-3xl font-black text-white">
             {stats?.avgLatency || 0}ms
           </div>
        </div>
        <div className="p-6 rounded-[2rem] bg-zinc-900 border border-zinc-800 shadow-xl">
           <BarChart3 className="w-5 h-5 text-purple-400 mb-4" />
           <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-1">Status</span>
           <div className="text-3xl font-black text-white">
             Active
           </div>
        </div>
      </div>

      {/* Function Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {functions.map(fn => (
          <motion.div
            key={fn.id}
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => setSelectedKey(fn.id)}
            className="group cursor-pointer p-8 rounded-[2.5rem] bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 transition-all shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-5 h-5 text-indigo-500" />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all shadow-inner">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-tight uppercase">{fn.name}</h3>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    fn.enabled ? "bg-emerald-500 animate-pulse" : "bg-zinc-700"
                  )} />
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                    {fn.enabled ? 'Operational' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed mb-6 line-clamp-2 font-medium">
              {fn.description || `AI core responsible for managing ${fn.id} logic and neural synthesis.`}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50">
              <div className="flex flex-wrap gap-2">
                 <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-[8px] font-black uppercase tracking-widest text-zinc-500">
                   {fn.provider}
                 </span>
                 <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-[8px] font-black uppercase tracking-widest text-zinc-500">
                   {fn.model}
                 </span>
              </div>
              <div className="text-[10px] font-black text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Configure
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

