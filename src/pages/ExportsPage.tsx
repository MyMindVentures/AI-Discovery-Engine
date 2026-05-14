import React, { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { 
  Download, 
  FileJson, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle2, 
  MoreHorizontal, 
  Plus,
  Play,
  X,
  History as HistoryIcon,
  Cloud,
  Database,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import UpgradePrompt from '../components/UpgradePrompt';
import { Card3D } from '../components/ui/Card3D';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { exportService } from '../services/exportService';

export default function ExportsPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'history' | 'scheduled'>('history');
  const [loading, setLoading] = useState(true);
  const [limitError, setLimitError] = useState(false);

  const fetchHistory = async () => {
    try {
      const data = await exportService.getAll('org_1');
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch exports", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  const createExport = async (format: string) => {
    try {
      await exportService.create({ 
        organizationId: 'org_1',
        name: `Quick Export ${new Date().toLocaleTimeString()}`,
        type: 'Search Results',
        format: format.toUpperCase()
      });
      fetchHistory();
    } catch (err: any) {
      console.error("Failed to create export", err);
      const errorMsg = typeof err === 'string' ? err : err.message || '';
      if (errorMsg.includes('PLAN_LIMIT_EXCEEDED')) {
        setLimitError(true);
      }
    }
  };

  const handleDownload = (job: any) => {
    if (!job.fileUrl) return;
    window.open(job.fileUrl, '_blank');
  };

  const exportTypes = [
    { id: 'csv', name: 'Comma Separated', icon: FileText, extension: '.csv', color: 'text-emerald-500' },
    { id: 'json', name: 'JSON Structure', icon: FileJson, extension: '.json', color: 'text-amber-500' },
    { id: 'xlsx', name: 'Excel Workbook', icon: FileSpreadsheet, extension: '.xlsx', color: 'text-blue-500' },
    { id: 'sheets', name: 'Google Sheets', icon: Cloud, extension: 'Sync', color: 'text-emerald-400' },
    { id: 'airtable', name: 'Airtable Base', icon: Database, extension: 'Sync', color: 'text-rose-400' },
    { id: 'notion', name: 'Notion Database', icon: ExternalLink, extension: 'Sync', color: 'text-zinc-300' },
  ];

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-12">
      <PageHeader 
        title="Export Center" 
        description="Extract and synchronize identified intelligence nodes across your ecosystem."
        actions={
          <button className="group bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-xl shadow-indigo-500/20 active:scale-95">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> 
            Configure Sync
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
            <UpgradePrompt feature="Export Jobs" onClose={() => setLimitError(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Options Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {exportTypes.map(type => (
          <InteractiveCard 
            key={type.id} 
            onClick={() => createExport(type.id)}
            className="p-8 flex flex-col items-center text-center gap-6"
            depth="sm"
          >
            <div className={cn("w-14 h-14 rounded-[1.25rem] bg-zinc-800 flex items-center justify-center border border-zinc-700 transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg", type.color)}>
              <type.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-black text-white mb-1 uppercase tracking-tight">{type.name}</p>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">{type.extension}</p>
            </div>
          </InteractiveCard>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-6 border-b border-zinc-800 px-1">
          <button 
            onClick={() => setActiveTab('history')}
            className={cn(
              "pb-4 text-xs font-black uppercase tracking-widest transition-all relative",
              activeTab === 'history' ? "text-white" : "text-zinc-600 hover:text-zinc-400"
            )}
          >
            Extraction History
            {activeTab === 'history' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
          </button>
          <button 
            onClick={() => setActiveTab('scheduled')}
            className={cn(
              "pb-4 text-xs font-black uppercase tracking-widest transition-all relative",
              activeTab === 'scheduled' ? "text-white" : "text-zinc-600 hover:text-zinc-400"
            )}
          >
            Scheduled Syncs
            {activeTab === 'scheduled' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
          </button>
        </div>

        <Card3D className="overflow-hidden" depth="lg" interactive={false}>
          <AnimatePresence mode="wait">
            {activeTab === 'history' ? (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="overflow-x-auto text-nowrap">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-zinc-950/50">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Resource Name</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Standard / Sink</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Transmission Status</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Payload Details</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Timestamp</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Direct Access</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {history.map((exp) => (
                        <tr key={exp.id} className="hover:bg-zinc-800/30 transition-colors group">
                          <td className="px-8 py-5">
                            <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight">{exp.name}</span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 border border-zinc-700">
                                {exp.format?.includes('JSON') ? <FileJson className="w-4 h-4 text-amber-400" /> : <FileText className="w-4 h-4 text-emerald-400" />}
                              </div>
                              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{exp.format}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            {exp.status === 'completed' && (
                              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                Transferred
                              </div>
                            )}
                            {(exp.status === 'running' || exp.status === 'pending' || exp.status === 'processing') && (
                              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                Buffering...
                              </div>
                            )}
                            {exp.status === 'failed' && (
                              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Interrupted: <span className="text-[10px] opacity-70 italic">{exp.errorMessage}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-zinc-300">{exp.recordsCount || 0} Entities</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-xs text-zinc-500 font-mono italic">
                            {exp.createdAt ? new Date(exp.createdAt).toLocaleString() : 'N/A'}
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleDownload(exp)}
                                disabled={exp.status !== 'completed'}
                                className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-20 transition-all border border-zinc-700"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-zinc-700">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {!loading && history.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-8 py-20 text-center">
                            <Database className="w-10 h-10 text-zinc-800 mx-auto mb-4" />
                            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">No extraction records localized.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="scheduled"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Empty state for scheduled syncs */}
                <div className="p-20 text-center">
                   <Clock className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                   <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">No active automation protocols found.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card3D>
      </div>
    </div>
  );
}


