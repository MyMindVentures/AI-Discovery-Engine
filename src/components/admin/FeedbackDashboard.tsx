import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  BarChart3, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  Tag as TagIcon,
  Layers,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  BrainCircuit,
  Settings,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import StatCard from '../ui/StatCard';
import { feedbackService } from '../../services/exportService';

export default function FeedbackDashboard() {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fData, iData] = await Promise.all([
        feedbackService.getAll(),
        feedbackService.getInsights()
      ]);
      setFeedback(fData);
      setInsights(iData);
    } catch (err) {
      console.error("Failed to fetch feedback", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await feedbackService.updateStatus(id, status);
      fetchData();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const filteredFeedback = feedback.filter(f => {
    if (filter === 'all') return true;
    return f.status === filter || f.aiCategory === filter || f.aiPriority === filter;
  });

  const selectedItem = feedback.find(f => f.id === selectedId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Sparkles className="w-8 h-8 text-indigo-500 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 shadow-xl">
          <MessageSquare className="w-5 h-5 text-indigo-400 mb-4" />
          <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-1">Total Signals</span>
          <div className="text-3xl font-black text-white">{insights?.total || 0}</div>
        </div>
        <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 shadow-xl">
          <AlertCircle className="w-5 h-5 text-rose-400 mb-4" />
          <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-1">Critical Issues</span>
          <div className="text-3xl font-black text-white">{insights?.priority?.Critical || 0}</div>
        </div>
        <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 shadow-xl">
          <TrendingUp className="w-5 h-5 text-emerald-400 mb-4" />
          <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-1">Net Sentiment</span>
          <div className="text-3xl font-black text-white">{insights?.sentiment?.Positive || 0} / {insights?.sentiment?.Frustrated || 0}</div>
        </div>
        <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 shadow-xl">
          <BrainCircuit className="w-5 h-5 text-purple-400 mb-4" />
          <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-1">Theme Clusters</span>
          <div className="text-3xl font-black text-white">{insights?.clusters?.length || 0}</div>
        </div>
      </div>

      {/* Trend Clusters */}
      {insights?.clusters && insights.clusters.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest px-1">AI Intelligence Clusters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {insights.clusters.map((cluster: any, i: number) => (
              <div key={i} className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 flex flex-col justify-between hover:bg-indigo-500/10 transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                      cluster.priority === 'Critical' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                    )}>
                      {cluster.priority}
                    </span>
                    <span className="text-[10px] font-black text-indigo-300 group-hover:scale-110 transition-transform">{cluster.count} Signals</span>
                  </div>
                  <h4 className="text-xs font-black text-white uppercase tracking-tight leading-relaxed">{cluster.theme}</h4>
                </div>
                <div className="mt-4 flex items-center gap-1 opacity-20">
                   <div className="flex -space-x-1">
                      {[1,2,3].map(j => <div key={j} className="w-2 h-2 rounded-full bg-indigo-400" />)}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Feedback List */}
        <div className="lg:col-span-12 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Intelligence Stream
            </h3>
            <div className="flex items-center gap-2">
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-bold text-zinc-400 focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="all">All Signals</option>
                <option value="pending">Pending Review</option>
                <option value="Critical">Critical Priority</option>
                <option value="Bug">Bugs Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredFeedback.map(f => (
                <motion.div
                  key={f.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setSelectedId(f.id === selectedId ? null : f.id)}
                  className={cn(
                    "p-6 rounded-3xl bg-zinc-900/40 border transition-all cursor-pointer group shadow-xl",
                    selectedId === f.id ? "border-indigo-500 shadow-indigo-500/10" : "border-zinc-800 hover:border-zinc-700"
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                      "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                      f.aiPriority === 'Critical' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
                      f.aiPriority === 'High' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                      "bg-zinc-800 border-zinc-700 text-zinc-500"
                    )}>
                      {f.aiPriority}
                    </div>
                    <span className="text-[10px] text-zinc-600 font-mono italic">
                      {new Date(f.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2 leading-tight group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                    {f.aiTitle || 'Neural Interpretation Loading...'}
                  </h4>
                  
                  <p className="text-[11px] text-zinc-500 line-clamp-3 mb-4 font-medium leading-relaxed italic">
                    "{f.rawFeedback}"
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-[8px] font-black uppercase tracking-widest text-zinc-500">
                      {f.aiCategory}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-[8px] font-black uppercase tracking-widest text-zinc-500">
                      {f.aiFeatureArea}
                    </span>
                  </div>

                  <AnimatePresence>
                    {selectedId === f.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-6 pt-6 border-t border-zinc-800 space-y-6"
                      >
                        <div>
                          <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest block mb-2">AI Summary</span>
                          <p className="text-xs text-zinc-300 leading-relaxed font-medium">{f.aiSummary}</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                          <span className="text-[9px] font-black uppercase text-indigo-400 tracking-widest block mb-2">Suggested Action</span>
                          <p className="text-xs text-indigo-300 leading-relaxed font-bold">{f.aiSuggestedAction}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest block mb-1">Sentiment</span>
                            <span className="text-xs font-bold text-white">{f.aiSentiment}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest block mb-1">Complexity</span>
                            <span className="text-xs font-bold text-white">{f.aiComplexityEstimate}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateStatus(f.id, 'planned'); }}
                            className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all border border-zinc-700"
                          >
                            Mark Planned
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateStatus(f.id, 'reviewed'); }}
                            className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-[9px] font-black uppercase tracking-widest text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
                          >
                            Review Signal
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
