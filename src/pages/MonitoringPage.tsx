import React, { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { 
  Activity, 
  Plus, 
  Search, 
  Clock, 
  Database, 
  AlertCircle, 
  Play, 
  Pause, 
  MoreVertical, 
  TrendingUp, 
  CheckCircle2, 
  History,
  Calendar,
  ChevronRight,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import CreateJobModal from '../components/monitoring/CreateJobModal';
import UpgradePrompt from '../components/UpgradePrompt';
import { monitoringService } from '../services/monitoringService';

import { MetricCard3D } from '../components/ui/MetricCard3D';
import { Card3D } from '../components/ui/Card3D';
import { InteractiveCard } from '../components/ui/InteractiveCard';

export default function MonitoringPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [runningId, setRunningId] = useState<string | null>(null);
  const [limitError, setLimitError] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await monitoringService.getJobs('org_1');
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch monitoring jobs", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = async (newJob: any) => {
    try {
      await monitoringService.createJob({
        ...newJob,
        organizationId: 'org_1'
      });
      fetchJobs();
      setIsCreateModalOpen(false);
    } catch (err: any) {
      console.error("Failed to create job", err);
      const errorMsg = typeof err === 'string' ? err : err.message || '';
      if (errorMsg.includes('PLAN_LIMIT_EXCEEDED')) {
        setLimitError(true);
        setIsCreateModalOpen(false);
      }
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      await monitoringService.updateJob(id, { status: newStatus });
      fetchJobs();
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const runNow = async (id: string) => {
    setRunningId(id);
    try {
      // Logic for runNow would be in service
      await new Promise(r => setTimeout(r, 2000)); // Simulate
      fetchJobs();
    } catch (err) {
      console.error("Failed to run job", err);
    } finally {
      setRunningId(null);
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm("Confirm decommissioning this intelligence node?")) return;
    try {
      await monitoringService.deleteJob(id);
      fetchJobs();
    } catch (err) {
      console.error("Failed to delete job", err);
    }
  };

  const activeJobsCount = jobs.filter(j => j.status === 'active').length;
  const totalFindings = jobs.reduce((acc, curr) => acc + (curr.lastResultsCount || 0), 0);
  const latestFindings = jobs.reduce((acc, curr) => acc + (curr.newFindingsCount || 0), 0);

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-10">
      <PageHeader 
        title="Intelligence Monitoring" 
        description="Persistent AI protocols tracking market shifts, talent migration, and financial events."
        actions={
          <button 
            onClick={() => {
              setLimitError(false);
              setIsCreateModalOpen(true);
            }}
            className="group bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-xl shadow-indigo-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> 
            Deploy Monitor
          </button>
        }
      />

      <AnimatePresence>
        {limitError && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
          >
            <UpgradePrompt feature="Monitoring Nodes" onClose={() => setLimitError(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard3D label="Active Protocols" value={loading ? '...' : activeJobsCount} icon={<Activity className="w-4 h-4" />} variant="default" depth="sm" />
        <MetricCard3D label="Intelligence Pulse" value="Live" icon={<Clock className="w-4 h-4" />} variant="success" depth="sm" />
        <MetricCard3D label="Captured Entities" value={loading ? '...' : (totalFindings || 0).toLocaleString()} icon={<TrendingUp className="w-4 h-4" />} variant="default" depth="sm" />
        <MetricCard3D label="New Discoveries" value={loading ? '...' : `+${latestFindings}`} icon={<CheckCircle2 className="w-4 h-4" />} variant="premium" depth="sm" glow />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content: Jobs List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em]">Active Intelligence Nodes</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
              <input 
                type="text" 
                placeholder="Filter nodes..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 w-48 md:w-64 transition-all"
              />
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="py-20 text-center">
                <RefreshCw className="w-8 h-8 text-zinc-800 animate-spin mx-auto mb-4" />
                <p className="text-xs font-black uppercase text-zinc-600 tracking-widest">Syncing Nodes...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="py-20 text-center bg-zinc-900/20 border border-zinc-800 border-dashed rounded-[2rem]">
                <Database className="w-10 h-10 text-zinc-800 mx-auto mb-4" />
                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">No intelligence protocols deployed.</p>
              </div>
            ) : jobs.filter(j => j.name.toLowerCase().includes(filterQuery.toLowerCase())).map((job) => (
              <motion.div layout key={job.id}>
                <InteractiveCard 
                  className="p-6 flex flex-col md:flex-row md:items-center gap-6"
                  depth="md"
                >
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight font-sans tracking-tight">{job.name}</h3>
                      <div className={cn(
                        "flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                        job.status === 'active' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-zinc-800 border-zinc-700 text-zinc-600"
                      )}>
                        {job.status}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500 font-mono line-clamp-1 italic">"{job.prompt || job.query}"</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[9px] font-black uppercase text-zinc-600 flex items-center gap-1">
                        <Database className="w-3 h-3" /> {job.lastResultsCount || 0} Entities
                      </span>
                      {(job.newFindingsCount || 0) > 0 && (
                        <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                          +{job.newFindingsCount} NEW
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-8 md:px-6 md:border-x border-zinc-800/50">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Frequency</span>
                      <span className="text-xs font-bold text-zinc-300 capitalize flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" /> {job.frequency || job.interval}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Next Pulse</span>
                      <span className="text-xs font-bold text-white">
                        {job.nextRun ? new Date(job.nextRun).toLocaleDateString() : 'Scheduling...'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => runNow(job.id)}
                      disabled={runningId === job.id || job.status !== 'active'}
                      className="p-3 rounded-2xl bg-zinc-800 border border-zinc-700 text-indigo-400 hover:bg-white hover:text-black hover:border-white transition-all disabled:opacity-50 shadow-lg"
                      title="Force Immediate Scan"
                    >
                      <RefreshCw className={cn("w-5 h-5", runningId === job.id && "animate-spin")} />
                    </button>
                    <button 
                      onClick={() => toggleStatus(job.id, job.status)}
                      className={cn(
                        "p-3 rounded-2xl border transition-all shadow-lg",
                        job.status === 'active' ? "bg-zinc-800 border-zinc-700 text-amber-400 hover:bg-amber-400 hover:text-black hover:border-amber-400" : "bg-zinc-800 border-zinc-700 text-emerald-400 hover:bg-emerald-400 hover:text-black hover:border-emerald-400"
                      )}
                    >
                      {job.status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>
                    <button 
                      onClick={() => deleteJob(job.id)}
                      className="p-3 rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all shadow-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </InteractiveCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar: Activity & Alerts */}
        <div className="lg:col-span-4 space-y-8">
          <Card3D className="p-8 relative overflow-hidden" depth="lg" interactive={false}>
            <div className="absolute top-0 right-0 p-8">
              <AlertCircle className="w-5 h-5 text-zinc-700" />
            </div>
            <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest mb-8">Intelligence Feed</h3>
            
            <div className="space-y-6">
              {jobs.filter(j => (j.newFindingsCount || 0) > 0).slice(0, 5).map(job => (
                <div key={job.id} className="group relative pl-6 pb-6 border-l border-zinc-800 last:pb-0">
                  <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{job.name}</h4>
                      <span className="text-[9px] font-bold text-zinc-600">{job.lastRun ? new Date(job.lastRun).toLocaleTimeString() : 'Recent'}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-relaxed italic">Discovered {job.newFindingsCount} new high-relevance entities tracking against protocol parameters.</p>
                  </div>
                </div>
              ))}
              {jobs.filter(j => (j.newFindingsCount || 0) > 0).length === 0 && (
                <p className="text-[10px] text-zinc-600 text-center italic py-10 uppercase tracking-widest">No recent alerts triggered.</p>
              )}
            </div>

            <button className="w-full mt-8 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
              View All Events <ChevronRight className="w-3 h-3" />
            </button>
          </Card3D>

          <Card3D variant="premium" className="p-8 shadow-2xl shadow-indigo-500/20 relative overflow-hidden group" depth="lg" glow>
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-500">
              <Calendar className="w-12 h-12" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xs font-black uppercase text-white/60 tracking-widest mb-2">Schedule Overview</h3>
              <p className="text-2xl font-black mb-6 tracking-tight text-white">{jobs.length} Monitors Active</p>
              <div className="space-y-4">
                {[
                  { label: 'Daily Pulse', freq: 'daily' },
                  { label: 'Weekly Check', freq: 'weekly' },
                  { label: 'Monthly Deep Scan', freq: 'monthly' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-xs font-bold text-white/80">{item.label}</span>
                    <span className="text-xs font-black text-white">{jobs.filter(j => (j.frequency || j.interval) === item.freq).length} Nodes</span>
                  </div>
                ))}
              </div>
            </div>
          </Card3D>
        </div>
      </div>

      <CreateJobModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateJob}
      />
    </div>
  );
}


