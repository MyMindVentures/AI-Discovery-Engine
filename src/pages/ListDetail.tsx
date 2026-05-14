import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import { 
  ArrowLeft, 
  Settings, 
  Download, 
  Share2, 
  Trash2, 
  Plus, 
  Search, 
  SlidersHorizontal,
  Save,
  CheckCircle2,
  Trash,
  Tag,
  MessageSquare,
  RefreshCcw
} from 'lucide-react';
import { cn } from '../lib/utils';
import ResultsTable from '../components/results/ResultsTable';
import { motion, AnimatePresence } from 'motion/react';
import { savedListService } from '../services/savedListService';

export default function ListDetail() {
  const { id } = useParams();
  const [list, setList] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadList();
  }, [id]);

  const loadList = async () => {
    try {
      setLoading(true);
      const res = await savedListService.getById(id!);
      setList(res);
      // If the list has companies directly (from DB relations or mock include)
      setCompanies(res.companies?.map((item: any) => item.company) || []);
    } catch (err) {
      console.error('Failed to load list details:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = (companies || []).filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.technologies || []).some((t: any) => (typeof t === 'string' ? t : t.name).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelectedIds(prev => prev.length === filteredCompanies.length ? [] : filteredCompanies.map(c => c.id));
  };

  const [exportLoading, setExportLoading] = useState(false);

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const res = await fetch('/api/exports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Export identified from List: ${list?.name}`,
          type: 'Saved List',
          format: 'CSV',
          filters: { 
            listId: id,
            companyIds: selectedIds.length > 0 ? selectedIds : undefined
          }
        })
      });
      if (res.ok) {
        window.location.href = '/exports';
      }
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <RefreshCcw className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Retrieving Protocol Segments...</span>
      </div>
    </div>
  );

  if (!list) return (
    <div className="p-10 text-center">
      <h2 className="text-2xl font-bold text-white">Protocol Cluster Not Found</h2>
      <Link to="/lists" className="text-indigo-400 hover:underline mt-4 inline-block">Return to Clusters</Link>
    </div>
  );

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8 relative">
      <div className="flex items-center gap-4">
        <Link 
          to="/lists" 
          className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-all shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">{list.name}</h1>
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
              list.isShared ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-zinc-800 border-zinc-700 text-zinc-500"
            )}>
              {list.isShared ? 'Shared Node' : 'Private Node'}
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">{list.description}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
         <div className="flex items-center gap-2 flex-wrap order-2 md:order-1">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all text-xs font-bold">
              <Plus className="w-4 h-4" /> Add Entity
            </button>
            <button 
              onClick={handleExport}
              disabled={exportLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-50 transition-all text-xs font-bold"
            >
              <Download className={cn("w-4 h-4", exportLoading && "animate-bounce")} /> {exportLoading ? 'Processing...' : 'Export Node'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all text-xs font-bold">
              <Share2 className="w-4 h-4" /> Sync Hub
            </button>
         </div>
         <div className="flex items-center gap-2 order-1 md:order-2 w-full md:w-auto">
            <button className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-all tooltip">
              <Settings className="w-5 h-5" />
            </button>
         </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search within this cluster..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-zinc-600"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm font-bold text-zinc-400 hover:text-white transition-all">
            <SlidersHorizontal className="w-4 h-4" /> Intelligence Filters
          </button>
        </div>
      </div>

      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-4 px-6 py-4 rounded-3xl bg-zinc-950 border border-indigo-500/30 shadow-2xl shadow-indigo-500/40 backdrop-blur-xl min-w-[320px] md:min-w-[500px]"
          >
            <div className="flex items-center gap-3 pr-6 border-r border-zinc-800">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">
                {selectedIds.length}
              </div>
              <span className="text-xs font-bold text-white uppercase tracking-widest hidden md:inline">Entities</span>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-around">
              <button className="p-2 rounded-xl text-zinc-400 hover:text-indigo-400 hover:bg-zinc-900 transition-all flex flex-col items-center gap-1">
                <Tag className="w-4 h-4" />
                <span className="text-[10px] font-bold">Tag</span>
              </button>
              <button className="p-2 rounded-xl text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 transition-all flex flex-col items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span className="text-[10px] font-bold">Notes</span>
              </button>
              <button className="p-2 rounded-xl text-zinc-400 hover:text-emerald-400 hover:bg-zinc-900 transition-all flex flex-col items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px] font-bold">Verify</span>
              </button>
              <button className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 transition-all flex flex-col items-center gap-1">
                <Trash className="w-4 h-4" />
                <span className="text-[10px] font-bold">Eject</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-zinc-900/20 rounded-[2.5rem] border border-zinc-800/50 overflow-hidden shadow-2xl min-h-[400px]">
        {filteredCompanies.length > 0 ? (
          <ResultsTable 
            companies={filteredCompanies}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleAll={toggleAll}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
             <div className="w-20 h-20 rounded-[2rem] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700">
                <Search className="w-10 h-10" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white">Cluster Search Returned Null</h3>
                <p className="text-zinc-500 text-sm">Adjust your intelligence parameters within this node.</p>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}

