import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import { 
  ShieldCheck, 
  Users, 
  Activity, 
  Settings, 
  Unlock, 
  BarChart3, 
  Search, 
  Database, 
  LayoutDashboard, 
  CreditCard, 
  Terminal, 
  Globe, 
  Cpu, 
  Server,
  Zap,
  MoreVertical,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  AlertTriangle,
  History,
  ShieldAlert,
  Clock,
  Download,
  Sparkles
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import PermissionGuard from '../components/ui/PermissionGuard';
import { 
  RefreshCcw,
  Play as PlayIcon, 
  Pause as PauseIcon, 
  XCircle as CancelIcon, 
  RefreshCcw as RetryIcon,
  Search as SearchIcon,
  ChevronRight,
  Code
} from 'lucide-react';

import QueueMonitor from '../components/admin/QueueMonitor';
import FeedbackDashboard from '../components/admin/FeedbackDashboard';
import AiFunctionManager from '../components/admin/AiFunctionManager';
import { AdminCard3D } from '../components/ui/AdminCard3D';
import { Card3D } from '../components/ui/Card3D';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { adminService } from '../services/adminService';
import { scrapingService } from '../services/searchService';

type AdminTab = 'overview' | 'users' | 'scraping' | 'providers' | 'system' | 'billing' | 'ai' | 'logs' | 'feedback';

export default function AdminPage() {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<AdminTab>((tab as AdminTab) || 'overview');

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab as AdminTab);
    }
  }, [tab]);

  const handleTabChange = (newTab: AdminTab) => {
    setActiveTab(newTab);
    navigate(`/admin/${newTab}`);
  };
  const [scrapingJobs, setScrapingJobs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const data = await scrapingService.getAll('org_1');
      setScrapingJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const [statsData, logsData] = await Promise.all([
        adminService.getStats(),
        adminService.getSystemLogs()
      ]);
      setStats(statsData);
      setLogs(logsData);
    } catch (err) {
      console.error("Failed to fetch overview data", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch user data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'logs') {
      fetchOverviewData();
    } else if (activeTab === 'scraping') {
      fetchJobs();
      const interval = setInterval(fetchJobs, 5000);
      return () => clearInterval(interval);
    } else if (activeTab === 'users') {
      fetchUserData();
    }
  }, [activeTab]);

  const tabs: { id: AdminTab, label: string, icon: any }[] = [
    { id: 'overview', label: 'Engine Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Nodes & Identity', icon: Users },
    { id: 'scraping', label: 'Extraction Jobs', icon: Search },
    { id: 'providers', label: 'Provider Core', icon: Globe },
    { id: 'system', label: 'Infrastructure', icon: Database },
    { id: 'billing', label: 'Revenue & Ops', icon: CreditCard },
    { id: 'feedback', label: 'Neural Feedback', icon: Sparkles },
    { id: 'ai', label: 'Neural Monitor', icon: Cpu },
    { id: 'logs', label: 'Audit Trail', icon: Terminal },
  ];

  const handleRetryJob = async (id: string) => {
    try {
      await scrapingService.retryJob(id);
      fetchJobs();
    } catch (err) {
      console.error("Failed to retry job", err);
    }
  };

  return (
    <PermissionGuard capability="admin_access" fallback={
      <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 rounded-[2.5rem] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Access Violation</h2>
          <p className="text-zinc-500 max-w-xs mx-auto">This terminal is restricted to platform administrators only. All unauthorized access attempts are logged.</p>
        </div>
      </div>
    }>
      <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8 pb-32">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-black uppercase text-rose-500 tracking-widest mb-4">
              <ShieldCheck className="w-3 h-3" />
              L7 Privileged Access Enabled
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight font-sans">Control Center</h1>
            <p className="text-zinc-500 mt-1">Universal governance of intelligence nodes, revenue streams, and neural processing.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400 hover:text-white transition-all flex items-center gap-2">
              <History className="w-4 h-4" /> System Baseline
            </button>
            <button className="px-6 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-all shadow-xl shadow-rose-600/20">
              Emergency Shutdown
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-zinc-800/50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                activeTab === tab.id ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-indigo-400" : "text-zinc-600")} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                       Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-40 rounded-[2.5rem] bg-zinc-900/40 border border-zinc-800 animate-pulse" />
                      ))
                    ) : stats.map((stat, i) => (
                      <AdminCard3D 
                        key={i} 
                        className="p-8 relative group overflow-hidden" 
                        depth="md"
                      >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-500">
                          <BarChart3 className="w-16 h-16" />
                        </div>
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">{stat.label}</span>
                            <div className={cn(
                              "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border",
                              stat.trend === 'up' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : 
                              stat.trend === 'down' ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : 
                              "bg-zinc-800 border-zinc-700 text-zinc-500"
                            )}>
                              {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : stat.trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
                              {stat.change}
                            </div>
                          </div>
                          <div className="text-3xl font-black text-white tracking-tighter">{stat.value}</div>
                        </div>
                      </AdminCard3D>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <AdminCard3D className="lg:col-span-8 p-10" depth="sm" interactive={false}>
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-xl font-black text-white tracking-tight uppercase">Scraping Infrastructure</h2>
                          <p className="text-xs text-zinc-500">Global crawler health and enrichment success rates.</p>
                        </div>
                        <Zap className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="space-y-8">
                        {[
                          { name: 'Cluster EU-Central-1', load: 42, health: 100, workers: 850 },
                          { name: 'Cluster US-East-2', load: 88, health: 94, workers: 1200 },
                          { name: 'Cluster Asia-South', load: 12, health: 85, workers: 400 },
                        ].map(cluster => (
                          <div key={cluster.name} className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-white text-sm">{cluster.name}</span>
                              <span className="text-zinc-500 font-black uppercase tracking-widest text-[9px]">{cluster.workers} Active Workers</span>
                            </div>
                            <div className="h-4 bg-black/40 rounded-full overflow-hidden flex border border-zinc-800 p-1">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${cluster.load}%` }}
                                className={cn("h-full rounded-full transition-all duration-1000", cluster.load > 85 ? "bg-rose-500" : "bg-indigo-500")} 
                              />
                            </div>
                            <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-[0.2em] text-zinc-600">
                              <span>Load Factor: {cluster.load}%</span>
                              <span className={cluster.health < 90 ? "text-amber-500" : "text-emerald-500"}>Consistency: {cluster.health}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AdminCard3D>

                    <AdminCard3D className="lg:col-span-4 p-8 flex flex-col justify-between" depth="sm" interactive={false}>
                      <div>
                        <div className="flex items-center gap-3 mb-8">
                          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                            <ShieldAlert className="w-4 h-4 text-orange-400" />
                          </div>
                          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest leading-none">Threat Intelligence</h3>
                        </div>
                        <div className="space-y-6">
                          <InteractiveCard className="p-5 border-rose-500/20 bg-rose-500/[0.02]" depth="sm">
                            <div className="flex items-center gap-2 text-rose-400 mb-2">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Rate Limit Trigger</span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed font-medium">Unusual scraping pattern detected from IP: <span className="text-white font-mono">142.12.8.***</span></p>
                          </InteractiveCard>
                          <InteractiveCard className="p-5 border-amber-500/20 bg-amber-500/[0.02]" depth="sm">
                            <div className="flex items-center gap-2 text-amber-500 mb-2">
                              <Zap className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Proxy Exhaustion</span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed font-medium">Proxy pool for source 'LinkedIn' is at <span className="text-white font-bold">12% capacity.</span></p>
                          </InteractiveCard>
                        </div>
                      </div>
                      <button className="w-full mt-10 py-5 rounded-2xl bg-zinc-800 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all border border-zinc-700 shadow-xl">
                        View Security Console
                      </button>
                    </AdminCard3D>
                  </div>
                </div>
              )}

              {activeTab === 'scraping' && (
                <Card3D className="overflow-hidden" depth="lg" interactive={false}>
                  <div className="p-10 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">Active Extraction Jobs</h3>
                      <p className="text-xs text-zinc-500">Real-time monitor of global scraping clusters and data ingestion.</p>
                    </div>
                    <div className="flex items-center gap-3">
                         <button className="px-5 py-3 rounded-2xl bg-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all border border-zinc-700 shadow-lg">
                           Clear Finished
                         </button>
                         <InteractiveCard className="px-6 py-3 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 border-0" depth="sm">
                           New Global Job
                         </InteractiveCard>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-zinc-950/50">
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Job Reference</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Engine / Source</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Intelligence Goal</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Transmission Status</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-center">Payload Metrics</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Timing Cycle</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Overrides</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50 font-sans">
                        {scrapingJobs.map((job) => (
                          <tr key={job.id} className="hover:bg-zinc-800/30 transition-colors group">
                            <td className="px-8 py-5">
                              <span className="text-xs font-mono text-zinc-500">#{job.id.toUpperCase()}</span>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                   <Code className="w-4 h-4 text-indigo-400" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">{job.source}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5 max-w-xs">
                              <p className="text-xs font-bold text-zinc-300 truncate group-hover:whitespace-normal transition-all">{job.prompt}</p>
                            </td>
                            <td className="px-8 py-5">
                               <div className={cn(
                                 "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border",
                                 job.status === 'running' ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" :
                                 job.status === 'completed' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                 job.status === 'failed' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
                                 job.status === 'paused' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                                 "bg-zinc-800 border-zinc-700 text-zinc-500"
                               )}>
                                 {job.status === 'running' && <RefreshCcw className="w-3 h-3 animate-spin" />}
                                 {job.status}
                               </div>
                               {job.status === 'running' && (
                                 <div className="w-full h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                                   <div 
                                     className="h-full bg-indigo-500 transition-all duration-500" 
                                     style={{ width: `${job.progress || 0}%` }} 
                                   />
                                 </div>
                               )}
                               {job.errorMessage && (
                                 <p className="text-[9px] text-rose-500 mt-1 font-bold italic">{job.errorMessage}</p>
                               )}
                            </td>
                            <td className="px-8 py-5">
                               <div className="flex items-center justify-center gap-6">
                                  <div className="text-center">
                                     <p className="text-[9px] font-black text-zinc-600 uppercase">Found</p>
                                     <p className="text-xs font-bold text-white">{job.recordsFound}</p>
                                  </div>
                                  <div className="text-center">
                                     <p className="text-[9px] font-black text-zinc-600 uppercase">Synced</p>
                                     <p className="text-xs font-bold text-emerald-400">{job.recordsCreated}</p>
                                  </div>
                                  <div className="text-center">
                                     <p className="text-[9px] font-black text-zinc-600 uppercase">Dupes</p>
                                     <p className="text-xs font-bold text-zinc-500">{job.duplicates}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-5">
                               <div className="flex flex-col gap-0.5">
                                  <span className="text-[10px] font-mono text-zinc-500">S: {job.startedAt}</span>
                                  {job.completedAt && <span className="text-[10px] font-mono text-zinc-600">E: {job.completedAt}</span>}
                               </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                               <div className="flex items-center justify-end gap-1.5">
                                  {job.status === 'failed' && (
                                    <button 
                                      className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-zinc-700" 
                                      title="Retry"
                                      onClick={() => handleRetryJob(job.id)}
                                    >
                                      <RetryIcon className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {job.status === 'running' && (
                                    <button className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-zinc-700" title="Pause">
                                      <PauseIcon className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {(job.status === 'paused' || job.status === 'failed') && (
                                    <button className="p-2 rounded-lg bg-zinc-800 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all border border-zinc-700" title="Resume/Restart">
                                      <PlayIcon className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {(job.status === 'running' || job.status === 'paused') && (
                                    <button className="p-2 rounded-lg bg-zinc-800 text-rose-500 hover:bg-rose-500 hover:text-black transition-all border border-zinc-700" title="Cancel">
                                      <CancelIcon className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  <button className="p-2 rounded-lg bg-zinc-800 text-zinc-600 hover:text-white transition-all border border-zinc-700" title="View Logs">
                                    <Terminal className="w-3.5 h-3.5" />
                                  </button>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card3D>
              )}

              {activeTab === 'providers' && (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <InteractiveCard className="p-10 flex flex-col items-center justify-center text-center space-y-6" depth="md">
                      <div className="w-20 h-20 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-inner">
                        <Globe className="w-10 h-10 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tight">Active Nodes</h4>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global provider network</p>
                      </div>
                    </InteractiveCard>
                    <InteractiveCard className="p-10 flex flex-col items-center justify-center text-center space-y-6" depth="md">
                      <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-inner">
                        <Zap className="w-10 h-10 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tight">Sync Ready</h4>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Real-time stream status</p>
                      </div>
                    </InteractiveCard>
                    <InteractiveCard className="p-10 flex flex-col items-center justify-center text-center space-y-6" depth="md">
                      <div className="w-20 h-20 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-inner">
                        <Activity className="w-10 h-10 text-amber-500" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tight">Neural Health</h4>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">API health & throughput</p>
                      </div>
                    </InteractiveCard>
                  </div>

                  <Card3D className="overflow-hidden" depth="lg" interactive={false}>
                    <div className="p-10 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/20">
                      <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Intelligence Providers</h3>
                        <p className="text-xs text-zinc-500">Configuration status of external data extraction and enrichment engines.</p>
                      </div>
                      <button className="px-5 py-3 rounded-2xl bg-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all border border-zinc-700 flex items-center gap-3 shadow-lg">
                        <RefreshCcw className="w-4 h-4" /> Hard Refresh
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-zinc-950/50">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Module Name</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Processor Type</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Synchronized</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Settings</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50 font-sans">
                          {[
                            { name: 'Google Places', type: 'search', key: 'GOOGLE_PLACES_API_KEY' },
                            { name: 'SerpApi', type: 'search', key: 'SERPAPI_API_KEY' },
                            { name: 'Exa', type: 'search', key: 'EXA_API_KEY' },
                            { name: 'Firecrawl', type: 'scraping', key: 'FIRECRAWL_API_KEY' },
                            { name: 'Apify', type: 'scraping', key: 'APIFY_TOKEN' },
                            { name: 'PhantomBuster', type: 'automation', key: 'PHANTOMBUSTER_API_KEY' },
                            { name: 'Hunter', type: 'enrichment', key: 'HUNTER_API_KEY' },
                            { name: 'Wappalyzer', type: 'enrichment', key: 'WAPPALYZER_API_KEY' },
                          ].map((prov) => (
                            <tr key={prov.name} className="hover:bg-zinc-800/30 transition-colors">
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                    <Cpu className="w-5 h-5 text-indigo-400" />
                                  </div>
                                  <span className="text-xs font-black uppercase tracking-widest text-white">{prov.name}</span>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <span className="text-[10px] px-2 py-1 rounded-md bg-zinc-800 text-zinc-400 font-black uppercase tracking-widest border border-zinc-700">{prov.type}</span>
                              </td>
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-2">
                                  <div className={cn(
                                    "w-2 h-2 rounded-full",
                                    "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                  )} />
                                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Ready</span>
                                </div>
                              </td>
                              <td className="px-8 py-5 text-right">
                                <button className="px-4 py-2 rounded-lg bg-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all border border-zinc-700">
                                  Configure
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card3D>
                </div>
              )}

              {activeTab === 'users' && (
                <Card3D className="overflow-hidden" depth="lg" interactive={false}>
                  <div className="p-10 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-zinc-950/20">
                    <div className="relative flex-1 max-w-lg">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input 
                        type="text" 
                        placeholder="Search identities by name, email or ID..." 
                        className="w-full bg-black/40 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium placeholder:text-zinc-700"
                      />
                    </div>
                    <InteractiveCard className="px-8 py-4 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl shadow-indigo-500/20 border-0" depth="sm">
                       <UserPlus className="w-4 h-4" /> Provision Node
                    </InteractiveCard>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-zinc-950/50">
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Identity</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Privilege Level</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Subscription</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Protocol Status</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Last Pulse</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Ops</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {loading ? (
                          <tr>
                            <td colSpan={6} className="px-8 py-20 text-center">
                              <RefreshCcw className="w-8 h-8 text-zinc-800 animate-spin mx-auto mb-2" />
                              <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest leading-none">Syncing identities...</span>
                            </td>
                          </tr>
                        ) : users.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-8 py-20 text-center text-zinc-500 text-xs font-black uppercase tracking-widest">
                              No identities found.
                            </td>
                          </tr>
                        ) : users.map(user => (
                          <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors group">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all capitalize">
                                  {user.name.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-white tracking-tight">{user.name}</span>
                                  <span className="text-xs text-zinc-500 font-mono italic">{user.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border",
                                user.role === 'platform_admin' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-zinc-800 border-zinc-700 text-zinc-500"
                              )}>
                                {user.role.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border",
                                user.plan === 'enterprise' ? "bg-purple-500/10 border-purple-500/20 text-purple-400" : 
                                user.plan === 'pro' ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : 
                                "bg-zinc-800 border-zinc-700 text-zinc-500"
                              )}>
                                {user.plan}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <div className={cn(
                                "inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest",
                                user.status === 'active' ? "text-emerald-500" : "text-rose-500"
                              )}>
                                <span className={cn("w-1.5 h-1.5 rounded-full capitalize", user.status === 'active' ? "bg-emerald-500" : "bg-rose-500")} />
                                {user.status}
                              </div>
                            </td>
                            <td className="px-8 py-5 text-xs text-zinc-500 font-mono">{user.lastSeen}</td>
                            <td className="px-8 py-5 text-right">
                              <button className="p-2 rounded-xl text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card3D>
              )}

              {activeTab === 'system' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between px-1">
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">Infrastructure Core</h3>
                      <p className="text-xs text-zinc-500">Real-time telemetry from background queues, cluster sharding, and database health.</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase text-emerald-500 tracking-widest">
                          <Activity className="w-3 h-3" />
                          Nodes Online: 42
                       </div>
                    </div>
                  </div>

                  <QueueMonitor />

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <AdminCard3D className="p-8 flex flex-col" depth="md" interactive={false}>
                      <div className="flex items-center gap-3 mb-10">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                          <Database className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest leading-none">Storage & Sharding</h3>
                      </div>
                      <div className="space-y-10 flex-1">
                        <div>
                          <div className="flex items-center justify-between mb-3 px-1">
                            <span className="text-xs font-black uppercase text-white tracking-[0.2em]">Main Cluster Usage</span>
                            <span className="text-[10px] font-black text-zinc-500 tracking-widest">842 GB / 2 TB</span>
                          </div>
                          <div className="h-4 bg-black/40 rounded-full overflow-hidden border border-zinc-800 p-1">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '42%' }}
                              className="h-full bg-indigo-500 rounded-full" 
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-6 rounded-2xl bg-zinc-950/50 border border-zinc-800 shadow-inner">
                             <p className="text-[9px] font-black uppercase text-zinc-600 mb-2 tracking-[0.2em]">Index Health</p>
                             <p className="text-2xl font-black text-emerald-500 tracking-tighter">99.9%</p>
                          </div>
                          <div className="p-6 rounded-2xl bg-zinc-950/50 border border-zinc-800 shadow-inner">
                             <p className="text-[9px] font-black uppercase text-zinc-600 mb-2 tracking-[0.2em]">IOPS Latency</p>
                             <p className="text-2xl font-black text-rose-500 tracking-tighter">12ms</p>
                          </div>
                        </div>
                      </div>
                    </AdminCard3D>
                    
                    <AdminCard3D className="p-8 flex flex-col" depth="md" interactive={false}>
                      <div className="flex items-center gap-3 mb-10">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                          <Globe className="w-5 h-5 text-amber-500" />
                        </div>
                        <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest leading-none">External Sources</h3>
                      </div>
                      <div className="space-y-4 flex-1">
                        {[
                          { name: 'Crunchbase API', status: 'optimal', ping: '142ms' },
                          { name: 'LinkedIn Scraper', status: 'degraded', ping: '1.2s' },
                          { name: 'Pitchbook Node', status: 'optimal', ping: '320ms' },
                          { name: 'News Aggregator', status: 'optimal', ping: '84ms' },
                        ].map(source => (
                          <div key={source.name} className="flex items-center justify-between p-4 rounded-xl hover:bg-zinc-800/30 transition-all border border-transparent hover:border-zinc-800">
                             <span className="text-xs font-bold text-white uppercase tracking-tight">{source.name}</span>
                             <div className="flex items-center gap-4">
                               <span className="text-[10px] font-black text-zinc-600 tracking-widest uppercase">{source.ping}</span>
                               <div className={cn(
                                 "w-2 h-2 rounded-full ring-4 ring-offset-0",
                                 source.status === 'optimal' ? "bg-emerald-500 ring-emerald-500/10" : "bg-amber-500 ring-amber-500/10"
                               )} />
                             </div>
                          </div>
                        ))}
                      </div>
                    </AdminCard3D>

                    <AdminCard3D className="p-8 flex flex-col" depth="md" interactive={false}>
                      <div className="flex items-center gap-3 mb-10">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                          <Server className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest leading-none">Compute Core</h3>
                      </div>
                      <div className="space-y-6 flex-1">
                        <div className="flex items-center justify-between p-6 rounded-2xl bg-zinc-950/50 border border-zinc-800 shadow-inner">
                           <div>
                             <p className="text-[9px] font-black uppercase text-zinc-600 mb-2 tracking-[0.2em]">Avg Response Time</p>
                             <p className="text-2xl font-black text-white tracking-tighter">245ms</p>
                           </div>
                           <BarChart3 className="w-10 h-10 text-indigo-500/20" />
                        </div>
                        <div className="flex items-center justify-between p-6 rounded-2xl bg-zinc-950/50 border border-zinc-800 shadow-inner">
                           <div>
                             <p className="text-[9px] font-black uppercase text-zinc-600 mb-2 tracking-[0.2em]">Cache Hit Rate</p>
                             <p className="text-2xl font-black text-emerald-500 tracking-tighter">82.4%</p>
                           </div>
                           <Zap className="w-10 h-10 text-emerald-500/20" />
                        </div>
                      </div>
                    </AdminCard3D>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 space-y-8">
                    <InteractiveCard className="p-12 bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 flex items-center justify-between overflow-hidden relative group border-0" depth="lg">
                      <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-1000">
                        <CreditCard className="w-40 h-40" />
                      </div>
                      <div className="relative z-10 w-full md:w-auto">
                        <h3 className="text-[10px] font-black uppercase opacity-60 tracking-[0.3em] mb-4">Platform Revenue Node</h3>
                        <p className="text-7xl font-black tracking-tighter mb-8">$1.4M<span className="text-xl opacity-60 font-bold ml-3 tracking-widest uppercase">ARR</span></p>
                        <div className="flex items-center gap-10">
                           <div className="flex flex-col">
                             <span className="text-[11px] font-black uppercase opacity-60 tracking-[0.2em] mb-1">Avg Order Value</span>
                             <span className="text-2xl font-black tracking-tight">$2,450</span>
                           </div>
                           <div className="w-px h-12 bg-white/20" />
                           <div className="flex flex-col">
                             <span className="text-[11px] font-black uppercase opacity-60 tracking-[0.2em] mb-1">Churn Rate</span>
                             <span className="text-2xl font-black tracking-tight">1.2%</span>
                           </div>
                        </div>
                      </div>
                      <Card3D className="relative z-10 px-10 py-5 rounded-2xl bg-white text-indigo-600 font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-100 transition-all shadow-2xl border-0" depth="sm">
                        Export Finance
                      </Card3D>
                    </InteractiveCard>

                    <Card3D className="p-10" depth="md" interactive={false}>
                       <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-10 px-2 leading-none">Network Subscriptions</h3>
                       <div className="space-y-4">
                          {[
                            { name: 'Venture Capital Collective', plan: 'Enterprise', MRR: '$8,400', date: '2026-05-12', color: 'indigo' },
                            { name: 'Stratify Consulting', plan: 'Pro', MRR: '$450', date: '2026-05-11', color: 'purple' },
                            { name: 'Research Lab #42', plan: 'Pro', MRR: '$450', date: '2026-05-11', color: 'purple' },
                          ].map(sub => (
                            <InteractiveCard key={sub.name} className="p-6 flex items-center justify-between group" depth="sm">
                               <div className="flex flex-col gap-1">
                                 <span className="text-lg font-black text-white tracking-tight">{sub.name}</span>
                                 <span className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.2em]">Billed on {sub.date}</span>
                               </div>
                               <div className="flex items-center gap-10">
                                 <div className="flex flex-col items-end">
                                   <span className="text-xl font-black text-white tracking-tight">{sub.MRR}</span>
                                   <span className={cn(
                                     "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md border",
                                     sub.plan === 'Enterprise' ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-zinc-800 border-zinc-700 text-zinc-500"
                                   )}>
                                     {sub.plan}
                                   </span>
                                 </div>
                                 <button className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-600 hover:text-white transition-all shadow-inner">
                                    <MoreVertical className="w-4 h-4" />
                                 </button>
                               </div>
                            </InteractiveCard>
                          ))}
                       </div>
                    </Card3D>
                  </div>

                  <div className="lg:col-span-4 space-y-8">
                    <AdminCard3D className="p-10" depth="lg" interactive={false}>
                       <div className="flex items-center gap-4 mb-10">
                          <div className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700">
                            <Settings className="w-5 h-5 text-zinc-500" />
                          </div>
                          <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest leading-none">Cost Allocation</h3>
                       </div>
                       <div className="space-y-8">
                          {[
                            { label: 'OpenAI Tokens', value: '$4,280', color: 'text-white' },
                            { label: 'Anthropic Tokens', value: '$2,142', color: 'text-white' },
                            { label: 'Scraping Proxies', value: '$840', color: 'text-white' },
                            { label: 'Bare Metal Clusters', value: '$1,150', color: 'text-white' },
                          ].map(cost => (
                            <div key={cost.label} className="flex items-center justify-between">
                               <span className="text-xs font-black uppercase text-zinc-500 tracking-widest">{cost.label}</span>
                               <span className={cn("text-base font-black tracking-tight", cost.color)}>{cost.value}</span>
                            </div>
                          ))}
                       </div>
                       <div className="mt-10 pt-10 border-t border-zinc-900 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em]">Total COGS</span>
                          <span className="text-3xl font-black text-rose-500 tracking-tighter shadow-rose-500/20 drop-shadow-xl">$8,412.00</span>
                       </div>
                    </AdminCard3D>
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <AiFunctionManager />
              )}

              {activeTab === 'feedback' && (
                <FeedbackDashboard />
              )}

              {activeTab === 'logs' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em]">Platform Immutable Audit Trail</h3>
                    <div className="flex items-center gap-3">
                       <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-all">
                          Filter: All Events <ArrowDownRight className="w-3 h-3" />
                       </button>
                       <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-all">
                         <Download className="w-3 h-3" /> Archive Logs
                       </button>
                    </div>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] overflow-hidden">
                    {loading ? (
                      <div className="p-20 text-center">
                         <RefreshCcw className="w-8 h-8 text-zinc-800 animate-spin mx-auto mb-2" />
                         <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest leading-none">Syncing audit logs...</span>
                      </div>
                    ) : logs.length === 0 ? (
                      <div className="p-20 text-center text-zinc-500 text-xs font-black uppercase tracking-widest leading-none">
                        No immutable records found in the current cycle.
                      </div>
                    ) : logs.map((log, i) => (
                      <div key={log.id} className="p-6 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900 transition-colors flex items-center justify-between gap-6 group">
                        <div className="flex items-center gap-6">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                            log.type === 'security' ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : 
                            log.type === 'database' ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : 
                            log.type === 'billing' ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : 
                            "bg-zinc-900 text-zinc-600 border border-zinc-800"
                          )}>
                            {log.type === 'security' ? <ShieldAlert className="w-5 h-5" /> : 
                             log.type === 'database' ? <Database className="w-5 h-5" /> : 
                             log.type === 'billing' ? <CreditCard className="w-5 h-5" /> : 
                             <Activity className="w-5 h-5" />}
                          </div>
                          <div className="flex flex-col gap-0.5">
                             <div className="flex items-center gap-3">
                               <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">{log.time}</span>
                               <span className="text-[10px] font-black uppercase text-zinc-700 select-none">•</span>
                               <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{log.type}</span>
                             </div>
                             <p className="text-sm font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                               {log.action} <span className="text-zinc-600 mx-2">→</span> <span className="text-zinc-400 font-mono text-xs">{log.target}</span>
                             </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="flex flex-col items-end">
                             <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Signer</span>
                             <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">{log.admin}</span>
                           </div>
                           <button className="p-2 rounded-lg text-zinc-800 hover:text-white transition-all">
                             <MoreVertical className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center pt-8">
                     <button className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-600 hover:text-indigo-400 transition-all">
                        Fetch More Immutable Records <ArrowDownRight className="w-3 h-3" />
                     </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PermissionGuard>
  );
}
