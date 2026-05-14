import { useEffect, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { 
  Shield, 
  Plus, 
  Filter, 
  History, 
  Fingerprint, 
  Clock, 
  FileCode, 
  Layout, 
  Brain, 
  FileText,
  MessageSquare, 
  Archive,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Database,
  Lock,
  Search
} from 'lucide-react';
import { ipProtectionService } from '../services/ipProtectionService';
import { IpEvidenceRecord } from '../lib/mock/data';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import PermissionGuard from '../components/ui/PermissionGuard';
import { MetricCard3D } from '../components/ui/MetricCard3D';
import AdminCard3D from '../components/ui/AdminCard3D';
import { Card3D } from '../components/ui/Card3D';

export default function AdminIpProtectionPage() {
  const [records, setRecords] = useState<IpEvidenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<IpEvidenceRecord>>({
    title: '',
    type: 'concept',
    description: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchRecords();
  }, [filterType]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await ipProtectionService.getEvidenceRecords('all');
      setRecords(data);
    } catch (err) {
      console.error("Failed to fetch evidence records", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await ipProtectionService.createEvidenceRecord({
        ...newRecord,
        organizationId: 'org_parallax',
        updatedAt: new Date().toISOString()
      });
      setShowModal(false);
      fetchRecords();
    } catch (err) {
      console.error("Failed to create record", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'timestamped': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'documented': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'archived': return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
      default: return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'concept': return <Brain className="w-4 h-4" />;
      case 'design': return <Layout className="w-4 h-4" />;
      case 'code': return <FileCode className="w-4 h-4" />;
      case 'prompt': return <Fingerprint className="w-4 h-4" />;
      case 'communication': return <MessageSquare className="w-4 h-4" />;
      default: return <FileCode className="w-4 h-4" />;
    }
  };

  return (
    <PermissionGuard capability="admin_access">
      <div className="p-6 md:p-10 max-w-7xl mx-auto pb-32">
        <PageHeader 
          title="IP Integrity Protocol" 
          description="Manage and document the intellectual property of Parallax Studio."
          actions={(
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Registry Entry
            </button>
          )}
        />

        {/* Global Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <MetricCard3D label="Concepts & Blueprints" value={12} icon={<Brain className="w-4 h-4 text-zinc-500" />} depth="sm" />
          <MetricCard3D label="UX & Interface Systems" value={8} icon={<Layout className="w-4 h-4 text-zinc-500" />} depth="sm" />
          <MetricCard3D label="Source Code" value={42} icon={<FileCode className="w-4 h-4 text-zinc-500" />} depth="sm" />
          <MetricCard3D label="Generated Assets" value={25} icon={<Database className="w-4 h-4 text-zinc-500" />} depth="sm" />
          <MetricCard3D label="Prompts & AI Workflows" value={15} icon={<Fingerprint className="w-4 h-4 text-zinc-500" />} depth="sm" />
          <MetricCard3D label="Documentation" value={18} icon={<FileText className="w-4 h-4 text-zinc-500" />} depth="sm" />
          <MetricCard3D label="Communication Flows" value={4} icon={<MessageSquare className="w-4 h-4 text-zinc-500" />} depth="sm" />
          <MetricCard3D label="Development History" value={1} icon={<History className="w-4 h-4 text-zinc-500" />} depth="sm" />
        </div>

        {/* Checklists & Repository Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Evidence Table */}
            <Card3D className="p-8" depth="lg" interactive={false} variant="admin">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-400" />
                  Evidence Timeline
                </h3>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800">
                     <Filter className="w-3 h-3 text-zinc-500" />
                     <select 
                       value={filterType}
                       onChange={(e) => setFilterType(e.target.value)}
                       className="bg-transparent text-[10px] font-black uppercase tracking-widest text-zinc-400 focus:outline-none"
                     >
                       <option value="all">All Records</option>
                       {['concept', 'design', 'code', 'prompt', 'asset', 'workflow', 'communication', 'release'].map(t => (
                         <option key={t} value={t}>{t}</option>
                       ))}
                     </select>
                   </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-zinc-800/50">
                      <th className="px-4 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Type / Entry</th>
                      <th className="px-4 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
                      <th className="px-4 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Proof URL</th>
                      <th className="px-4 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Commit</th>
                      <th className="px-4 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Ops</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/30">
                    {loading ? (
                       <tr><td colSpan={5} className="py-10 text-center text-zinc-600 italic">Syncing ledgers...</td></tr>
                    ) : records.length === 0 ? (
                       <tr><td colSpan={5} className="py-10 text-center text-zinc-600 italic">No records in registry.</td></tr>
                    ) : records.map(record => (
                      <tr key={record.id} className="hover:bg-zinc-800/20 transition-colors group text-xs">
                        <td className="px-4 py-5">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-zinc-500">{getTypeIcon(record.type)}</span>
                              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 leading-none">{record.type}</span>
                            </div>
                            <span className="text-sm font-bold text-white leading-tight">{record.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
                            getStatusColor(record.status)
                          )}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 py-5 font-mono text-[10px] text-zinc-500">
                          {record.timestampProofUrl ? (
                            <a href={record.timestampProofUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-400 flex items-center gap-1">
                              Link <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : '—'}
                        </td>
                        <td className="px-4 py-5 font-mono text-[10px] text-zinc-600">
                          {record.commitHash || '—'}
                        </td>
                        <td className="px-4 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:text-indigo-400 transition-colors">
                                <Archive className="w-3 h-3" />
                             </button>
                             <button className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:text-indigo-400 transition-colors">
                               <Plus className="w-3 h-3" />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 pt-8 border-t border-zinc-800/50 flex justify-center">
                 <button className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">
                   Export Evidence Log (PDF)
                 </button>
              </div>
            </Card3D>
          </div>

          <aside className="space-y-8">
            {/* Repository Status */}
            <AdminCard3D title="Repo Protection Status" icon={<Lock className="w-4 h-4" />}>
              <div className="space-y-6">
                 <StatusItem label="GitHub Integrity" status="Active" icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />} />
                 <StatusItem label="Commit Signing" status="Verified" icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />} />
                 <StatusItem label="OpenTimestamps" status="Standby" icon={<Clock className="w-4 h-4 text-zinc-500" />} />
                 <StatusItem label="Data Sharding" status="Encrypted" icon={<Database className="w-4 h-4 text-indigo-500" />} />
              </div>
            </AdminCard3D>

            {/* Checklist: Repository Documentation */}
            <AdminCard3D title="Archive Checklist" variant="admin">
               <div className="space-y-6">
                 <div className="space-y-3">
                   <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Repository Docs</p>
                   <CheckItem label="LEGAL.md" checked />
                   <CheckItem label="COPYRIGHT.md" checked />
                   <CheckItem label="IP-PROTECTION.md" checked />
                   <CheckItem label="NOTICE.md" checked />
                 </div>
                 <div className="space-y-3">
                   <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Development History</p>
                   <CheckItem label="Origin Concept" checked />
                   <CheckItem label="Arch Details" checked />
                   <CheckItem label="AI Prompts Log" />
                 </div>
                 <div className="space-y-3">
                   <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Timestamping</p>
                   <CheckItem label="Pre-Release Hash" checked />
                   <CheckItem label="Blockchain Sync" />
                 </div>
               </div>
            </AdminCard3D>

            <Card3D variant="premium" className="p-8" depth="lg" glow>
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(79,70,229,0.6)]">
                   <Shield className="w-5 h-5 text-white" />
                 </div>
                 <h4 className="text-sm font-bold text-white leading-tight">Evidence Archived</h4>
               </div>
               <p className="text-xs text-zinc-500 leading-relaxed">
                 All logs are being archived to the Parallax Private Vault for long-term IP enforcement.
               </p>
            </Card3D>
          </aside>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-2xl p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-white">Create Evidence Record</h3>
                  <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                    <Plus className="w-6 h-6 rotate-45" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Entry Title</label>
                    <input 
                       type="text" 
                       value={newRecord.title}
                       onChange={e => setNewRecord({...newRecord, title: e.target.value})}
                       placeholder="e.g. Discovery Protocol v1.2 Implementation"
                       className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Asset Type</label>
                      <select 
                        value={newRecord.type}
                        onChange={e => setNewRecord({...newRecord, type: e.target.value as any})}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                      >
                        <option value="concept">Concept</option>
                        <option value="design">Architecture</option>
                        <option value="code">Source Code</option>
                        <option value="prompt">AI Protocol</option>
                        <option value="document">Documentation</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Initial Status</label>
                      <select 
                        value={newRecord.status}
                        onChange={e => setNewRecord({...newRecord, status: e.target.value as any})}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                      >
                        <option value="draft">Draft</option>
                        <option value="documented">Documented</option>
                        <option value="timestamped">Timestamped</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Context / Description</label>
                    <textarea 
                       value={newRecord.description}
                       onChange={e => setNewRecord({...newRecord, description: e.target.value})}
                       rows={3}
                       placeholder="Describe the intellectual capital being documented..."
                       className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    />
                  </div>

                  <button 
                    onClick={handleCreate}
                    disabled={!newRecord.title}
                    className="w-full py-4 rounded-xl bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  >
                    Authorize Entry
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PermissionGuard>
  );
}

function StatSummaryCard({ title, count, icon }: { title: string, count: number, icon: any }) {
  return (
    <div className="p-6 rounded-[2rem] bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all group">
      <div className="p-3 rounded-xl bg-black w-fit mb-4 text-zinc-500 group-hover:text-indigo-400 transition-colors">
        {icon}
      </div>
      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-black text-white leading-none">{count}</p>
    </div>
  );
}

function StatusItem({ label, status, icon }: { label: string, status: string, icon: any }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-xs text-zinc-400 font-medium">{label}</span>
      </div>
      <span className="text-[10px] font-black text-white uppercase tracking-tighter">{status}</span>
    </div>
  );
}

function CheckItem({ label, checked = false }: { label: string, checked?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        "w-4 h-4 rounded border flex items-center justify-center transition-colors",
        checked ? "bg-indigo-600 border-indigo-600" : "bg-black border-zinc-800"
      )}>
        {checked && <Plus className="w-3 h-3 text-white" />}
      </div>
      <span className={cn(
        "text-[10px] font-bold uppercase tracking-widest",
        checked ? "text-zinc-400" : "text-zinc-600"
      )}>{label}</span>
    </div>
  );
}
