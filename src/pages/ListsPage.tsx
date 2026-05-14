import { useEffect, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { 
  ListOrdered, 
  Plus, 
  Search, 
  MoreVertical, 
  Archive, 
  Share2, 
  Trash2, 
  Calendar, 
  Users, 
  Tag as TagIcon,
  Shield,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import CreateListModal from '../components/lists/CreateListModal';
import { savedListService } from '../services/savedListService';

export default function ListsPage() {
  const [lists, setLists] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      setLoading(true);
      const res = await savedListService.getAll('org_1');
      setLists(res);
    } catch (err) {
      console.error('Failed to load lists:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLists = lists.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateList = async (newList: { name: string; description: string; isShared: boolean }) => {
    try {
      const list = await savedListService.create({
        ...newList,
        organizationId: 'org_1',
        tags: []
      });
      setLists([list, ...lists]);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create list:', err);
    }
  };

  const deleteList = async (id: string) => {
    try {
      await savedListService.delete(id);
      setLists(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error('Failed to delete list:', err);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8">
      <PageHeader 
        title="Intelligence Clusters" 
        description="Structured segments of identified market entities and discovery nodes."
        actions={
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="group bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-xl shadow-indigo-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> 
            Create Protocol
          </button>
        }
      />

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search clusters by name, description, or tags..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-zinc-600"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm font-bold text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
            Sort: Activity <Clock className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-500 font-bold text-sm">Mapping Cluster Graph...</p>
          </div>
        ) : filteredLists.map(list => (
          <div 
            key={list.id} 
            className="p-8 rounded-[2.5rem] bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all group flex flex-col h-[280px] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  deleteList(list.id);
                }}
                className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-indigo-600 group-hover:text-white transition-all border border-zinc-700 group-hover:border-indigo-500 shadow-lg">
                <ListOrdered className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-3">
                {list.isShared && (
                  <div className="flex items-center gap-1 text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                    <Users className="w-2.5 h-2.5" /> Shared
                  </div>
                )}
                {!list.isShared && (
                  <div className="flex items-center gap-1 text-[9px] font-black uppercase text-zinc-500 bg-zinc-900 px-2 py-1 rounded-full border border-zinc-800">
                    <Shield className="w-2.5 h-2.5" /> Private
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors mb-1 tracking-tight">{list.name}</h3>
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                  {list.description || 'No strategic description provided.'}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {(list.tags || []).map((tag: any, idx: number) => (
                  <span key={idx} className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">#{typeof tag === 'string' ? tag : tag.name}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50 mt-auto">
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest mb-0.5">Inventory</span>
                <span className="text-sm font-black text-indigo-400 tracking-tighter">{list.count || list._count?.companies || 0} Entities</span>
              </div>
              <Link 
                to={`/lists/${list.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 text-white text-[11px] font-bold hover:bg-indigo-600 transition-all border border-zinc-700 group-hover:border-indigo-500"
              >
                Access Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}

        {!loading && filteredLists.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 rounded-[2rem] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700">
              <ListOrdered className="w-10 h-10" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white">No nodes matches your search</h3>
              <p className="text-zinc-500 text-sm">Clear your keywords or refine your intelligence parameters.</p>
            </div>
          </div>
        )}
      </div>

      <CreateListModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreate={handleCreateList} 
      />
    </div>
  );
}


