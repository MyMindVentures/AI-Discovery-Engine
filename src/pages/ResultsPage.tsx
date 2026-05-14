import { useEffect, useState, useMemo } from 'react';
import PageHeader from '../components/ui/PageHeader';
import CompanyCard from '../components/ui/CompanyCard';
import { 
  Filter, 
  Search, 
  Download, 
  LayoutGrid, 
  List as ListIcon, 
  SlidersHorizontal, 
  ChevronDown, 
  Save, 
  Share2,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';
import PermissionGuard from '../components/ui/PermissionGuard';
import ResultsTable from '../components/results/ResultsTable';
import FilterPanel from '../components/results/FilterPanel';
import AddToListModal from '../components/lists/AddToListModal';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { companyService } from '../services/companyService';

export default function ResultsPage() {
  const location = useLocation();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dbCompanies, setDbCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    location: [] as string[],
    industry: [] as string[],
    tech: [] as string[],
    size: [] as string[],
  });

  // Handle results from navigation state (real backend results)
  const navigationResults = location.state?.results;

  useEffect(() => {
    // If we have results from a search (navigation state), use those
    // Otherwise, fetch all companies for the demo org
    if (!navigationResults) {
      setLoading(true);
      async function loadCompanies() {
        try {
          const res = await companyService.getAll('org_1');
          setDbCompanies(res);
        } catch (err) {
          console.error('Failed to load companies:', err);
        } finally {
          setLoading(false);
        }
      }
      loadCompanies();
    }
  }, [navigationResults]);

  const companies = useMemo(() => {
    if (navigationResults && Array.isArray(navigationResults)) {
      return navigationResults.map((r: any) => ({
        ...r.company,
        relevance: r.relevance,
        matchReason: r.matchReason
      }));
    }
    return dbCompanies;
  }, [navigationResults, dbCompanies]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelectedIds(prev => prev.length === companies.length ? [] : companies.map((c: any) => c.id));
  };

  const updateFilters = (key: string, value: string) => {
    setFilters(prev => {
      const current = (prev as any)[key] as string[];
      return {
        ...prev,
        [key]: current.includes(value) ? current.filter(v => v !== value) : [...current, value]
      };
    });
  };

  const handleAddToList = (listId: string) => {
    console.log(`Adding ${selectedIds.length} entities to list ${listId}`);
    setSelectedIds([]);
  };

  const [exportLoading, setExportLoading] = useState(false);

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const searchId = location.state?.searchId;
      const res = await fetch('/api/exports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Export identified from ${searchId ? 'Search ' + searchId.slice(0, 8) : 'Manual Review'}`,
          type: 'Search Results',
          format: 'CSV',
          filters: { 
            searchId: selectedIds.length === 0 ? searchId : undefined,
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

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8 relative">
      <PageHeader 
        title="Intelligence Discovery" 
        description={loading ? "Refreshing market intelligence..." : `${companies.length} entities identified and enriched via AI protocol.`}
        actions={
          <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2.5 rounded-xl transition-all",
                viewMode === 'grid' ? "bg-zinc-800 text-white shadow-lg shadow-black/20" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={cn(
                "p-2.5 rounded-xl transition-all",
                viewMode === 'table' ? "bg-zinc-800 text-white shadow-lg shadow-black/20" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        }
      />

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search within results (Name, Tech, Keyword)..." 
            className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-zinc-600"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm font-bold transition-all",
              (filters.industry.length > 0 || filters.location.length > 0) 
                ? "text-indigo-400 border-indigo-500/30 bg-indigo-500/5" 
                : "text-zinc-400 hover:text-white hover:border-zinc-700"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" /> 
            Filters
            {(filters.industry.length + filters.location.length + filters.tech.length) > 0 && (
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center ml-1">
                {filters.industry.length + filters.location.length + filters.tech.length}
              </span>
            )}
          </button>
          
          <PermissionGuard capability="exports" showLock>
            <button 
              onClick={handleExport}
              disabled={exportLoading}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
            >
              <Download className={cn("w-4 h-4", exportLoading && "animate-bounce")} /> 
              <span className="hidden sm:inline">{exportLoading ? 'Processing...' : 'Export'}</span>
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* Selection Actions Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-4 px-6 py-4 rounded-3xl bg-zinc-950 border border-indigo-500/30 shadow-2xl shadow-indigo-500/40 backdrop-blur-xl min-w-[320px] md:min-w-[500px]"
          >
            <div className="flex items-center gap-3 pr-6 border-r border-zinc-800">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">
                {selectedIds.length}
              </div>
              <span className="text-xs font-bold text-white uppercase tracking-widest hidden md:inline">Selected</span>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-around">
              <button 
                onClick={() => setIsAddListOpen(true)}
                className="p-2 rounded-xl text-zinc-400 hover:text-indigo-400 hover:bg-zinc-900 transition-all flex flex-col items-center gap-1"
              >
                <Save className="w-4 h-4" />
                <span className="text-[10px] font-bold">List</span>
              </button>
              <button className="p-2 rounded-xl text-zinc-400 hover:text-emerald-400 hover:bg-zinc-900 transition-all flex flex-col items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px] font-bold">Verify</span>
              </button>
              <button className="p-2 rounded-xl text-zinc-400 hover:text-blue-400 hover:bg-zinc-900 transition-all flex flex-col items-center gap-1">
                <Share2 className="w-4 h-4" />
                <span className="text-[10px] font-bold">Share</span>
              </button>
              <button className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 transition-all flex flex-col items-center gap-1">
                <Trash2 className="w-4 h-4" />
                <span className="text-[10px] font-bold">Remove</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-[60vh]">
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-zinc-500 font-bold text-sm animate-pulse">Consulting Database...</p>
           </div>
        ) : (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company: any) => (
                <div 
                  key={company.id} 
                  className="relative"
                  onClick={() => toggleSelect(company.id)}
                >
                  <div className={cn(
                    "absolute top-4 right-4 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer",
                    selectedIds.includes(company.id) 
                      ? "bg-indigo-600 border-indigo-600 scale-110" 
                      : "bg-black/20 border-white/20 hover:border-white/40"
                  )}>
                    {selectedIds.includes(company.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <CompanyCard 
                    company={company} 
                    className={selectedIds.includes(company.id) ? "border-indigo-500/50 bg-indigo-500/5" : ""} 
                  />
                </div>
              ))}
            </div>
          ) : (
            <ResultsTable 
              companies={companies} 
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onToggleAll={toggleAll}
            />
          )
        )}
      </div>

      <FilterPanel 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        filters={filters}
        onUpdateFilters={updateFilters}
      />

      <AddToListModal 
        isOpen={isAddListOpen}
        onClose={() => setIsAddListOpen(false)}
        onAdd={handleAddToList}
        count={selectedIds.length}
      />

      {/* Mobile Sticky Actions */}
      <div className="md:hidden sticky bottom-20 left-0 right-0 p-4 pointer-events-none">
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="w-full py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-bold text-sm shadow-2xl pointer-events-auto active:scale-95 transition-transform flex items-center justify-center gap-3"
        >
          <SlidersHorizontal className="w-4 h-4" /> Quick Filters
        </button>
      </div>
    </div>
  );
}



